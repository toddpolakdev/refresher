"use client";

import { useMemo, useState } from "react";
import { useTodos } from "../context/TodosContext";
import TodoItem from "./TodoItem";
import type { Priority } from "../types";

type Filter = "all" | "active" | "completed";

const FILTERS: Filter[] = ["all", "active", "completed"];

export default function Todo() {
  const { todos, addTodo, clearCompleted } = useTodos();
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const submit = () => {
    if (!input.trim()) return;
    addTodo(input, { priority, dueDate: dueDate || undefined });
    setInput("");
    setDueDate("");
  };

  const visible = useMemo(() => {
    const list =
      filter === "all"
        ? todos
        : todos.filter((t) => (filter === "active" ? !t.done : t.done));
    // Uncompleted first, then by priority weight, newest last.
    const weight: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    return [...list].sort(
      (a, b) =>
        Number(a.done) - Number(b.done) ||
        weight[a.priority] - weight[b.priority] ||
        a.createdAt - b.createdAt
    );
  }, [todos, filter]);

  const activeCount = todos.filter((t) => !t.done).length;
  const completedCount = todos.length - activeCount;

  return (
    <div className="todo-app">
      <div className="todo-add">
        <input
          className="todo-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add a task…"
        />
        <select
          className="todo-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          aria-label="Priority"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          className="todo-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
        />
        <button className="todo-add-btn" onClick={submit}>
          Add
        </button>
      </div>

      <div className="todo-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`todo-filter ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="todo-empty">
          {todos.length === 0
            ? "Nothing here yet — add your first task above."
            : "No tasks match this filter."}
        </p>
      ) : (
        <ul className="todo-list">
          {visible.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}

      <div className="todo-footer">
        <span>
          {activeCount} {activeCount === 1 ? "task" : "tasks"} left
        </span>
        <button
          className="todo-clear"
          onClick={clearCompleted}
          disabled={completedCount === 0}
        >
          Clear completed
        </button>
      </div>
    </div>
  );
}
