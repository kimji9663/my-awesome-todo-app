"use client";

import { useState } from "react";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNavigation } from "@/components/mobile-navigation";
import { MobileTodoList } from "@/components/mobile-todo-list";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: "today" | "tomorrow" | "week";
}

export type Category = "today" | "tomorrow" | "week";

const initialTodos: Todo[] = [
  { id: "1", text: "프로젝트 미팅 준비", completed: false, category: "today" },
  { id: "2", text: "보고서 작성하기", completed: true, category: "today" },
  { id: "3", text: "운동 30분 하기", completed: false, category: "today" },
  { id: "4", text: "장보기", completed: false, category: "tomorrow" },
  { id: "5", text: "병원 예약", completed: false, category: "tomorrow" },
  { id: "6", text: "친구 생일 선물 준비", completed: true, category: "tomorrow" },
  { id: "7", text: "주간 회의 자료 준비", completed: false, category: "week" },
  { id: "8", text: "책 2장 읽기", completed: false, category: "week" },
  { id: "9", text: "온라인 강의 수강", completed: false, category: "week" },
  { id: "10", text: "집 청소하기", completed: true, category: "week" },
];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedCategory, setSelectedCategory] = useState<Category>("today");

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleAdd = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      category: selectedCategory,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleEdit = (id: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  };

  const getCategoryTodos = (category: Category) =>
    todos.filter((todo) => todo.category === category);

  const getCategoryStats = (category: Category) => {
    const categoryTodos = getCategoryTodos(category);
    const completed = categoryTodos.filter((t) => t.completed).length;
    return { total: categoryTodos.length, completed };
  };

  const totalStats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MobileHeader
        category={selectedCategory}
        stats={getCategoryStats(selectedCategory)}
        totalStats={totalStats}
      />
      <main className="flex-1 overflow-y-auto pb-20">
        <MobileTodoList
          category={selectedCategory}
          todos={getCategoryTodos(selectedCategory)}
          onToggle={handleToggle}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </main>
      <MobileNavigation
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        stats={{
          today: getCategoryStats("today"),
          tomorrow: getCategoryStats("tomorrow"),
          week: getCategoryStats("week"),
        }}
      />
    </div>
  );
}
