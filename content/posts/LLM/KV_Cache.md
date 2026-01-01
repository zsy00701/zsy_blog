---
title: KV Cache 详解
date: '2026-01-01T10:46:33.219Z'
excerpt: 大语言模型推理阶段最重要的基础优化技术
category: LLM
---
> **KV Cache (Key-Value Cache)** 是大语言模型（LLM）推理（Inference）阶段最重要、最基础的优化技术。

## 为什么需要KV Cache

LLM 的推理通常是**自回归（Autoregressive）**的。也就是说，模型是逐个 Token 生成的。

假设我们要生成一句话：`"I love AI"`。

1. **Step 1:** 输入 `"I"`, 模型输出 `"love"`。
2. **Step 2:** 输入 `"I love"`, 模型输出 `"AI"`。
3. **Step 3:** 输入 `"I love AI"`, 模型输出 `<EOS>`。

没有 KV Cache 时的计算浪费：

在 Step 2 中，我们把 "I love" 输入进模型。Transformer 的注意力机制（Self-Attention）会计算 "I" 和 "love" 的 $Q, K, V$ 向量。

但在 Step 1 中，我们其实已经计算过 "I" 的 $K, V$ 向量了。

随着序列变长（比如输入 1000 个词，生成第 1001 个词），如果每次都把这 1000 个词重新算一遍 $K$ 和 $V$，计算量是 $O(N^2)$ 级别的增长，非常低效。

前面的 Token（如 "I"）在后续生成过程中是固定不变的，它们的 $K$（Key）和 $V$（Value）向量也是不变的。唯一变化的是新进来的那个 Token 的 $Q$（Query）对前面所有 Token 的注意力。

## 技术原理与流程

Transformer 的 Attention 公式为：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

启用 KV Cache 后的推理流程：

假设我们已经生成了 $t$ 个 Token，现在要生成第 $t+1$ 个。

1. **输入**：仅输入当前的第 $t$ 个 Token（即上一步刚刚生成的那个词），而不是整个序列。

2. **投影**：计算当前 Token 的 $Q_{t}, K_{t}, V_{t}$。

3. **拼接（Concat）**：

   - 从显存中取出之前保存的 $K_{cache} = [K_1, ..., K_{t-1}]$ 和 $V_{cache} = [V_1, ..., V_{t-1}]$。

   - 将当前的 $K_t, V_t$ 拼接到 Cache 后面：

     

     $$K_{new} = [K_{cache}, K_{t}]$$

     $$V_{new} = [V_{cache}, V_{t}]$$

4. **计算 Attention**：

   - 使用当前的 $Q_t$ 与完整的 $K_{new}$ 进行矩阵乘法（计算 Attention Score）。
   - 再与 $V_{new}$ 相乘得到输出。

5. **更新 Cache**：将 $K_{new}, V_{new}$ 存回显存，供下一步使用。

**注意**：我们不需要缓存 $Q$，因为 $Q$ 只代表“当前 Token 想查什么”，每一步的 $Q$ 都是全新的，用完即弃。

## 显存占用分析（Memory Analysis）

KV Cache 虽然提升了计算速度，但代价是极大的**显存（VRAM）消耗**。这也是限制 LLM 支持超长上下文（Context Window）的主要瓶颈。

### 显存计算公式

假设模型参数如下：

- $B$: Batch Size
- $L$: 当前序列长度 (Sequence Length)
- $N_{layers}$: Transformer 层数
- $N_{heads}$: 注意力头数 (Heads)
- $D_{head}$: 每个头的维度 (Head Dimension)
- $P$: 精度 (Precision, e.g., FP16 = 2 bytes)

KV Cache 总大小（Bytes）公式为：

$$\text{Size} = 2 \times B \times L \times N_{layers} \times N_{heads} \times D_{head} \times P$$

(乘 2 是因为要同时存 K 和 V)

**举例：LLaMA-2-7B (FP16)**

- $N_{layers} = 32$
- $N_{heads} = 32$
- $D_{head} = 128$ (Hidden size 4096 / 32 heads)
- $P = 2$ bytes

对于 Batch Size = 1，序列长度 1024：

$$\text{Size} \approx 2 \times 1 \times 1024 \times 32 \times 32 \times 128 \times 2 \approx 512 \text{ MB}$$

看起来不多？但在实际部署中：

1. **Batch Size** 通常很大（如 64 或 128），显存直接乘以 64。
2. **Context Length** 现在动辄 32k、128k。如果是 32k 上下文，Batch 1 就需要 16GB 显存仅用于 KV Cache，甚至超过了模型权重本身。

## 针对KV Cache的现代优化

A. Multi-Query Attention (MQA) & Grouped-Query Attention (GQA)

- **MHA (Standard)**: 每个 Query Head 都有自己对应的 Key/Value Head。($K, V$ 头数 = $Q$ 头数)
- **MQA**: 所有 Query Head 共享**同一组** $K$ 和 $V$。($K, V$ 头数 = 1)。这能将 KV Cache 显存减少 $N_{heads}$ 倍。
- **GQA (LLaMA-2/3, Mistral 采用)**: 折中方案。将 Query Head 分组，每组共享一对 $K, V$。
  - 例如：32 个 Query Head，分为 4 组，每组 8 个 Q 对应 1 个 K/V。KV Cache 显存减少 8 倍。

B. PagedAttention (vLLM 的核心)

传统的 KV Cache 需要预分配连续的显存空间。由于序列长度不可预测，往往会预留最大长度（Padding），导致严重的**显存碎片化**和浪费。

- **原理**：借鉴操作系统的 **虚拟内存（Virtual Memory）** 和 **分页（Paging）** 技术。
- **做法**：将 KV Cache 切分成非连续的 Block。显存可以按需动态分配，不再需要物理连续。
- **效果**：极大提高了显存利用率（从 20%-40% 提升到 90%+），从而允许更大的 Batch Size，显著提升吞吐量。

C. Quantization (KV Cache 量化)

- 将 KV Cache 从 FP16 量化到 INT8 甚至 FP4。这会带来精度损失，但能直接将显存占用减半或更多。
