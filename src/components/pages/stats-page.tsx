"use client";

import { BarChart3, Clock3, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DateNavigator } from "@/components/date-navigator";
import { CATEGORY_META } from "@/lib/constants";
import { CoinCategory, DayRecord } from "@/lib/types";
import { getWeekDates } from "@/lib/time";
import { useTimeCoins } from "@/hooks/use-time-coins";

const categories = Object.keys(CATEGORY_META) as Exclude<
  CoinCategory,
  "empty"
>[];

function calculate(records: DayRecord[]) {
  const counts = Object.fromEntries(categories.map((item) => [item, 0])) as Record<
    Exclude<CoinCategory, "empty">,
    number
  >;
  let filled = 0;

  records.forEach((record) => {
    record.coins.forEach((coin) => {
      if (coin.category !== "empty") {
        counts[coin.category] += 1;
        filled += 1;
      }
    });
  });

  return { counts, filled };
}

export function StatsPage({
  date,
  onDateChange,
}: {
  date: string;
  onDateChange: (date: string) => void;
}) {
  const { records, getRecord } = useTimeCoins();
  const dayRecord = getRecord(date);
  const daily = calculate([dayRecord]);
  const weekDates = getWeekDates(date);
  const weeklyRecords = weekDates
    .map((item) => records[item])
    .filter((item): item is DayRecord => Boolean(item));
  const weekly = calculate(weeklyRecords);
  const qualityHours = weekly.counts.quality * 0.5;
  const delayHours = weekly.counts.procrastination * 0.5;
  const compareMax = Math.max(qualityHours, delayHours, 1);

  return (
    <section className="px-4 pb-28 pt-5">
      <header className="mb-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
          Reflection
        </p>
        <h1 className="text-3xl font-bold tracking-tight">时间流向</h1>
        <p className="mt-2 text-sm text-stone-500">看见就好，不急着评判。</p>
      </header>

      <DateNavigator value={date} onChange={onDateChange} />

      <Card className="mt-5 overflow-hidden bg-foreground text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-stone-300">当日已记录</p>
            <p className="mt-2 text-4xl font-bold">{daily.filled * 0.5}h</p>
          </div>
          <Clock3 className="h-7 w-7 text-quality" />
        </div>
        <div className="mt-5 flex gap-1">
          {categories.map((item) => (
            <div
              key={item}
              className="h-2 rounded-full"
              style={{
                width: `${daily.filled ? (daily.counts[item] / daily.filled) * 100 : 20}%`,
                backgroundColor: CATEGORY_META[item].color,
                opacity: daily.counts[item] ? 1 : 0.18,
              }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-400">
          {daily.filled} 枚金币，占完整一天的{" "}
          {Math.round((daily.filled / dayRecord.coins.length) * 100)}%
        </p>
      </Card>

      <div className="mt-5 space-y-3">
        {categories.map((item) => {
          const meta = CATEGORY_META[item];
          const count = daily.counts[item];
          const percent = daily.filled
            ? Math.round((count / daily.filled) * 100)
            : 0;
          return (
            <div
              key={item}
              className="rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-white"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-10 w-10 rounded-full shadow-coin"
                  style={{ backgroundColor: meta.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <strong className="block truncate text-sm">
                        {meta.label}
                      </strong>
                      <p className="mt-0.5 text-[11px] leading-4 text-stone-500">
                        {meta.description}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-sm font-bold">
                      {count * 0.5}h · {percent}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-3 mt-8 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-amber-600" />
        <h2 className="text-xl font-bold">本周统计</h2>
      </div>
      <Card>
        <p className="text-sm text-stone-500">
          周一至周日 · 已记录 {weekly.filled * 0.5} 小时
        </p>
        <div className="mt-5 space-y-4">
          {categories.map((item) => (
            <div key={item}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>{CATEGORY_META[item].shortLabel}</span>
                <strong>{weekly.counts[item] * 0.5}h</strong>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${weekly.filled ? (weekly.counts[item] / weekly.filled) * 100 : 0}%`,
                    backgroundColor: CATEGORY_META[item].color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4">
        <div className="mb-5 flex items-center gap-2">
          <Scale className="h-5 w-5 text-stone-600" />
          <h3 className="font-bold">专注与拖延</h3>
        </div>
        <div className="space-y-4">
          <CompareBar
            label="Quality Work"
            value={qualityHours}
            max={compareMax}
            color={CATEGORY_META.quality.color}
          />
          <CompareBar
            label="Procrastination"
            value={delayHours}
            max={compareMax}
            color={CATEGORY_META.procrastination.color}
          />
        </div>
      </Card>
    </section>
  );
}

function CompareBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span>{label}</span>
        <strong>{value}h</strong>
      </div>
      <div className="h-7 overflow-hidden rounded-xl bg-stone-100">
        <div
          className="flex h-full min-w-1 items-center rounded-xl px-2 text-xs font-bold text-stone-700 transition-all"
          style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
