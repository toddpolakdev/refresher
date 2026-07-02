"use client";
import { ReactNode, useEffect, useRef, useState } from "react";

interface FloatingWindowProps {
  children: ReactNode;
  title?: string;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  minimized?: boolean;
  initialPosition?: { x: number; y: number };
}

export default function FloatingWindow({
  children,
  title,
  onClose,
  onMinimize,
  onFocus,
  zIndex = 1000,
  minimized = false,
  initialPosition = { x: 120, y: 120 },
}: FloatingWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    onFocus?.();
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      className="floating-window"
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        display: minimized ? "none" : "flex",
      }}
      onMouseDown={() => onFocus?.()}
    >
      <div className="floating-header" onMouseDown={onMouseDown}>
        <span>{title}</span>
        <div
          className="floating-controls"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {onMinimize && (
            <button onClick={onMinimize} aria-label="Minimize" title="Minimize">
              —
            </button>
          )}
          <button onClick={onClose} aria-label="Close" title="Close">
            ✖
          </button>
        </div>
      </div>

      <div className="floating-body">{children}</div>
    </div>
  );
}
