import React from "react";
import { useNavigate } from "react-router-dom";
import "./dams.css";

const Dams = () => {
  const navigate = useNavigate();

  return (
    <div className="page dams-page">
      <header className="page-header">
        <h2>Dam Monitoring</h2>
        <button onClick={() => navigate("/")}>⬅ Back</button>
      </header>

      <div className="dam-list">
        <div className="dam blue">
          <h3>Idukki Dam</h3>
          <p>89% Full</p>
        </div>

        <div className="dam orange">
          <h3>Mullaperiyar</h3>
          <p>92% Full</p>
        </div>
      </div>
    </div>
  );
};

export default Dams;
