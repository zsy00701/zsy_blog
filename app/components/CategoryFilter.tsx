"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Post } from "@/lib/posts";

interface CategoryFilterProps {
  posts: Post[];
}

interface CategoryNode {
  name: string;
  fullPath: string;
  count: number;
  children: CategoryNode[];
}

// 分类图标映射
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
  "cs144": "🔗",
  "位置编码": "📍",
  "未分类": "📦",
};

function getCategoryIcon(name: string): string {
  return categoryIcons[name] || "📂";
}

export function CategoryFilter({ posts }: CategoryFilterProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // 构建分类树
  const categoryTree = useMemo(() => {
    const root: CategoryNode = { name: "全部", fullPath: "", count: posts.length, children: [] };
    
    posts.forEach((post) => {
      const segments = post.pathSegments.length > 0 ? post.pathSegments : ["未分类"];
      let current = root;
      
      segments.forEach((seg, idx) => {
        const fullPath = segments.slice(0, idx + 1).join("/");
        let child = current.children.find((c) => c.name === seg);
        if (!child) {
          child = { name: seg, fullPath, count: 0, children: [] };
          current.children.push(child);
        }
        child.count++;
        current = child;
      });
    });

    // 按数量排序
    const sortNode = (node: CategoryNode): CategoryNode => ({
      ...node,
      children: node.children
        .map(sortNode)
        .sort((a, b) => b.count - a.count),
    });

    return sortNode(root);
  }, [posts]);

  // 获取当前层级的分类选项
  const currentCategories = useMemo(() => {
    if (selectedPath.length === 0) {
      return categoryTree.children;
    }
    
    let current = categoryTree;
    for (const seg of selectedPath) {
      const child = current.children.find((c) => c.name === seg);
      if (!child) return [];
      current = child;
    }
    return current.children;
  }, [categoryTree, selectedPath]);

  // 过滤后的文章
  const filteredPosts = useMemo(() => {
    if (selectedPath.length === 0) return posts;
    
    return posts.filter((post) => {
      const segments = post.pathSegments.length > 0 ? post.pathSegments : ["未分类"];
      // 检查文章路径是否以选中路径开头
      return selectedPath.every((seg, idx) => segments[idx] === seg);
    });
  }, [posts, selectedPath]);

  const handleCategoryClick = (category: CategoryNode) => {
    if (category.fullPath === "") {
      // 点击"全部"
      setSelectedPath([]);
    } else {
      const newPath = category.fullPath.split("/");
      setSelectedPath(newPath);
    }
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index < 0) {
      setSelectedPath([]);
    } else {
      setSelectedPath(selectedPath.slice(0, index + 1));
    }
  };

  const toggleExpand = (path: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="category-filter">
      {/* 面包屑导航 */}
      {selectedPath.length > 0 && (
        <div className="category-breadcrumb">
          <button
            className="breadcrumb-item breadcrumb-root"
            onClick={() => handleBreadcrumbClick(-1)}
          >
            <span className="breadcrumb-icon">🏠</span>
            <span>全部</span>
          </button>
          {selectedPath.map((seg, idx) => (
            <span key={seg} className="breadcrumb-segment">
              <span className="breadcrumb-separator">›</span>
              <button
                className={`breadcrumb-item ${idx === selectedPath.length - 1 ? "active" : ""}`}
                onClick={() => handleBreadcrumbClick(idx)}
              >
                <span className="breadcrumb-icon">{getCategoryIcon(seg)}</span>
                <span>{seg}</span>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 分类卡片网格 */}
      <div className="category-grid">
        {/* 全部按钮（只在非根级别显示） */}
        {selectedPath.length > 0 && (
          <button
            className="category-card category-card-back"
            onClick={() => handleBreadcrumbClick(selectedPath.length - 2)}
          >
            <span className="category-card-icon">←</span>
            <span className="category-card-name">返回上级</span>
          </button>
        )}
        
        {/* 当前层级的分类 */}
        {(selectedPath.length === 0 ? categoryTree.children : currentCategories).map((cat) => (
          <button
            key={cat.fullPath}
            className={`category-card ${cat.children.length > 0 ? "has-children" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            <span className="category-card-icon">{getCategoryIcon(cat.name)}</span>
            <span className="category-card-name">{cat.name}</span>
            <span className="category-card-count">{cat.count}</span>
            {cat.children.length > 0 && (
              <span className="category-card-arrow">›</span>
            )}
          </button>
        ))}
      </div>

      {/* 显示当前过滤状态 */}
      {selectedPath.length > 0 && (
        <div className="filter-status">
          <span className="filter-status-icon">⚔️</span>
          <span>
            「{selectedPath.join(" / ")}」流派共 {filteredPosts.length} 篇秘籍
          </span>
          {currentCategories.length > 0 && (
            <span className="filter-status-hint">
              （含 {currentCategories.length} 个子分类）
            </span>
          )}
        </div>
      )}

      {/* 过滤后的文章列表 */}
      <div className="post-list">
        {filteredPosts.length === 0 ? (
          <div className="empty-state" style={{ marginTop: "2rem" }}>
            <div className="empty-icon">剑</div>
            <p className="empty-title">此分类暂无文章</p>
            <p className="empty-desc">请选择其他分类查看</p>
          </div>
        ) : (
          filteredPosts.map((post, index) => {
            const wordCount = post.content?.length || 0;
            const readingTime = Math.max(1, Math.ceil(wordCount / 300));
            // 显示完整的路径
            const pathDisplay = post.pathSegments.length > 0 
              ? post.pathSegments.join(" / ") 
              : "未分类";

            return (
              <article
                key={post.slug}
                className="post-item"
                style={{
                  animation: "fadeInUp 0.5s ease-out",
                  animationDelay: `${Math.min(index * 0.05, 0.3)}s`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="post-meta">
                  <span className="category-badge" title={pathDisplay}>
                    {getCategoryIcon(post.pathSegments[0] || "未分类")} {post.category || "未分类"}
                  </span>
                  {post.pathSegments.length > 1 && (
                    <span className="category-path-badge">
                      {post.pathSegments.slice(1).join(" › ")}
                    </span>
                  )}
                  <span className="post-date-badge">
                    {format(new Date(post.date), "yyyy-MM-dd", { locale: zhCN })}
                  </span>
                  <span className="post-reading-badge">{readingTime} 分钟</span>
                </div>

                <h2>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h2>

                {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}

                <div className="post-footer">
                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags-inline">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-badge">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="tag-more">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                  <Link href={`/posts/${post.slug}`} className="read-more">
                    阅读全文
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
