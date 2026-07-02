"use client";

import { useEffect, useMemo, useState } from "react";
import { NOTE_COLORS, useNotes } from "../context/NotesContext";
import type { Note } from "../types";

function noteTitle(note: Note) {
  if (note.title.trim()) return note.title.trim();
  const firstLine = note.text.trim().split("\n")[0];
  return firstLine || "Untitled";
}

function notePreview(note: Note) {
  const body = note.title.trim() ? note.text : note.text.split("\n").slice(1).join(" ");
  return body.trim().replace(/\s+/g, " ").slice(0, 60);
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function Notes() {
  const { notes, addNote, updateNote, removeNote, togglePin } = useNotes();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q)
    );
  }, [notes, query]);

  // Keep a valid note selected as data hydrates / changes.
  useEffect(() => {
    if (notes.length === 0) {
      if (activeId !== null) setActiveId(null);
      return;
    }
    if (!activeId || !notes.some((n) => n.id === activeId)) {
      setActiveId(notes[0].id);
    }
  }, [notes, activeId]);

  const activeNote = notes.find((n) => n.id === activeId) ?? null;

  const handleAdd = () => {
    const id = addNote();
    setActiveId(id);
    setQuery("");
  };

  return (
    <div className="notes-layout">
      <aside className="notes-sidebar">
        <button className="new-note-btn" onClick={handleAdd}>
          ＋ New Note
        </button>
        <input
          className="notes-search"
          placeholder="Search notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <ul className="notes-list">
          {filtered.length === 0 && (
            <li className="notes-list-empty">No notes found.</li>
          )}
          {filtered.map((note) => (
            <li
              key={note.id}
              className={`notes-list-item ${
                note.id === activeId ? "active" : ""
              }`}
              onClick={() => setActiveId(note.id)}
              style={{ borderLeft: `4px solid ${note.color}` }}
            >
              <div className="note-row">
                <span className="note-title">
                  {note.pinned && <span className="note-pin">📌</span>}
                  {noteTitle(note)}
                </span>
                <span className="note-meta">{timeAgo(note.updatedAt)}</span>
              </div>
              {notePreview(note) && (
                <div className="note-preview">{notePreview(note)}</div>
              )}
            </li>
          ))}
        </ul>
      </aside>

      <section className="notes-view">
        {activeNote ? (
          <div className="sticky-note single" style={{ background: activeNote.color }}>
            <div className="note-toolbar">
              <button
                className="note-tool"
                onClick={() => togglePin(activeNote.id)}
                title={activeNote.pinned ? "Unpin" : "Pin"}
              >
                {activeNote.pinned ? "📌" : "📍"}
              </button>
              <div className="note-colors">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c}
                    className={`note-swatch ${
                      activeNote.color === c ? "active" : ""
                    }`}
                    style={{ background: c }}
                    onClick={() => updateNote(activeNote.id, { color: c })}
                    aria-label={`Set color ${c}`}
                  />
                ))}
              </div>
              <button
                className="note-tool delete"
                onClick={() => removeNote(activeNote.id)}
                title="Delete note"
              >
                🗑
              </button>
            </div>

            <input
              className="note-title-input"
              placeholder="Title"
              value={activeNote.title}
              onChange={(e) =>
                updateNote(activeNote.id, { title: e.target.value })
              }
            />
            <textarea
              className="note-body"
              placeholder="Write something…"
              value={activeNote.text}
              onChange={(e) =>
                updateNote(activeNote.id, { text: e.target.value })
              }
            />
          </div>
        ) : (
          <p className="notes-empty">No note selected. Create one to start.</p>
        )}
      </section>
    </div>
  );
}
