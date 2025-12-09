import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="layout-container">
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
            返回首页
          </Link>
          <div className="about-hero">
            <div>
              <p className="hero-eyebrow">你好，我是</p>
              <h1 className="hero-title">()</h1>
              <p className="hero-desc">
                喜欢把思考写下来，记录技术、科研与生活观察。这里是我的小站，左侧是分组目录，右侧是正文分层展示，希望对你有用。
              </p>
              <div className="hero-actions">
                <Link href="/posts/getting-started" className="primary-link">
                  查看快速开始
                </Link>
                <a href="mailto:yourname@example.com" className="secondary-link">
                  联系我
                </a>
              </div>
            </div>
          </div>

          <div className="about-grid">
            <div className="info-card">
              <h2>我在做什么</h2>
              <ul className="bullet-list">
                <li>技术与科研笔记整理</li>
                <li>项目与工具的实践与复盘</li>
                <li>阅读摘录与思考记录</li>
              </ul>
            </div>
            <div className="info-card">
              <h2>关注方向</h2>
              <div className="pill-list">
                <span className="pill">大语言模型</span>
                <span className="pill">多模态大模型</span>
                <span className="pill">AI/科研工具</span>
                <span className="pill">效率与写作</span>
                <span className="pill">强化学习</span>
                <span className="pill">自然语言编程</span>
                <span className="pill">AI Agent</span>
              </div>
            </div>
            <div className="info-card">
              <h2>常用技术</h2>
              <div className="pill-list">
                <span className="pill">TypeScript</span>
                <span className="pill">React / Next.js</span>
                <span className="pill">Node.js</span>
                <span className="pill">Markdown / 文档</span>
              </div>
            </div>
            <div className="info-card">
              <h2>联系与合作</h2>
              <ul className="bullet-list">
                <li>
                  邮箱：<a href="mailto:yourname@example.com">yourname@example.com</a>
                </li>
                <li>
                  GitHub：<a href="https://github.com/yourname" target="_blank">github.com/yourname</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} 我的个人博客</p>
        </footer>
      </main>
    </div>
  );
}

