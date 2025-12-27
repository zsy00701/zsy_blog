"use client";

import { useState, useEffect } from "react";
import { SidebarTree } from "./SidebarTree";
import type { Post } from "@/lib/posts";

interface SidebarProps {
  posts: Post[];
  activeSlug?: string;
  children?: React.ReactNode;
}

export function Sidebar({ posts, activeSlug, children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSidebarClick = (e: React.MouseEvent) => {
    // 只在移动端且点击的是链接时关闭侧边栏
    if (isMobile) {
      const target = e.target as HTMLElement;
      // 检查是否点击了链接或链接内的元素
      if (target.tagName === 'A' || target.closest('a')) {
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {isMobile && (
        <button
          className="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "收剑" : "拔剑"}
          style={{
            background: 'var(--ink)',
            color: 'var(--sword-cyan)',
            border: '1px solid var(--sword-cyan)',
            boxShadow: '0 0 10px var(--sword-pale)'
          }}
        >
          {isOpen ? "×" : "剑"}
        </button>
      )}

      {isMobile && (
        <div
          className={`mobile-overlay ${isOpen ? "show" : ""}`}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`sidebar ${isOpen ? "open" : ""}`} 
        onClick={handleSidebarClick}
      >
        <div className="sidebar-header">
          <div className="sidebar-title">藏经阁</div>
          <div className="sidebar-subtitle">SWORD SCROLLS</div>
        </div>
        <SidebarTree posts={posts} activeSlug={activeSlug} />
        {children}
      </aside>
    </>
  );
}
