export type Category = "today" | "tomorrow" | "week";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  category: Category;
};
