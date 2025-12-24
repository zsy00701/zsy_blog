import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

export const metadata: Metadata = {
  title: '我的个人博客 | 学习笔记与技术思考',
  description: '记录学习笔记、技术思考和项目经验，涵盖机器学习、大模型、计算机系统等领域。',
  keywords: ['博客', '技术', '机器学习', '大模型', 'LLM', '学习笔记'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  )
}
