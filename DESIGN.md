# 《文字空间》登录页 · 设计文档与适配指南

| | |
|---|---|
| 版本 | V0.3（视觉定稿）· 文档 V1.0 |
| 日期 | 2026-10-22 |
| 参考实现 | 本目录（Next.js App Router + React 19 + TypeScript + Tailwind CSS v4） |
| 视觉定稿稿 | `../index.html`（纯 HTML/CSS/JS 单文件 mockup，与本实现像素级同源） |
| 目标读者 | 负责把本效果适配进已有 Next.js 项目的开发 / AI agent |

---

## 1. 概述

登录页的核心视觉是**动态"文字空间"**：屏幕中悬浮着 12 条不同半径、倾角、转速、方向的 3D 文字环，像陀螺仪一样围绕中央登录卡持续旋转；环上文字是产品标志性功能的**调用 Prompt**（`/深度推理`、`/一键构建` 这样的斜杠命令形式，当前为占位文案）。

整体为**白色纯粹单色**风格：白→浅灰径向底色，墨黑 + 多级灰阶文字环，白色玻璃拟态登录卡，纯黑主按钮。无任何多余色相与装饰（无星星、无光晕层）。

实现路线：**纯 CSS 3D transform**（无 canvas / WebGL / 三方库），零运行时依赖，所有环字符可由服务端渲染，水合后仅增强鼠标视差。

## 2. 视觉规格

### 2.1 画面分层与 z-index

| 层 | 内容 | z-index | 定位 |
|---|---|---|---|
| 底色 | 白→浅灰径向渐变 `.bg-stage` | 0（页面根） | fixed inset-0 |
| 文字环空间 | 12 条 3D 文字环 + 鼠标视差 | 0 | fixed inset-0, perspective 1500px |
| 暗角 | 四角极淡灰色径向渐变 `.vignette` | 10 | fixed inset-0, pointer-events-none |
| 顶栏 | 品牌标识 + 导航（占位） | 20 | fixed top |
| 登录卡 | 玻璃拟态卡片（含表单） | 30 | fixed 全屏 grid 居中 |
| 粒子层 | 60 颗飞向用户的粒子（`components/dust.tsx`） | 40 | fixed inset-0, perspective 700px, pointer-events-none |
| 底部装饰 | `AGENTS · IN · ORBIT` 字距标语 | 10 | fixed bottom |
| 角标 | 版本角标（demo 专用，正式版删除） | 20 | fixed bottom-right |

登录卡使用 `backdrop-blur` + 半透明白底，背后经过的文字环会被实时毛玻璃化。

### 2.2 文字环几何

**构造原理**（每条环两层嵌套 + 一组字符 span）：

1. 字符 span 依次做 `rotateY(θᵢ) translateZ(r)`，θᵢ = i·360°/n，使 n 个字符沿半径 r 的圆周**切向**排列；
2. 内层容器做 CSS 动画 `orbit-spin`（rotateY 0°→360° 无限循环）实现自转，环的旋转轴即其法轴；
3. 外层容器做静态 `rotateY(yaw) rotateX(tilt)` 决定环的空间朝向。

关键属性：字符 span 设 `backface-visibility: hidden` → 转到背面的字符自动隐藏，任意时刻只显示**前半弧**，文字如绕轨道流动，且不会出现镜像反字。

**字符数量公式**：`n = round(2πr / CHAR_SPACING)`，`CHAR_SPACING = 25px`（每个字符占用的弧长，中英混排下的经验值；调大则间隙变大，调小可能重叠）。文案不足时循环补齐。

**开口度与"窄条"问题（重要背景）**：
环在屏幕上的投影是椭圆，其可见张开程度 = `|sin(tilt) · cos(yaw)|`（1 = 正对观众的正圆，0 = 侧对观众的窄条）。
- 本稿（V0.3）为视觉丰富度保留了较大的 yaw/tilt 组合范围，其中个别环（如 yaw 90°/tilt 45° 的 r=260 环）会周期性呈现很窄的条状——**产品方已知晓，此为当前定稿状态**；
- 曾实现过一版约束方案（V0.4，全部环 `|sin(tilt)·cos(yaw)| ≥ 0.63`，yaw 限制在 ±45°），后应用户要求回退。
- **适配时的可调开关**：若线上版希望避免窄条，对 `lib/rings.ts` 中每条环校验 `|sin(tilt)·cos(yaw)| ≥ 0.6` 即可（等价做法：yaw ∈ [-45°, 45°] 且 tilt ∈ [55°, 88°]）。环自转是绕法轴的，开口度不随时间变化，一次校验永久有效。

