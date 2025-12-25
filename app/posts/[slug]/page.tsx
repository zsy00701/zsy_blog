import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { extractToc } from '@/lib/toc';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Sidebar } from '@/app/components/Sidebar';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { ReadingProgress } from '@/app/components/ReadingProgress';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { RightToc } from '@/app/components/RightToc';
import { RelatedPosts } from '@/app/components/RelatedPosts';
import { SearchBox } from '@/app/components/SearchBox';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 分类图标映射
const categoryIcons: Record<string, string> = {
  "多模态大模型": "🎨",
  "大语言模型": "🤖",
  "machine_learning": "🧠",
  "计算机系统原理": "💻",
  "LLMAPP": "🔧",
  "科研第一步": "🔬",
  "roadmap": "🗺️",
  "Network": "🌐",
  "环境配置": "⚙️",
};

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  const allPosts = getAllPosts();

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content);
  const toc = extractToc(content);

  // 计算阅读时间（假设每分钟阅读 300 字）
  const wordCount = post.content.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 300));

  const categoryIcon = categoryIcons[post.category || ''] || '📄';

  return (
    <>
      <ReadingProgress />
      
      <div className="layout-container">
        <Sidebar posts={allPosts} activeSlug={post.slug} />

        <main className="main-content main-content-with-toc">
          <header className="header">
            <div className="header-content">
              <Link href="/" className="logo">
                <span className="logo-icon">✨</span>
                <span className="logo-text">My Blog</span>
              </Link>
              <div className="header-right">
                <SearchBox posts={allPosts} />
                <nav className="nav">
                  <Link href="/">首页</Link>
                  <Link href="/about">关于</Link>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <div className="article-layout">
            <div className="content-wrapper">
              <Link href="/" className="back-link">
                <span>←</span> 返回首页
              </Link>

              <article className="article">
                <div className="post-header">
                  <div className="post-header-meta">
                    <span className="post-category-badge">
                      {categoryIcon} {post.category || '未分类'}
                    </span>
                    <span className="post-reading-time">⏱️ {readingTime} 分钟阅读</span>
                  </div>
                  <h1 className="post-title">{post.title}</h1>
                  <div className="post-info">
                    <span className="post-date">
                      📅 {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
                    </span>
                    <span className="post-words">📝 约 {wordCount.toLocaleString()} 字</span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((tag) => (
                        <span key={tag} className="tag-badge">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* 相关文章 */}
                <RelatedPosts currentPost={post} allPosts={allPosts} />
              </article>
            </div>

            {toc.length > 0 && <RightToc toc={toc} />}
          </div>

          <footer className="footer">
            <div className="footer-content">
              <p>© {new Date().getFullYear()} My Blog</p>
              <p className="footer-sub">用 💜 和 Next.js 构建</p>
            </div>
          </footer>
        </main>

        <ScrollToTop />
      </div>
    </>
  );
}
