const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(), 'content', 'posts');

function summarize(text, max = 140) {
  const stripped = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return stripped.length > max ? `${stripped.slice(0, max)}…` : stripped;
}

function ensureArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

function slugifySegment(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function walkMarkdownFiles(dir, baseDir = dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    if (entry.name === 'TEMPLATE.md') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relative = path.relative(baseDir, fullPath);
      const parts = relative.split(path.sep);
      const category = parts.length > 1 ? parts[0] : '未分类';
      const slug =
        slugifySegment(
          relative.replace(/\.md$/, '').replace(new RegExp(`\\${path.sep}`, 'g'), '-')
        ) || slugifySegment(entry.name.replace(/\.md$/, ''));
      results.push({
        fullPath,
        slug,
        category,
        baseName: entry.name.replace(/\.md$/, ''),
      });
    }
  }
  return results;
}

function normalizeFile(filePath, fallbackCategory, slug, baseName) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const stat = fs.statSync(filePath);
  const parsed = matter(raw);

  const title = parsed.data.title || baseName || slug;
  const date = parsed.data.date || stat.birthtime.toISOString();
  const category = parsed.data.category || fallbackCategory || '未分类';
  const tags = ensureArray(parsed.data.tags);
  const excerpt = parsed.data.excerpt || summarize(parsed.content);

  const normalized = matter.stringify(parsed.content.trim(), {
    title,
    date,
    excerpt,
    category,
    ...(tags.length ? { tags } : {}),
  });

  fs.writeFileSync(filePath, `${normalized.trim()}\n`, 'utf8');
  return { slug, title, category };
}

function main() {
  if (!fs.existsSync(postsDir)) {
    console.log('content/posts 目录不存在，已跳过。');
    return;
  }

  const files = walkMarkdownFiles(postsDir);
  if (files.length === 0) {
    console.log('content/posts 中没有需要处理的 .md 文件。');
    return;
  }

  const results = files.map((file) =>
    normalizeFile(file.fullPath, file.category, file.slug, file.baseName)
  );
  console.log('✅ 已规范化以下文件:');
  results.forEach((r) => {
    console.log(`- ${r.slug} (${r.category})`);
  });
}

main();

