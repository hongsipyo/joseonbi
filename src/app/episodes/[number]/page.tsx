"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Save, Loader2, Check } from "lucide-react";
import { TARGET_CHARS, TOTAL_EPISODES } from "@/lib/data";
import { getEpisode, saveEpisodeContent, saveEpisodeTitle } from "@/lib/episodes";
import Link from "next/link";

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const number = parseInt(params.number as string);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [titleSaved, setTitleSaved] = useState(false);

  useEffect(() => {
    if (isNaN(number) || number < 1 || number > TOTAL_EPISODES) {
      router.push("/episodes");
      return;
    }
    getEpisode(number).then((ep) => {
      setTitle(ep.title);
      setContent(ep.content);
      setLoading(false);
    });
  }, [number, router]);

  const handleSave = useCallback(async () => {
    if (!content.trim()) return;
    setSaving(true);
    await saveEpisodeContent(number, content.trim());
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [content, number]);

  const handleTitleSave = async () => {
    if (!title.trim()) return;
    await saveEpisodeTitle(number, title.trim());
    setTitleSaved(true);
    setTimeout(() => setTitleSaved(false), 2000);
  };

  const chars = content.length;
  const percent = Math.min(Math.round((chars / TARGET_CHARS) * 100), 100);
  const isDone = chars >= TARGET_CHARS;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/episodes" className="text-xs text-muted-foreground hover:text-foreground">
          ← 목록
        </Link>
        <div className="flex gap-2">
          {number > 1 && (
            <Link href={`/episodes/${number - 1}`}>
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
          )}
          <span className="flex items-center text-sm font-mono font-bold text-primary">
            {number}부
          </span>
          {number < TOTAL_EPISODES && (
            <Link href={`/episodes/${number + 1}`}>
              <Button variant="ghost" size="sm"><ArrowRight className="w-4 h-4" /></Button>
            </Link>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleSave}
          onKeyDown={(e) => { if (e.key === "Enter") handleTitleSave(); }}
          placeholder={`${number}부 제목을 입력...`}
          className="w-full text-xl font-serif font-bold border-none outline-none bg-transparent placeholder:text-muted-foreground/30"
        />
        {titleSaved && <span className="text-[10px] text-primary">제목 저장됨</span>}
      </div>

      {/* Writing area */}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="여기에 써..."
        className="min-h-[500px] text-sm leading-relaxed font-serif border-border/50 resize-none"
        onKeyDown={(e) => {
          if (e.key === "s" && e.metaKey) {
            e.preventDefault();
            handleSave();
          }
        }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isDone ? "bg-green-500" : "bg-primary/60"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className={`text-xs ${isDone ? "text-green-600 font-bold" : "text-muted-foreground"}`}>
            {chars.toLocaleString()} / {TARGET_CHARS.toLocaleString()}자
            {isDone && " (완성!)"}
          </span>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving || !content.trim()} className="gap-1.5">
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saved ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {saved ? "저장됨" : "저장"}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">Cmd+S로 저장</p>
    </div>
  );
}
