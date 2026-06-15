"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { CoinEditor } from "@/components/coin-editor";
import { DateNavigator } from "@/components/date-navigator";
import { CATEGORY_META } from "@/lib/constants";
import { TimeCoin } from "@/lib/types";
import { useTimeCoins } from "@/hooks/use-time-coins";
import { cn } from "@/lib/utils";

export function TodayPage({
  date,
  onDateChange,
}: {
  date: string;
  onDateChange: (date: string) => void;
}) {
  const { getRecord, updateCoin } = useTimeCoins();
  const [selectedCoin, setSelectedCoin] = useState<TimeCoin | null>(null);
  const record = getRecord(date);
  const filled = record.coins.filter((coin) => coin.category !== "empty").length;
  const percent = Math.round((filled / Math.max(record.coins.length, 1)) * 100);

  const encouragement = useMemo(() => {
    if (filled === 0) return "从记住一枚金币开始";
    if (filled < record.coins.length / 2) return "不必完美，先把想得起的记下来";
    if (filled < record.coins.length) return "今天的时间轮廓已经出现了";
    return "34 枚金币都回家了";
  }, [filled, record.coins.length]);

  return (
    <section className="flex h-dvh flex-col overflow-hidden px-3 pb-[calc(4.75rem+env(safe-area-inset-bottom))] pt-3">
      <header className="mb-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">
              Time Coins
            </p>
            <h1 className="text-2xl font-bold tracking-tight">今日时间金币</h1>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-quality/70 shadow-coin">
            <Sparkles className="h-4 w-4 text-amber-800" />
          </div>
        </div>
        <p className="mt-0.5 text-xs text-stone-500">{encouragement}</p>
      </header>

      <DateNavigator value={date} onChange={onDateChange} />

      <div className="my-2 rounded-2xl bg-white/70 px-3 py-2 shadow-sm ring-1 ring-white">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold">今日进度</span>
          <span className="text-stone-500">
            {filled} / {record.coins.length} coins
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-stone-200/80">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="grid flex-1 auto-rows-fr grid-cols-5 gap-1.5">
        {record.coins.map((coin) => {
          const meta =
            coin.category === "empty" ? null : CATEGORY_META[coin.category];
          const summary = [...(coin.tags ?? []), coin.note]
            .filter(Boolean)
            .join(" · ");
          return (
            <button
              key={coin.id}
              type="button"
              onClick={() => setSelectedCoin(coin)}
              className={cn(
                "relative flex min-h-0 min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border border-white/70 px-1 py-1 shadow-coin transition active:scale-95",
                coin.category === "empty" && "bg-empty/80",
              )}
              style={meta ? { backgroundColor: meta.color } : undefined}
              aria-label={`${coin.startTime} ${meta?.label ?? "未记录"}`}
            >
              <span className="text-[11px] font-bold leading-none tabular-nums">
                {coin.startTime}
              </span>
              <span className="mt-1 line-clamp-2 w-full break-all text-center text-[9px] font-medium leading-[11px] text-stone-700/80">
                {summary || meta?.shortLabel || "未记录"}
              </span>
            </button>
          );
        })}
      </div>

      <CoinEditor
        coin={selectedCoin}
        open={Boolean(selectedCoin)}
        onOpenChange={(open) => !open && setSelectedCoin(null)}
        onSave={(coin) => updateCoin(date, coin)}
      />
    </section>
  );
}
