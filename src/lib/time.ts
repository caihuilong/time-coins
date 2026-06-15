import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { DayRecord, Settings, TimeCoin } from "@/lib/types";

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const toTime = (minutes: number) => {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(
    normalized % 60,
  ).padStart(2, "0")}`;
};

export const dateKey = (date: Date) => format(date, "yyyy-MM-dd");

export function generateCoins(settings: Settings): TimeCoin[] {
  const start = toMinutes(settings.wakeTime);
  const end = toMinutes(settings.sleepTime);
  const count = Math.max(0, Math.floor((end - start) / settings.coinDuration));

  return Array.from({ length: count }, (_, index) => {
    const coinStart = start + index * settings.coinDuration;
    const coinEnd = coinStart + settings.coinDuration;
    return {
      id: `${toTime(coinStart)}-${toTime(coinEnd)}`,
      startTime: toTime(coinStart),
      endTime: toTime(coinEnd),
      category: "empty",
    };
  });
}

export function createDayRecord(date: string, settings: Settings): DayRecord {
  return {
    date,
    wakeTime: settings.wakeTime,
    sleepTime: settings.sleepTime,
    coins: generateCoins(settings),
  };
}

export function getWeekDates(date: string) {
  const start = startOfWeek(parseISO(date), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => dateKey(addDays(start, index)));
}