**环配置总表**（`lib/rings.ts`，可直接改此表调整整个空间）：

| # | 文案（占位 Prompt） | r | yaw | tilt | dur(s) | tone | 反向 |
|---|---|---|---|---|---|---|---|
| 1 | /深度推理 · /一键构建 · /多智能体协作 · | 480 | 0° | 66° | 52 | ink | |
| 2 | /实时检索 · /代码执行 · /记忆中枢 · | 480 | 60° | 66° | 52 | mid | ✓ |
| 3 | /自动编排 · /工作流引擎 · /插件广场 · | 480 | 120° | 66° | 52 | mid | |
| 4 | /语音输入 VOICE · /视觉理解 VISION · /文档问答 DOCS · | 660 | 25° | 74° | 88 | faint | ✓ |
| 5 | /知识库 · /任务队列 · | 300 | 150° | 58° | 36 | mid | |
| 6 | /安全沙箱 · /私有部署 · /开放接口 API · | 580 | 40° | 80° | 74 | faint | ✓ |
| 7 | /AGENT ORBIT · /AGENT SPACE · | 220 | 210° | 32° | 28 | faint | |
| 8 | /数据分析 · /报告生成 · | 400 | 200° | 70° | 44 | mid | ✓ |
| 9 | /定时任务 · /消息通知 · | 550 | 310° | 62° | 66 | faint | ✓ |
| 10 | /网页浏览 · /文件解析 · | 260 | 90° | 45° | 32 | faint | |
| 11 | /团队空间 · /权限管理 · | 620 | 150° | 85° | 95 | faint | ✓ |
| 12 | /模型切换 · /上下文加工 · | 340 | 275° | 78° | 40 | mid | ✓ |

字号统一 24px / medium；"/"命令标记加粗（bold）。

### 2.3 色彩系统

**设计 token**（Tailwind v4 `@theme`，定义于 `app/globals.css`，自动生成 `text-ink`、`bg-mist`、`border-line` 等工具类）：

| Token | 值 | 用途 |
|---|---|---|
| `--color-ink` | `#0a0a0a` | 主墨黑：按钮、主环"/"标记、标题、品牌 |
| `--color-ink-2` | `#1f2937` | ink 环普通字符 |
| `--color-ink-3` | `#262a31` | 按钮 hover |
| `--color-mute` | `#6b7280` | 次级文字（副标题、导航、脚注） |
| `--color-faint` | `#9ca3af` | 最弱文字（占位符、图标描边、角标小字） |
| `--color-line` | `#e3e6ea` | 输入框/描边 |
| `--color-mist` | `#f3f4f6` | 底色渐变终点、oauth hover 底 |

半透明灰阶直接用 Tailwind 透明度修饰符（基于 `color-mix`）：`text-ink/45`、`border-ink/10` 等。

**环的 tone 三级体系**（近→远、主→次）：

| tone | 普通字符 c | "/" 标记 m | 分隔符/空格 d |
|---|---|---|---|
| `ink` | `text-ink-2` | `text-ink` + bold | `text-ink/25` |
| `mid` | `text-ink/45` | `text-ink/70` + bold | `text-ink/15` |
| `faint` | `text-ink/18` | `text-ink/32` + bold | `text-ink/10` |

每个字符 span 附带极淡白色光晕 `text-shadow: 0 0 6px rgb(255 255 255/.9), 0 0 14px rgb(255 255 255/.55)`，作用是环与环交叠处保持清晰（白底上等效"描边"）。

**字体**：环用 `--font-mono`（`"SF Mono", ui-monospace, Menlo, "PingFang SC", monospace`，CJK 回退系统黑体）；界面用 `--font-sans`（系统栈）。正式版建议接 `next/font`（英文等宽推荐 Geist Mono / JetBrains Mono；中文走系统栈即可）。

### 2.4 动效规格

| 动效 | 参数 | 实现 |
|---|---|---|
| 环自转 | 各环独立 dur 28–95s，半数反向，linear 无限 | `[data-ring]` 内联 `animation: orbit-spin Xs linear infinite [reverse]` |
| 空间入场 | opacity 0→1 + scale .86→1，1.8s ease-out | `.space-in` |
| 卡片入场 | 上移 26px + scale .96→1，1.1s 延迟 .15s | `.card-in` |
| 鼠标视差 | 归一化指针位置 → 目标值，插值系数 0.045/帧 | `lib/use-parallax.ts` rAF 直写 style |
| ↳ 空间旋转 | rotateX(-y·7°) rotateY(x·9°) | scene 容器 |
| ↳ 卡片平移 | translate(-x·10px, -y·8px) | 卡片 wrapper |
| ↳ 粒子层平移 | translate(x·26px, y·18px)（与卡片反向，强化景深） | 粒子容器 |
| 粒子飞行 | 60 颗，translateZ -1500px → +320px（越近越大），径向渐变灰点，透明度 0→1→0，周期 7–15s 线性循环，负延迟铺满首屏 | `.dust-fly` keyframes + CSS 变量（--x/--y/--s/--o/--d/--dl） |
| 白色光晕 | 见 §2.3 | `.ring-char` |

