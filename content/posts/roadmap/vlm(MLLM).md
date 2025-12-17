---
title: roadmap-vlmmllm
date: '2025-12-17T02:39:00.588Z'
excerpt: >-
  ## 读survey > [A Comprehensive Survey and Guide to Multimodal Large Language
  Models in Vision-Language Tasks](https://arxiv.org/pdf/2411.0628…
category: roadmap
---
## 读survey

> [A Comprehensive Survey and Guide to Multimodal Large Language Models in Vision-Language Tasks](https://arxiv.org/pdf/2411.06284)
>
> > 梳理 MLLM 和 VLM 的架构和应用

## 读paper（基础）

MLLM基础:
● Visual Instruction Tuning   
● Qwen2.5-VL Technical Report 
● Qwen3 Technical Report
● LLaVA-OneVision: Easy Visual Task Transfer
● LLaVA-Video: Video Instruction Tuning With Synthetic Data

## 读paper（细分领域）

### **视觉-语言模型关键架构**

（阅读顺序建议：基本到进阶）

1. **Contrastive Models**

   - **CLIP** — 图像–文本对比学习基础架构。（具体引用可在 CLIP 原文中查阅）

2. **联合模型 / 融合结构**

   - **BLIP 系列** — 视觉-语言桥接架构设计
   - **LLaVA / InstructBLIP** — 指令级增强 VLM

3. **生成式与推理增强**

   - **MiniGPT-4 / Qwen-VL** 等前沿生成性 VLM（可从论文集合网站检索）

     Step 1：先把三大“代表范式”读透

- **CLIP**：为什么对比学习能做 zero-shot，为什么成了视觉底座。[arXiv](https://arxiv.org/abs/2103.00020?utm_source=chatgpt.com)
- **Flamingo**：in-context few-shot 的多模态范式（prompt 就能做多任务）。[arXiv+1](https://arxiv.org/abs/2204.14198?utm_source=chatgpt.com)
- **BLIP-2**：冻结视觉编码器 + 冻结 LLM，通过 Q-Former 桥接（非常工程友好）。[arXiv](https://arxiv.org/abs/2301.12597?utm_source=chatgpt.com)

Step 2：再把“开源可复现主线”读透（顶会做研究最实用）

- **LLaVA（视觉指令微调）**：指令数据构造思路 + 端到端多模态助手范式。[arXiv+1](https://arxiv.org/abs/2304.08485?utm_source=chatgpt.com)
- **LLaVA-1.5 / CVPR’24（强 baseline）**：连接器、分辨率、数据配方等设计选择的系统研究（你后续的 ablation 基线就靠它）。[arXiv+1](https://arxiv.org/abs/2310.03744?utm_source=chatgpt.com)
- **InstructBLIP**：更系统的 instruction tuning 数据混合与泛化评测。[arXiv](https://arxiv.org/abs/2305.06500?utm_source=chatgpt.com)

Step 3：最后补“你要发顶会会很吃香”的可靠性/对齐

- **DPO**：偏好对齐的核心数学形式与工程实现。[arXiv](https://arxiv.org/abs/2305.18290?utm_source=chatgpt.com)
- **Hallucination/POPE/H-POPE**：怎么定义、怎么测、为什么会发生。[GitHub+2arXiv](https://github.com/RUCAIBox/POPE?utm_source=chatgpt.com)
