import React from "react";

const Home: React.FC = () => {
  return (
    <section className="home">
      <div className="home-inner">
        <h1 className="home-title">Your Personal Productivity Desktop</h1>
        <p className="home-subtitle">
          Calculator, notes, todos, and weather — all in one clean,
          distraction-free workspace. Launch anything from the sidebar.
        </p>
      </div>

      <div className="home-features">
        <div className="feature-card">🧮 Calculator</div>
        <div className="feature-card">📝 Notes</div>
        <div className="feature-card">✅ Todo List</div>
        <div className="feature-card">🌤 Weather</div>
      </div>
    </section>
  );
};

export default Home;
