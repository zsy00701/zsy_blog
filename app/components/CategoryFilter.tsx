"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Post } from "@/lib/posts";

interface CategoryFilterProps {
  posts: Post[];
}

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

  const handleCategoryClick = (cat: string | null) => {
    setSelectedCategory(cat);
    // 平滑滚动到文章列表顶部
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="category-filter">
      {/* 分类标签 */}
      <div className="category-tabs">
        <button
          className={`category-tab ${!selectedCategory ? "active" : ""}`}
          onClick={() => handleCategoryClick(null)}
        >
          全部 <span className="category-tab-count">{posts.length}</span>
        </button>
        {categories.map(([cat, count]) => (
          <button
            key={cat}
            className={`category-tab ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat} <span className="category-tab-count">{count}</span>
          </button>
        ))}
      </div>

      {/* 显示当前过滤状态 */}
      {selectedCategory && (
        <div className="filter-status">
          正在显示「{selectedCategory}」分类的 {filteredPosts.length} 篇文章
        </div>
      )}

      {/* 过滤后的文章列表 */}
      <div className="post-list">
        {filteredPosts.length === 0 ? (
          <div className="empty-state" style={{ marginTop: '2rem' }}>
            <div className="empty-icon">剑</div>
            <p className="empty-title">此分类暂无文章</p>
            <p className="empty-desc">请选择其他分类查看</p>
          </div>
        ) : (
          filteredPosts.map((post, index) => {
            const wordCount = post.content?.length || 0;
            const readingTime = Math.max(1, Math.ceil(wordCount / 300));
            
            return (
              <article 
                key={post.slug} 
                className="post-item"
                style={{
                  animation: 'fadeInUp 0.5s ease-out',
                  animationDelay: `${Math.min(index * 0.05, 0.3)}s`,
                  animationFillMode: 'backwards'
                }}
              >
                <div className="post-meta">
                  <span className="category-badge">
                    {post.category || "未分类"}
                  </span>
                  <span className="post-date-badge">
                    {format(new Date(post.date), "yyyy-MM-dd", { locale: zhCN })}
                  </span>
                  <span className="post-reading-badge">
                    {readingTime} 分钟
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
                    阅读全文 →
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
