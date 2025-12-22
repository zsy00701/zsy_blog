> 用于开发由LLM驱动的应用程序的开源框架

## 六大核心组件

### Model I/O

- **Prompts（提示词模板）**：预设好格式，让你只需要填入变量（如：“请帮我把{text}翻译成中文”）。
- **Models（模型接口）**：统一了不同厂商（OpenAI, Claude, Llama）的调用方式。

### Retrival（检索增强生成，RAG）

> 让模型访问外部数据

- **Document Loaders**：读取 PDF、Notion、网页等。
- **Vector Stores**：将文档变成数学向量存储，方便模型快速“检索”相关信息。

### Chain

> 将多个任务串联起来

### Agent

> 决定调用什么工具

### Memory

> 记忆

### Tools

> 各种工具

## 安装

~~~zsh
安装langchain
uv add langchain
安装大模型相关的包
uv add langchain-openai
uv add langchain-anthropic
~~~

