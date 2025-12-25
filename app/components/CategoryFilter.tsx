"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Post } from "@/lib/posts";

interface CategoryFilterProps {
  posts: Post[];
}

// 分类图标和颜色映射
const categoryConfig: Record<string, { icon: string; color: string }> = {
  "多模态大模型": { icon: "🎨", color: "#ec4899" },
  "大语言模型": { icon: "🤖", color: "#8b5cf6" },
  "machine_learning": { icon: "🧠", color: "#3b82f6" },
  "计算机系统原理": { icon: "💻", color: "#10b981" },
  "LLMAPP": { icon: "🔧", color: "#f59e0b" },
  "科研第一步": { icon: "🔬", color: "#06b6d4" },
  "roadmap": { icon: "🗺️", color: "#f97316" },
  "Network": { icon: "🌐", color: "#14b8a6" },
  "环境配置": { icon: "⚙️", color: "#6366f1" },
  "未分类": { icon: "📄", color: "#64748b" },
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
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  // 过滤后的文章
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((p) => (p.category || "未分类") === selectedCategory);
  }, [posts, selectedCategory]);

  const getConfig = (cat: string) => categoryConfig[cat] || categoryConfig["未分类"];

  return (
    <div className="category-filter">
      {/* 分类标签 */}
      <div className="category-tabs">
        <button
          className={`category-tab ${!selectedCategory ? "active" : ""}`}
          onClick={() => setSelectedCategory(null)}
        >
          ✨ 全部
          <span className="category-tab-count">{posts.length}</span>
        </button>
        {categories.map(([cat, count]) => {
          const config = getConfig(cat);
          return (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              style={{
                "--tab-color": config.color,
              } as React.CSSProperties}
            >
              {config.icon} {cat}
              <span className="category-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* 过滤后的文章列表 */}
      <div className="post-list">
        {filteredPosts.map((post, index) => {
          const config = getConfig(post.category || "未分类");
          const wordCount = post.content?.length || 0;
          const readingTime = Math.max(1, Math.ceil(wordCount / 300));
          
          return (
            <article
              key={post.slug}
              className="post-item"
              style={{ 
                animationDelay: `${Math.min(index * 0.05, 0.3)}s`,
                "--card-accent": config.color,
              } as React.CSSProperties}
            >
              <div className="post-meta">
                <span
                  className="category-badge"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.color}20, ${config.color}10)`,
                    borderColor: `${config.color}30`,
                    color: config.color,
                  }}
                >
                  {config.icon} {post.category || "未分类"}
                </span>
                <span className="post-date-badge">
                  📅 {format(new Date(post.date), "yyyy年MM月dd日", { locale: zhCN })}
                </span>
                <span className="post-reading-badge">
                  ⏱️ {readingTime} 分钟
                </span>
              </div>
              
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              
              {post.excerpt && (
                <p className="post-excerpt">{post.excerpt}</p>
              )}
              
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
                  阅读全文 <span>→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
