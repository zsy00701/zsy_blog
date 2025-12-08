import Link from 'next/link';
import { getAllPosts, type Post } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { SidebarTree } from '@/app/components/SidebarTree';
import { SearchBar } from '@/app/components/SearchBar';

type TreeNode = {
  name: string;
  posts: Post[];
  children: TreeNode[];
  pathKey: string;
};

function buildContentTree(posts: Post[]): TreeNode {
  const root: TreeNode = { name: 'root', posts: [], children: [], pathKey: 'root' };

  const ensureChild = (parent: TreeNode, name: string) => {
    let child = parent.children.find((c) => c.name === name);
    if (!child) {
      child = {
        name,
        posts: [],
        children: [],
        pathKey: `${parent.pathKey}/${name}`,
      };
      parent.children.push(child);
    }
    return child;
  };

  posts.forEach((post) => {
    const segments = post.pathSegments.length ? post.pathSegments : ['未分类'];
    let current = root;
    segments.forEach((seg) => {
      current = ensureChild(current, seg);
    });
    current.posts.push(post);
  });

  const sortTree = (node: TreeNode): TreeNode => ({
    ...node,
    posts: [...node.posts].sort((a, b) => a.title.localeCompare(b.title, 'zh')),
    children: [...node.children]
      .map(sortTree)
      .sort((a, b) => a.name.localeCompare(b.name, 'zh')),
  });

  return sortTree(root);
}

export default function Home() {
  const posts = getAllPosts();
  const contentTree = buildContentTree(posts);

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
            <SearchBar posts={posts} />
          </div>
        </header>

        <div className="content-wrapper">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
            所有笔记
          </h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            共 {posts.length} 篇文章
          </p>

          <div className="hero-block">
            <div>
              <div className="hero-eyebrow">欢迎来到我的博客</div>
              <h2 className="hero-title">记录 · 学习 · 分享</h2>
              <p className="hero-desc">
                左侧目录按文件夹分组，右侧分层展示文章。把 Markdown 放入 content/posts，即可自动归类、补全元数据并展示。
              </p>
              <div className="hero-actions">
                <Link href="/posts/getting-started" className="primary-link">
                  查看快速开始指南
                </Link>
                <Link href="/about" className="secondary-link">
                  关于我
                </Link>
              </div>
            </div>
          </div>

          <div className="quick-start-block">
            <h3>快速开始</h3>
            <ol>
              <li>将 Markdown 文件放入 <code>content/posts/</code>（可用子目录归类）。</li>
              <li>运行 <code>npm run dev</code>（会自动规范化并展示）。</li>
              <li>需要脚本创建？使用 <code>npm run add-post</code> 交互生成。</li>
            </ol>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              <p>还没有文章</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                在 content/posts 目录下添加 Markdown 文件
              </p>
            </div>
          ) : (
            <div className="content-tree">
              {contentTree.children.map((node) => (
                <ContentSection key={node.pathKey} node={node} depth={0} />
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

function ContentSection({ node, depth }: { node: TreeNode; depth: number }) {
  const indent = depth * 12;
  return (
    <div className="section-block" style={{ marginLeft: indent }}>
      <div className="section-header">
        <span className="folder-icon">📁</span>
        <span className="section-title">{node.name}</span>
        <span className="count-badge">{node.posts.length}</span>
      </div>
      {node.posts.length > 0 && (
        <div className="post-list section-posts">
          {node.posts.map((post) => (
            <article key={post.slug} className="post-item">
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                <span className="category-badge">{post.category || '未分类'}</span>
                {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
              </div>
              {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
            </article>
          ))}
        </div>
      )}
      {node.children.length > 0 && (
        <div className="section-children">
          {node.children.map((child) => (
            <ContentSection key={child.pathKey} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

