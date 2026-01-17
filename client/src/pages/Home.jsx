import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { locations } from "../data/locations";
import RiskMap from "../components/RiskMap";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // INPUT STATES
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("");
  const [disaster, setDisaster] = useState("Flood");

  // RESULT STATES
  const [riskLevel, setRiskLevel] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [mapPosition, setMapPosition] = useState(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ BACKEND CONNECTED ANALYSIS
  const runAnalysis = async () => {
    if (!district || !stateName) {
      alert("Please enter District and State");
      return;
    }

    const loc = locations[district.toLowerCase()];
    if (!loc) {
      alert("Location not found in database");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district: district,
          state: stateName,
          disaster: disaster,
        }),
      });

      const data = await response.json();

      setRiskLevel(data.riskLevel);
      setRiskScore(data.riskScore);
      setMapPosition([loc.lat, loc.lng]);
    } catch (error) {
      console.error(error);
      alert("Backend not reachable");
    }
  };

  return (
    <div className="dashboard">
      {/* TOP BAR */}
      <header className="topbar">
        <h2>RISK ANALYZER</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="main">
        {/* LEFT PANEL */}
        <div className="panel left">
          <h3>Analyze Area</h3>

          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />

          <input
            type="text"
            placeholder="State"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />

          <select value={disaster} onChange={(e) => setDisaster(e.target.value)}>
            <option>Flood</option>
            <option>Earthquake</option>
            <option>Cyclone</option>
            <option>Landslide</option>
          </select>

          <button onClick={runAnalysis}>Run Analysis</button>
        </div>

        {/* CENTER PANEL */}
        <div className="panel center">
          <h3>Risk Map</h3>
          <RiskMap
            position={mapPosition}
            riskLevel={riskLevel}
            district={district}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="panel right">
          <h3>Area Risk Information</h3>

          {riskLevel ? (
            <>
              <p><strong>District:</strong> {district}</p>
              <p><strong>State:</strong> {stateName}</p>
              <p><strong>Disaster:</strong> {disaster}</p>

              <p>
                <strong>Risk Level:</strong>{" "}
                {riskLevel === "HIGH" && "🔴 High"}
                {riskLevel === "MEDIUM" && "🟡 Medium"}
                {riskLevel === "LOW" && "🟢 Low"}
              </p>

              <p><strong>Risk Score:</strong> {riskScore} / 10</p>
            </>
          ) : (
            <p>Select an area and click Run Analysis</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
