"use client";
import { useState } from "react";
import Todo from "./Todo";
import Calculator from "./Calculator";
import Weather from "./Weather";
import Modal from "./Modal";

export default function Desktop() {
  const [isCalcOpen, setCalcOpen] = useState(false);

  return (
    <div className="desktop-root">
      <aside className="sidebar">
        <button onClick={() => setCalcOpen(true)} className="sidebar-btn">
          Calculator
        </button>
        <div className="sidebar-widget">
          <Weather />
        </div>
      </aside>

      <main className="main-content">
        <Todo />
      </main>

      {isCalcOpen && (
        <Modal onClose={() => setCalcOpen(false)} title="Calculator">
          <Calculator />
        </Modal>
      )}
    </div>
  );
}
