function Display({ display, error, operation, previousValue, angleMode }) {
  return (
    <div className="display-container">
      <div className="mode-indicator">{angleMode?.toUpperCase()}</div>
      {previousValue !== null && operation && (
        <div className="previous-calculation">
          {previousValue}{" "}
          {operation === "*" ? "×" : operation === "power" ? "^" : operation}
        </div>
      )}
      <div className={`display ${error ? "error" : ""}`}>{display}</div>
    </div>
  );
}

export default Display;
