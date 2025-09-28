"use client";
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
}

export default function Modal({ children, onClose, title }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{title}</span>
          <button className="modal-close-btn" onClick={onClose}>
            ✖
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
