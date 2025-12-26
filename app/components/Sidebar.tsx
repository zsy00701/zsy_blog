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

  return (
    <>
      {isMobile && (
        <button
          className="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "关闭" : "目录"}
        >
          {isOpen ? "×" : "目"}
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
        onClick={() => isMobile && setIsOpen(false)}
      >
        <div className="sidebar-header">
          <div className="sidebar-title">卷轴</div>
          <div className="sidebar-subtitle">SCROLLS</div>
        </div>
        <SidebarTree posts={posts} activeSlug={activeSlug} />
        {children}
      </aside>
    </>
  );
}
