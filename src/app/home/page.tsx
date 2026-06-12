"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookText,
  Pen,
  Feather,
  Layers,
  ScrollText,
  Flame,
  Trophy,
  ArrowRight,
  Heart,
} from "lucide-react";
import { TOTAL_EPISODES, TARGET_CHARS } from "@/lib/data";
import { getEpisodes } from "@/lib/episodes";

const ENCOURAGEMENTS = [
  "오늘 500자면 충분해",
  "80부 완성이 목표다",
  "일단 써. 고치는 건 나중에",
  "조선비가 기다리고 있어",
  "5000자는 생각보다 짧아",
  "한 화만 끝내자",
  "쓰는 사람이 작가야",
];

/** 진행도 = 보상. 금박으로 빛나는 원형 진행 링 */
function ProgressRing({ value }: { value: number }) {
  const r = 78;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-48 w-48">
      <svg className="h-48 w-48 -rotate-90" viewBox="0 0 180 180">
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(38 72% 52%)" />
            <stop offset="55%" stopColor="hsl(46 84% 66%)" />
            <stop offset="100%" stopColor="hsl(40 70% 56%)" />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r={r} fill="none" stroke="hsl(36 14% 18%)" strokeWidth="10" />
        <circle
          cx="90" cy="90" r={r} fill="none" stroke="url(#gold)" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)", filter: "drop-shadow(0 0 8px hsl(42 70% 55% / .55))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-5xl font-bold text-gold leading-none">{value}%</span>
        <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">완성</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [episodes, setEpisodes] = useState<{ number: number; title: string; content: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    getEpisodes().then(setEpisodes);
  }, []);

  const totalWritten = episodes.reduce((sum, ep) => sum + ep.content.length, 0);
  const totalTarget = TOTAL_EPISODES * TARGET_CHARS;
  const completedEps = episodes.filter((ep) => ep.content.length >= TARGET_CHARS).length;
  const startedEps = episodes.filter((ep) => ep.content.length > 0 || ep.title).length;
  const percent = Math.round((totalWritten / totalTarget) * 100);

  const today = new Date();
  const dayIdx = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % ENCOURAGEMENTS.length;
  const encouragement = ENCOURAGEMENTS[dayIdx];

  const stats = [
    { icon: Layers, label: "완성된 화", value: `${completedEps}/${TOTAL_EPISODES}` },
    { icon: Pen, label: "착수한 화", value: `${startedEps}` },
    { icon: ScrollText, label: "누적 글자", value: totalWritten.toLocaleString() },
    { icon: BookText, label: "남은 화", value: `${TOTAL_EPISODES - completedEps}` },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16 space-y-14">
      {/* ── HERO: 사극 포스터 표지 + 진행도 보상 링 ── */}
      <section className="grid items-center gap-10 md:grid-cols-[auto_1fr] animate-float-up">
        {/* 시네마틱 사극 표지 */}
        <div className="relative mx-auto">
          <div className="relative h-64 w-48 overflow-hidden rounded-2xl border border-accent/15 glow-gold">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(30_14%_14%)] via-[hsl(30_14%_9%)] to-[hsl(4_30%_8%)]" />
            <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-r from-accent via-primary to-accent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="font-serif text-5xl font-bold tracking-tight text-gold leading-tight text-center">조선비</span>
              <span className="text-[8px] uppercase tracking-[0.35em] text-accent/60">a saga · web novel</span>
              <span className="mt-6 text-[10px] tracking-[0.25em] text-muted-foreground">홍시표</span>
            </div>
          </div>
          <div className="absolute -inset-6 -z-10 rounded-full bg-accent/15 blur-3xl" />
        </div>

        {/* 진행도 = 보상 */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
          <ProgressRing value={mounted ? percent : 0} />
          <div className="text-center md:text-left">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              가뭄해갈사<br /><span className="text-gold">조선비 80부작</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">웹소설 · 5000자/화</p>
            {mounted && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-secondary/40 px-3.5 py-1.5">
                <Flame className="h-3.5 w-3.5 text-accent animate-flicker" />
                <span className="text-xs text-foreground/80">{encouragement}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 스탯 (먹빛 글래스 + 글로우) ── */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="glass rounded-2xl p-4 animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
            <s.icon className="h-5 w-5 text-accent" />
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── 누적 글자 진행바 ── */}
      <section className="glass rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-[0.18em] text-accent/80">전체 진행</span>
          <span className="text-muted-foreground">{totalWritten.toLocaleString()}자 / {totalTarget.toLocaleString()}자</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full progress-shine" style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
      </section>

      {/* ── 80부작 진행 그리드 ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent/80">80부작 진행</h2>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-accent" /> {startedEps}화 착수 — 잘 하고 있어
          </span>
        </div>
        <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 md:[grid-template-columns:repeat(16,minmax(0,1fr))]">
          {Array.from({ length: TOTAL_EPISODES }, (_, i) => i + 1).map((num) => {
            const ep = episodes.find((e) => e.number === num);
            const chars = ep?.content.length || 0;
            const epPercent = Math.min(Math.round((chars / TARGET_CHARS) * 100), 100);
            const isDone = chars >= TARGET_CHARS;
            const started = chars > 0 || !!ep?.title;
            return (
              <Link
                key={num}
                href={`/episodes/${num}`}
                title={`${num}부 ${ep?.title || ""} · ${epPercent}%`}
                className={`group relative aspect-square overflow-hidden rounded-md border text-[9px] flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? "border-accent/40 bg-accent/15 text-accent glow-gold"
                    : started
                    ? "border-accent/20 bg-secondary/50 text-foreground/70"
                    : "border-dashed border-border/50 bg-card/30 text-muted-foreground/40"
                }`}
              >
                <span className="font-mono font-bold">{num}</span>
                {started && !isDone && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-secondary">
                    <div className="h-full progress-shine" style={{ width: `${epPercent}%` }} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 모멘텀: 빠른 진입 ── */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { href: "/episodes", icon: BookText, t: "회차 목록", d: "80부를 한눈에 보고 이어 쓰기" },
          { href: "/zen", icon: Feather, t: "Zen 모드", d: "방해 없이 그냥 쓰기" },
          { href: "/community", icon: Heart, t: "독자 응원", d: "응원이 기다리고 있어" },
        ].map((x, i) => (
          <Link key={x.href} href={x.href} className="animate-float-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="glass h-full rounded-2xl p-5 space-y-2 transition-all duration-300 hover:-translate-y-1 hover:glow-gold">
              <x.icon className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">{x.t}</h3>
              <p className="text-xs text-muted-foreground">{x.d}</p>
              <span className="inline-flex items-center gap-1 text-[11px] text-accent/80">
                바로가기 <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <footer className="space-y-1 pb-8 pt-4 text-center">
        <p className="text-xs text-muted-foreground">작가 홍시표의 작업 공간</p>
        <p className="text-[11px] text-accent/60">매일 한 화씩, 묵직하게</p>
      </footer>
    </div>
  );
}
