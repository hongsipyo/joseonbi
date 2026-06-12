"use client";

import { Users, Pen, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CHARACTERS } from "@/lib/data";
import { saveCharacterField, getCharacterOverrides } from "@/lib/supabase/actions";
import { useState, useEffect } from "react";

interface CharState {
  name: string;
  description: string;
}

export default function CharactersPage() {
  const [chars, setChars] = useState<CharState[]>(
    CHARACTERS.map((c) => ({ name: c.name, description: c.description }))
  );
  const [editing, setEditing] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  // Load overrides from Supabase
  useEffect(() => {
    async function load() {
      const overrides = await getCharacterOverrides();
      if (Object.keys(overrides).length > 0) {
        setChars((prev) =>
          prev.map((c) => {
            const ov = overrides[c.name];
            if (ov) {
              return {
                name: (ov as Record<string, string>).name || c.name,
                description: (ov as Record<string, string>).description || c.description,
              };
            }
            return c;
          })
        );
      }
    }
    load();
  }, []);

  const startEdit = (idx: number) => {
    setEditing(idx);
    setEditName(chars[idx].name);
    setEditDesc(chars[idx].description);
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const saveEdit = async (idx: number) => {
    setSaving(true);
    const original = CHARACTERS[idx];
    const oldName = original?.name || chars[idx].name;

    if (editName.trim() && editName !== oldName) {
      await saveCharacterField(oldName, "name", editName.trim());
    }
    if (editDesc.trim() !== chars[idx].description) {
      await saveCharacterField(editName.trim() || oldName, "description", editDesc.trim());
    }

    setChars((prev) =>
      prev.map((c, i) =>
        i === idx ? { name: editName.trim() || c.name, description: editDesc.trim() } : c
      )
    );
    setEditing(null);
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8 animate-float-up">
        <div className="flex items-center gap-2 text-accent">
          <Users className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Characters</span>
        </div>
        <h1 className="mt-1 font-serif text-4xl font-bold text-gold">인물</h1>
        <p className="mt-1 text-sm text-muted-foreground">조선비의 세계를 살아가는 사람들</p>
      </div>

      <div className="space-y-4">
        {chars.map((char, idx) => (
          <Card key={idx}>
            <CardContent className="p-5">
              {editing === idx ? (
                <div className="space-y-3">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="font-serif text-lg font-bold w-full border-b border-primary/30 bg-transparent outline-none pb-1"
                    placeholder="이름"
                    autoFocus
                  />
                  <Textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="text-sm min-h-[60px]"
                    placeholder="설명"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(idx)} disabled={saving} className="gap-1">
                      <Check className="w-3 h-3" />
                      {saving ? "저장 중..." : "저장"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit} className="gap-1">
                      <X className="w-3 h-3" />
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="cursor-pointer group flex items-start gap-4"
                  onClick={() => startEdit(idx)}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/15 bg-gradient-to-br from-[hsl(30_14%_16%)] to-[hsl(4_30%_10%)] font-serif text-xl font-bold text-gold">
                    {char.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-lg font-bold text-foreground">{char.name}</h2>
                      <Pen className="w-3 h-3 text-accent/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{char.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