**粒子层规格**（`components/dust.tsx`）：参数由**固定种子（mulberry32）的确定性伪随机**生成——位置 ±46vw/±42vh、直径 2.5–6px、强度 0.14–0.44、周期 7–15s、延迟 0–-15s。确定性保证 SSR 输出与客户端一致（无水合警告），60 颗全部在服务端 HTML 中。粒子颜色 `rgb(23 28 38 / o)` 径向渐变（近墨色软点），层级在登录卡**之上**（z-40），制造"从画面里飞出、掠过卡片"的纵深感。

**reduced-motion**：`prefers-reduced-motion: reduce` 时停掉全部入场/自转动画（globals.css media 块 + `[data-ring] { animation: none !important }`），视差 hook 内部检测后直接不启动。环的静态布局仍然完整。

### 2.5 响应式

- 登录卡：固定 400px，`max-w-[90vw]`；
- 文字环空间：**整体缩放**（不重排）：`<768px` 缩放 0.55，`768–1279px` 缩放 0.8，`≥1280px` 原尺寸（`scale-[.55] md:scale-[.8] xl:scale-100`，缩放容器保持 `preserve-3d`）；
- 顶栏导航 `<768px` 隐藏。

## 3. 技术架构

### 3.1 文件结构与职责

```
app/
  layout.tsx        根布局 + metadata（title/description）
  page.tsx          登录页（Server Component）：组合底色/文字环/暗角/顶栏/卡片/标语
  globals.css       Tailwind v4 入口：@theme token、keyframes、@layer components 自定义类、reduced-motion
components/
  text-space.tsx    Client · 3D 文字环空间（渲染全部环 + scene 视差）
  login-card.tsx    Client · 玻璃拟态登录卡（表单状态 + 自身视差；占位提交逻辑）
  dust.tsx          Client · 飞向用户的粒子层（60 颗，确定性随机，SSR 友好）
lib/
  rings.ts          环配置数据 + ringCharAngles() 字符角度计算（纯数据无副作用，Server/Client 共用）
  use-parallax.ts   Client · 指针视差 hook（rAF + 直写 transform，不触发 re-render）
```

### 3.2 Server / Client 划分及理由

| 组件 | 类型 | 理由 |
|---|---|---|
| `app/page.tsx`、`layout.tsx` | Server | 纯组合与静态标记，无状态无浏览器 API |
| `components/text-space.tsx` | **Client** | 需要 `useParallax`（refs + rAF + pointer 事件）。**注意：字符 span 本身是确定性渲染，不需要 JS** |
| `components/login-card.tsx` | **Client** | 表单提交状态机（idle/busy/done） |
| `lib/rings.ts` | 双用 | 纯数据 + 纯函数 |

### 3.3 渲染与水合流程

1. **SSR**：`ringCharAngles()` 是纯函数，约 1350 个字符 span 在服务端确定性生成，首屏 HTML 即包含完整 3D 场景；
2. **首帧**：环自转是纯 CSS 动画，**水合之前就在转**；只有视差缺失；
3. **水合**：React 挂载后 `useParallax` 生效，加入鼠标视差。无任何水合不匹配风险（无随机值、无时间相关渲染）。

### 3.4 性能注记

- 约 1350 个绝对定位 span（实测）+ 60 个粒子元素，但**动画均作用在父容器/粒子自身**（每环一个合成层，共 12 层 + 粒子 60 个小合成层），字符 transform 静态 —— GPU 负担可控；
- 视差循环直写 `style.transform`，全程零 setState、零 React re-render；
- 环容器与 scene 带 `will-change-transform` 提示提升；
- 实测（Chrome 1440×900）：`next build` 首屏 First Load JS 106 kB，页面本体 3.19 kB，预览流畅；若目标环境性能受限，优先减少环数量（删 faint 环）而非降低字号。

## 4. Tailwind CSS v4 集成规范

