"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Feather, Sparkles, Save, Loader2 } from "lucide-react";
import { saveScratch } from "@/lib/supabase/actions";

export default function ZenPage() {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    await saveScratch(`[zen] ${text.trim()}`);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    setText("");
    setSaved(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 min-h-screen flex flex-col">
      <div className="flex items-center gap-2 mb-12">
        <Feather className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground tracking-widest uppercase">
          zen
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="그냥 써."
          className="flex-1 min-h-[400px] text-base leading-relaxed border-none shadow-none resize-none focus-visible:ring-0 placeholder:text-muted-foreground/30 font-serif"
          autoFocus
        />
      </div>

      <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/30">
        <span className="text-[10px] text-muted-foreground">
          {text.length > 0 ? `${text.length}자` : "빈 칸"}
        </span>
        <div className="flex gap-2">
          {text.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs">
              비우기
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!text.trim() || saving}
            className="gap-1.5"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <Save className="w-3.5 h-3.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {saved ? "저장됨" : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
}
