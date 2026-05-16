"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookText, Pen } from "lucide-react";
import { TOTAL_EPISODES, TARGET_CHARS } from "@/lib/data";
import { getEpisodes } from "@/lib/episodes";

export default function HomePage() {
  const [episodes, setEpisodes] = useState<{ number: number; title: string; content: string }[]>([]);

  useEffect(() => {
    getEpisodes().then(setEpisodes);
  }, []);

  const totalWritten = episodes.reduce((sum, ep) => sum + ep.content.length, 0);
  const totalTarget = TOTAL_EPISODES * TARGET_CHARS;
  const completedEps = episodes.filter((ep) => ep.content.length >= TARGET_CHARS).length;
  const percent = Math.round((totalWritten / totalTarget) * 100);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-bold mb-2">가뭄해갈사 조선비</h1>
      <p className="text-sm text-muted-foreground mb-10">80부작 웹소설. 5000자/화.</p>

      {/* Progress */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <div className="text-2xl font-bold text-primary">{completedEps}</div>
          <div className="text-[11px] text-muted-foreground mt-1">완성된 화</div>
        </div>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <div className="text-2xl font-bold text-primary">{TOTAL_EPISODES - completedEps}</div>
          <div className="text-[11px] text-muted-foreground mt-1">남은 화</div>
        </div>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <div className="text-2xl font-bold text-primary">{percent}%</div>
          <div className="text-[11px] text-muted-foreground mt-1">전체 진행률</div>
        </div>
      </div>

      {/* Total chars */}
      <div className="mb-10">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{totalWritten.toLocaleString()}자 / {totalTarget.toLocaleString()}자</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>

      {/* Quick links */}
      <div className="space-y-2">
        <Link
          href="/episodes"
          className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
        >
          <BookText className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">회차 목록 →</span>
        </Link>
        <Link
          href="/zen"
          className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
        >
          <Pen className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Zen 모드 →</span>
        </Link>
      </div>
    </div>
  );
}
