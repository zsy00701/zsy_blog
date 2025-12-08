const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('📝 创建新笔记\n');

  const title = await question('标题: ');
  const category = await question('分类（可选，默认未分类）: ');
  const tagsInput = await question('标签（可选，逗号分隔）: ');
  const excerpt = await question('摘要（可选，回车跳过）: ');
  console.log('\n输入内容（Markdown），结束请按 Ctrl+D：\n');

  let content = '';
  for await (const line of rl) {
    content += line + '\n';
  }

  const slug = slugify(title || `post-${Date.now()}`);
  const postsDir = path.join(process.cwd(), 'content', 'posts');

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${new Date().toISOString()}
${excerpt ? `excerpt: "${excerpt.replace(/"/g, '\\"')}"\n` : ''}${`category: "${(category || '未分类').replace(/"/g, '\\"')}"\n`}${
    tagsInput.trim()
      ? `tags:\n${tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t) => `  - "${t.replace(/"/g, '\\"')}"`)
          .join('\n')}\n`
      : ''
  }---

${content}`;

  const filePath = path.join(postsDir, `${slug}.md`);
  fs.writeFileSync(filePath, frontmatter, 'utf8');

  console.log(`\n✅ 笔记已创建: ${filePath}`);
  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
});

