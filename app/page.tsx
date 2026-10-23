import { LoginCard } from "@/components/login-card";
import { TextSpace } from "@/components/text-space";
import { Dust } from "@/components/dust";

/**
 * 登录页（Server Component）：组合 3D 文字环背景与登录卡。
 * 层级：bg(0) < vignette(10) < header(20) < card(30) < 粒子(40)。
 */
export default function LoginPage() {
  return (
    <div className="bg-stage fixed inset-0 overflow-hidden text-ink">
      <TextSpace />

      <div aria-hidden className="vignette pointer-events-none fixed inset-0 z-10" />

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2.5 text-sm font-bold tracking-[0.14em]">
          <span className="h-2.5 w-2.5 rounded-full bg-ink" />
          AGENTSPACE
          <small className="ml-0.5 text-xs font-medium tracking-normal text-faint">AGENT OS</small>
        </div>
        <nav className="hidden gap-7 text-[13px] text-mute md:flex">
          {["产品", "文档", "定价", "关于"].map((item) => (
            <a key={item} href="#" className="transition hover:text-ink">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <main className="pointer-events-none fixed inset-0 z-30 grid place-items-center">
        <div className="pointer-events-auto">
          <LoginCard />
        </div>
      </main>

      <p
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-6 z-10 text-center text-[11px] tracking-[0.42em] text-ink/40"
      >
        AGENTS · IN · ORBIT
      </p>

      <div className="fixed bottom-5 right-6 z-20 rounded-full border border-ink/15 bg-white/60 px-2.5 py-1 text-[10px] tracking-[0.18em] text-ink/45">
        DEMO · NEXT.JS 参考实现
      </div>

      <Dust />
    </div>
  );
}
