"use client";
import { useState } from "react";
import Todo from "./Todo";
import Calculator from "./Calculator";
import Weather from "./Weather";
import Modal from "./Modal";

export default function Desktop() {
  const [isCalcOpen, setCalcOpen] = useState(false);

  return (
    <>
      <div className="taskbar">
        <button onClick={() => setCalcOpen(true)} className="taskbar-icon">
          🧮 Calculator
        </button>
      </div>
      <div className="desktop-root">
        {/* Dock / taskbar */}

        {/* Background widgets */}
        <div className="desktop-widgets">
          <Weather />
        </div>

        {/* Main desktop content */}
        <div className="desktop-content">
          <Todo />
        </div>

        {/* Modals */}
        {isCalcOpen && (
          <Modal onClose={() => setCalcOpen(false)} title="Calculator">
            <Calculator />
          </Modal>
        )}
      </div>
    </>
  );
}
