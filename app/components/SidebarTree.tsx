"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/posts";

export type TreeNode = {
  name: string;
  posts: Post[];
  children: TreeNode[];
};

// 分类图标映射 - 诗剑行风格
const categoryIcons: Record<string, string> = {
  "多模态大模型": "🎨",
  "大语言模型": "📜",
  "machine_learning": "🧠",
  "计算机系统原理": "💾",
  "LLMAPP": "🛠️",
  "科研第一步": "🔍",
  "roadmap": "🗺️",
  "Network": "🌐",
  "环境配置": "⚙️",
  "未分类": "📦",
};

function getCategoryIcon(name: string): string {
  return categoryIcons[name] || "📂";
}

function TreeBranch({
  node,
  depth = 0,
  activeSlug,
}: {
  node: TreeNode;
  depth?: number;
  activeSlug?: string;
}) {
  // 检查是否有活跃的子项
  const hasActiveChild = useMemo(() => {
    const checkActive = (n: TreeNode): boolean => {
      if (n.posts.some((p) => p.slug === activeSlug)) return true;
      return n.children.some(checkActive);
    };
    return checkActive(node);
  }, [node, activeSlug]);

  const [expanded, setExpanded] = useState(hasActiveChild || depth === 0);
  const hasChildren = node.children.length > 0 || node.posts.length > 0;
  
  // 计算总文章数
  const totalCount = useMemo(() => {
    const countAll = (n: TreeNode): number => 
      n.posts.length + n.children.reduce((s, ch) => s + countAll(ch), 0);
    return node.posts.length + node.children.reduce((sum, c) => sum + countAll(c), 0);
  }, [node]);

  return (
    <div className="tree-node">
      <div
        className={`tree-branch-header ${hasActiveChild ? "has-active" : ""} ${expanded ? "expanded" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) setExpanded((v) => !v);
        }}
        role="button"
        tabIndex={0}
      >
        <span className={`folder-toggle ${expanded ? "expanded" : ""}`}>
          {hasChildren ? "▶" : "•"}
        </span>
        <span className="folder-icon">{getCategoryIcon(node.name)}</span>
        <span className="folder-name">{node.name}</span>
        <span className="count-badge">{totalCount}</span>
      </div>

      <div 
        className="tree-children"
        style={{ 
          maxHeight: expanded ? '2000px' : '0',
          opacity: expanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {node.children.map((child) => (
          <TreeBranch
            key={`${node.name}-${child.name}-${depth}`}
            node={child}
            depth={depth + 1}
            activeSlug={activeSlug}
          />
        ))}
        {node.posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className={`nav-item ${post.slug === activeSlug ? "active" : ""}`}
          >
            <span className="post-icon">⚔️</span>
            <span className="nav-item-title">{post.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function sortTree(node: TreeNode): TreeNode {
  return {
    ...node,
    posts: [...node.posts].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    children: [...node.children]
      .map(sortTree)
      .sort((a, b) => a.name.localeCompare(b.name, "zh")),
  };
}

export function SidebarTree({
  posts,
  activeSlug,
}: {
  posts: Post[];
  activeSlug?: string;
}) {
  const tree = useMemo(() => {
    const root: TreeNode = { name: "root", posts: [], children: [] };

    const ensureChild = (parent: TreeNode, name: string) => {
      let child = parent.children.find((c) => c.name === name);
      if (!child) {
        child = { name, posts: [], children: [] };
        parent.children.push(child);
      }
      return child;
    };

    posts.forEach((post) => {
      const segments = post.pathSegments.length
        ? post.pathSegments
        : ["未分类"];
      let current = root;
      segments.forEach((seg) => {
        current = ensureChild(current, seg);
      });
      current.posts.push(post);
    });

    return sortTree(root);
  }, [posts]);

  return (
    <nav className="sidebar-nav">
      <div className="nav-section">
        {tree.children.map((child) => (
          <TreeBranch
            key={child.name}
            node={child}
            depth={0}
            activeSlug={activeSlug}
          />
        ))}
      </div>
    </nav>
  );
}
