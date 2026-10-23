"use client";

import { useCallback, type CSSProperties } from "react";
import { useParallax } from "@/lib/use-parallax";

/** mulberry32：固定种子的确定性伪随机，SSR 与客户端渲染结果一致（无水合不匹配） */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Particle {
  x: string;
  y: string;
  s: string;
  o: string;
  d: string;
  dl: string;
}

/** 粒子参数在模块加载时生成一次（60 颗：位置/尺寸/透明度/周期/负延迟） */
const PARTICLES: Particle[] = (() => {
  const rand = mulberry32(20261022);
  return Array.from({ length: 60 }, () => ({
    x: (rand() * 92 - 46).toFixed(1) + "vw",
    y: (rand() * 84 - 42).toFixed(1) + "vh",
    s: (2.5 + rand() * 4.5).toFixed(1) + "px",
    o: (0.16 + rand() * 0.32).toFixed(2),
    d: (4.5 + rand() * 4.5).toFixed(1) + "s",
    dl: (-rand() * 9).toFixed(1) + "s",
  }));
})();

/**
 * 飞向用户的粒子层：从深处（translateZ -1500px）向镜头飞来，越近越大，
 * 越过相机前淡出；带轻微指针视差。纯 CSS 动画，SSR 即渲染。
 */
export function Dust() {
  const applyParallax = useCallback((el: HTMLDivElement, mx: number, my: number) => {
    el.style.transform = `translate(${(mx * 26).toFixed(1)}px, ${(my * 18).toFixed(1)}px)`;
  }, []);
  const ref = useParallax<HTMLDivElement>(applyParallax);

  return (
    <div ref={ref} aria-hidden className="dust-layer pointer-events-none fixed inset-0 z-40 overflow-hidden [perspective:700px]">
      {PARTICLES.map((p, i) => (
        <i
          key={i}
          className="dust"
          style={{ "--x": p.x, "--y": p.y, "--s": p.s, "--o": p.o, "--d": p.d, "--dl": p.dl } as CSSProperties}
        />
      ))}
    </div>
  );
}
