"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { collection } from "../lib/store";
import type { Note } from "../types";

const EMPTY_NOTES: Note[] = [];

export const NOTE_COLORS = ["#fff6a9", "#c8f7c5", "#bfe3ff", "#ffd6e0", "#e3d7ff"];
const DEFAULT_COLOR = NOTE_COLORS[0];

// Backfill fields for notes saved under the older { id, text } shape.
function normalizeNote(raw: Partial<Note> & { id: string }): Note {
  const created = raw.createdAt ?? Date.now();
  return {
    id: raw.id,
    title: raw.title ?? "",
    text: raw.text ?? "",
    color: raw.color ?? DEFAULT_COLOR,
    pinned: raw.pinned ?? false,
    createdAt: created,
    updatedAt: raw.updatedAt ?? created,
  };
}

type NotesContextValue = {
  notes: Note[];
  addNote: () => string;
  updateNote: (id: string, patch: Partial<Note>) => void;
  removeNote: (id: string) => void;
  togglePin: (id: string) => void;
};

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [rawNotes, setNotes] = useLocalStorage<Note[]>(
    "desktop-notes",
    EMPTY_NOTES
  );

  // Pinned first, then most recently updated.
  const notes = useMemo(() => {
    return rawNotes
      .map(normalizeNote)
      .sort((a, b) =>
        a.pinned === b.pinned
          ? b.updatedAt - a.updatedAt
          : Number(b.pinned) - Number(a.pinned)
      );
  }, [rawNotes]);

  const addNote = useCallback(() => {
    const now = Date.now();
    const note: Note = {
      id: crypto.randomUUID(),
      title: "",
      text: "",
      color: DEFAULT_COLOR,
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => collection.create(prev, note));
    return note.id;
  }, [setNotes]);

  const updateNote = useCallback(
    (id: string, patch: Partial<Note>) => {
      setNotes((prev) =>
        collection.update(prev, id, { ...patch, updatedAt: Date.now() })
      );
    },
    [setNotes]
  );

  const removeNote = useCallback(
    (id: string) => {
      setNotes((prev) => collection.remove(prev, id));
    },
    [setNotes]
  );

  const togglePin = useCallback(
    (id: string) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
      );
    },
    [setNotes]
  );

  return (
    <NotesContext.Provider
      value={{ notes, addNote, updateNote, removeNote, togglePin }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within a NotesProvider");
  return ctx;
}
