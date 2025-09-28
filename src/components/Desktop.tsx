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
      <Weather />
      {/* Todo list = desktop */}
      <Todo />

      {/* Shortcut to open Calculator */}
      <button className="desktop-launcher" onClick={() => setCalcOpen(true)}>
        Open Calculator
      </button>

      {/* Calculator modal */}
      {isCalcOpen && (
        <Modal onClose={() => setCalcOpen(false)}>
          <Calculator />
        </Modal>
      )}
    </div>
  );
}
