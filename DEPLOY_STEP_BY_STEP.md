# 一步一步部署教程

## 第一步：准备 GitHub 仓库

### 1.1 创建 GitHub 账号（如果还没有）

1. 访问 [github.com](https://github.com)
2. 点击右上角 "Sign up"
3. 填写信息注册账号

### 1.2 创建新仓库

1. 登录 GitHub 后，点击右上角的 **"+"** → **"New repository"**
2. 填写仓库信息：
   - **Repository name**: `my-blog`（或你喜欢的名字）
   - **Description**: `我的个人博客`（可选）
   - **Visibility**: 选择 **Public**（公开）或 **Private**（私有）
   - **不要**勾选 "Add a README file"（因为本地已有）
3. 点击 **"Create repository"**

### 1.3 在本地初始化 Git

打开终端（Terminal），进入你的博客目录：

```bash
cd /Users/zhoushengyao/blog
```

初始化 Git 仓库：

```bash
git init
```

### 1.4 添加所有文件

```bash
git add .
```

### 1.5 提交代码

```bash
git commit -m "Initial commit: 我的博客"
```

### 1.6 连接远程仓库

复制你刚创建的 GitHub 仓库地址（在 GitHub 页面会显示，类似 `https://github.com/你的用户名/my-blog.git`），然后运行：

```bash
git remote add origin https://github.com/你的用户名/my-blog.git
```

**注意**：把 `你的用户名/my-blog` 替换成你实际的用户名和仓库名

### 1.7 推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

如果提示输入账号密码：
- 用户名：你的 GitHub 用户名
- 密码：需要使用 **Personal Access Token**（不是登录密码）

**如何获取 Token**：
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token"
3. 勾选 `repo` 权限
4. 生成后复制保存（只显示一次）

---

## 第二步：在 Vercel 部署

### 2.1 注册 Vercel 账号

1. 访问 [vercel.com](https://vercel.com)
2. 点击右上角 **"Sign Up"**
3. 选择 **"Continue with GitHub"**（推荐，可以直接连接 GitHub）

### 2.2 导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在 "Import Git Repository" 中找到你的 `my-blog` 仓库
3. 点击 **"Import"**

### 2.3 配置项目（通常自动检测）

Vercel 会自动检测到这是 Next.js 项目，配置通常是：
- **Framework Preset**: Next.js（自动）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（自动）
- **Output Directory**: `.next`（自动）
- **Install Command**: `npm install`（自动）

**通常不需要修改，直接下一步**

### 2.4 设置环境变量（可选）

如果需要完整的 SEO 功能：

1. 点击 **"Environment Variables"**
2. 添加变量：
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://your-project.vercel.app`（部署后会给你一个地址，可以先填这个，后续可以改）
3. 点击 **"Add"**

### 2.5 开始部署

1. 点击 **"Deploy"** 按钮
2. 等待 2-3 分钟，Vercel 会自动：
   - 安装依赖
   - 运行 `npm run normalize-posts`（因为 prebuild 脚本）
   - 构建项目
   - 部署到 CDN

### 2.6 查看部署结果

部署完成后，你会看到：
- ✅ **Success!** 提示
- 一个链接，类似：`https://my-blog-xxx.vercel.app`
- 点击链接即可访问你的博客！

---

## 第三步：验证部署

### 3.1 访问你的博客

点击 Vercel 提供的链接，应该能看到：
- 首页正常显示
- 左侧目录树
- 所有文章都能访问

### 3.2 测试功能

- ✅ 搜索功能是否正常
- ✅ 文章详情页是否正常
- ✅ 目录导航是否正常
- ✅ 移动端是否正常显示

---

## 第四步：绑定自定义域名（可选）

### 4.1 在 Vercel 添加域名

1. 在 Vercel 项目页面，点击 **"Settings"** → **"Domains"**
2. 输入你的域名（如 `blog.yourdomain.com`）
3. 点击 **"Add"**

### 4.2 配置 DNS

Vercel 会显示需要添加的 DNS 记录，在你的域名服务商（如阿里云、腾讯云）添加：
- **Type**: CNAME
- **Name**: `blog`（或 `@` 如果是根域名）
- **Value**: `cname.vercel-dns.com`

等待 DNS 生效（通常几分钟到几小时）

---

## 第五步：更新内容

### 5.1 在本地添加新文章

1. 在 `content/posts` 目录添加新的 `.md` 文件
2. 或者运行 `npm run add-post` 创建

### 5.2 推送到 GitHub

```bash
git add content/posts/
git commit -m "Add new post: 文章标题"
git push
```

### 5.3 自动部署

Vercel 会自动检测到代码更新，自动重新构建和部署（通常 1-2 分钟）

你可以在 Vercel 的 **"Deployments"** 页面查看部署状态

---

## 常见问题

### Q: 构建失败怎么办？

**A**: 检查以下几点：
1. 确保 `content/posts` 中的 Markdown 文件格式正确
2. 检查终端错误信息
3. 在 Vercel 的部署日志中查看详细错误

### Q: 网站显示 404？

**A**: 
1. 确保运行了 `npm run normalize-posts`（Vercel 会自动运行）
2. 检查 `content/posts` 目录是否有文件
3. 等待几分钟让 CDN 缓存更新

### Q: 如何回退到之前的版本？

**A**: 在 Vercel 的 **"Deployments"** 页面，找到之前的部署，点击 **"..."** → **"Promote to Production"**

### Q: 如何查看访问统计？

**A**: Vercel 提供基础的访问统计，在项目页面的 **"Analytics"** 标签

---

## 完成！

🎉 恭喜！你的博客已经成功部署到互联网上了！

现在你可以：
- 随时通过链接访问你的博客
- 通过 Git 推送更新内容
- 分享给朋友访问
- 绑定自己的域名

有任何问题，随时查看 Vercel 的文档或联系我！

