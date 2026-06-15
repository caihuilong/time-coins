"use client";

import { addDays, format, isSameDay, parseISO, subDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dateKey } from "@/lib/time";

export function DateNavigator({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const date = parseISO(value);
  const today = new Date();
  const label = isSameDay(date, today)
    ? "今天"
    : isSameDay(date, subDays(today, 1))
      ? "昨天"
      : isSameDay(date, addDays(today, 1))
        ? "明天"
        : format(date, "M月d日", { locale: zhCN });

  return (
    <div className="flex items-center justify-between rounded-3xl bg-white/70 p-2 shadow-sm ring-1 ring-white">
      <Button
        variant="ghost"
        size="icon"
        aria-label="前一天"
        onClick={() => onChange(dateKey(subDays(date, 1)))}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <label className="relative flex min-w-32 cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-2 text-center">
        <CalendarDays className="h-4 w-4 text-stone-500" />
        <span>
          <strong className="block text-sm">{label}</strong>
          <span className="block text-[11px] text-stone-500">
            {format(date, "EEEE", { locale: zhCN })}
          </span>
        </span>
        <input
          type="date"
          value={value}
          onChange={(event) => event.target.value && onChange(event.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="选择日期"
        />
      </label>
      <Button
        variant="ghost"
        size="icon"
        aria-label="后一天"
        onClick={() => onChange(dateKey(addDays(date, 1)))}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
