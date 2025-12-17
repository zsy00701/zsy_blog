import Link from 'next/link';
import { getAllPosts, type Post } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { SidebarTree } from '@/app/components/SidebarTree';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">我的笔记</div>
          <div className="sidebar-subtitle">学习与思考</div>
        </div>
        <SidebarTree posts={posts} />
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
            所有笔记
          </h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            共 {posts.length} 篇文章
          </p>

          {posts.length === 0 ? (
            <div className="empty-state">
              <p>还没有文章</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                在 content/posts 目录下添加 Markdown 文件
              </p>
            </div>
          ) : (
            <div className="post-list">
              {posts.map((post) => (
                <article key={post.slug} className="post-item">
                  <h2>
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <div className="post-meta">
                    <span className="category-badge">{post.category || '未分类'}</span>
                    {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
                  </div>
                  {post.excerpt && (
                    <p className="post-excerpt">{post.excerpt}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} 我的个人博客</p>
        </footer>
      </main>
    </div>
  );
}

