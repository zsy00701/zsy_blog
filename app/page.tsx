import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { Sidebar } from '@/app/components/Sidebar';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { SearchBox } from '@/app/components/SearchBox';
import { CategoryFilter } from '@/app/components/CategoryFilter';

export default function Home() {
  const posts = getAllPosts();
  
  // 计算分类数量
  const categories = new Set(posts.map(p => p.category || '未分类'));
  
  // 计算总标签数
  const allTags = new Set(posts.flatMap(p => p.tags || []));

  return (
    <div className="layout-container">
      <Sidebar posts={posts} />

      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <Link href="/" className="logo">
              <span className="logo-text">Blog</span>
            </Link>
            <div className="header-right">
              <SearchBox posts={posts} />
              <nav className="nav">
                <Link href="/">首页</Link>
                <Link href="/about">关于</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          {/* Hero 区域 */}
          <section className="hero-section">
            <div className="hero-badge">持续更新中</div>
            <h1 className="hero-title">
              我的<span>学习笔记</span>
            </h1>
            <p className="hero-subtitle">
              记录学习过程中的思考与收获
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
              <div className="stat-item">
                <div className="stat-number">{allTags.size}</div>
                <div className="stat-label">个标签</div>
              </div>
            </div>
          </section>

          {/* 分类过滤和文章列表 */}
          <section className="posts-section">
            <div className="section-header">
              <h2 className="section-title">所有文章</h2>
            </div>

            {posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p className="empty-title">还没有文章</p>
                <p className="empty-desc">在 content/posts 目录下添加 Markdown 文件开始写作</p>
              </div>
            ) : (
              <CategoryFilter posts={posts} />
            )}
          </section>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Blog</p>
            <p className="footer-sub">Powered by Next.js</p>
          </div>
        </footer>
      </main>

      <ScrollToTop />
    </div>
  );
}
