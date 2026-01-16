import React from "react";

const Home: React.FC = () => {
  return (
    <section className="home">
      <div className="home-inner">
        {/* Text */}
        <div className="home-content">
          <h1 className="home-title">Your Personal Productivity Desktop</h1>

          <p className="home-subtitle">
            Calculator, notes, todos, and weather — all in one clean,
            distraction-free workspace.
          </p>

          {/* <div className="home-actions">
            <button className="primary-btn">Get Started</button>
            <button className="secondary-btn">View Features</button>
          </div> */}
        </div>

        {/* Illustration */}
        {/* <div className="home-visual">
          <img
            src="/images/desktop-illustration.png"
            alt="Productivity desktop illustration"
          />
        </div> */}
      </div>

      {/* Feature strip */}
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
