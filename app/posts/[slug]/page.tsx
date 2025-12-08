import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { extractToc } from '@/lib/toc';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { SidebarTree } from '@/app/components/SidebarTree';
import { TocScroll } from '@/app/components/TocScroll';
import { estimateReadingTime, countWords } from '@/lib/utils';
import { generateMetadata, generateStaticParams as genParams } from './metadata';

export { generateMetadata };
export const generateStaticParams = genParams;

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
  const readingTime = estimateReadingTime(content);
  const wordCount = countWords(content);

  // 获取上一篇和下一篇文章
  const sortedPosts = allPosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentIndex = sortedPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">我的笔记</div>
          <div className="sidebar-subtitle">学习与思考</div>
        </div>
        <SidebarTree posts={allPosts} activeSlug={post.slug} />

        {toc.length > 0 && <TocScroll toc={toc} />}
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <Link href="/" className="logo">
              我的博客
            </Link>
            <nav className="nav">
              <Link href="/">首页</Link>
              <Link href="/about">关于</Link>
            </nav>
          </div>
        </header>

        <div className="content-wrapper">
          <Link href="/" className="back-link">
            ← 返回首页
          </Link>

          <article>
            <div className="post-header">
              <h1 className="post-title">{post.title}</h1>
              <div className="post-meta">
                <span className="category-badge">{post.category || '未分类'}</span>
              </div>
              <div className="post-date">
                {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
                <span className="post-stats">
                  · {readingTime} 分钟阅读 · {wordCount} 字
                </span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
          </article>

          {/* 上一篇/下一篇文章导航 */}
          {(prevPost || nextPost) && (
            <nav className="post-navigation">
              {prevPost && (
                <Link href={`/posts/${prevPost.slug}`} className="nav-post prev-post">
                  <div className="nav-post-label">← 上一篇</div>
                  <div className="nav-post-title">{prevPost.title}</div>
                </Link>
              )}
              {nextPost && (
                <Link href={`/posts/${nextPost.slug}`} className="nav-post next-post">
                  <div className="nav-post-label">下一篇 →</div>
                  <div className="nav-post-title">{nextPost.title}</div>
                </Link>
              )}
            </nav>
          )}
        </div>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} 我的个人博客</p>
        </footer>
      </main>
    </div>
  );
}

