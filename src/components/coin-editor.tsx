"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_META } from "@/lib/constants";
import { CoinCategory, TimeCoin } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTimeCoins } from "@/hooks/use-time-coins";

const categories = Object.keys(CATEGORY_META) as Exclude<
  CoinCategory,
  "empty"
>[];

export function CoinEditor({
  coin,
  open,
  onOpenChange,
  onSave,
}: {
  coin: TimeCoin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (coin: TimeCoin) => void;
}) {
  const { settings } = useTimeCoins();
  const [category, setCategory] = useState<CoinCategory>("empty");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (coin) {
      setCategory(coin.category);
      setNote(coin.note ?? "");
      setTags(coin.tags ?? []);
    }
  }, [coin]);

  if (!coin) return null;

  const save = () => {
    onSave({
      ...coin,
      category,
      note: note.trim() || undefined,
      tags: tags.length ? tags : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetTitle className="pr-10 text-xl font-bold">
          {coin.startTime} - {coin.endTime}
        </SheetTitle>
        <SheetDescription className="mt-1 text-sm text-stone-500">
          这半小时流向了哪里？
        </SheetDescription>

        <div className="mt-5 space-y-2.5">
          {categories.map((item) => {
            const meta = CATEGORY_META[item];
            const selected = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left transition active:scale-[0.99]",
                  selected
                    ? "border-stone-500 shadow-sm"
                    : "border-stone-100",
                )}
              >
                <span
                  className="h-10 w-10 shrink-0 rounded-full shadow-coin"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">{meta.label}</strong>
                  <span className="block truncate text-xs text-stone-500">
                    {meta.description}
                  </span>
                </span>
                {selected && <Check className="h-5 w-5 text-stone-700" />}
              </button>
            );
          })}
        </div>

        {settings.noteTags.length > 0 && (
          <div className="mt-5">
            <span className="mb-2 block text-sm font-semibold">快捷标签</span>
            <div className="flex flex-wrap gap-2">
              {settings.noteTags.map((tag) => {
                const selected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setTags((current) =>
                        current.includes(tag)
                          ? current.filter((item) => item !== tag)
                          : [...current, tag],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      selected
                        ? "border-stone-700 bg-foreground text-white"
                        : "border-stone-200 bg-white text-stone-600",
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold">
            一句话备注 <span className="font-normal text-stone-400">可选</span>
          </span>
          <Textarea
            value={note}
            maxLength={120}
            rows={3}
            placeholder="比如：散步时听完了一期播客"
            onChange={(event) => setNote(event.target.value)}
          />
        </label>

        <div className="mt-5 grid grid-cols-[1fr_2fr] gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setCategory("empty");
              setNote("");
              setTags([]);
            }}
          >
            清空
          </Button>
          <Button onClick={save}>保存这枚金币</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
