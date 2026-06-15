export type CoinCategory =
  | "play"
  | "rest"
  | "mandatory"
  | "quality"
  | "procrastination"
  | "empty";

export type TimeCoin = {
  id: string;
  startTime: string;
  endTime: string;
  category: CoinCategory;
  note?: string;
};

export type DayRecord = {
  date: string;
  wakeTime: string;
  sleepTime: string;
  coins: TimeCoin[];
};

export type Role = {
  id: string;
  name: string;
  description?: string;
};

export type GoalType = "yearly" | "monthly" | "weekly";
export type GoalStatus = "active" | "done" | "paused";

export type Goal = {
  id: string;
  title: string;
  description?: string;
  roleId?: string;
  type: GoalType;
  status: GoalStatus;
  createdAt: string;
};

export type MissionStatement = {
  content: string;
  updatedAt: string;
};

export type Settings = {
  wakeTime: string;
  sleepTime: string;
  coinDuration: number;
};
