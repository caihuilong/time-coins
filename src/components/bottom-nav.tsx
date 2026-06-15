"use client";

import { BarChart3, CircleDollarSign, ListChecks, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type AppTab = "today" | "stats" | "plan" | "settings";

const items = [
  { id: "today", label: "Today", icon: CircleDollarSign },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "plan", label: "Plan", icon: ListChecks },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav({
  active,
  onChange,
}: {
  active: AppTab;
  onChange: (tab: AppTab) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-stone-200/80 bg-background/95 px-3 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      <div className="grid grid-cols-4">
        {items.map(({ id, label, icon: Icon }) => {
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-medium transition",
                selected ? "bg-white text-foreground shadow-sm" : "text-stone-400",
              )}
            >
              <Icon
                className={cn("h-5 w-5", selected && "text-amber-500")}
                strokeWidth={selected ? 2.4 : 1.8}
              />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
