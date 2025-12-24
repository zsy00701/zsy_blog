"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

interface SearchBoxProps {
  posts: Post[];
}

export function SearchBox({ posts }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 搜索结果
  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    return posts
      .filter((post) => {
        const title = post.title.toLowerCase();
        const excerpt = (post.excerpt || "").toLowerCase();
        const category = (post.category || "").toLowerCase();
        const tags = (post.tags || []).join(" ").toLowerCase();
        
        return (
          title.includes(q) ||
          excerpt.includes(q) ||
          category.includes(q) ||
          tags.includes(q)
        );
      })
      .slice(0, 8);
  }, [posts, query]);

  // 快捷键 Cmd/Ctrl + K 打开搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      window.location.href = `/posts/${results[selectedIndex].slug}`;
    }
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 重置选中索引
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <div className="search-container" ref={containerRef}>
      <button
        className="search-trigger"
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        aria-label="搜索"
      >
        <span className="search-icon">🔍</span>
        <span className="search-placeholder">搜索文章...</span>
        <kbd className="search-kbd">⌘K</kbd>
      </button>

      {isOpen && (
        <>
          <div className="search-overlay" onClick={() => setIsOpen(false)} />
          <div className="search-modal">
            <div className="search-input-wrapper">
              <span className="search-input-icon">🔍</span>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="搜索标题、内容、分类或标签..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {query && (
                <button
                  className="search-clear"
                  onClick={() => setQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {query && (
              <div className="search-results">
                {results.length === 0 ? (
                  <div className="search-empty">
                    <span>😕</span>
                    <p>没有找到相关文章</p>
                  </div>
                ) : (
                  <ul className="search-list">
                    {results.map((post, index) => (
                      <li key={post.slug}>
                        <Link
                          href={`/posts/${post.slug}`}
                          className={`search-result-item ${index === selectedIndex ? "selected" : ""}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="search-result-title">{post.title}</div>
                          <div className="search-result-meta">
                            <span className="search-result-category">{post.category}</span>
                            {post.excerpt && (
                              <span className="search-result-excerpt">
                                {post.excerpt.slice(0, 60)}...
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="search-footer">
              <span><kbd>↑↓</kbd> 导航</span>
              <span><kbd>Enter</kbd> 打开</span>
              <span><kbd>Esc</kbd> 关闭</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

