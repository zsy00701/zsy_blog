# 个人博客

一个基于 Next.js 的现代化个人博客系统，支持 Markdown 格式的文章和笔记。

## 功能特点

- ✨ 现代化的 UI 设计
- 📝 支持 Markdown 格式
- 📱 完全响应式设计
- ⚡ 基于 Next.js 14，性能优秀
- 🚀 易于部署到各种平台
- 🔍 SEO 友好

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看博客。

### 构建生产版本

```bash
npm run build
npm start
```

## 创建新文章

1. 在 `content/posts` 目录下创建新的 `.md` 文件
2. 文件名将成为文章的 URL slug

### 文章格式

每篇文章需要在开头包含 frontmatter：

```markdown
---
title: 文章标题
date: 2024-01-01
excerpt: 文章摘要（可选）
---

# 文章内容

使用 Markdown 语法编写内容...
```

### 元数据规范（frontmatter）

- `title`（必填）：文章标题。若缺省，将回退为文件名。
- `date`（可选但推荐）：ISO 时间字符串，格式示例 `2025-01-20T09:00:00.000Z`。若缺省，使用文件创建时的当前时间。
- `excerpt`（可选）：文章摘要，显示在列表。
- `category`（可选）：文章分类，缺省为“未分类”。
- `tags`（可选）：数组形式的标签，如：

```yaml
tags:
  - "标签1"
  - "标签2"
```

### 一键规范化已有 Markdown

- 将你已有的 `.md` 文件放进 `content/posts/`（文件名即 slug）。
- 运行：

```bash
npm run normalize-posts
```

- 脚本会为缺失的元数据自动填充：
  - `title`：缺省用文件名
  - `date`：当前时间
  - `excerpt`：正文前 140 字
  - `category`：默认“未分类”
  - `tags`：保留已有；缺省为空

## 项目结构

```text
blog/
├── app/              # Next.js App Router 页面
│   ├── page.tsx     # 首页
│   ├── posts/       # 文章详情页
│   └── globals.css  # 全局样式
├── content/         # Markdown 文章目录
│   └── posts/       # 文章文件
├── lib/             # 工具函数
│   ├── posts.ts     # 文章处理逻辑
│   └── markdown.ts  # Markdown 解析
└── package.json     # 项目配置
```

## 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成！

### 其他平台

这个博客可以部署到多个平台，**不是只能在本地运行**！

支持的平台：
- **Vercel**（推荐）- 零配置，自动部署
- **Netlify** - 类似 Vercel，功能丰富
- **Cloudflare Pages** - 全球 CDN，速度快
- **自托管服务器** - 完全控制

### 详细部署指南

- **新手推荐**：查看 [DEPLOY_STEP_BY_STEP.md](./DEPLOY_STEP_BY_STEP.md) - 一步一步详细教程
- **快速参考**：查看 [DEPLOY.md](./DEPLOY.md) - 各平台部署说明和高级配置

### 部署后添加文章

查看 [HOW_TO_ADD_POSTS.md](./HOW_TO_ADD_POSTS.md) - 详细的添加文章指南，包含各种场景和最佳实践

## 数据存储

这个博客使用**文件系统**存储文章（不是传统数据库）：
- 所有文章在 `content/posts/` 目录
- 文件即数据，简单直观
- 支持 Git 版本控制
- 查看 [DATA_STORAGE.md](./DATA_STORAGE.md) 了解详细说明

## 自定义

- **样式**：修改 `app/globals.css`
- **首页**：编辑 `app/page.tsx`
- **元数据**：更新 `app/layout.tsx`
- **关于页**：编辑 `app/about/page.tsx`

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter 解析
- [remark](https://remark.js.org/) - Markdown 处理
- [date-fns](https://date-fns.org/) - 日期格式化

## 许可证

MIT
