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
      setIsMobile(window.innerWidth <= 900);
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

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

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

      <aside className={`sidebar ${isOpen ? "open" : ""}`} onClick={handleLinkClick}>
        <div className="sidebar-header">
          <div className="sidebar-title">目录</div>
          <div className="sidebar-subtitle">CONTENTS</div>
        </div>
        <SidebarTree posts={posts} activeSlug={activeSlug} />
        {children}
      </aside>
    </>
  );
}
