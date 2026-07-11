import React from "react";

type HomeProps = {
  // Launch an app window by id. Wired to Desktop's window opener so the
  // feature cards double as launchers. Optional so Home still renders alone.
  onLaunch?: (id: string) => void;
};

const FEATURES: { id: string; icon: string; label: string; blurb: string }[] = [
  { id: "calculator", icon: "🧮", label: "Calculator", blurb: "Crunch numbers fast" },
  { id: "notes", icon: "📝", label: "Notes", blurb: "Jot it all down" },
  { id: "todo", icon: "✅", label: "Todo List", blurb: "Stay on track" },
  { id: "weather", icon: "🌤", label: "Weather", blurb: "Now & 5-day forecast" },
];

const Home: React.FC<HomeProps> = ({ onLaunch }) => {
  return (
    <section className="home">
      <div className="home-hero">
        <div className="home-logo" aria-hidden="true">
          <span className="home-logo-mark">PPD</span>
        </div>

        <span className="home-badge">
          <span className="home-badge-dot" />
          All your tools, one workspace
        </span>

        <h1 className="home-title">
          Personal Productivity
          <span className="home-title-accent">Desktop</span>
        </h1>

        <p className="home-subtitle">
          Calculator, notes, todos, and weather — all in one clean,
          distraction-free workspace. Launch anything from the sidebar, or jump
          straight in below.
        </p>
      </div>

      <div className="home-features">
        {FEATURES.map((f, i) => (
          <button
            key={f.id}
            type="button"
            className="feature-card"
            style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            onClick={() => onLaunch?.(f.id)}
          >
            <span className="feature-icon">{f.icon}</span>
            <span className="feature-label">{f.label}</span>
            <span className="feature-blurb">{f.blurb}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Home;
