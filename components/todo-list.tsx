"use client";

import { useState } from "react";
import { Plus, Trash2, Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Todo, Category } from "@/app/page";

interface TodoListProps {
  category: Category;
  todos: Todo[];
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const categoryInfo: Record<
  Category,
  { title: string; subtitle: string; bgColor: string }
> = {
  today: {
    title: "오늘 할일",
    subtitle: "오늘 완료해야 할 일들",
    bgColor: "bg-amber-50/30",
  },
  tomorrow: {
    title: "내일 할일",
    subtitle: "내일을 위해 미리 준비하세요",
    bgColor: "bg-sky-50/30",
  },
  week: {
    title: "이번주 할일",
    subtitle: "이번 주 안에 완료할 일들",
    bgColor: "bg-emerald-50/30",
  },
};

export function TodoList({
  category,
  todos,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
}: TodoListProps) {
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const info = categoryInfo[category];
  const incompleteTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAdd(newTodo.trim());
      setNewTodo("");
    }
  };

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleEditSave = (id: string) => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className={cn("flex flex-1 flex-col", info.bgColor)}>
      <div className="border-b border-border bg-card/80 px-8 py-6">
        <h2 className="text-2xl font-bold text-foreground">{info.title}</h2>
        <p className="mt-1 text-muted-foreground">{info.subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="새 할일 추가..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 bg-card border-border focus-visible:ring-primary"
            />
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              추가
            </Button>
          </div>
        </form>

        {incompleteTodos.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              진행중 ({incompleteTodos.length})
            </h3>
            <ul className="space-y-2">
              {incompleteTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="group flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <Checkbox
                    id={todo.id}
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo.id)}
                    className="h-5 w-5 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  {editingId === todo.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(todo.id);
                          if (e.key === "Escape") handleEditCancel();
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditSave(todo.id)}
                        className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleEditCancel}
                        className="h-8 w-8 text-muted-foreground hover:bg-muted"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <label
                        htmlFor={todo.id}
                        className="flex-1 cursor-pointer text-foreground"
                      >
                        {todo.text}
                      </label>
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditStart(todo)}
                          className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete(todo.id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {completedTodos.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              완료됨 ({completedTodos.length})
            </h3>
            <ul className="space-y-2">
              {completedTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="group flex items-center gap-3 rounded-xl bg-card/60 p-4 transition-all"
                >
                  <Checkbox
                    id={todo.id}
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo.id)}
                    className="h-5 w-5 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={todo.id}
                    className="flex-1 cursor-pointer text-muted-foreground line-through"
                  >
                    {todo.text}
                  </label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(todo.id)}
                    className="h-8 w-8 text-destructive opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Check className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">
              할일이 없습니다
            </p>
            <p className="mt-1 text-muted-foreground">
              위에서 새 할일을 추가해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
