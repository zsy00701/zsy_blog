---
title: ViT 视觉 Transformer
date: '2025-12-17T02:39:00.590Z'
excerpt: Vision Transformer 架构详解与实现细节
category: 多模态大模型
---
## Vision Transformer的架构

![image-20251217010249693](/Users/zhoushengyao/Library/Application Support/typora-user-images/image-20251217010249693.png)

## 结构说明

1. 把图片切成Patch
2. Patch拉平+线性映射
3. 加入位置编码
4. transformer encoder
5. 分类头输出

> 前两点还可以用卷积来实现，一个patch就是一个token，卷积核数量就是维度。

## 细节说明

### [CLS] token

**加入[CLS] token**:用于聚合图片的信息

> 原论文：
>
> Similar to BERT’s [class] token, we prepend a learnable embedding to the sequence of embedded patches ($z_0^0$= xclass), whose state at the output of the Transformer encoder ($z_L^0$) serves as the image representation y (Eq. 4). Both during pre-training and fine-tuning, a classification head is attached to z 0 L . The classification head is implemented by a MLP with one hidden layer at pre-training time and by a single linear layer at fine-tuning time.

对应数学形式（Eq. 1）：
$$
z_0 = [x_{\text{class}};\ x_p^1 E;\ x_p^2 E;\ \dots;\ x_p^N E] + E_{pos}
$$
**关键点：**

- `[CLS]` 是一个 **可学习向量**（learnable embedding）
- 它被 **放在所有 patch token 之前**
- 它和 patch token **维度完全相同**
- 它 **参与所有 Transformer 层的 self-attention**

⚠️ 论文没有赋予它任何“视觉先验意义”，它只是一个 **额外的 token**

**为什么要[CLS] token**:

利用注意力机制整合了所有信息

**一定要[CLS] token吗**：

不一定

### Positional Embedding

> 可学习的positional embedding

并且在公式 (1) 里给了最关键的张量形状：
$$
z_0 = [x_{class}; x_p^1 E; \dots; x_p^N E] + E_{pos},\ \ \ E_{pos}\in \mathbb{R}^{(N+1)\times D}
$$
也就是：

- 序列长度是 **N+1**（包含 `[CLS]`）
- 每个位置一个 **D 维**可学习向量



## 如何训练

**训练目标**：

`supervised classification`

- 输入：image
- 输出：label
- 损失函数：标准softmax+cross-entroy

- Optimizer：**Adam**

- Batch size：**4096**

- Learning rate：

- 典型量级：`3e-4 ~ 1e-3`

- Learning rate schedule：

**linear warmup            linear / cosine decay**

- Weight decay：**0.1**

- Dropout：

- 有时使用（ImageNet 训练）
- JFT 预训练中常为 0
