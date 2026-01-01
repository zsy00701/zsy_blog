"use client";

import { useEffect, useState, useRef, useMemo } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface GroupedTocItem extends TocItem {
  children: TocItem[];
}

export function RightToc({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [readProgress, setReadProgress] = useState(0);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const indicatorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 将目录按层级分组 (h2 作为父级，h3 作为子级)
  const groupedToc = useMemo(() => {
    const groups: GroupedTocItem[] = [];
    let currentGroup: GroupedTocItem | null = null;

    toc.forEach((item) => {
      if (item.level <= 2) {
        currentGroup = { ...item, children: [] };
        groups.push(currentGroup);
      } else if (currentGroup) {
        currentGroup.children.push(item);
      } else {
        // 如果没有父级，创建一个虚拟的
        groups.push({ ...item, children: [] });
      }
    });

    return groups;
  }, [toc]);

  // 监听滚动以高亮当前标题
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

  // 计算阅读进度
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setReadProgress(progress);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

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

  // 滚动到激活项
  useEffect(() => {
    if (!activeId || !containerRef.current) return;
    
    const activeItem = containerRef.current.querySelector(`[data-id="${activeId}"]`) as HTMLElement;
    if (activeItem) {
      const container = containerRef.current;
      const itemTop = activeItem.offsetTop;
      const itemHeight = activeItem.offsetHeight;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      // 如果激活项不在可视区域内，滚动到它
      if (itemTop < scrollTop || itemTop + itemHeight > scrollTop + containerHeight) {
        container.scrollTo({
          top: itemTop - containerHeight / 2 + itemHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

  const toggleGroup = (id: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 100;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
    }
  };

  if (toc.length === 0) return null;

  // 计算当前阅读的条目索引
  const currentIndex = toc.findIndex((item) => item.id === activeId);
  const progressText = currentIndex >= 0 ? `${currentIndex + 1}/${toc.length}` : `0/${toc.length}`;

  return (
    <aside className="right-toc">
      {/* 头部带进度 */}
      <div className="right-toc-header">
        <div className="right-toc-header-left">
          <span className="sword-icon">⚔️</span>
          <span className="right-toc-title">剑诀目录</span>
        </div>
        <div className="right-toc-progress">
          <span className="progress-text">{progressText}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${readProgress}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="right-toc-container" ref={containerRef}>
        {/* 剑意指示器 */}
        <div className="sword-indicator" ref={indicatorRef}>
          <div className="sword-light"></div>
        </div>

        <ul className="right-toc-list" ref={listRef}>
          {groupedToc.map((group) => (
            <li key={group.id} className="right-toc-group">
              {/* 父级标题 */}
              <div
                data-id={group.id}
                className={`right-toc-item right-toc-level-${group.level}`}
              >
                <div className="right-toc-item-wrapper">
                  {group.children.length > 0 && (
                    <button
                      className={`toc-toggle ${collapsedGroups.has(group.id) ? "" : "expanded"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroup(group.id);
                      }}
                      aria-label={collapsedGroups.has(group.id) ? "展开" : "折叠"}
                    >
                      <span className="toggle-icon">▶</span>
                    </button>
                  )}
                  <a
                    href={`#${group.id}`}
                    className={`right-toc-link ${activeId === group.id ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHeading(group.id);
                    }}
                  >
                    <span className="toc-marker"></span>
                    <span className="toc-text">{group.text}</span>
                  </a>
                </div>
              </div>

              {/* 子级标题 */}
              {group.children.length > 0 && (
                <ul 
                  className={`right-toc-children ${collapsedGroups.has(group.id) ? "collapsed" : ""}`}
                >
                  {group.children.map((child) => (
                    <li
                      key={child.id}
                      data-id={child.id}
                      className={`right-toc-item right-toc-level-${child.level}`}
                    >
                      <a
                        href={`#${child.id}`}
                        className={`right-toc-link ${activeId === child.id ? "active" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToHeading(child.id);
                        }}
                      >
                        <span className="toc-marker"></span>
                        <span className="toc-text">{child.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 快捷操作 */}
      <div className="right-toc-footer">
        <button 
          className="toc-action-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="回到顶部"
        >
          ↑ 顶
        </button>
        <button 
          className="toc-action-btn"
          onClick={() => {
            if (collapsedGroups.size === groupedToc.length) {
              setCollapsedGroups(new Set());
            } else {
              setCollapsedGroups(new Set(groupedToc.map((g) => g.id)));
            }
          }}
          title={collapsedGroups.size === groupedToc.length ? "展开全部" : "折叠全部"}
        >
          {collapsedGroups.size === groupedToc.length ? "▼ 展" : "▲ 收"}
        </button>
      </div>
    </aside>
  );
}
