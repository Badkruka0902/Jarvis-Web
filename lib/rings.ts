export type RingTone = "ink" | "mid" | "faint";

export interface RingConfig {
  /** 环上文案，循环铺满圆周；"/"开头的命令名会加粗强调 */
  text: string;
  /** 环半径 px */
  r: number;
  /** 偏航角 deg，绕竖直轴（决定环朝向） */
  yaw: number;
  /** 俯仰角 deg，绕水平轴（决定椭圆张开程度） */
  tilt: number;
  /** 自转周期 s */
  dur: number;
  tone: RingTone;
  /** 自转方向反转 */
  reverse?: boolean;
}

/** 圆周上每个字符占用的弧长 px（含间隙），字符数 n = 2πr / CHAR_SPACING */
export const CHAR_SPACING = 25;

export const RINGS: RingConfig[] = [
  { text: "/深度推理 · /一键构建 · /多智能体协作 · ", r: 480, yaw: 0,   tilt: 66, dur: 52, tone: "ink" },
  { text: "/实时检索 · /代码执行 · /记忆中枢 · ",     r: 480, yaw: 60,  tilt: 66, dur: 52, tone: "mid", reverse: true },
  { text: "/自动编排 · /工作流引擎 · /插件广场 · ",   r: 480, yaw: 120, tilt: 66, dur: 52, tone: "mid" },
  { text: "/语音输入 VOICE · /视觉理解 VISION · /文档问答 DOCS · ", r: 660, yaw: 25, tilt: 74, dur: 88, tone: "faint", reverse: true },
  { text: "/知识库 · /任务队列 · ",                   r: 300, yaw: 150, tilt: 58, dur: 36, tone: "mid" },
  { text: "/安全沙箱 · /私有部署 · /开放接口 API · ", r: 580, yaw: 40,  tilt: 80, dur: 74, tone: "faint", reverse: true },
  { text: "/AGENT ORBIT · /AGENT SPACE · ",           r: 220, yaw: 210, tilt: 32, dur: 28, tone: "faint" },
  { text: "/数据分析 · /报告生成 · ",                 r: 400, yaw: 200, tilt: 70, dur: 44, tone: "mid", reverse: true },
  { text: "/定时任务 · /消息通知 · ",                 r: 550, yaw: 310, tilt: 62, dur: 66, tone: "faint", reverse: true },
  { text: "/网页浏览 · /文件解析 · ",                 r: 260, yaw: 90,  tilt: 45, dur: 32, tone: "faint" },
  { text: "/团队空间 · /权限管理 · ",                 r: 620, yaw: 150, tilt: 85, dur: 95, tone: "faint", reverse: true },
  { text: "/模型切换 · /上下文加工 · ",               r: 340, yaw: 275, tilt: 78, dur: 40, tone: "mid", reverse: true },
];

/**
 * 计算一条环上每个字符的内容与角度。
 * 字符以 rotateY(angle) translateZ(r) 沿圆周切向排列，
 * 整条环再由外层元素做 rotateY(yaw) rotateX(tilt) 定向、自身绕法轴自转。
 */
export function ringCharAngles(cfg: RingConfig): { ch: string; angle: number }[] {
  const n = Math.round((2 * Math.PI * cfg.r) / CHAR_SPACING);
  let full = "";
  while (full.length < n) full += cfg.text;
  return [...full].slice(0, n).map((ch, i) => ({ ch, angle: (i * 360) / n }));
}
