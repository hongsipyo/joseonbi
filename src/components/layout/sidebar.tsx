"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  BookText,
  Feather,
  Menu,
  X,
  Pen,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/episodes", label: "회차 (80부)", icon: BookText },
  { href: "/characters", label: "인물", icon: Users },
  { href: "/zen", label: "Zen", icon: Feather },
];

const ENCOURAGEMENTS = [
  "오늘 500자면 충분해",
  "80부 완성이 목표다",
  "일단 써. 고치는 건 나중에",
  "조선비가 기다리고 있어",
  "5000자는 생각보다 짧아",
  "한 화만 끝내자",
  "쓰는 사람이 작가야",
];

function getDailyEncouragement() {
  const today = new Date();
  const idx = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % ENCOURAGEMENTS.length;
  return ENCOURAGEMENTS[idx];
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-xl bg-white/80 backdrop-blur border border-border shadow-sm"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen w-56 bg-white/70 backdrop-blur-xl border-r border-border/50 flex flex-col transition-transform duration-200",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-border/50">
          <Link href="/home" className="block">
            <span className="font-serif text-xl font-bold tracking-tight text-primary">
              가뭄해갈사 조선비
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Pen className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground tracking-wide">
                작가 홍시표
              </span>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="absolute top-5 right-4 md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent/60"
                )}
              >
                <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary/5 to-accent/30 border border-primary/10">
            <p className="text-[11px] text-primary/80 italic leading-relaxed">
              {getDailyEncouragement()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
