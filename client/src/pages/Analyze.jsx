import React from "react";
import { useNavigate } from "react-router-dom";
import "./analyze.css";

const Analyze = () => {
  const navigate = useNavigate();

  return (
    <div className="page analyze-page">
      <header className="page-header">
        <h2>Hyper-Local Analyzer</h2>
        <button onClick={() => navigate("/")}>⬅ Back</button>
      </header>

      <div className="analyze-grid">
        <div className="metric">
          <h4>Rainfall</h4>
          <p>5.3 mm/hr</p>
        </div>

        <div className="metric">
          <h4>Soil Saturation</h4>
          <p>68%</p>
        </div>

        <div className="metric">
          <h4>Risk Index</h4>
          <p className="danger">HIGH</p>
        </div>
      </div>

      <button className="analyze-btn">Run Full Analysis</button>
    </div>
  );
};

export default Analyze;
