import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content: string;
  category: string;
  tags?: string[];
  pathSegments: string[]; // 相对 content/posts 的目录分段
  relativePath: string;   // 相对路径（含文件名）
}

type PostEntry = {
  slug: string;
  fullPath: string;
  category: string;
  pathSegments: string[];
  relativePath: string;
};

function slugifySegment(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function walkMarkdownFiles(dir: string, baseDir = dir): PostEntry[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: PostEntry[] = [];

  for (const entry of entries) {
    if (entry.name === 'TEMPLATE.md') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relative = path.relative(baseDir, fullPath);
      const parts = relative.split(path.sep);
      const category = parts.length > 1 ? parts[0] : '未分类';
      const fileName = parts[parts.length - 1];
      const slug = slugifySegment(
        relative.replace(/\.md$/, '').replace(new RegExp(`\\${path.sep}`, 'g'), '-')
      ) || slugifySegment(fileName.replace(/\.md$/, ''));

      results.push({
        slug,
        fullPath,
        category,
        pathSegments: parts.slice(0, -1),
        relativePath: relative,
      });
    }
  }

  return results;
}

function parsePost(entry: PostEntry): Post | null {
  if (!fs.existsSync(entry.fullPath)) return null;
  const fileContents = fs.readFileSync(entry.fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const category = (data.category || entry.category || '未分类') as string;
  const tags = Array.isArray(data.tags)
    ? data.tags.map((t) => String(t))
    : data.tags
    ? [String(data.tags)]
    : [];

  return {
    slug: entry.slug,
    title: data.title || entry.slug,
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || '',
    content,
    category,
    tags,
    pathSegments: entry.pathSegments,
    relativePath: entry.relativePath,
  };
}

export function getPostSlugs(): string[] {
  return walkMarkdownFiles(postsDirectory).map((p) => p.slug);
}

export function getPostBySlug(slug: string): Post | null {
  const entry = walkMarkdownFiles(postsDirectory).find((p) => p.slug === slug);
  if (!entry) return null;
  return parsePost(entry);
}

export function getAllPosts(): Post[] {
  return walkMarkdownFiles(postsDirectory)
    .map((entry) => parsePost(entry))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function createPost(
  slug: string,
  title: string,
  content: string,
  excerpt?: string,
  category?: string,
  tags?: string[]
): void {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${new Date().toISOString()}
${excerpt ? `excerpt: "${excerpt.replace(/"/g, '\\"')}"\n` : ''}${
    `category: "${(category || '未分类').replace(/"/g, '\\"')}"\n`
  }${tags && tags.length ? `tags:\n${tags.map((t) => `  - "${t.replace(/"/g, '\\"')}"`).join('\n')}\n` : ''}---

${content}`;

  const fullPath = path.join(postsDirectory, `${slug}.md`);
  fs.writeFileSync(fullPath, frontmatter, 'utf8');
}

export function deletePost(slug: string): boolean {
  const entry = walkMarkdownFiles(postsDirectory).find((p) => p.slug === slug);
  if (!entry) return false;
  if (fs.existsSync(entry.fullPath)) {
    fs.unlinkSync(entry.fullPath);
    return true;
  }
  return false;
}

export function updatePost(
  slug: string,
  title: string,
  content: string,
  excerpt?: string,
  category?: string,
  tags?: string[]
): boolean {
  const entry = walkMarkdownFiles(postsDirectory).find((p) => p.slug === slug);
  if (!entry) return false;

  const fileContents = fs.readFileSync(entry.fullPath, 'utf8');
  const { data } = matter(fileContents);
  const originalDate = data.date || new Date().toISOString();
  const nextCategory = category || data.category || entry.category || '未分类';
  const nextTags = Array.isArray(tags)
    ? tags
    : Array.isArray(data.tags)
    ? data.tags
    : data.tags
    ? [data.tags]
    : [];

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${originalDate}
${excerpt ? `excerpt: "${excerpt.replace(/"/g, '\\"')}"\n` : ''}${
    `category: "${String(nextCategory).replace(/"/g, '\\"')}"\n`
  }${nextTags && nextTags.length ? `tags:\n${nextTags.map((t: string) => `  - "${String(t).replace(/"/g, '\\"')}"`).join('\n')}\n` : ''}---

${content}`;

  fs.writeFileSync(entry.fullPath, frontmatter, 'utf8');
  return true;
}

export function slugify(text: string): string {
  return slugifySegment(text);
}
