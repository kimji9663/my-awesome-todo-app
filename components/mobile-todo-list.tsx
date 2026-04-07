"use client";

import { useState } from "react";
import { Plus, Trash2, Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Todo, Category } from "@/lib/todo-types";

interface MobileTodoListProps {
  category: Category;
  todos: Todo[];
  onToggle: (id: string) => void | Promise<void>;
  onAdd: (text: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onEdit: (id: string, text: string) => void | Promise<void>;
  disabled?: boolean;
}

export function MobileTodoList({
  todos,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
  disabled = false,
}: MobileTodoListProps) {
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const incompleteTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !newTodo.trim()) return;
    await onAdd(newTodo.trim());
    setNewTodo("");
  };

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleEditSave = async (id: string) => {
    if (editText.trim()) {
      await onEdit(id, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="px-4 py-4">
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="flex gap-2">
          <Input
            placeholder={disabled ? "불러오는 중…" : "새 할일 추가..."}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            disabled={disabled}
            className="flex-1 h-12 rounded-xl bg-card border-border text-base"
          />
          <Button
            type="submit"
            size="icon"
            disabled={disabled}
            className="h-12 w-12 shrink-0 rounded-xl"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {incompleteTodos.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 px-1 text-sm font-medium text-muted-foreground">
            진행중 ({incompleteTodos.length})
          </h3>
          <ul className="space-y-2">
            {incompleteTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm"
              >
                <Checkbox
                  id={todo.id}
                  checked={todo.completed}
                  disabled={disabled}
                  onCheckedChange={() => void onToggle(todo.id)}
                  className="h-6 w-6 shrink-0 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                {editingId === todo.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 h-10"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSave(todo.id);
                        if (e.key === "Escape") handleEditCancel();
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => void handleEditSave(todo.id)}
                      className="h-10 w-10 shrink-0 text-emerald-600"
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={disabled}
                      onClick={handleEditCancel}
                      className="h-10 w-10 shrink-0 text-muted-foreground"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <label
                      htmlFor={todo.id}
                      className="flex-1 cursor-pointer text-foreground leading-relaxed"
                    >
                      {todo.text}
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={disabled}
                        onClick={() => handleEditStart(todo)}
                        className="h-9 w-9 shrink-0 text-muted-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={disabled}
                        onClick={() => void onDelete(todo.id)}
                        className="h-9 w-9 shrink-0 text-destructive"
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
          <h3 className="mb-3 px-1 text-sm font-medium text-muted-foreground">
            완료됨 ({completedTodos.length})
          </h3>
          <ul className="space-y-2">
            {completedTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 rounded-xl bg-card/60 p-4"
              >
                <Checkbox
                  id={todo.id}
                  checked={todo.completed}
                  disabled={disabled}
                  onCheckedChange={() => void onToggle(todo.id)}
                  className="h-6 w-6 shrink-0 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor={todo.id}
                  className="flex-1 cursor-pointer text-muted-foreground line-through leading-relaxed"
                >
                  {todo.text}
                </label>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => void onDelete(todo.id)}
                  className="h-9 w-9 shrink-0 text-destructive/70"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {todos.length === 0 && disabled && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">할일을 불러오는 중…</p>
        </div>
      )}

      {todos.length === 0 && !disabled && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Check className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground">
            할일이 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            위에서 새 할일을 추가해보세요
          </p>
        </div>
      )}
    </div>
  );
}
