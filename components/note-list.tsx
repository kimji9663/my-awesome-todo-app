"use client";

import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

interface NoteListProps {
  notes: Note[];
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
}

const colorClasses: Record<string, string> = {
  yellow: "bg-amber-50 border-amber-200",
  green: "bg-emerald-50 border-emerald-200",
  blue: "bg-sky-50 border-sky-200",
  pink: "bg-rose-50 border-rose-200",
  white: "bg-white border-border",
};

export function NoteList({
  notes,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onAddNote,
}: NoteListProps) {
  return (
    <div className="flex h-full flex-col border-r border-border bg-sidebar">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">메모</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={onAddNote}
          className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">새 메모 추가</span>
        </Button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="메모 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-2">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">메모가 없습니다</p>
              <p className="text-sm text-muted-foreground">
                새 메모를 추가해보세요
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <button
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-all hover:shadow-md",
                  colorClasses[note.color] || colorClasses.white,
                  selectedId === note.id && "ring-2 ring-primary shadow-md"
                )}
              >
                <h3 className="font-medium text-foreground line-clamp-1">
                  {note.title || "제목 없음"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {note.content || "내용 없음"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{note.date}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
