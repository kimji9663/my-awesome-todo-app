"use client";

import { Sun, Sunrise, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/app/page";

interface CategoryStats {
  total: number;
  completed: number;
}

interface TodoSidebarProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  stats: {
    today: CategoryStats;
    tomorrow: CategoryStats;
    week: CategoryStats;
  };
}

const categories: {
  id: Category;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}[] = [
  {
    id: "today",
    label: "오늘 할일",
    icon: Sun,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    id: "tomorrow",
    label: "내일 할일",
    icon: Sunrise,
    color: "text-sky-600",
    bgColor: "bg-sky-100",
  },
  {
    id: "week",
    label: "이번주 할일",
    icon: Calendar,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
];

export function TodoSidebar({
  selectedCategory,
  onSelectCategory,
  stats,
}: TodoSidebarProps) {
  return (
    <div className="flex h-full w-72 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border p-6">
        <h1 className="text-2xl font-bold text-foreground">할일 목록</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          오늘도 화이팅!
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {categories.map((category) => {
            const categoryStats = stats[category.id];
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <li key={category.id}>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-3 transition-all",
                    isSelected
                      ? "bg-primary/10 shadow-sm"
                      : "hover:bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      category.bgColor
                    )}
                  >
                    <Icon className={cn("h-5 w-5", category.color)} />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={cn(
                        "font-medium",
                        isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {category.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {categoryStats.completed}/{categoryStats.total} 완료
                    </p>
                  </div>
                  {categoryStats.total - categoryStats.completed > 0 && (
                    <span
                      className={cn(
                        "flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-medium",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {categoryStats.total - categoryStats.completed}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm font-medium text-foreground">전체 진행률</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${
                  ((stats.today.completed +
                    stats.tomorrow.completed +
                    stats.week.completed) /
                    Math.max(
                      stats.today.total +
                        stats.tomorrow.total +
                        stats.week.total,
                      1
                    )) *
                  100
                }%`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {stats.today.completed +
              stats.tomorrow.completed +
              stats.week.completed}
            /{stats.today.total + stats.tomorrow.total + stats.week.total} 완료
          </p>
        </div>
      </div>
    </div>
  );
}
