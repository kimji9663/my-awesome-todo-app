import { deriveCategory } from "@/lib/todo-category";
import type { Todo } from "@/lib/todo-types";

export function serializeTodoRow(
  t: {
    id: string;
    text: string;
    completed: boolean;
    scheduledDate: string | null;
  },
  todayStr: string,
  tomorrowStr: string
): Todo {
  const sd = t.scheduledDate;
  if (!sd) {
    return {
      id: t.id,
      text: t.text,
      completed: t.completed,
      category: "today",
    };
  }
  return {
    id: t.id,
    text: t.text,
    completed: t.completed,
    category: deriveCategory(sd, todayStr, tomorrowStr),
  };
}
