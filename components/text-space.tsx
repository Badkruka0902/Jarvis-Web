"use client";

import { useCallback } from "react";
import { RINGS, ringCharAngles, type RingTone } from "@/lib/rings";
import { useParallax } from "@/lib/use-parallax";

/** 三级灰阶 tone：c=普通字符 m=命令标记("/") d=分隔符与空格 */
const TONE: Record<RingTone, { c: string; m: string; d: string }> = {
  ink: { c: "text-ink-2", m: "text-ink font-bold", d: "text-ink/25" },
  mid: { c: "text-ink/45", m: "text-ink/70 font-bold", d: "text-ink/15" },
  faint: { c: "text-ink/18", m: "text-ink/32 font-bold", d: "text-ink/10" },
};

/**
 * 3D 文字环空间。纯 CSS 3D（无 canvas/WebGL）：
 * 所有字符由服务端渲染，水合前即可呈现完整旋转效果（旋转是纯 CSS 动画），
 * 水合后仅增强鼠标视差。
 */
export function TextSpace() {
  const applyParallax = useCallback((el: HTMLDivElement, mx: number, my: number) => {
    el.style.transform = `rotateX(${(-my * 7).toFixed(2)}deg) rotateY(${(mx * 9).toFixed(2)}deg)`;
  }, []);
  const sceneRef = useParallax<HTMLDivElement>(applyParallax);

  return (
    <div
      aria-hidden
      className="space-in fixed inset-0 z-0 [perspective:1500px]"
    >
      {/* 小屏整体缩放（等效 mockup 的 .zoom） */}
      <div className="absolute inset-0 scale-[0.55] md:scale-[0.8] xl:scale-100 [transform-style:preserve-3d]">
        <div
          ref={sceneRef}
          className="absolute left-1/2 top-1/2 h-0 w-0 will-change-transform [transform-style:preserve-3d]"
        >
          {RINGS.map((cfg, ri) => (
            // 外层：环的静态定向（偏航 + 俯仰）
            <div
              key={ri}
              className="absolute [transform-style:preserve-3d]"
              style={{ transform: `rotateY(${cfg.yaw}deg) rotateX(${cfg.tilt}deg)` }}
            >
              {/* 内层：绕自身法轴自转 */}
              <div
                data-ring
                className="absolute will-change-transform [transform-style:preserve-3d]"
                style={{
                  animation: `orbit-spin ${cfg.dur}s linear infinite${cfg.reverse ? " reverse" : ""}`,
                }}
              >
                {ringCharAngles(cfg).map(({ ch, angle }, ci) => (
                  <span
                    key={ci}
                    className={`ring-char font-mono text-[24px] font-medium ${
                      ch === "·" || ch === " " ? TONE[cfg.tone].d : ch === "/" ? TONE[cfg.tone].m : TONE[cfg.tone].c
                    }`}
                    style={{ transform: `rotateY(${angle.toFixed(2)}deg) translateZ(${cfg.r}px)` }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
