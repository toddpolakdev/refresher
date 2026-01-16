"use client";
import { useState } from "react";
import Todo from "./Todo";
import Calculator from "./Calculator";
import Home from "./Home";
import Notes from "./Notes";
import FloatingWindow from "./FloatingWindow";

import dynamic from "next/dynamic";
const Weather = dynamic(() => import("./Weather"), {
  ssr: false,
});

export default function Desktop() {
  const [isCalcOpen, setCalcOpen] = useState(false);
  const [isNotesOpen, setNotesOpen] = useState(false);
  const [isTodoOpen, setTodoOpen] = useState(false);

  return (
    <div className="desktop-root">
      <aside className="sidebar">
        <button onClick={() => setCalcOpen(true)} className="sidebar-btn">
          Calculator
        </button>

        <button className="sidebar-btn" onClick={() => setTodoOpen(true)}>
          Todo List
        </button>

        <button className="sidebar-btn" onClick={() => setNotesOpen(true)}>
          Notes
        </button>

        <div className="sidebar-widget">
          <Weather />
        </div>
      </aside>

      <main className="main-content">
        <Home />
      </main>

      {isCalcOpen && (
        <FloatingWindow title="Calculator" onClose={() => setCalcOpen(false)}>
          <Calculator />
        </FloatingWindow>
      )}

      {isTodoOpen && (
        <FloatingWindow title="Todo List" onClose={() => setTodoOpen(false)}>
          <Todo />
        </FloatingWindow>
      )}

      {isNotesOpen && (
        <FloatingWindow title="Notes" onClose={() => setNotesOpen(false)}>
          <Notes />
        </FloatingWindow>
      )}
    </div>
  );
}
