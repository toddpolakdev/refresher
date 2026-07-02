"use client";
import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import Todo from "./Todo";
import Calculator from "./Calculator";
import Home from "./Home";
import Notes from "./Notes";
import Clock from "./Clock";
import Taskbar, { type TaskbarItem } from "./Taskbar";
import FloatingWindow from "./FloatingWindow";

import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { TodosProvider } from "../context/TodosContext";
import { NotesProvider } from "../context/NotesContext";

const Weather = dynamic(() => import("./Weather"), { ssr: false });

type WinId = "calculator" | "todo" | "notes";

type WinState = { open: boolean; minimized: boolean; z: number };

const WINDOW_META: { id: WinId; title: string; className?: string }[] = [
  { id: "calculator", title: "Calculator" },
  { id: "todo", title: "Todo List" },
  { id: "notes", title: "Notes", className: "notes-window" },
];

const CLOSED: WinState = { open: false, minimized: false, z: 0 };

export default function Desktop() {
  return (
    <ThemeProvider>
      <TodosProvider>
        <NotesProvider>
          <DesktopShell />
        </NotesProvider>
      </TodosProvider>
    </ThemeProvider>
  );
}

function DesktopShell() {
  const { theme, toggleTheme } = useTheme();
  const [windows, setWindows] = useState<Record<WinId, WinState>>({
    calculator: CLOSED,
    todo: CLOSED,
    notes: CLOSED,
  });
  const zCounter = useRef(10);

  const open = (id: WinId) =>
    setWindows((prev) => ({
      ...prev,
      [id]: { open: true, minimized: false, z: (zCounter.current += 1) },
    }));

  const close = (id: WinId) =>
    setWindows((prev) => ({ ...prev, [id]: CLOSED }));

  const focus = (id: WinId) =>
    setWindows((prev) => {
      const maxZ = Math.max(prev.calculator.z, prev.todo.z, prev.notes.z);
      if (prev[id].z === maxZ && !prev[id].minimized) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], minimized: false, z: (zCounter.current += 1) },
      };
    });

  const minimize = (id: WinId) =>
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: true },
    }));

  // Taskbar click: restore + focus if minimized/behind, else minimize.
  const topZ = Math.max(...WINDOW_META.map((w) => windows[w.id].z));
  const onTaskbarClick = (id: WinId) => {
    const w = windows[id];
    if (w.minimized || w.z < topZ) focus(id);
    else minimize(id);
  };

  const taskbarItems: TaskbarItem[] = useMemo(
    () =>
      WINDOW_META.filter((w) => windows[w.id].open).map((w) => ({
        id: w.id,
        title: w.title,
        active: !windows[w.id].minimized && windows[w.id].z === topZ,
        minimized: windows[w.id].minimized,
      })),
    [windows, topZ]
  );

  const cascade = (index: number) => ({ x: 140 + index * 36, y: 110 + index * 36 });

  const renderBody = (id: WinId) => {
    if (id === "calculator") return <Calculator />;
    if (id === "todo") return <Todo />;
    return <Notes />;
  };

  return (
    <div className="desktop-root">
      <div className="desktop-body">
        <aside className="sidebar">
          <div className="sidebar-brand">🖥️ Desktop</div>

          {WINDOW_META.map((w) => (
            <button
              key={w.id}
              className="sidebar-btn"
              onClick={() => open(w.id)}
            >
              {w.title}
            </button>
          ))}

          <div className="sidebar-widget">
            <Weather />
          </div>

          <div className="sidebar-footer">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
            </button>
          </div>
        </aside>

        <main className="main-content">
          <Home />
        </main>
      </div>

      {WINDOW_META.map((w, i) =>
        windows[w.id].open ? (
          <FloatingWindow
            key={w.id}
            title={w.title}
            className={w.className}
            zIndex={windows[w.id].z}
            minimized={windows[w.id].minimized}
            initialPosition={cascade(i)}
            onClose={() => close(w.id)}
            onMinimize={() => minimize(w.id)}
            onFocus={() => focus(w.id)}
          >
            {renderBody(w.id)}
          </FloatingWindow>
        ) : null
      )}

      <Taskbar items={taskbarItems} onItemClick={(id) => onTaskbarClick(id as WinId)}>
        <Clock />
      </Taskbar>
    </div>
  );
}
