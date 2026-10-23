"use client";

import { useCallback, useState, type FormEvent } from "react";
import { useParallax } from "@/lib/use-parallax";

/**
 * 玻璃拟态登录卡（占位实现）。
 * 接入真实系统时：替换 onSubmit 里的 TODO 为登录 API 调用，
 * 品牌文案/Logo 按设计文档 §7 替换。
 */
export function LoginCard() {
  const [status, setStatus] = useState<"idle" | "busy" | "done">("idle");

  const applyParallax = useCallback((el: HTMLDivElement, mx: number, my: number) => {
    el.style.transform = `translate(${(-mx * 10).toFixed(1)}px, ${(-my * 8).toFixed(1)}px)`;
  }, []);
  const wrapRef = useParallax<HTMLDivElement>(applyParallax);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("busy");
    // TODO: 调用已有登录 API；成功后 router.push 到工作台
    window.setTimeout(() => setStatus("done"), 800);
    window.setTimeout(() => setStatus("idle"), 2000);
  };

  const btnLabel = status === "busy" ? "正在进入空间…" : status === "done" ? "✓ 欢迎回来" : "进入空间 →";

  return (
    <div ref={wrapRef} className="card-in will-change-transform">
      <section className="w-[400px] max-w-[90vw] rounded-3xl border border-ink/10 bg-white/80 px-9 pb-8 pt-10 shadow-[0_30px_80px_rgb(17_24_39/0.10),0_2px_10px_rgb(17_24_39/0.04)] backdrop-blur-[18px] backdrop-saturate-150">
        <div className="mb-6 text-center">
          <svg className="mx-auto mb-3 block h-[46px] w-[46px]" viewBox="0 0 48 48" fill="none" aria-hidden>
            <circle cx="24" cy="24" r="15" stroke="#0a0a0a" strokeWidth="2.5" strokeDasharray="58 14" strokeLinecap="round" opacity=".9" />
            <circle cx="24" cy="24" r="6.5" fill="#0a0a0a" />
            <circle cx="38.5" cy="18" r="2.6" fill="#9ca3af" />
          </svg>
          <h1 className="text-[22px] font-bold tracking-wide">进入你的智能体空间</h1>
          <p className="mt-1.5 text-[13px] tracking-wide text-mute">AGENTSPACE · 让每个想法进入轨道</p>
        </div>

        <form onSubmit={onSubmit}>
          <label className="relative mb-3 block">
            <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-faint" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M3.5 7l8.5 6 8.5-6" />
            </svg>
            <input
              type="email"
              placeholder="邮箱 / 用户名"
              autoComplete="username"
              className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-3.5 text-[14.5px] outline-none transition placeholder:text-faint focus:border-ink focus:[box-shadow:0_0_0_3px_rgb(17_24_39/0.08)]"
            />
          </label>
          <label className="relative mb-3 block">
            <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-faint" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="10" width="16" height="10" rx="3" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            <input
              type="password"
              placeholder="密码"
              autoComplete="current-password"
              className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-3.5 text-[14.5px] outline-none transition placeholder:text-faint focus:border-ink focus:[box-shadow:0_0_0_3px_rgb(17_24_39/0.08)]"
            />
          </label>

          <div className="mb-4 mt-0.5 flex items-center justify-between px-0.5 text-[13px] text-mute">
            <label className="flex cursor-pointer items-center gap-1.5">
              <input type="checkbox" defaultChecked className="accent-ink" />
              记住我
            </label>
            <a href="#" className="font-medium text-ink hover:underline">
              忘记密码?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-[13px] bg-ink py-3.5 text-[15.5px] font-bold tracking-wider text-white shadow-[0_12px_28px_rgb(17_24_39/0.22)] transition hover:bg-ink-3 active:scale-[0.99]"
          >
            {btnLabel}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-faint">
          <span className="h-px flex-1 bg-line" />
          或
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="flex gap-2.5">
          {["GitHub", "微信", "Google"].map((p) => (
            <button
              key={p}
              type="button"
              className="flex-1 rounded-xl border border-line bg-white py-2.5 text-[13px] font-semibold text-ink-3 transition hover:border-ink/20 hover:bg-mist"
            >
              {p}
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-[13px] text-mute">
          还没有账号?{" "}
          <a href="#" className="font-semibold text-ink hover:underline">
            申请加入
          </a>
        </p>
      </section>
    </div>
  );
}
