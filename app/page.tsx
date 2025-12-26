import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { Sidebar } from '@/app/components/Sidebar';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { SearchBox } from '@/app/components/SearchBox';
import { CategoryFilter } from '@/app/components/CategoryFilter';

export default function Home() {
  const posts = getAllPosts();
  
  const categories = new Set(posts.map(p => p.category || '未分类'));
  const allTags = new Set(posts.flatMap(p => p.tags || []));

  return (
    <div className="layout-container">
      <Sidebar posts={posts} />

      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <Link href="/" className="logo">
              墨剑阁
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
          <section className="hero-section">
            <div className="hero-badge">十年磨一剑</div>
            <h1 className="hero-title">
              笔落惊风雨<br/>
              <span>诗成泣鬼神</span>
            </h1>
            <p className="hero-subtitle">
              以代码为剑，以笔墨铸魂<br/>
              记录技术修行之路
            </p>
            <div className="hero-divider"></div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{posts.length}</div>
                <div className="stat-label">篇章</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{categories.size}</div>
                <div className="stat-label">卷轴</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{allTags.size}</div>
                <div className="stat-label">印记</div>
              </div>
            </div>
          </section>

          <section className="posts-section">
            <div className="section-header">
              <h2 className="section-title">文章</h2>
            </div>

            {posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">剑</div>
                <p className="empty-title">尚无篇章</p>
                <p className="empty-desc">于 content/posts 目录下添加文章</p>
              </div>
            ) : (
              <CategoryFilter posts={posts} />
            )}
          </section>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <p>墨剑阁 © {new Date().getFullYear()}</p>
            <p className="footer-sub">Next.js</p>
          </div>
        </footer>
      </main>

      <ScrollToTop />
    </div>
  );
}
