import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* Fix marker icon issue */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const RiskMap = ({ position, riskLevel, district }) => {
  // Default location (India center)
  const centerPosition = position || [20.5937, 78.9629];

  // Risk-based color logic
  const getRiskColor = () => {
    if (riskLevel === "HIGH") return "red";
    if (riskLevel === "MEDIUM") return "yellow";
    if (riskLevel === "LOW") return "green";
    return "blue";
  };

  const getZoomLevel = () => {
    if (riskLevel === "HIGH") return 7;
    if (riskLevel === "MEDIUM") return 6;
    return 5;
  };

  return (
    <MapContainer
      center={centerPosition}
      zoom={getZoomLevel()}
      style={{ height: "100%", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Risk Area Circle */}
      {riskLevel && (
        <Circle
          center={centerPosition}
          radius={30000}
          pathOptions={{
            color: getRiskColor(),
            fillColor: getRiskColor(),
            fillOpacity: 0.4,
          }}
        />
      )}

      {/* Marker */}
      <Marker position={centerPosition}>
        <Popup>
          <strong>District:</strong> {district || "Selected Area"} <br />
          <strong>Risk Level:</strong> {riskLevel || "Not Analyzed"} <br />
          <strong>Status:</strong>{" "}
          {riskLevel === "HIGH" && "🔴 High Risk Zone"}
          {riskLevel === "MEDIUM" && "🟡 Medium Risk Zone"}
          {riskLevel === "LOW" && "🟢 Low Risk Zone"}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default RiskMap;
