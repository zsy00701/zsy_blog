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
      <div className="leaf-bg">
        <div className="leaf"></div>
        <div className="leaf"></div>
        <div className="leaf"></div>
        <div className="leaf"></div>
      </div>
      
      <Sidebar posts={posts} />

      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <Link href="/" className="logo">
              诗剑行
            </Link>
            <div className="header-right">
              <SearchBox posts={posts} />
              <nav className="nav">
                <Link href="/">剑谱</Link>
                <Link href="/about">侠客</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <section className="hero-section">
            <div className="hero-badge">青莲剑歌</div>
            <h1 className="hero-title">
              大河之剑<span>天上来</span>
            </h1>
            <p className="hero-subtitle">
              一篇诗，一斗酒，一曲长歌，一剑天涯<br/>
              今朝有酒今朝醉，明日愁来明日愁
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{posts.length}</div>
                <div className="stat-label">剑式</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{categories.size}</div>
                <div className="stat-label">流派</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{allTags.size}</div>
                <div className="stat-label">心法</div>
              </div>
            </div>
          </section>

          <section className="posts-section">
            <div className="section-header">
              <h2 className="section-title">习武录</h2>
            </div>

            {posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">剑</div>
                <p className="empty-title">暂无剑谱</p>
                <p className="empty-desc">请于 content/posts 添加</p>
              </div>
            ) : (
              <CategoryFilter posts={posts} />
            )}
          </section>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <p>诗剑行 © {new Date().getFullYear()}</p>
            <p className="footer-sub">Next.js</p>
          </div>
        </footer>
      </main>

      <ScrollToTop />
    </div>
  );
}
