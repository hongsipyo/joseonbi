"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookText } from "lucide-react";
import { TOTAL_EPISODES, TARGET_CHARS } from "@/lib/data";
import { getEpisodes, Episode } from "@/lib/episodes";

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  useEffect(() => {
    getEpisodes().then(setEpisodes);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8 animate-float-up">
        <div className="flex items-center gap-2 text-accent">
          <BookText className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Episodes</span>
        </div>
        <div className="flex items-end justify-between">
          <h1 className="mt-1 font-serif text-4xl font-bold text-gold">회차 목록</h1>
          <span className="text-xs text-muted-foreground">
            {TOTAL_EPISODES}부 × {TARGET_CHARS.toLocaleString()}자
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {Array.from({ length: TOTAL_EPISODES }, (_, i) => i + 1).map((num) => {
          const ep = episodes.find((e) => e.number === num);
          const chars = ep?.content.length || 0;
          const percent = Math.min(Math.round((chars / TARGET_CHARS) * 100), 100);
          const isDone = chars >= TARGET_CHARS;
          const started = chars > 0 || !!ep?.title;

          return (
            <Link
              key={num}
              href={`/episodes/${num}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                isDone
                  ? "glass border-accent/25 glow-gold"
                  : started
                  ? "border-accent/12 bg-card/40 hover:border-accent/25"
                  : "border-dashed border-border/50 bg-card/20 hover:border-accent/20"
              }`}
            >
              <span className={`text-xs font-mono w-8 ${isDone ? "text-gold font-bold" : started ? "text-accent/70" : "text-muted-foreground"}`}>
                {String(num).padStart(2, "0")}
              </span>
              <span className="flex-1 text-sm truncate text-foreground/85">
                {ep?.title || <span className="text-muted-foreground/40 italic">제목 없음</span>}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${started ? "progress-shine" : ""}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-14 text-right">
                  {chars.toLocaleString()} / {TARGET_CHARS.toLocaleString()}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
