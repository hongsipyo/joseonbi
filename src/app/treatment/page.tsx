"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { saveScratch, getScratchItems } from "@/lib/supabase/actions";

const TOTAL_EPISODES = 80;
const MARKER_OVERALL = "[트리트먼트:전체]";
const MARKER_EP = (n: number) => `[트리트먼트:${n}회]`;

export default function TreatmentPage() {
  const [overall, setOverall] = useState("");
  const [episodes, setEpisodes] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedEp, setExpandedEp] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const items = await getScratchItems();
      for (const item of items as { content: string }[]) {
        if (item.content.startsWith(MARKER_OVERALL)) {
          if (!overall) setOverall(item.content.slice(MARKER_OVERALL.length + 1));
        }
        for (let i = 1; i <= TOTAL_EPISODES; i++) {
          const m = MARKER_EP(i);
          if (item.content.startsWith(m)) {
            setEpisodes((prev) => prev[i] ? prev : { ...prev, [i]: item.content.slice(m.length + 1) });
          }
        }
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveOverall() {
    if (!overall.trim()) return;
    setSaving("overall");
    try { await saveScratch(`${MARKER_OVERALL} ${overall}`); } catch { /* ignore */ }
    setSaving(null);
  }

  async function saveEpisode(n: number) {
    const text = episodes[n];
    if (!text?.trim()) return;
    setSaving(`ep-${n}`);
    try { await saveScratch(`${MARKER_EP(n)} ${text}`); } catch { /* ignore */ }
    setSaving(null);
  }

  if (!loaded) return <div className="max-w-2xl mx-auto px-6 py-10 text-gray-400">로딩 중...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-5 h-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">트리트먼트</h1>
      </div>

      {/* 전체 트리트먼트 */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">전체 트리트먼트</CardTitle>
          <Button size="sm" onClick={saveOverall} disabled={saving === "overall"} className="gap-1.5">
            <Save className="w-3.5 h-3.5" />
            {saving === "overall" ? "저장 중..." : "저장"}
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea
            value={overall}
            onChange={(e) => setOverall(e.target.value)}
            placeholder="조선비 전체 트리트먼트: 80부작 전체 흐름, 주요 아크, 갈등 구조..."
            className="min-h-[250px] text-sm"
          />
        </CardContent>
      </Card>

      {/* 간단 회차별 트리트먼트 */}
      <h2 className="font-serif text-lg font-bold mb-4">회차별 트리트먼트 <span className="text-sm font-normal text-muted-foreground">(80회)</span></h2>
      <div className="space-y-1">
        {Array.from({ length: TOTAL_EPISODES }, (_, i) => i + 1).map((n) => {
          const isExpanded = expandedEp === n;
          const hasContent = !!episodes[n]?.trim();

          return (
            <div key={n} className={`rounded-lg border ${hasContent ? "border-green-200 bg-green-50/30" : "border-gray-100"}`}>
              <button
                className="w-full flex items-center justify-between px-3 py-2 text-sm"
                onClick={() => setExpandedEp(isExpanded ? null : n)}
              >
                <span className={hasContent ? "text-green-600 font-medium" : "text-gray-500"}>
                  {n}회 {hasContent && "✓"}
                </span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  <Textarea
                    value={episodes[n] ?? ""}
                    onChange={(e) => setEpisodes((prev) => ({ ...prev, [n]: e.target.value }))}
                    placeholder={`${n}회 한 줄 트리트먼트...`}
                    className="min-h-[60px] text-sm"
                  />
                  <Button size="sm" variant="outline" onClick={() => saveEpisode(n)} disabled={saving === `ep-${n}`}>
                    {saving === `ep-${n}` ? "저장 중..." : "저장"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
