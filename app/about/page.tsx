import Link from 'next/link';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { ScrollToTop } from '@/app/components/ScrollToTop';

export default function AboutPage() {
  return (
    <div className="layout-container">
      <main className="main-content" style={{ marginLeft: 0 }}>
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

        <div className="content-wrapper" style={{ maxWidth: '700px' }}>
          <Link href="/" className="back-link">
            ← 返回首页
          </Link>
          
          <article>
            <div className="post-header">
              <h1 className="post-title">关于我</h1>
            </div>
            
            <div className="post-content">
              <p>欢迎来到我的个人博客！👋</p>
              
              <h2>关于这个博客</h2>
              <p>
                这是一个记录学习笔记和技术思考的地方。我相信「输出是最好的学习方式」，
                通过写作来整理思路、深化理解。
              </p>
              
              <h2>主要内容</h2>
              <p>你可以在这里找到以下主题的文章：</p>
              <ul>
                <li><strong>机器学习</strong> — 从基础到前沿的学习笔记</li>
                <li><strong>大语言模型</strong> — LLM、VLM 等多模态模型的探索</li>
                <li><strong>计算机系统</strong> — 系统原理和底层知识</li>
                <li><strong>开发实践</strong> — 项目经验和最佳实践</li>
              </ul>
              
              <h2>技术栈</h2>
              <p>这个博客使用以下技术构建：</p>
              <ul>
                <li><strong>Next.js 14</strong> — React 全栈框架</li>
                <li><strong>TypeScript</strong> — 类型安全的 JavaScript</li>
                <li><strong>Markdown</strong> — 支持 GFM、数学公式、代码高亮</li>
              </ul>
              
              <h2>联系方式</h2>
              <p>
                如果你有任何问题或想法，欢迎通过以下方式联系我：
              </p>
              <ul>
                <li>GitHub</li>
                <li>Email</li>
              </ul>
              
              <blockquote>
                <p>「Stay hungry, stay foolish.」</p>
              </blockquote>
              
              <p>感谢你的访问！🙏</p>
            </div>
          </article>
        </div>

        <footer className="footer">
          <p>© {new Date().getFullYear()} 我的个人博客 · 用 ❤️ 和 Next.js 构建</p>
        </footer>
      </main>
      
      <ScrollToTop />
    </div>
  );
}
