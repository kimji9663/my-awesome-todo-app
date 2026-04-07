import type { Category } from "@/lib/todo-types";

export function deriveCategory(
  scheduledDate: string,
  todayStr: string,
  tomorrowStr: string
): Category {
  if (scheduledDate === todayStr) return "today";
  if (scheduledDate === tomorrowStr) return "tomorrow";
  return "week";
}
