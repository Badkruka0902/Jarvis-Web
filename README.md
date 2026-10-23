# text-space-login-demo

"文字空间"登录页的 Next.js 参考实现（视觉定稿稿见上级目录 `../index.html`）。

技术栈：Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4

## 运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000 即可。

## 结构

```
app/
  layout.tsx        根布局 + metadata
  page.tsx          登录页（Server Component，组合各层）
  globals.css       Tailwind v4 入口 + @theme 设计 token + 3D/动画自定义类
components/
  text-space.tsx    Client · 3D 文字环空间
  login-card.tsx    Client · 玻璃拟态登录卡（占位表单）
lib/
  rings.ts          环配置数据 + 字符角度计算（纯数据，可被 Server/Client 共用）
  use-parallax.ts   Client · 指针视差 hook
```

完整设计规格与适配指南见 [DESIGN.md](./DESIGN.md)。
