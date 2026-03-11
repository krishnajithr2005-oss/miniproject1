import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix default marker icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Create custom house icon */
const createHouseIcon = () => {
  return L.divIcon({
    html: `<div style="font-size: 40px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🏠</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: "house-icon",
  });
};

/* Create custom red marker icon */
const createRedMarkerIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 50px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        pointer-events: auto;
      ">
        <div style="
          position: relative;
          width: 35px;
          height: 35px;
          background-color: #dc3545;
          border-radius: 50%;
          box-shadow: 0 3px 8px rgba(0,0,0,0.5);
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        ">📌</div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 45],
    popupAnchor: [0, -45],
    className: "red-marker",
  });
};

/* Map Event Handler Component */
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const PlaceableHouseMarker = ({ position, riskLevel, district }) => {
  // Default shelter location
  const defaultShelter = {
    id: "default-shelter",
    lat: 8.5618,
    lng: 77.0566,
    name: "Govt LP School Kattakada",
    isDefault: true,
  };
  
  // Center map at shelter location
  const centerPosition = position || [defaultShelter.lat, defaultShelter.lng];
  
  const [houseMarkers, setHouseMarkers] = useState([defaultShelter]);

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

  const handleMapClick = (latlng) => {
    const newMarker = {
      id: Date.now(),
      lat: latlng.lat,
      lng: latlng.lng,
    };
    setHouseMarkers([...houseMarkers, newMarker]);
  };

  const removeMarker = (id) => {
    // Don't allow removing the default shelter
    if (id === "default-shelter") return;
    setHouseMarkers(houseMarkers.filter((marker) => marker.id !== id));
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={centerPosition}
        zoom={getZoomLevel()}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Risk Area Circles - Green outer zone and Red inner zone */}
        {riskLevel && (
          <>
            {/* Green outer zone (30km radius) */}
            <Circle
              center={centerPosition}
              radius={30000}
              pathOptions={{
                color: "green",
                fillColor: "green",
                fillOpacity: 0.2,
              }}
            />
            {/* Red inner zone (15km radius) */}
            <Circle
              center={centerPosition}
              radius={15000}
              pathOptions={{
                color: "red",
                fillColor: "red",
                fillOpacity: 0.3,
              }}
            />
          </>
        )}

        {/* House Markers */}
        {houseMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={marker.isDefault ? createRedMarkerIcon() : createHouseIcon()}
          >
            <Popup>
              <div>
                <p>
                  <strong>
                    {marker.isDefault ? "📍 Shelter Location" : "🏠 House Location"}
                  </strong>
                </p>
                {marker.name && <p><strong>{marker.name}</strong></p>}
                <p>Lat: {marker.lat.toFixed(4)}</p>
                <p>Lng: {marker.lng.toFixed(4)}</p>
                {!marker.isDefault && (
                  <button
                    onClick={() => removeMarker(marker.id)}
                    style={{
                      backgroundColor: "#ff4444",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Click handler for adding new markers */}
        <MapClickHandler onMapClick={handleMapClick} />
      </MapContainer>

      {/* Info Box */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 100,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
          🏠 Houses Placed: {houseMarkers.length - 1}
        </p>
        <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
          Click on map to add house marker
        </p>
      </div>
    </div>
  );
};

export default PlaceableHouseMarker;
