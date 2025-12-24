"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/posts";

export type TreeNode = {
  name: string;
  posts: Post[];
  children: TreeNode[];
};

// 分类图标映射
const categoryIcons: Record<string, string> = {
  "多模态大模型": "🤖",
  "大语言模型": "💬",
  "machine_learning": "🧠",
  "计算机系统原理": "💻",
  "LLMAPP": "🚀",
  "科研第一步": "🔬",
  "roadmap": "🗺️",
  "Network": "🌐",
  "环境配置": "⚙️",
  "未分类": "📄",
};

function getCategoryIcon(name: string): string {
  return categoryIcons[name] || "📁";
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
  const totalCount = node.posts.length + node.children.reduce((sum, c) => {
    const countAll = (n: TreeNode): number => 
      n.posts.length + n.children.reduce((s, ch) => s + countAll(ch), 0);
    return sum + countAll(c);
  }, 0);

  return (
    <div className="tree-node">
      <div
        className={`tree-branch-header ${hasActiveChild ? "has-active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) {
            setExpanded((v) => !v);
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (hasChildren) setExpanded((v) => !v);
          }
        }}
      >
        <span className={`folder-toggle ${expanded ? "expanded" : ""}`}>
          {hasChildren ? "▸" : ""}
        </span>
        <span className="folder-icon">{getCategoryIcon(node.name)}</span>
        <span className="folder-name">{node.name}</span>
        <span className="count-badge">{totalCount}</span>
      </div>

      <div className={`tree-children ${expanded ? "expanded" : ""}`}>
        {node.posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className={`nav-item ${post.slug === activeSlug ? "active" : ""}`}
          >
            <span className="nav-item-icon">📝</span>
            <span className="nav-item-title">{post.title}</span>
          </Link>
        ))}
        {node.children.map((child) => (
          <TreeBranch
            key={`${node.name}-${child.name}-${depth}`}
            node={child}
            depth={depth + 1}
            activeSlug={activeSlug}
          />
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
      <div className="sidebar-nav-header">
        <span className="sidebar-nav-title">文档目录</span>
        <span className="sidebar-nav-count">{posts.length} 篇</span>
      </div>
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
