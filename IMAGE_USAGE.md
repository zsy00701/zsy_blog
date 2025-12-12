# 图片使用指南

## ✅ 支持情况

你的博客**完全支持图片**！可以使用标准的 Markdown 图片语法。

## 📝 使用方法

### 方法一：使用本地图片（推荐）

1. **将图片放在 `public/images/` 目录下**

```
public/
└── images/
    ├── example.jpg
    ├── screenshot.png
    └── diagram.svg
```

2. **在 Markdown 中使用相对路径**

```markdown
![图片描述](/images/example.jpg)
```

**注意**：路径以 `/` 开头，Next.js 会自动从 `public` 目录提供静态文件。

### 方法二：使用外部图片 URL

```markdown
![图片描述](https://example.com/image.jpg)
```

支持任何有效的图片 URL（HTTP/HTTPS）。

### 方法三：使用图片标题

```markdown
![图片描述](/images/example.jpg "这是图片标题")
```

## 🎨 图片样式特性

- ✅ **自动响应式**：图片会自动适应容器宽度
- ✅ **居中显示**：图片默认居中显示
- ✅ **圆角边框**：美观的圆角设计
- ✅ **阴影效果**：轻微的阴影提升视觉效果
- ✅ **自动缩放**：大图片会自动缩小，不会溢出

## 📁 推荐的目录结构

你可以按文章分类组织图片：

```
public/
└── images/
    ├── posts/              # 通用文章图片
    │   ├── example1.jpg
    │   └── example2.png
    ├── 科研第一步/          # 分类图片
    │   └── ssh-diagram.png
    └── 多模态大模型/        # 分类图片
        └── architecture.jpg
```

然后在 Markdown 中引用：

```markdown
![SSH 连接示意图](/images/科研第一步/ssh-diagram.png)
```

## 💡 最佳实践

### 1. **图片命名**
- 使用有意义的文件名：`ssh-connection-diagram.png` 而不是 `img1.png`
- 使用小写字母和连字符：`my-image.jpg` 而不是 `My Image.jpg`

### 2. **图片格式**
- **JPG/JPEG**：适合照片、复杂图像
- **PNG**：适合截图、需要透明背景的图片
- **SVG**：适合图标、矢量图（可缩放）
- **WebP**：现代格式，体积小（如果浏览器支持）

### 3. **图片大小**
- 建议单张图片不超过 2MB
- 大图片可以使用工具压缩（如 TinyPNG、Squoosh）

### 4. **Alt 文本**
- 始终提供有意义的 alt 文本（图片描述）
- 有助于 SEO 和可访问性

```markdown
✅ 好：![SSH 连接流程图](/images/ssh-diagram.png)
❌ 差：![图片](/images/img1.png)
```

## 🔧 高级用法

### 使用 HTML 标签（如果需要更多控制）

```html
<figure>
  <img src="/images/example.jpg" alt="示例图片" />
  <figcaption>这是图片的说明文字</figcaption>
</figure>
```

### 链接图片

```markdown
[![图片描述](/images/example.jpg)](https://example.com)
```

点击图片会跳转到指定链接。

## 📦 部署注意事项

1. **Git 提交**：确保 `public/images/` 目录中的图片都提交到 Git
2. **文件大小**：大图片会增加仓库大小，考虑使用 Git LFS 或外部图床
3. **CDN**：部署后，图片会通过 CDN 分发，加载速度快

## 🚀 快速开始

1. 将图片复制到 `public/images/` 目录
2. 在 Markdown 文件中使用：`![描述](/images/文件名.jpg)`
3. 保存并查看效果

就是这么简单！

