// Shared domain types for the productivity desktop.

export type Priority = "low" | "medium" | "high";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
  dueDate?: string; // ISO date string (yyyy-mm-dd)
  createdAt: number;
};

export type Note = {
  id: string;
  title: string;
  text: string;
  color: string; // sticky-note background color
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Theme = "light" | "dark";
