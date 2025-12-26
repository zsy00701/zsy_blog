"use client";

import { useEffect, useState, useRef } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function RightToc({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const indicatorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  // 更新指示器位置
  useEffect(() => {
    if (!activeId || !listRef.current || !indicatorRef.current) return;
    
    const activeItem = listRef.current.querySelector(`[data-id="${activeId}"]`) as HTMLElement;
    if (activeItem) {
      const top = activeItem.offsetTop;
      const height = activeItem.offsetHeight;
      indicatorRef.current.style.transform = `translateY(${top + (height / 2) - 8}px)`;
      indicatorRef.current.style.opacity = "1";
    }
  }, [activeId]);

  if (toc.length === 0) return null;

  return (
    <aside className="right-toc">
      <div className="right-toc-header">
        <span className="sword-icon">⚔️</span>
        <span className="right-toc-title">剑诀目录</span>
      </div>
      
      <div className="right-toc-container">
        {/* 剑意指示器 */}
        <div className="sword-indicator" ref={indicatorRef}>
          <div className="sword-light"></div>
        </div>

        <ul className="right-toc-list" ref={listRef}>
          {toc.map((item) => (
            <li
              key={item.id}
              data-id={item.id}
              className={`right-toc-item right-toc-level-${item.level}`}
            >
              <a
                href={`#${item.id}`}
                className={`right-toc-link ${activeId === item.id ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    const top = element.offsetTop - 100;
                    window.scrollTo({ top, behavior: "smooth" });
                    setActiveId(item.id);
                  }
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
