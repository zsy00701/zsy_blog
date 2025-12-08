---
title: 快速开始指南
date: 2025-12-08
excerpt: 了解如何开始使用这个博客系统，包括安装、配置和部署。
---

## 快速开始指南

本指南将帮助你快速上手这个个人博客系统。

### 安装依赖

首先，确保你已经安装了 Node.js（版本 18 或更高）。然后运行：

```bash
npm install
```

### 开发模式

启动开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看你的博客。

### 创建新文章

1. 在 `content/posts` 目录下创建新的 `.md` 文件
2. 文件名将成为文章的 URL slug（例如：`my-post.md` → `/posts/my-post`）

#### Frontmatter 格式

每篇文章的开头需要包含 frontmatter：

```yaml
---
title: 文章标题
date: 2024-01-01
excerpt: 文章摘要（可选）
---
```

#### 编写内容

使用标准的 Markdown 语法编写内容：

- **粗体文本**
- *斜体文本*
- `代码片段`
- [链接](https://example.com)
- 列表项

### 构建生产版本

```bash
npm run build
npm start
```

### 部署

#### 部署到 Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成！

#### 部署到其他平台

这个博客是静态生成的，可以部署到任何支持静态网站的平台：

- Netlify
- GitHub Pages
- Cloudflare Pages
- 等等

### 自定义

- 修改 `app/globals.css` 来自定义样式
- 编辑 `app/page.tsx` 来修改首页
- 更新 `app/layout.tsx` 中的元数据

祝你使用愉快！
