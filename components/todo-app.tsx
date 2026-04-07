"use client";

import { useCallback, useEffect, useState } from "react";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNavigation } from "@/components/mobile-navigation";
import { MobileTodoList } from "@/components/mobile-todo-list";
import type { Todo, Category } from "@/lib/todo-types";

export type { Todo, Category } from "@/lib/todo-types";

type TodoAppProps = {
  userEmail: string;
};

export function TodoApp({ userEmail }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("today");

  const loadTodos = useCallback(async () => {
    const res = await fetch("/api/todos");
    const data = (await res.json()) as { todos?: Todo[]; error?: string };
    if (!res.ok) {
      setSyncError(data.error ?? "할일을 불러오지 못했습니다.");
      return;
    }
    if (data.todos) {
      setTodos(data.todos);
      setSyncError(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadTodos();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadTodos]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setSyncError(data.error ?? "상태 변경에 실패했습니다.");
      return;
    }
    await loadTodos();
  };

  const handleAdd = async (text: string) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, category: selectedCategory }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setSyncError(data.error ?? "할일 추가에 실패했습니다.");
      return;
    }
    await loadTodos();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setSyncError(data.error ?? "삭제에 실패했습니다.");
      return;
    }
    await loadTodos();
  };

  const handleEdit = async (id: string, text: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setSyncError(data.error ?? "수정에 실패했습니다.");
      return;
    }
    await loadTodos();
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
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      {syncError ? (
        <div
          className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive"
          role="alert"
        >
          {syncError}
        </div>
      ) : null}
      <main className="flex-1 overflow-y-auto pb-20">
        <MobileTodoList
          category={selectedCategory}
          todos={getCategoryTodos(selectedCategory)}
          onToggle={handleToggle}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onEdit={handleEdit}
          disabled={loading}
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
