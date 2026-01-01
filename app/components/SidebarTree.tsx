"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
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
  "LLM": "🤖",
  "科研第一步": "🔍",
  "roadmap": "🗺️",
  "Network": "🌐",
  "环境配置": "⚙️",
  "人工智能基础": "🎯",
  "ads": "📊",
  "ASM": "🔧",
  "Math": "📐",
  "OOP": "💎",
  "高中数学": "📚",
  "产生的问题与解决": "💡",
  "未分类": "📦",
};

function getCategoryIcon(name: string): string {
  return categoryIcons[name] || "📂";
}

function TreeBranch({
  node,
  depth = 0,
  activeSlug,
  isLast = false,
}: {
  node: TreeNode;
  depth?: number;
  activeSlug?: string;
  isLast?: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  
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

  // 当有活跃子项时自动展开
  useEffect(() => {
    if (hasActiveChild) {
      setExpanded(true);
    }
  }, [hasActiveChild]);

  return (
    <div className={`tree-node ${isLast ? 'tree-node-last' : ''}`}>
      <div
        className={`tree-branch-header ${hasActiveChild ? "has-active" : ""} ${expanded ? "expanded" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) setExpanded((v) => !v);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (hasChildren) setExpanded((v) => !v);
          }
        }}
      >
        <span className={`folder-toggle ${expanded ? "expanded" : ""}`}>
          {hasChildren ? (
            <svg 
              className="toggle-arrow" 
              width="10" 
              height="10" 
              viewBox="0 0 10 10"
              fill="currentColor"
            >
              <path d="M3 2 L7 5 L3 8 Z" />
            </svg>
          ) : (
            <span className="toggle-dot">•</span>
          )}
        </span>
        <span className="folder-icon">{getCategoryIcon(node.name)}</span>
        <span className="folder-name">{node.name}</span>
        <span className="count-badge">
          <span className="count-number">{totalCount}</span>
        </span>
      </div>

      <div 
        ref={contentRef}
        className={`tree-children ${expanded ? 'expanded' : 'collapsed'}`}
      >
        <div className="tree-children-inner">
          {node.children.map((child, index) => (
            <TreeBranch
              key={`${node.name}-${child.name}-${depth}`}
              node={child}
              depth={depth + 1}
              activeSlug={activeSlug}
              isLast={index === node.children.length - 1 && node.posts.length === 0}
            />
          ))}
          {node.posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className={`nav-item ${post.slug === activeSlug ? "active" : ""}`}
            >
              <span className="post-line-indicator" />
              <span className="post-icon">
                {post.slug === activeSlug ? "⚔️" : "📄"}
              </span>
              <span className="nav-item-title">{post.title}</span>
              {post.slug === activeSlug && (
                <span className="active-indicator" />
              )}
            </Link>
          ))}
        </div>
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

  // 计算总文章数
  const totalPosts = posts.length;

  return (
    <nav className="sidebar-nav">
      <div className="nav-section">
        <div className="nav-section-stats">
          <span className="stats-icon">📚</span>
          <span className="stats-text">共 {totalPosts} 篇秘籍</span>
        </div>
        {tree.children.map((child, index) => (
          <TreeBranch
            key={child.name}
            node={child}
            depth={0}
            activeSlug={activeSlug}
            isLast={index === tree.children.length - 1}
          />
        ))}
      </div>
    </nav>
  );
}
