"use client";

import { useEffect, useRef } from "react";

type ApplyFn<T> = (el: T, mx: number, my: number) => void;

/**
 * 指针视差：监听 pointermove，rAF 循环里以 0.045 的插值系数逼近目标值，
 * 直写 ref 元素的 style.transform（不经过 setState，避免每帧 re-render）。
 * prefers-reduced-motion 时不启用。
 */
export function useParallax<T extends HTMLElement>(apply: ApplyFn<T>) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    };
    const loop = () => {
      x += (targetX - x) * 0.045;
      y += (targetY - y) * 0.045;
      apply(el, x, y);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [apply]);

  return ref;
}
