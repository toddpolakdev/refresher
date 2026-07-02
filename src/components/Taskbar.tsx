"use client";

import type { ReactNode } from "react";

export type TaskbarItem = {
  id: string;
  title: string;
  active: boolean;
  minimized: boolean;
};

export default function Taskbar({
  items,
  onItemClick,
  children,
}: {
  items: TaskbarItem[];
  onItemClick: (id: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="taskbar">
      <div className="taskbar-apps">
        {items.length === 0 && (
          <span className="taskbar-hint">No open windows</span>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            className={`taskbar-icon ${item.active ? "active" : ""} ${
              item.minimized ? "minimized" : ""
            }`}
            onClick={() => onItemClick(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="taskbar-clock">{children}</div>
    </div>
  );
}
