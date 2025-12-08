'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/posts';

export function SearchBar({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return posts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.excerpt?.toLowerCase().includes(lowerQuery) ||
          post.content.toLowerCase().includes(lowerQuery) ||
          post.category?.toLowerCase().includes(lowerQuery) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 10);
  }, [query, posts]);

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      {isOpen && query && filteredPosts.length > 0 && (
        <div className="search-results">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="search-result-item"
            >
              <div className="search-result-title">{post.title}</div>
              {post.excerpt && (
                <div className="search-result-excerpt">{post.excerpt}</div>
              )}
              <div className="search-result-meta">
                <span className="category-badge">{post.category || '未分类'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      {isOpen && query && filteredPosts.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">未找到相关文章</div>
        </div>
      )}
    </div>
  );
}

