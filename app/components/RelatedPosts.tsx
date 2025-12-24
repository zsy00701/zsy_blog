"use client";

import Link from "next/link";
import type { Post } from "@/lib/posts";

interface RelatedPostsProps {
  currentPost: Post;
  allPosts: Post[];
  maxCount?: number;
}

export function RelatedPosts({ currentPost, allPosts, maxCount = 3 }: RelatedPostsProps) {
  // 计算相关度分数
  const getRelevanceScore = (post: Post): number => {
    if (post.slug === currentPost.slug) return -1;
    
    let score = 0;
    
    // 同分类加分
    if (post.category === currentPost.category) {
      score += 10;
    }
    
    // 同标签加分
    const currentTags = new Set(currentPost.tags || []);
    (post.tags || []).forEach((tag) => {
      if (currentTags.has(tag)) {
        score += 5;
      }
    });
    
    // 同目录路径加分
    const currentPath = currentPost.pathSegments.join("/");
    const postPath = post.pathSegments.join("/");
    if (currentPath === postPath) {
      score += 8;
    } else if (postPath.startsWith(currentPath) || currentPath.startsWith(postPath)) {
      score += 4;
    }
    
    return score;
  };

  // 获取相关文章
  const relatedPosts = allPosts
    .map((post) => ({ post, score: getRelevanceScore(post) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount)
    .map(({ post }) => post);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="related-posts">
      <h3 className="related-posts-title">📚 相关文章</h3>
      <div className="related-posts-list">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="related-post-item"
          >
            <span className="related-post-category">{post.category}</span>
            <span className="related-post-title">{post.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

