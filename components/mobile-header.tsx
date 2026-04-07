"use client";

import { LogOut, Sun, Sunrise, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/todo-types";

interface MobileHeaderProps {
  category: Category;
  stats: { total: number; completed: number };
  totalStats: { total: number; completed: number };
  userEmail: string;
  onLogout: () => void;
}

const categoryInfo: Record<
  Category,
  {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    gradient: string;
    iconBg: string;
  }
> = {
  today: {
    title: "오늘 할일",
    subtitle: "오늘 하루도 화이팅!",
    icon: Sun,
    gradient: "from-amber-400 to-orange-400",
    iconBg: "bg-amber-500/20",
  },
  tomorrow: {
    title: "내일 할일",
    subtitle: "미리 준비하면 여유로워요",
    icon: Sunrise,
    gradient: "from-sky-400 to-blue-400",
    iconBg: "bg-sky-500/20",
  },
  week: {
    title: "이번주 할일",
    subtitle: "한 주를 알차게 보내세요",
    icon: Calendar,
    gradient: "from-emerald-400 to-teal-400",
    iconBg: "bg-emerald-500/20",
  },
};

export function MobileHeader({
  category,
  stats,
  totalStats,
  userEmail,
  onLogout,
}: MobileHeaderProps) {
  const info = categoryInfo[category];
  const Icon = info.icon;
  const progressPercent =
    totalStats.total > 0 ? (totalStats.completed / totalStats.total) * 100 : 0;

  return (
    <header
      className={cn(
        "relative overflow-hidden bg-gradient-to-br px-5 pb-6 pt-12 text-white",
        info.gradient
      )}
    >
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
      <div className="absolute right-16 top-16 h-16 w-16 rounded-full bg-white/10" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-2 text-xs text-white/90">
          <span className="truncate" title={userEmail}>
            {userEmail}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 shrink-0 gap-1 border-0 bg-white/20 text-white hover:bg-white/30"
            onClick={onLogout}
          >
            <LogOut className="h-3.5 w-3.5" />
            로그아웃
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className={cn("rounded-xl p-2", info.iconBg)}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{info.title}</h1>
                <p className="text-sm text-white/80">{info.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {stats.completed}/{stats.total}
            </p>
            <p className="text-xs text-white/80">완료</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>전체 진행률</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
