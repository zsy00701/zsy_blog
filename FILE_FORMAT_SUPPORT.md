# 文件格式支持说明

## 📝 当前支持格式

**目前只支持 Markdown（`.md`）文件**

代码中明确检查文件扩展名：
```typescript
} else if (entry.isFile() && entry.name.endsWith('.md')) {
```

## ✅ 为什么选择 Markdown？

### 1. **简单易用**
- 纯文本格式，任何编辑器都能打开
- 语法简单，学习成本低
- 人类可读，即使不渲染也能看懂

### 2. **功能强大**
- 支持标题、列表、代码块、表格、链接等
- 支持 frontmatter（元数据）
- 可以轻松转换为 HTML

### 3. **版本控制友好**
- 纯文本，Git 可以追踪变更
- 可以查看 diff
- 合并冲突容易解决

### 4. **生态丰富**
- 大量工具支持（编辑器、预览器等）
- 社区活跃，资源丰富

## 🔄 其他格式的处理方式

### 如果你有其他格式的文件

**方法一：转换为 Markdown（推荐）**

1. **Word 文档 (.docx)**
   - 使用 Pandoc：`pandoc document.docx -o document.md`
   - 或手动复制粘贴到 Markdown 编辑器

2. **纯文本 (.txt)**
   - 直接重命名为 `.md`
   - 添加 frontmatter 即可

3. **HTML 文件**
   - 使用工具转换为 Markdown
   - 或手动整理成 Markdown 格式

4. **其他格式**
   - 先导出为文本或 HTML
   - 再转换为 Markdown

### 方法二：扩展代码支持其他格式（高级）

如果需要支持其他格式，需要修改代码：

#### 支持 `.txt` 文件

修改 `lib/posts.ts`：

```typescript
// 修改前
} else if (entry.isFile() && entry.name.endsWith('.md')) {

// 修改后
} else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.txt'))) {
```

然后修改 `parsePost` 函数，处理 `.txt` 文件（可能需要不同的解析逻辑）。

#### 支持 `.docx` 文件

需要安装额外的库：
```bash
npm install mammoth  # 用于转换 .docx
```

然后修改代码处理 `.docx` 文件。

#### 支持 HTML 文件

相对简单，因为已经有 HTML 处理能力，但需要：
1. 修改文件检测逻辑
2. 跳过 Markdown 转换步骤
3. 直接使用 HTML 内容

## 💡 推荐工作流程

### 场景一：从 Word 文档开始

1. 在 Word 中写好内容
2. 使用 Pandoc 转换：
   ```bash
   pandoc document.docx -o document.md
   ```
3. 添加 frontmatter
4. 放入 `content/posts/`

### 场景二：从其他笔记软件导出

大多数笔记软件都支持导出为 Markdown：
- Notion → 导出为 Markdown
- Obsidian → 直接是 Markdown
- Typora → 保存为 Markdown
- 语雀 → 导出为 Markdown

### 场景三：在线转换工具

- [Pandoc Try](https://pandoc.org/try/) - 在线转换各种格式
- [CloudConvert](https://cloudconvert.com/) - 支持多种格式转换

## 🎯 最佳实践

1. **统一使用 Markdown**
   - 所有文章都用 `.md` 格式
   - 保持一致性，便于管理

2. **使用 Markdown 编辑器**
   - VS Code + Markdown 插件
   - Typora（所见即所得）
   - Obsidian（知识管理）

3. **建立转换流程**
   - 如果经常从其他格式转换，建立自动化脚本

## 📋 总结

- ✅ **当前**：只支持 `.md` 文件
- ✅ **推荐**：将其他格式转换为 Markdown
- ⚙️ **可扩展**：可以修改代码支持其他格式，但需要额外开发

**建议**：统一使用 Markdown，这是最简单、最通用的方案！


