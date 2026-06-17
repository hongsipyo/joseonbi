"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, Feather, Trash2, Loader2 } from "lucide-react";
import { TARGET_CHARS } from "@/lib/data";
import { getEpisodes, Episode } from "@/lib/episodes";
import { getScratchItems, deleteScratch } from "@/lib/supabase/actions";

interface ZenScrap {
  id: string;
  content: string;
  created_at: string;
}

export default function ManuscriptPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [scraps, setScraps] = useState<ZenScrap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEpisodes(), getScratchItems()]).then(([eps, rows]) => {
      setEpisodes(eps.filter((ep) => ep.content.trim() || ep.title.trim()));

      const typed = rows as unknown as {
        id: string;
        content: string;
        created_at: string;
      }[];
      // Zen에서 쓴 [zen] 메모만 — 회차([ep:N])·제목([ep-title:N])은 제외
      const zenRows = typed.filter((r) => r.content.startsWith("[zen]"));
      setScraps(
        zenRows.map((r) => ({
          id: r.id,
          content: r.content.replace(/^\[zen\]\s*/, ""),
          created_at: r.created_at,
        }))
      );
      setLoading(false);
    });
  }, []);

  const removeScrap = async (id: string) => {
    setScraps((prev) => prev.filter((s) => s.id !== id));
    await deleteScratch(id);
  };

  const totalChars = episodes.reduce((sum, ep) => sum + ep.content.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8 animate-float-up">
        <div className="flex items-center gap-2 text-accent">
          <BookText className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Manuscript</span>
        </div>
        <h1 className="mt-1 font-serif text-4xl font-bold text-gold">전체 원고</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          쓴 회차를 순서대로 이어 읽기. Zen에서 쓴 것도 아래에 모임. · 착수 {episodes.length}부 ·{" "}
          {totalChars.toLocaleString()}자
        </p>
      </div>

      {/* ── 회차 본문 이어보기 ── */}
      {episodes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          아직 쓴 회차가 없어. 회차에서 쓰거나, Zen 모드에서 써.
        </div>
      ) : (
        <div className="space-y-12 mb-16">
          {episodes.map((ep) => {
            const isDone = ep.content.length >= TARGET_CHARS;
            return (
              <article key={ep.number} className="animate-float-up">
                <div className="flex items-baseline gap-3 mb-3 pb-2 border-b border-accent/15">
                  <span className="font-mono text-sm font-bold text-gold">{ep.number}부</span>
                  <h2 className="flex-1 font-serif text-lg font-bold text-foreground/90">
                    {ep.title || <span className="text-muted-foreground/40 italic">제목 없음</span>}
                  </h2>
                  <span className={`text-[10px] ${isDone ? "text-accent font-bold" : "text-muted-foreground"}`}>
                    {ep.content.length.toLocaleString()}자{isDone && " · 완성"}
                  </span>
                </div>
                {ep.content.trim() ? (
                  <p className="text-sm leading-loose whitespace-pre-wrap font-serif text-foreground/85">
                    {ep.content}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground/50 italic">제목만 잡힌 회차</p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* ── Zen 스크랩 ── */}
      <div className="border-t border-border/30 pt-8">
        <div className="flex items-center gap-2 mb-4 text-accent/80">
          <Feather className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Zen 스크랩</span>
          <span className="text-[10px] text-muted-foreground">· {scraps.length}개</span>
        </div>
        {scraps.length === 0 ? (
          <p className="text-xs text-muted-foreground/60">
            Zen 모드에서 쓴 글이 여기 모여. 아직 없음.
          </p>
        ) : (
          <div className="space-y-3">
            {scraps.map((s, i) => (
              <Card
                key={s.id}
                style={{ animationDelay: `${i * 45}ms` }}
                className="group glass animate-float-up border-accent/10 transition-all duration-300 hover:border-accent/30"
              >
                <CardContent className="p-5">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif text-foreground/85">
                    {s.content}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeScrap(s.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