- 入口：`@import "tailwindcss";` + `postcss.config.mjs` 使用 `@tailwindcss/postcss`（无 tailwind.config.js）；
- 主题 token 全部走 `@theme`（见 §2.3），工具类自动派生；
- 3D 关键属性使用 arbitrary property 保证版本兼容：`[transform-style:preserve-3d]`、`[perspective:1500px]`、`backface-hidden`；v4 也有内置的 `transform-3d` / `perspective-*` 工具类，团队可自行替换；
- **动态动画时长无法用工具类表达**（每环 dur 不同），故 `[data-ring]` 的 animation 用内联 style，配合 globals.css 的 media 块实现 reduced-motion 降级；
- 自定义类统一放 `@layer components`：`.bg-stage`、`.vignette`、`.space-in`、`.card-in`、`.ring-char`（字符的绝对定位 + backface + 白色光晕）；
- tone 的静态 class 映射表写在 `text-space.tsx` 顶部（字面量，保证被 Tailwind 扫描到）。

## 5. 适配到已有项目的操作清单

> 前提：已有项目为 Next.js App Router + React 19 + TS + Tailwind v4。

1. **复制文件**（建议收拢到 `components/text-space/`）：
   - `lib/rings.ts`、`lib/use-parallax.ts`、`components/text-space.tsx`、`components/login-card.tsx`、`components/dust.tsx`
   - 以及 `globals.css` 中的 `dust-fly` keyframes 与 `.dust-layer i` 类
   - 若只想要背景效果：仅前三个文件 + dust，把 `<TextSpace/>`、`<Dust/>` 挂到已有登录页即可；
2. **合并 globals.css**：迁移 `@theme` token（**重命名命名空间**避免与已有变量冲突，如 `--color-ts-ink`；或直接对接项目已有灰阶变量）、三个 `@keyframes`、`@layer components` 五个类、`prefers-reduced-motion` 块；
3. **路由**：将 `app/page.tsx` 内容移到 `app/(auth)/login/page.tsx`；调整内部链接（"申请加入"等）为项目真实路由；
4. **接入登录 API**：`login-card.tsx` `onSubmit` 中的 `TODO`（替换 setTimeout 演示逻辑；成功后 `router.push` 到工作台）；oauth 三按钮接真实 provider；
5. **品牌替换**：`AGENTSPACE` / `AGENT OS` / 标语 / Logo SVG（`login-card.tsx` 与 `page.tsx`）；
6. **环文案替换**：`lib/rings.ts` 的 `RINGS` 表换成真实功能 Prompt（保持 `· ` 分隔 + `/命令` 前缀格式，长度变化会自动重排字符数）；
7. **字体**（可选）：接 `next/font`，更新 `@theme` 的 `--font-mono` / `--font-sans`；
8. **暗色主题**（可选）：所有颜色已是 token，加 `@theme` 的 `.dark` 覆盖或 `dark:` 变体即可反转；
9. **验收测试**：
   - `view-source` 确认 SSR HTML 含环字符；
   - 控制台无水合（hydration）警告；
   - 系统开启"减弱动态效果"后页面静止但布局完整；
   - 375px / 768px / 1440px 三档宽度检查缩放；
   - Performance 面板确认滚动/悬停无明显掉帧。

## 6. 无障碍与降级

- 整个 3D 空间 `aria-hidden`（纯装饰），表单是唯一语义焦点；
- `prefers-reduced-motion` 全动画降级（见 §2.4）；
- 无 JS 环境（或水合前）：环仍在转（纯 CSS），视差不可用 —— 功能无损；
- 装饰层不拦截鼠标（卡片层 `pointer-events` 已正确处理）。

## 7. 占位内容清单（正式版必须替换）

| 位置 | 占位内容 |
|---|---|
| `lib/rings.ts` | 12 条环的 `/功能` Prompt 文案 |
| `login-card.tsx` | 品牌名/标语/Logo、"邮箱/用户名 + 密码"表单字段与登录 API、oauth provider |
| `page.tsx` | 顶栏品牌与导航项、底部标语 |
| `layout.tsx` | metadata title/description |
| `page.tsx` 角标 | `DEMO · NEXT.JS 参考实现`（正式版删除） |

## 8. 备选实现路线对比

| 路线 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| **CSS 3D（当前）** | 零依赖、SSR 友好、实现透明、动画 GPU 合成 | DOM 数量大（~1250 span）、景深表现力有限 | ✅ 采纳 |
| Canvas 2D 自绘 | 无 DOM 负担、绘制自由 | SSR 无内容、需自管 DPR/清晰度/交互、失去 CSS 动画水合前运行的优势 | 备选（性能受限时） |
| WebGL / three.js | 光照、雾化、真实景深最强 | 引入重依赖、包体与维护成本高、SSR 需动态导入 | 不推荐（当前需求过剩） |
