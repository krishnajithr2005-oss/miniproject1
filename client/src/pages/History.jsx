import React from "react";
import { useNavigate } from "react-router-dom";
import "./history.css";

const History = () => {
  const navigate = useNavigate();

  return (
    <div className="page history-page">
      <header className="page-header">
        <h2>Historical Disaster Data</h2>
        <button onClick={() => navigate("/")}>⬅ Back</button>
      </header>

      <ul className="history-list">
        <li>🌧️ 2018 Flood – Severe</li>
        <li>⛰️ 2020 Landslide – Moderate</li>
        <li>🌊 2022 Coastal Erosion – Mild</li>
      </ul>
    </div>
  );
};

export default History;
