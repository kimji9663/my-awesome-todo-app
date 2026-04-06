"use client";

import { Trash2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

const colors = [
  { name: "흰색", value: "white", className: "bg-white border-border" },
  { name: "노란색", value: "yellow", className: "bg-amber-100 border-amber-300" },
  { name: "초록색", value: "green", className: "bg-emerald-100 border-emerald-300" },
  { name: "파란색", value: "blue", className: "bg-sky-100 border-sky-300" },
  { name: "분홍색", value: "pink", className: "bg-rose-100 border-rose-300" },
];

const bgColorClasses: Record<string, string> = {
  yellow: "bg-amber-50/50",
  green: "bg-emerald-50/50",
  blue: "bg-sky-50/50",
  pink: "bg-rose-50/50",
  white: "bg-background",
};

export function NoteEditor({ note, onUpdateNote, onDeleteNote }: NoteEditorProps) {
  if (!note) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-6xl">📝</div>
          <h2 className="text-xl font-medium text-foreground">메모를 선택하세요</h2>
          <p className="mt-2 text-muted-foreground">
            왼쪽 목록에서 메모를 선택하거나 새 메모를 추가하세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", bgColorClasses[note.color] || bgColorClasses.white)}>
      <div className="flex items-center justify-between border-b border-border bg-card/80 px-6 py-3">
        <span className="text-sm text-muted-foreground">{note.date}</span>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Palette className="h-4 w-4" />
                <span className="sr-only">색상 변경</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {colors.map((color) => (
                <DropdownMenuItem
                  key={color.value}
                  onClick={() => onUpdateNote(note.id, { color: color.value })}
                  className="flex items-center gap-2"
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2",
                      color.className
                    )}
                  />
                  <span>{color.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteNote(note.id)}
            className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">메모 삭제</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Input
          placeholder="제목을 입력하세요"
          value={note.title}
          onChange={(e) => onUpdateNote(note.id, { title: e.target.value })}
          className="border-0 bg-transparent text-2xl font-semibold placeholder:text-muted-foreground/60 focus-visible:ring-0 px-0"
        />
        <Textarea
          placeholder="내용을 입력하세요..."
          value={note.content}
          onChange={(e) => onUpdateNote(note.id, { content: e.target.value })}
          className="mt-4 min-h-[400px] resize-none border-0 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 px-0 leading-relaxed"
        />
      </div>
    </div>
  );
}
