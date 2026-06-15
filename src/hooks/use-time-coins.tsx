"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/lib/constants";
import {
  DayRecord,
  Goal,
  MissionStatement,
  Role,
  Settings,
  TimeCoin,
} from "@/lib/types";
import { createDayRecord, dateKey } from "@/lib/time";

type Records = Record<string, DayRecord>;

type TimeCoinsStore = {
  hydrated: boolean;
  records: Records;
  settings: Settings;
  roles: Role[];
  goals: Goal[];
  mission: MissionStatement;
  getRecord: (date: string) => DayRecord;
  updateCoin: (date: string, coin: TimeCoin) => void;
  updateCoins: (date: string, coinIds: string[], values: Partial<TimeCoin>) => void;
  updateSettings: (settings: Settings) => void;
  updateMission: (content: string) => void;
  saveRole: (role: Role) => void;
  deleteRole: (id: string) => void;
  saveGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
};

const TimeCoinsContext = createContext<TimeCoinsStore | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function TimeCoinsProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [records, setRecords] = useState<Records>({});
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [roles, setRoles] = useState<Role[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [mission, setMission] = useState<MissionStatement>({
    content: "",
    updatedAt: "",
  });

  useEffect(() => {
    const savedSettings = readStorage<Partial<Settings>>(
      STORAGE_KEYS.settings,
      DEFAULT_SETTINGS,
    );
    const storedSettings = {
      ...DEFAULT_SETTINGS,
      ...savedSettings,
      noteTags: savedSettings.noteTags ?? DEFAULT_SETTINGS.noteTags,
    };
    const storedRecords = readStorage<Records>(STORAGE_KEYS.records, {});
    const today = dateKey(new Date());

    if (!storedRecords[today]) {
      storedRecords[today] = createDayRecord(today, storedSettings);
      persist(STORAGE_KEYS.records, storedRecords);
    }

    setSettings(storedSettings);
    setRecords(storedRecords);
    setRoles(readStorage(STORAGE_KEYS.roles, []));
    setGoals(readStorage(STORAGE_KEYS.goals, []));
    setMission(
      readStorage(STORAGE_KEYS.mission, { content: "", updatedAt: "" }),
    );
    setHydrated(true);
  }, []);

  const getRecord = useCallback(
    (date: string) => records[date] ?? createDayRecord(date, settings),
    [records, settings],
  );

  const updateCoin = useCallback(
    (date: string, coin: TimeCoin) => {
      setRecords((current) => {
        const record = current[date] ?? createDayRecord(date, settings);
        const next = {
          ...current,
          [date]: {
            ...record,
            coins: record.coins.map((item) =>
              item.id === coin.id ? coin : item,
            ),
          },
        };
        persist(STORAGE_KEYS.records, next);
        return next;
      });
    },
    [settings],
  );

  const updateCoins = useCallback(
    (date: string, coinIds: string[], values: Partial<TimeCoin>) => {
      const selectedIds = new Set(coinIds);
      setRecords((current) => {
        const record = current[date] ?? createDayRecord(date, settings);
        const next = {
          ...current,
          [date]: {
            ...record,
            coins: record.coins.map((coin) =>
              selectedIds.has(coin.id)
                ? {
                    ...coin,
                    category: values.category ?? coin.category,
                    note: values.note,
                    tags: values.tags,
                  }
                : coin,
            ),
          },
        };
        persist(STORAGE_KEYS.records, next);
        return next;
      });
    },
    [settings],
  );

  const updateSettings = useCallback((nextSettings: Settings) => {
    setSettings(nextSettings);
    persist(STORAGE_KEYS.settings, nextSettings);
  }, []);

  const updateMission = useCallback((content: string) => {
    const next = { content, updatedAt: new Date().toISOString() };
    setMission(next);
    persist(STORAGE_KEYS.mission, next);
  }, []);

  const saveRole = useCallback((role: Role) => {
    setRoles((current) => {
      const exists = current.some((item) => item.id === role.id);
      const next = exists
        ? current.map((item) => (item.id === role.id ? role : item))
        : [...current, role];
      persist(STORAGE_KEYS.roles, next);
      return next;
    });
  }, []);

  const deleteRole = useCallback((id: string) => {
    setRoles((current) => {
      const next = current.filter((item) => item.id !== id);
      persist(STORAGE_KEYS.roles, next);
      return next;
    });
    setGoals((current) => {
      const next = current.map((goal) =>
        goal.roleId === id ? { ...goal, roleId: undefined } : goal,
      );
      persist(STORAGE_KEYS.goals, next);
      return next;
    });
  }, []);

  const saveGoal = useCallback((goal: Goal) => {
    setGoals((current) => {
      const exists = current.some((item) => item.id === goal.id);
      const next = exists
        ? current.map((item) => (item.id === goal.id ? goal : item))
        : [...current, goal];
      persist(STORAGE_KEYS.goals, next);
      return next;
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((current) => {
      const next = current.filter((item) => item.id !== id);
      persist(STORAGE_KEYS.goals, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      records,
      settings,
      roles,
      goals,
      mission,
      getRecord,
      updateCoin,
      updateCoins,
      updateSettings,
      updateMission,
      saveRole,
      deleteRole,
      saveGoal,
      deleteGoal,
    }),
    [
      hydrated,
      records,
      settings,
      roles,
      goals,
      mission,
      getRecord,
      updateCoin,
      updateCoins,
      updateSettings,
      updateMission,
      saveRole,
      deleteRole,
      saveGoal,
      deleteGoal,
    ],
  );

  return (
    <TimeCoinsContext.Provider value={value}>
      {children}
    </TimeCoinsContext.Provider>
  );
}

export function useTimeCoins() {
  const context = useContext(TimeCoinsContext);
  if (!context) {
    throw new Error("useTimeCoins must be used inside TimeCoinsProvider");
  }
  return context;
}
