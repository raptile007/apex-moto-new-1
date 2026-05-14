
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "COMMON" | "RARE" | "LEGENDARY";
  unlockedAt: string | null;
  progress: number; // 0-100
};

export type TelemetryData = {
  label: string;
  value: string | number;
  unit: string;
  trend: "up" | "down" | "stable";
  color: string;
};

export const achievements: Achievement[] = [
  {
    id: "ach-001",
    title: "Apex Pilot",
    description: "Reach a total flight distance of 5,000 KM.",
    icon: "Trophy",
    rarity: "COMMON",
    unlockedAt: "2024-02-15T12:00:00Z",
    progress: 100
  },
  {
    id: "ach-002",
    title: "Master Engineer",
    description: "Complete 10 custom builds in the Virtual Garage.",
    icon: "Wrench",
    rarity: "RARE",
    unlockedAt: null,
    progress: 70
  },
  {
    id: "ach-003",
    title: "Ghost Rider",
    description: "Operate the dashboard during night hours (22:00 - 04:00).",
    icon: "Zap",
    rarity: "LEGENDARY",
    unlockedAt: "2024-03-01T23:30:00Z",
    progress: 100
  },
  {
    id: "ach-004",
    title: "Brembo King",
    description: "Install 5 different Brembo braking systems.",
    icon: "Shield",
    rarity: "RARE",
    unlockedAt: null,
    progress: 40
  },
  {
    id: "ach-005",
    title: "Akrapovic Sound",
    description: "Unlock the Akrapovic full titanium system.",
    icon: "Activity",
    rarity: "LEGENDARY",
    unlockedAt: null,
    progress: 10
  }
];

export const telemetryData: TelemetryData[] = [
  {
    label: "TOP_SPEED_RECORD",
    value: 284,
    unit: "KM/H",
    trend: "up",
    color: "apex-orange"
  },
  {
    label: "AVG_ENGINE_TEMP",
    value: 92,
    unit: "°C",
    trend: "stable",
    color: "emerald-500"
  },
  {
    label: "FUEL_EFFICIENCY",
    value: 18.5,
    unit: "KM/L",
    trend: "down",
    color: "amber-500"
  },
  {
    label: "LEAN_ANGLE_MAX",
    value: 52,
    unit: "°",
    trend: "up",
    color: "apex-orange"
  },
  {
    label: "G_FORCE_PEAK",
    value: 1.4,
    unit: "G",
    trend: "stable",
    color: "blue-500"
  },
  {
    label: "BRAKING_FORCE",
    value: 9.8,
    unit: "M/S²",
    trend: "up",
    color: "red-500"
  }
];
