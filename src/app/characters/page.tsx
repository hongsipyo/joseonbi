"use client";

import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CHARACTERS } from "@/lib/data";

export default function CharactersPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-5 h-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">인물</h1>
      </div>

      <div className="space-y-4">
        {CHARACTERS.map((char) => (
          <Card key={char.id}>
            <CardContent className="p-5">
              <h2 className="font-serif text-lg font-bold">{char.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{char.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
