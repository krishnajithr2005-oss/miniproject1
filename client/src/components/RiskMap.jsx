import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* Fix default blue marker icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Custom House Icon Style */
const houseIcon = L.divIcon({
  html: '<div style="font-size: 30px; text-shadow: 0 0 5px white;">🏠</div>',
  className: 'custom-house-marker', 
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const RiskMap = ({ position, riskLevel, district }) => {
  // 1. Define all shelter locations here
  const shelters = [
    {
      id: "peringamala",
      name: "Government Upper Primary School (GUPS) Vithura",
      pos: [8.6500, 77.1000], // Peringamala area
      desc: "Emergency Shelter"
    },
    {
      id: "amboori",
      name: "Govt LP School Kattakkada",
      pos: [8.5618, 77.0566], // Amboori area
      desc: "Location: Amboori"
    }
  ];
  
  // Center map on Amboori by default, or the current risk position
  const centerPosition = position || [8.5618, 77.0566];

  const getRiskColor = () => {
    if (riskLevel === "HIGH") return "red";
    if (riskLevel === "MEDIUM") return "yellow";
    return "green"; 
  };

  return (
    <MapContainer
      center={centerPosition}
      zoom={11} // Zoomed out slightly to see both shelters at once
      style={{ height: "100%", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 2. THE GREEN ZONES (Risk Circles) */}
      {/* Circle for Amboori */}
      <Circle
        center={[8.5618, 77.0566]}
        radius={5000}
        pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
      />
      
      {/* Circle for Peringamala area */}
      <Circle
        center={[8.6500, 77.1000]}
        radius={5000}
        pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
      />

      {/* 3. RENDER ALL SHELTER ICONS */}
      {shelters.map((shelter) => (
        <Marker 
          key={shelter.id} 
          position={shelter.pos} 
          icon={houseIcon} 
          zIndexOffset={1000}
        >
          <Popup>
            <strong>🏠 {shelter.name}</strong><br />
            {shelter.desc}
          </Popup>
        </Marker>
      ))}

      {/* 4. THE RISK PIN (Blue Marker) */}
      {position && (
        <Marker position={position}>
          <Popup><strong>Current Selected Area:</strong> {district}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default RiskMap;