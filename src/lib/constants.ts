import { CoinCategory, Settings } from "@/lib/types";

export const DEFAULT_SETTINGS: Settings = {
  wakeTime: "06:30",
  sleepTime: "23:30",
  coinDuration: 30,
};

export const CATEGORY_META: Record<
  Exclude<CoinCategory, "empty">,
  { label: string; shortLabel: string; description: string; color: string }
> = {
  play: {
    label: "Guilt Free Play",
    shortLabel: "Play",
    description: "没有罪恶感地玩，真正放松、尽兴玩耍",
    color: "#7DB7E8",
  },
  rest: {
    label: "Rest",
    shortLabel: "Rest",
    description: "休息、恢复、睡眠、散步、放空",
    color: "#8FD6A4",
  },
  mandatory: {
    label: "Mandatory Work",
    shortLabel: "Mandatory",
    description: "不得不做的事情，例如通勤、家务、行政事务、被迫工作",
    color: "#F6A96B",
  },
  quality: {
    label: "Quality Work",
    shortLabel: "Quality",
    description: "高质量工作，喜欢、有意义、有产出的事情",
    color: "#F4D35E",
  },
  procrastination: {
    label: "Procrastination",
    shortLabel: "Delay",
    description: "拖延、刷手机、无意识消耗、记不清做了什么",
    color: "#F28482",
  },
};

export const STORAGE_KEYS = {
  records: "time-coins:records",
  settings: "time-coins:settings",
  roles: "time-coins:roles",
  goals: "time-coins:goals",
  mission: "time-coins:mission",
} as const;
