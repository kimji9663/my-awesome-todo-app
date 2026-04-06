"use client";

import { useState, useMemo } from "react";
import { NoteList } from "@/components/note-list";
import { NoteEditor } from "@/components/note-editor";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "오늘의 할 일",
    content: "1. 프로젝트 미팅 준비\n2. 보고서 작성\n3. 운동하기\n4. 책 읽기",
    date: "2024년 4월 6일",
    color: "yellow",
  },
  {
    id: "2",
    title: "회의 노트",
    content: "다음 주 목표: 새로운 기능 출시\n담당자: 김철수\n마감일: 4월 15일",
    date: "2024년 4월 5일",
    color: "blue",
  },
  {
    id: "3",
    title: "아이디어 메모",
    content: "앱 디자인 개선 아이디어:\n- 다크 모드 추가\n- 태그 기능\n- 검색 기능 강화",
    date: "2024년 4월 4일",
    color: "green",
  },
  {
    id: "4",
    title: "쇼핑 리스트",
    content: "우유, 빵, 계란, 과일, 채소, 생수",
    date: "2024년 4월 3일",
    color: "pink",
  },
];

function formatDate(): string {
  const now = new Date();
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      date: formatDate(),
      color: "white",
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedId === id) {
      setSelectedId(notes.length > 1 ? notes.find((n) => n.id !== id)?.id || null : null);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 flex-shrink-0">
        <NoteList
          notes={filteredNotes}
          selectedId={selectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectNote={setSelectedId}
          onAddNote={handleAddNote}
        />
      </div>
      <div className="flex-1">
        <NoteEditor
          note={selectedNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </div>
  );
}
