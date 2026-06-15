"use client";

import { useState } from "react";
import { BottomNav, AppTab } from "@/components/bottom-nav";
import { PlanPage } from "@/components/pages/plan-page";
import { SettingsPage } from "@/components/pages/settings-page";
import { StatsPage } from "@/components/pages/stats-page";
import { TodayPage } from "@/components/pages/today-page";
import { useTimeCoins } from "@/hooks/use-time-coins";
import { dateKey } from "@/lib/time";

export function AppShell() {
  const { hydrated } = useTimeCoins();
  const [activeTab, setActiveTab] = useState<AppTab>("today");
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));

  if (!hydrated) {
    return (
      <main className="mx-auto min-h-dvh max-w-[430px] bg-background px-4 pt-20">
        <div className="animate-pulse space-y-4">
          <div className="h-9 w-52 rounded-xl bg-stone-200" />
          <div className="h-20 rounded-3xl bg-white/70" />
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: 20 }, (_, index) => (
              <div
                key={index}
                className="aspect-square rounded-[1.35rem] bg-stone-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh max-w-[430px] bg-background shadow-[0_0_60px_rgba(82,72,57,0.08)]">
      {activeTab === "today" && (
        <TodayPage date={selectedDate} onDateChange={setSelectedDate} />
      )}
      {activeTab === "stats" && (
        <StatsPage date={selectedDate} onDateChange={setSelectedDate} />
      )}
      {activeTab === "plan" && <PlanPage />}
      {activeTab === "settings" && <SettingsPage />}
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </main>
  );
}
