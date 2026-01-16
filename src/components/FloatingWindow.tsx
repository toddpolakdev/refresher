"use client";
import { ReactNode, useEffect, useRef, useState } from "react";

interface FloatingWindowProps {
  children: ReactNode;
  title?: string;
  onClose: () => void;
}

export default function FloatingWindow({
  children,
  title,
  onClose,
}: FloatingWindowProps) {
  const [position, setPosition] = useState({ x: 120, y: 120 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
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
      }}
    >
      <div className="floating-header" onMouseDown={onMouseDown}>
        <span>{title}</span>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="floating-body">{children}</div>
    </div>
  );
}
