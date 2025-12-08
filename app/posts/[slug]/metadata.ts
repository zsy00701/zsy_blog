import { getPostBySlug, getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-blog.com';
  const url = `${siteUrl}/posts/${post.slug}`;

  return {
    title: `${post.title} | 我的博客`,
    description: post.excerpt || post.content.slice(0, 160).replace(/\n/g, ' '),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160).replace(/\n/g, ' '),
      type: 'article',
      publishedTime: post.date,
      authors: ['我的博客'],
      tags: post.tags || [],
      url,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160).replace(/\n/g, ' '),
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

