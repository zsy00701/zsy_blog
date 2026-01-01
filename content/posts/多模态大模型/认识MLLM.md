---
title: 认识 MLLM
date: '2025-12-17T02:39:00.591Z'
excerpt: 多模态大语言模型的数据模态与基本概念
category: 多模态大模型
---
## Data Modalities

> One data mode  can be represented or approximated in another data mode.

- Text
- Images
- Audio
- Video
- Code
- Sensor data

**For example**;

- Audio->Image
- Speech->Text(lose information such as volume ,intonation, pauses,etc)
- Image->Vector
- So on

![image-20260101202223803](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260101202223803.png)

![image-20260101202341999](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260101202341999.png)

![image-20260101202658206](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260101202658206.png)

![image-20260101202721380](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260101202721380.png)

![image-20260101202918908](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260101202918908.png)





![image-20260101203819170](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260101203819170.png)







## LLava

> LLaVA (Large Language and Vision Assistant) is an **open-source multimodal model** built on top of open LLMs.

**LLaVA combines:**

- A vision encoder
- A language model
- A projection layer for alignment

**Why LLaVa is important:**

- Fully open-source
- Can run on private servers
- Supports research and experiment
- Can be fine-tuned
- Works with RAG systems

> LLaVA brings multimodal AI to **developers, startups, and universities** without expensive APIs.

## How MultiModal Models Work

> MultiModal systems rely on three main components

### Modality Encoders

Each input type has its own encoder:

- Vision encoder → images
- Speech encoder → audio
- Text encoder → language

These convert raw inputs into **numerical embeddings**.

### Shared Fusion Layer

This layer merges all embeddings into a single semantic space,where reasoning happens.

### Decoder/Reasoning Engine

The final layer generates:

- Text responses
- Action commands
- Structured outputs

> This design is built on the Transformer foundation.
