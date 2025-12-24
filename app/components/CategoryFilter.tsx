"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Post } from "@/lib/posts";

interface CategoryFilterProps {
  posts: Post[];
}

// 分类颜色映射
const categoryColors: Record<string, string> = {
  "多模态大模型": "#e74c3c",
  "大语言模型": "#9b59b6",
  "machine_learning": "#3498db",
  "计算机系统原理": "#1abc9c",
  "LLMAPP": "#f39c12",
  "科研第一步": "#2ecc71",
  "roadmap": "#e67e22",
  "Network": "#00bcd4",
  "环境配置": "#607d8b",
};

export function CategoryFilter({ posts }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 获取所有分类及其文章数量
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach((post) => {
      const cat = post.category || "未分类";
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1]);
  }, [posts]);

  // 过滤后的文章
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((p) => (p.category || "未分类") === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <div className="category-filter-section">
      {/* 分类标签 */}
      <div className="category-tags">
        <button
          className={`category-tag ${!selectedCategory ? "active" : ""}`}
          onClick={() => setSelectedCategory(null)}
        >
          全部
          <span className="category-tag-count">{posts.length}</span>
        </button>
        {categories.map(([cat, count]) => (
          <button
            key={cat}
            className={`category-tag ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            style={{
              "--category-color": categoryColors[cat] || "var(--primary)",
            } as React.CSSProperties}
          >
            {cat}
            <span className="category-tag-count">{count}</span>
          </button>
        ))}
      </div>

      {/* 过滤后的文章列表 */}
      <div className="post-list">
        {filteredPosts.map((post, index) => (
          <article 
            key={post.slug} 
            className="post-item"
            style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
          >
            <div className="post-item-header">
              <span 
                className="post-item-category"
                style={{
                  backgroundColor: categoryColors[post.category || "未分类"] || "var(--primary)",
                }}
              >
                {post.category || "未分类"}
              </span>
              <span className="post-item-date">
                {format(new Date(post.date), "MM月dd日", { locale: zhCN })}
              </span>
            </div>
            <h2 className="post-item-title">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt && (
              <p className="post-excerpt">{post.excerpt}</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="post-item-tags">
                {post.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="tag-badge">#{tag}</span>
                ))}
              </div>
            )}
            <Link href={`/posts/${post.slug}`} className="post-item-read-more">
              阅读全文 →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

