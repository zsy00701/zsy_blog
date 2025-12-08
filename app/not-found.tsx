import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              我的博客
            </Link>
            <nav className="nav">
              <Link href="/">首页</Link>
              <Link href="/about">关于</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="post-content" style={{ textAlign: 'center' }}>
            <h1>404 - 页面未找到</h1>
            <p>抱歉，您访问的页面不存在。</p>
            <Link href="/" className="back-link">
              返回首页
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

