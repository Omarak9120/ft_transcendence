/* Shared DTO shapes returned by the backend */

export interface WinsTotalDTO {
  wins: number;
  losses: number;
}

export interface GoalsTotalDTO {
  scored: number;
  conceded: number;
}

export interface MonthlyGoalsDTO {
  scored: number[];
  conceded: number[];
}

export interface MonthlyNumsDTO extends Array<number> {} // e.g. wins per month

export interface StreakDTO {
  streak: number;
}

export interface LongestHitDTO {
  longest: number;
  opponent: string;
}

export interface TrophyDTO {
  total: number;
}

export interface MatchRow {
  id: string;
  date: string;       // ISO yyyy-mm-dd
  opponent: string;
  score: string;      // “11 – 8”
  result: "Win" | "Loss";
}
