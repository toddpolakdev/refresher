import React from "react";

interface Props {
  todo: {
    id: number;
    text: string;
    done: boolean;
  };
  toggleDone: (id: number) => void;
}

const TodoItem: React.FC<Props> = ({ todo, toggleDone }) => {
  return (
    <li
      onClick={() => toggleDone(todo.id)}
      style={{
        textDecoration: todo.done ? "line-through" : "none",
        cursor: "pointer",
        marginBottom: "0.5rem",
      }}>
      {todo.text}
    </li>
  );
};

export default TodoItem;
