import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '我的个人博客',
  description: '记录学习笔记和思考',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

