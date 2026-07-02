"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  // Render nothing on the server / first paint to avoid a hydration mismatch,
  // then start ticking once mounted on the client.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div className="clock" suppressHydrationWarning />;

  return (
    <div className="clock" suppressHydrationWarning>
      <span className="clock-time">
        {now.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      <span className="clock-date">
        {now.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </span>
    </div>
  );
}
