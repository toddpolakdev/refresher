"use client";

import { useEffect, useRef, useState } from "react";
import { useTodos } from "../context/TodosContext";
import type { Priority, Todo } from "../types";

const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
};

function formatDue(dueDate: string) {
  const due = new Date(dueDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diffDays === 0) return { label: "Today", overdue: false };
  if (diffDays === 1) return { label: "Tomorrow", overdue: false };
  if (diffDays < 0) return { label: `${-diffDays}d overdue`, overdue: true };
  return {
    label: due.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    overdue: false,
  };
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const { toggleTodo, updateTodo, removeTodo } = useTodos();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.text) {
      updateTodo(todo.id, { text: trimmed });
    } else {
      setDraft(todo.text);
    }
    setEditing(false);
  };

  const due = todo.dueDate ? formatDue(todo.dueDate) : null;

  return (
    <li className={`todo-item ${todo.done ? "done" : ""}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.done}
        onChange={() => toggleTodo(todo.id)}
      />

      {editing ? (
        <input
          ref={inputRef}
          className="todo-edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") {
              setDraft(todo.text);
              setEditing(false);
            }
          }}
        />
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => setEditing(true)}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}

      {due && (
        <span className={`todo-due ${due.overdue ? "overdue" : ""}`}>
          {due.label}
        </span>
      )}

      <span className={`todo-priority ${todo.priority}`}>
        {PRIORITY_LABEL[todo.priority]}
      </span>

      <button
        className="todo-icon-btn"
        onClick={() => setEditing(true)}
        aria-label="Edit task"
        title="Edit"
      >
        ✎
      </button>
      <button
        className="todo-icon-btn delete"
        onClick={() => removeTodo(todo.id)}
        aria-label="Delete task"
        title="Delete"
      >
        ✕
      </button>
    </li>
  );
}
