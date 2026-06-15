"use client";

import { useEffect, useState } from "react";
import { Clock, Smartphone, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTimeCoins } from "@/hooks/use-time-coins";
import { Settings } from "@/lib/types";

export function SettingsPage() {
  const { settings, updateSettings } = useTimeCoins();
  const [draft, setDraft] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(settings), [settings]);

  const save = () => {
    updateSettings(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <section className="px-4 pb-28 pt-5">
      <header className="mb-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
          Your Rhythm
        </p>
        <h1 className="text-3xl font-bold tracking-tight">设置</h1>
        <p className="mt-2 text-sm text-stone-500">让金币贴合你的日常节奏。</p>
      </header>

      <Card>
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-quality/40 p-3">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold">一天的边界</h2>
            <p className="text-xs text-stone-500">新日期会使用这里的设置生成</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="mb-2 block text-sm font-semibold">起床时间</span>
            <Input
              type="time"
              value={draft.wakeTime}
              onChange={(event) =>
                setDraft({ ...draft, wakeTime: event.target.value })
              }
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold">睡觉时间</span>
            <Input
              type="time"
              value={draft.sleepTime}
              onChange={(event) =>
                setDraft({ ...draft, sleepTime: event.target.value })
              }
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold">金币时长</span>
          <div className="relative">
            <Input
              type="number"
              min={10}
              max={120}
              step={5}
              value={draft.coinDuration}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  coinDuration: Number(event.target.value) || 30,
                })
              }
              className="pr-16"
            />
            <span className="pointer-events-none absolute right-4 top-3 text-sm text-stone-500">
              分钟
            </span>
          </div>
        </label>
        <Button className="mt-5 w-full" onClick={save}>
          {saved ? "已保存" : "保存设置"}
        </Button>
      </Card>

      <Card className="mt-4">
        <div className="flex gap-3">
          <TimerReset className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-bold">关于已有记录</h3>
            <p className="mt-1 text-sm leading-6 text-stone-500">
              修改设置不会重建或删除已有日期的数据。首次打开一个新日期时，才会按最新设置生成金币。
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <div className="flex gap-3">
          <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-bold">添加到 iPhone 主屏幕</h3>
            <p className="mt-1 text-sm leading-6 text-stone-500">
              在 Safari 中打开，点击分享按钮，再选择“添加到主屏幕”。
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
