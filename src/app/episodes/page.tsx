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
      <div className="flex items-center gap-3 mb-8">
        <BookText className="w-5 h-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">회차 목록</h1>
        <span className="text-xs text-muted-foreground ml-auto">
          {TOTAL_EPISODES}부 x {TARGET_CHARS.toLocaleString()}자
        </span>
      </div>

      <div className="space-y-1">
        {Array.from({ length: TOTAL_EPISODES }, (_, i) => i + 1).map((num) => {
          const ep = episodes.find((e) => e.number === num);
          const chars = ep?.content.length || 0;
          const percent = Math.min(Math.round((chars / TARGET_CHARS) * 100), 100);
          const isDone = chars >= TARGET_CHARS;

          return (
            <Link
              key={num}
              href={`/episodes/${num}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors group"
            >
              <span className={`text-xs font-mono w-8 ${isDone ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {String(num).padStart(2, "0")}
              </span>
              <span className="flex-1 text-sm truncate">
                {ep?.title || <span className="text-muted-foreground/50 italic">제목 없음</span>}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isDone ? "bg-primary" : "bg-primary/40"}`}
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
