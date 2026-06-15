"use client";

import { useEffect, useState } from "react";
import { Check, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useTimeCoins } from "@/hooks/use-time-coins";
import { CATEGORY_META } from "@/lib/constants";
import { CoinCategory, TimeCoin } from "@/lib/types";
import { cn } from "@/lib/utils";

const categories = Object.keys(CATEGORY_META) as Exclude<
  CoinCategory,
  "empty"
>[];

export function BatchCoinEditor({
  coins,
  open,
  onOpenChange,
  onSave,
}: {
  coins: TimeCoin[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: Pick<TimeCoin, "category" | "note" | "tags">) => void;
}) {
  const { settings } = useTimeCoins();
  const [category, setCategory] = useState<CoinCategory | null>(null);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setCategory(null);
      setNote("");
      setTags([]);
    }
  }, [open]);

  const first = coins[0];
  const last = coins[coins.length - 1];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetTitle className="flex items-center gap-2 pr-10 text-xl font-bold">
          <Layers3 className="h-5 w-5 text-amber-600" />
          批量填写 {coins.length} 枚金币
        </SheetTitle>
        <SheetDescription className="mt-1 text-sm text-stone-500">
          {first && last
            ? `${first.startTime} - ${last.endTime}，统一覆盖分类、标签和备注`
            : "统一填写所选时间段"}
        </SheetDescription>

        <div className="mt-5 grid grid-cols-5 gap-2">
          {categories.map((item) => {
            const meta = CATEGORY_META[item];
            const selected = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "relative flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border bg-white px-1 py-3 text-center transition",
                  selected
                    ? "border-stone-600 shadow-sm"
                    : "border-stone-100",
                )}
              >
                <span
                  className="h-8 w-8 rounded-full shadow-coin"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="w-full truncate text-[10px] font-semibold">
                  {meta.shortLabel}
                </span>
                {selected && (
                  <span className="absolute right-1 top-1 rounded-full bg-foreground p-0.5 text-white">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
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
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
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
            统一备注 <span className="font-normal text-stone-400">可选</span>
          </span>
          <Textarea
            value={note}
            maxLength={120}
            rows={3}
            placeholder="这些时间段做了什么？"
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
            统一清空
          </Button>
          <Button
            disabled={!category}
            onClick={() => {
              if (!category) return;
              onSave({
                category,
                note: note.trim() || undefined,
                tags: tags.length ? tags : undefined,
              });
              onOpenChange(false);
            }}
          >
            应用到 {coins.length} 个时间段
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
