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
          <div className="post-content">
            <h1>关于我</h1>
            <p>欢迎来到我的个人博客！</p>
            <p>这里记录着我的学习笔记、技术思考和日常感悟。</p>
            <p>你可以在这里找到各种主题的文章，包括但不限于：</p>
            <ul>
              <li>技术学习笔记</li>
              <li>编程心得</li>
              <li>生活思考</li>
            </ul>
            <p>感谢你的访问！</p>
          </div>
        </div>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} 我的个人博客</p>
        </footer>
      </main>
    </div>
  );
}

