import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { SidebarTree } from '@/app/components/SidebarTree';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { ScrollToTop } from '@/app/components/ScrollToTop';

export default function Home() {
  const posts = getAllPosts();
  
  // 计算分类数量
  const categories = new Set(posts.map(p => p.category || '未分类'));

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">我的笔记</div>
          <div className="sidebar-subtitle">学习与思考的记录</div>
        </div>
        <SidebarTree posts={posts} />
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <Link href="/" className="logo">
              📚 我的博客
            </Link>
            <nav className="nav">
              <Link href="/">首页</Link>
              <Link href="/about">关于</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <div className="content-wrapper">
          {/* Hero 区域 */}
          <section className="hero-section">
            <h1 className="hero-title">
              记录<span>学习</span>的旅程
            </h1>
            <p className="hero-subtitle">
              在这里分享我的技术笔记、学习心得和思考，涵盖机器学习、大模型、计算机系统等领域。
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{posts.length}</div>
                <div className="stat-label">篇文章</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{categories.size}</div>
                <div className="stat-label">个分类</div>
              </div>
            </div>
          </section>

          {/* 文章列表 */}
          <h2 style={{ 
            fontFamily: "'Crimson Pro', serif",
            fontSize: '1.5rem', 
            fontWeight: 600, 
            marginBottom: '1.5rem',
            color: 'var(--text)'
          }}>
            最新文章
          </h2>

          {posts.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📝 还没有文章</p>
              <p>在 content/posts 目录下添加 Markdown 文件开始写作</p>
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
                    <span>{format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                  </div>
                  {post.excerpt && (
                    <p className="post-excerpt">{post.excerpt}</p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-badge">#{tag}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="footer">
          <p>© {new Date().getFullYear()} 我的个人博客 · 用 ❤️ 和 Next.js 构建</p>
        </footer>
      </main>

      <ScrollToTop />
    </div>
  );
}
