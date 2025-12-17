import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { extractToc } from '@/lib/toc';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { SidebarTree } from '@/app/components/SidebarTree';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">我的笔记</div>
          <div className="sidebar-subtitle">学习与思考</div>
        </div>
        <SidebarTree posts={allPosts} activeSlug={post.slug} />

        {toc.length > 0 && (
          <div className="toc">
            <div className="toc-title">目录</div>
            <ul className="toc-list">
              {toc.map((item) => (
                <li key={item.id} className={`toc-item toc-level-${item.level}`}>
                  <a href={`#${item.id}`} className="toc-link">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
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
        </div>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} 我的个人博客</p>
        </footer>
      </main>
    </div>
  );
}

