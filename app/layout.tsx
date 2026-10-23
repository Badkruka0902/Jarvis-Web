import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentSpace · 登录",
  description: "文字空间 · 智能体工作台登录页",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
