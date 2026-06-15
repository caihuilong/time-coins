"use client";

import { useEffect, useState } from "react";
import { Clock, Plus, Smartphone, Tags, TimerReset, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTimeCoins } from "@/hooks/use-time-coins";
import { Settings } from "@/lib/types";

export function SettingsPage() {
  const { settings, updateSettings } = useTimeCoins();
  const [draft, setDraft] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => setDraft(settings), [settings]);

  const save = () => {
    updateSettings(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (!tag || draft.noteTags.includes(tag)) return;
    setDraft({ ...draft, noteTags: [...draft.noteTags, tag] });
    setNewTag("");
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
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-play/30 p-3">
            <Tags className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold">一句话备注快捷标签</h2>
            <p className="text-xs text-stone-500">记录金币时可以直接点选</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {draft.noteTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-stone-100 py-1.5 pl-3 pr-1.5 text-xs font-medium text-stone-700"
            >
              {tag}
              <button
                type="button"
                aria-label={`删除标签 ${tag}`}
                onClick={() =>
                  setDraft({
                    ...draft,
                    noteTags: draft.noteTags.filter((item) => item !== tag),
                  })
                }
                className="rounded-full p-1 text-stone-400 hover:bg-white hover:text-stone-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={newTag}
            maxLength={12}
            placeholder="新增标签"
            onChange={(event) => setNewTag(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={addTag}
            disabled={!newTag.trim() || draft.noteTags.includes(newTag.trim())}
            aria-label="新增标签"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button className="mt-4 w-full" onClick={save}>
          {saved ? "已保存" : "保存快捷标签"}
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
