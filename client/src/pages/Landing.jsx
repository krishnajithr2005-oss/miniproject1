import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">RISK ANALYZER</h2>

        <ul className="nav-links">
          <li>Home</li>
          <li>Features</li>
          <li>Risk Analysis</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <button className="nav-btn" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Natural <br />
            Disaster Risk Analyzer
          </h1>

          <p>
            Analyze flood, earthquake, cyclone and landslide risks using
            AI-powered insights, interactive dashboards and real-time maps for
            better disaster preparedness.
          </p>

          <button className="hero-btn" onClick={() => navigate("/login")}>
            Start Risk Analysis
          </button>
        </div>

        {/* DASHBOARD MOCKUP */}
        <div className="hero-image">
          <div className="glass-frame">
            <img
              src="https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?q=80&w=1000"
              alt="dashboard"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          🌊
          <h3>Flood Risk</h3>
          <p>Identify flood-prone regions and severity levels.</p>
        </div>

        <div className="feature-card">
          🌎
          <h3>Earthquake Zones</h3>
          <p>Analyze seismic vulnerability by region.</p>
        </div>

        <div className="feature-card">
          🌪️
          <h3>Cyclone Alerts</h3>
          <p>Monitor cyclone intensity and coastal risks.</p>
        </div>

        <div className="feature-card">
          ⛰️
          <h3>Landslide Areas</h3>
          <p>Detect terrain-based landslide risks.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
