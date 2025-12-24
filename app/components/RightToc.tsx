"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function RightToc({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

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

    // 观察所有标题元素
    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <aside className="right-toc">
      <div className="right-toc-title">目录</div>
      <ul className="right-toc-list">
        {toc.map((item) => (
          <li
            key={item.id}
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
    </aside>
  );
}

