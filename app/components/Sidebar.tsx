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
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 点击链接后关闭菜单
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 移动端菜单按钮 */}
      {isMobile && (
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={isOpen}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      )}

      {/* 遮罩层 */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 侧边栏 */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`} onClick={handleLinkClick}>
        <div className="sidebar-header">
          <div className="sidebar-title">我的笔记</div>
          <div className="sidebar-subtitle">学习与思考的记录</div>
        </div>
        <SidebarTree posts={posts} activeSlug={activeSlug} />
        {children}
      </aside>
    </>
  );
}

