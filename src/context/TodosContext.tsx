"use client";

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { collection } from "../lib/store";
import type { Priority, Todo } from "../types";

const EMPTY_TODOS: Todo[] = [];

type AddOptions = { priority?: Priority; dueDate?: string };

type TodosContextValue = {
  todos: Todo[];
  addTodo: (text: string, opts?: AddOptions) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, patch: Partial<Todo>) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
};

const TodosContext = createContext<TodosContextValue | null>(null);

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useLocalStorage<Todo[]>("desktop-todos", EMPTY_TODOS);

  const addTodo = useCallback(
    (text: string, opts?: AddOptions) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: trimmed,
        done: false,
        priority: opts?.priority ?? "medium",
        dueDate: opts?.dueDate,
        createdAt: Date.now(),
      };
      setTodos((prev) => collection.create(prev, todo));
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
    },
    [setTodos]
  );

  const updateTodo = useCallback(
    (id: string, patch: Partial<Todo>) => {
      setTodos((prev) => collection.update(prev, id, patch));
    },
    [setTodos]
  );

  const removeTodo = useCallback(
    (id: string) => {
      setTodos((prev) => collection.remove(prev, id));
    },
    [setTodos]
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.done));
  }, [setTodos]);

  return (
    <TodosContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        updateTodo,
        removeTodo,
        clearCompleted,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error("useTodos must be used within a TodosProvider");
  return ctx;
}
