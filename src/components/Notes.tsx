"use client";
import useLocalStorage from "../hooks/useLocalStorage";
import { useState } from "react";

type Note = {
  id: string;
  text: string;
};

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>("desktop-notes", []);

  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    notes[0]?.id ?? null
  );

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      text: "",
    };

    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (text: string) => {
    if (!activeNoteId) return;

    setNotes(notes.map((n) => (n.id === activeNoteId ? { ...n, text } : n)));
  };

  const deleteNote = (id: string) => {
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);

    if (id === activeNoteId) {
      setActiveNoteId(filtered[0]?.id ?? null);
    }
  };

  return (
    <div className="notes-layout">
      {/* LEFT NAV */}
      <aside className="notes-sidebar">
        <button className="new-note-btn" onClick={addNote}>
          ＋ New Note
        </button>

        <ul className="notes-list">
          {notes.map((note, index) => (
            <li
              key={note.id}
              className={`notes-list-item ${
                note.id === activeNoteId ? "active" : ""
              }`}
              onClick={() => setActiveNoteId(note.id)}
            >
              Note {index + 1}
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN NOTE VIEW */}
      <section className="notes-view">
        {activeNote ? (
          <div className="sticky-note single">
            <textarea
              placeholder="Write something…"
              value={activeNote.text}
              onChange={(e) => updateNote(e.target.value)}
            />
            <button
              className="delete-note"
              onClick={() => deleteNote(activeNote.id)}
            >
              ✖
            </button>
          </div>
        ) : (
          <p className="notes-empty">No note selected.</p>
        )}
      </section>
    </div>
  );
}
