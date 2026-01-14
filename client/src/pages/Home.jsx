import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RiskMap from "../components/RiskMap";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* Top Bar */}
      <header className="topbar">
        <h2>RISK ANALYZER</h2>
        <div className="top-actions">
          <span className="status">🟢 Live Feed Active</span>
          <button className="sos">🚨 Emergency SOS</button>
          <button onClick={handleLogout} className="logout">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main">
        {/* Left Panel */}
        <div className="panel left">
          <h3>Analyze New District</h3>
          <input type="text" placeholder="District Name" />
          <input type="text" placeholder="State" />
          <select>
            <option>Flood</option>
            <option>Earthquake</option>
            <option>Cyclone</option>
            <option>Landslide</option>
          </select>
          <button className="primary">Run Analysis</button>
        </div>

        {/* Center Panel (MAP) */}
        <div className="panel center">
          <h3>Risk Map</h3>
          <div className="map-box">
            <RiskMap />
          </div>
        </div>

        {/* Right Panel */}
        <div className="panel right">
          <h3>Global Risk Level</h3>
          <div className="risk-score">7.8 / 10</div>
          <p className="risk-text">High Risk</p>

          <div className="stat">
            <span>Vulnerability</span>
            <strong>Moderate</strong>
          </div>
          <div className="stat">
            <span>Infrastructure</span>
            <strong>Weak</strong>
          </div>
          <div className="stat">
            <span>Population</span>
            <strong>Dense</strong>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-actions">
        <button>Run Simulation</button>
        <button>Generate Report</button>
        <button>Emergency Resources</button>
        <button>Export Data</button>
      </footer>
    </div>
  );
};

export default Home;
