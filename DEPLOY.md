# 部署指南

这个博客可以部署到多个平台，以下是详细的部署步骤。

## 部署前准备

### 1. 设置环境变量（可选）

如果需要完整的 SEO 功能，设置网站 URL：

```bash
NEXT_PUBLIC_SITE_URL=https://your-blog-domain.com
```

### 2. 确保所有笔记已规范化

部署前运行：

```bash
npm run normalize-posts
```

## 部署方式

### 方式一：Vercel（推荐，最简单）

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - Vercel 会自动检测 Next.js 并配置
   - 如果需要，添加环境变量 `NEXT_PUBLIC_SITE_URL`
   - 点击 "Deploy"

3. **完成！**
   - 部署完成后会获得一个 `your-project.vercel.app` 域名
   - 可以绑定自定义域名

### 方式二：Netlify

1. **推送到 GitHub**（同上）

2. **在 Netlify 部署**
   - 访问 [netlify.com](https://netlify.com)
   - 点击 "Add new site" → "Import an existing project"
   - 连接 GitHub 仓库
   - 构建设置：
     - Build command: `npm run build`
     - Publish directory: `.next`
   - 添加环境变量（如需要）
   - 点击 "Deploy site"

### 方式三：Cloudflare Pages

1. **推送到 GitHub**

2. **在 Cloudflare Pages 部署**
   - 访问 [pages.cloudflare.com](https://pages.cloudflare.com)
   - 点击 "Create a project" → "Connect to Git"
   - 选择 GitHub 仓库
   - 构建设置：
     - Framework preset: Next.js
     - Build command: `npm run build`
     - Build output directory: `.next`
   - 添加环境变量（如需要）
   - 点击 "Save and Deploy"

### 方式四：自托管服务器

1. **构建项目**
   ```bash
   npm run build
   ```

2. **启动生产服务器**
   ```bash
   npm start
   ```

3. **使用 PM2 管理进程**（推荐）
   ```bash
   npm install -g pm2
   pm2 start npm --name "blog" -- start
   pm2 save
   pm2 startup
   ```

4. **配置 Nginx 反向代理**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 部署后更新内容

### 方法一：通过 Git（推荐）

1. 在本地 `content/posts` 添加或修改文件
2. 提交并推送：
   ```bash
   git add content/posts/
   git commit -m "Add new post"
   git push
   ```
3. 平台会自动重新构建和部署

### 方法二：直接在服务器上

如果使用自托管：

1. SSH 到服务器
2. 进入项目目录
3. 添加/修改 `content/posts` 中的文件
4. 运行：
   ```bash
   npm run normalize-posts
   npm run build
   pm2 restart blog
   ```

## 注意事项

1. **文件系统限制**：某些平台（如 Vercel）在构建时是只读的，但 Next.js 静态生成会在构建时读取 `content/posts`，所以没问题。

2. **环境变量**：记得在部署平台设置 `NEXT_PUBLIC_SITE_URL`（如果使用）

3. **构建时间**：首次构建可能需要几分钟，后续更新会更快

4. **自定义域名**：所有平台都支持绑定自定义域名，通常在项目设置中配置

## 故障排查

- **构建失败**：检查 `content/posts` 中的 Markdown 文件格式是否正确
- **404 错误**：确保运行了 `npm run normalize-posts` 规范化文件
- **样式丢失**：检查 `app/globals.css` 是否正确导入

## 性能优化

部署后可以：
- 启用 CDN（Vercel/Netlify/Cloudflare 自动提供）
- 配置缓存策略
- 使用图片 CDN（如果后续添加图片功能）


