"use client";

import { Sun, Sunrise, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/todo-types";

interface CategoryStats {
  total: number;
  completed: number;
}

interface MobileNavigationProps {
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
  activeColor: string;
}[] = [
  {
    id: "today",
    label: "오늘",
    icon: Sun,
    activeColor: "text-amber-500",
  },
  {
    id: "tomorrow",
    label: "내일",
    icon: Sunrise,
    activeColor: "text-sky-500",
  },
  {
    id: "week",
    label: "이번주",
    icon: Calendar,
    activeColor: "text-emerald-500",
  },
];

export function MobileNavigation({
  selectedCategory,
  onSelectCategory,
  stats,
}: MobileNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-lg safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          const remaining =
            stats[category.id].total - stats[category.id].completed;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all",
                isSelected ? "bg-muted" : "active:bg-muted/50"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isSelected ? category.activeColor : "text-muted-foreground"
                  )}
                />
                {remaining > 0 && (
                  <span
                    className={cn(
                      "absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium text-white",
                      category.id === "today" && "bg-amber-500",
                      category.id === "tomorrow" && "bg-sky-500",
                      category.id === "week" && "bg-emerald-500"
                    )}
                  >
                    {remaining}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isSelected ? category.activeColor : "text-muted-foreground"
                )}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
