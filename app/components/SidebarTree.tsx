"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/posts";

export type TreeNode = {
  name: string;
  posts: Post[];
  children: TreeNode[];
};

function ExpandIcon({ expanded }: { expanded: boolean }) {
  return (
    <span
      className={`folder-toggle ${expanded ? "expanded" : ""}`}
      aria-hidden
    >
      ▸
    </span>
  );
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
  const [expanded, setExpanded] = useState(true);

  const hasChildren = node.children.length > 0 || node.posts.length > 0;
  const paddingLeft = depth * 12;

  return (
    <div className="tree-node" style={{ paddingLeft }}>
      <div
        className="nav-section-title tree-branch-header"
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
            e.stopPropagation();
            if (hasChildren) {
              setExpanded((v) => !v);
            }
          }
        }}
      >
        {hasChildren && <ExpandIcon expanded={expanded} />}
        <span className="folder-icon">📁</span>
        <span className="folder-name">{node.name}</span>
        <span className="count-badge">
          {node.posts.length +
            node.children.reduce((sum, c) => sum + c.posts.length, 0)}
        </span>
      </div>

      {expanded && (
        <div className="tree-children">
          {node.posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className={`nav-item ${post.slug === activeSlug ? "active" : ""}`}
              style={{ paddingLeft: paddingLeft + 12 }}
            >
              {post.title}
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
      )}
    </div>
  );
}

function sortTree(node: TreeNode): TreeNode {
  return {
    ...node,
    posts: [...node.posts].sort((a, b) =>
      a.title.localeCompare(b.title, "zh")
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

