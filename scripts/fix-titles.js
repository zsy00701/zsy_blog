const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(__dirname, '../content/posts');

// 递归获取所有 markdown 文件
function walkMarkdownFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === 'TEMPLATE.md') continue;
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push({
        fullPath,
        fileName: entry.name.replace(/\.md$/, ''),
        relativePath: path.relative(postsDir, fullPath),
      });
    }
  }
  
  return results;
}

// 从内容中提取第一个标题
function extractFirstHeading(content) {
  // 匹配 # 标题（h1）
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // 匹配 ## 标题（h2）
  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match) {
    return h2Match[1].trim();
  }
  
  return null;
}

// 判断标题是否需要修复
function needsFix(title) {
  if (!title) return true;
  
  // 以 - 开头的标题
  if (title.startsWith('-')) return true;
  
  // 全小写且包含连字符的 slug 格式（如 llmapp-langchain）
  if (/^[a-z0-9-_]+$/.test(title) && title.includes('-')) return true;
  
  // 太短的标题
  if (title.length < 2) return true;
  
  return false;
}

// 清理标题（去除可能的链接和特殊字符）
function cleanTitle(title) {
  if (!title) return null;
  
  // 去除 markdown 链接格式 [text](url)
  title = title.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // 去除 HTML 标签
  title = title.replace(/<[^>]+>/g, '');
  
  // 去除锚点链接 [¶](...)
  title = title.replace(/\[¶\]\([^)]+\)/g, '');
  
  // 去除多余空格
  title = title.replace(/\s+/g, ' ').trim();
  
  return title;
}

// 主函数
function fixTitles() {
  const files = walkMarkdownFiles(postsDir);
  let fixedCount = 0;
  
  console.log(`找到 ${files.length} 个 Markdown 文件\n`);
  
  for (const file of files) {
    const content = fs.readFileSync(file.fullPath, 'utf8');
    const { data: frontmatter, content: markdownContent } = matter(content);
    
    const currentTitle = frontmatter.title;
    const shouldFix = needsFix(currentTitle);
    
    if (!shouldFix) {
      console.log(`✓ ${file.relativePath}: "${currentTitle}" (保持不变)`);
      continue;
    }
    
    // 尝试从内容提取标题
    let newTitle = extractFirstHeading(markdownContent);
    newTitle = cleanTitle(newTitle);
    
    // 如果没找到，使用文件名
    if (!newTitle) {
      newTitle = file.fileName;
    }
    
    // 如果新标题和旧标题一样，跳过
    if (newTitle === currentTitle) {
      console.log(`- ${file.relativePath}: "${currentTitle}" (无法改进)`);
      continue;
    }
    
    console.log(`→ ${file.relativePath}: "${currentTitle || '(无标题)'}" → "${newTitle}"`);
    
    // 更新 frontmatter
    const newFrontmatter = {
      ...frontmatter,
      title: newTitle,
    };
    
    // 确保有日期
    if (!newFrontmatter.date) {
      newFrontmatter.date = new Date().toISOString();
    }
    
    // 获取分类（从路径）
    const pathParts = file.relativePath.split(path.sep);
    if (pathParts.length > 1 && !newFrontmatter.category) {
      newFrontmatter.category = pathParts[0];
    }
    
    // 重新生成文件内容
    const newContent = matter.stringify(markdownContent, newFrontmatter);
    fs.writeFileSync(file.fullPath, newContent, 'utf8');
    
    fixedCount++;
  }
  
  console.log(`\n✅ 完成！共修复 ${fixedCount} 个文件的标题`);
}

fixTitles();

