"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import type { Post } from "@/lib/posts";

export type TreeNode = {
  name: string;
  posts: Post[];
  children: TreeNode[];
  pathKey?: string;
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
  expanded,
  onToggle,
}: {
  node: TreeNode;
  depth?: number;
  activeSlug?: string;
  expanded: Set<string>;
  onToggle: (path: string) => void;
}) {
  const hasChildren = node.children.length > 0 || node.posts.length > 0;
  const paddingLeft = depth * 16;
  const pathKey = node.pathKey || node.name;
  const isExpanded = expanded.has(pathKey);

  const totalPosts =
    node.posts.length +
    node.children.reduce(
      (sum, c) => sum + c.posts.length + c.children.length,
      0
    );

  return (
    <div className="tree-node" style={{ paddingLeft }}>
      <div
        className="nav-section-title tree-branch-header"
        onClick={() => hasChildren && onToggle(pathKey)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            hasChildren && onToggle(pathKey);
          }
        }}
      >
        {hasChildren && <ExpandIcon expanded={isExpanded} />}
        <span className="folder-icon">📁</span>
        <span className="folder-name">{node.name}</span>
        <span className="count-badge">{totalPosts}</span>
      </div>

      {isExpanded && (
        <div className="tree-children">
          {node.posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className={`nav-item ${post.slug === activeSlug ? "active" : ""}`}
              style={{ paddingLeft: paddingLeft + 16 }}
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
              expanded={expanded}
              onToggle={onToggle}
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
    const root: TreeNode & { pathKey?: string } = {
      name: "root",
      posts: [],
      children: [],
      pathKey: "root",
    };

    const ensureChild = (parent: TreeNode & { pathKey?: string }, name: string) => {
      let child = parent.children.find((c) => c.name === name) as
        | (TreeNode & { pathKey?: string })
        | undefined;
      if (!child) {
        child = {
          name,
          posts: [],
          children: [],
          pathKey: `${parent.pathKey || parent.name}/${name}`,
        };
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

  // 展开状态：记忆在 localStorage
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root"]));

  useEffect(() => {
    const saved =
      typeof window !== "undefined" &&
      window.localStorage.getItem("sidebarExpanded");
    if (saved) {
      setExpanded(new Set(JSON.parse(saved)));
    } else if (activeSlug) {
      // 默认展开当前文章路径
      const activePost = posts.find((p) => p.slug === activeSlug);
      const segs = activePost?.pathSegments ?? [];
      const initial = new Set<string>(["root"]);
      let path = "root";
      segs.forEach((s) => {
        path = `${path}/${s}`;
        initial.add(path);
      });
      setExpanded(initial);
    }
  }, [activeSlug, posts]);

  const persist = (next: Set<string>) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "sidebarExpanded",
        JSON.stringify(Array.from(next))
      );
    }
  };

  const toggle = (pathKey: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(pathKey)) next.delete(pathKey);
      else next.add(pathKey);
      persist(next);
      return next;
    });
  };

  const expandAll = () => {
    const collect = (node: TreeNode, acc: Set<string>, prefix = "root") => {
      node.children.forEach((child) => {
        const pathKey = `${prefix}/${child.name}`;
        acc.add(pathKey);
        collect(child, acc, pathKey);
      });
    };
    const all = new Set<string>(["root"]);
    collect(tree, all);
    setExpanded(all);
    persist(all);
  };

  const collapseAll = () => {
    const rootOnly = new Set<string>(["root"]);
    setExpanded(rootOnly);
    persist(rootOnly);
  };

  return (
    <nav className="sidebar-nav">
      <div className="tree-controls">
        <button className="tree-btn" onClick={expandAll} type="button">
          全部展开
        </button>
        <button className="tree-btn" onClick={collapseAll} type="button">
          全部收起
        </button>
      </div>
      <div className="nav-section">
        {tree.children.map((child) => (
          <TreeBranch
            key={child.name}
            node={child}
            depth={0}
            activeSlug={activeSlug}
            expanded={expanded}
            onToggle={toggle}
          />
        ))}
      </div>
    </nav>
  );
}

