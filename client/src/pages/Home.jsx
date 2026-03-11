/*
PROJECT CONTEXT:
This is a React frontend for a Natural Disaster Risk Analyzer (Suraksha Keralam 2.0).
Tech stack: React (Vite or CRA), CSS modules, no backend yet (demo mode).

GOAL:
Enhance the Home page with realistic demo functionality using mock data,
structured so that it can later be replaced by a real database/API.

REQUIREMENTS:

1. SEARCH BAR WITH AUTOCOMPLETE
- Create a search input for districts/places in Kerala.
- Show dropdown suggestions while typing (case-insensitive).
- Suggestions must come from a local array in src/data/places.js.
- On selecting a place:
  - Close dropdown
  - Load demo data for that place
  - Update all UI sections below

2. DEMO DATA HANDLING
- Import getPlaceData(place) from src/services/dataService.js
- Demo data includes:
  - historical disaster data (floods, landslides, cyclones, earthquakes)
  - current safety alerts
  - risk score (0–100) and risk level (LOW/MODERATE/HIGH)
  - shelter count
  - helpline numbers
  - SOS availability
  - map coordinates (lat, lng)

3. ACTIVE LAYERS PANEL
- Show buttons/toggles for:
  - Historical Data
  - Flood Zones
  - Landslide Zones
- Enable layers only after a place is selected
- Maintain active layer state (boolean)

4. MAP SECTION (PLACEHOLDER)
- Use a div placeholder (no real map yet)
- When place is selected:
  - Display "Viewing risk map for <PLACE>"
  - Display coordinates from demo data
- Structure code so real map (Leaflet/Mapbox) can be added later

5. SAFETY ALERTS PANEL
- Show:
  - "No active alerts" if none
  - List of alerts if available
- Highlight alerts in warning colors

6. RISK LEVEL & SCORE
- Display risk score numerically
- Display risk level badge
- Color code:
  - LOW → green
  - MODERATE → yellow
  - HIGH → red

7. RESCUE & EMERGENCY RESOURCES
- Show:
  - Number of rescue teams
  - Medical units
  - Emergency helpline numbers
- Add a visible SOS button
- Disable SOS if sosAvailable is false

8. SHELTER AVAILABILITY
- Display number of available shelters
- Placeholder text: "Nearest shelters will be shown here"

9. STATE MANAGEMENT
- Use React useState and useEffect
- States required:
  - searchQuery
  - suggestions
  - selectedPlace
  - placeData
  - activeLayers

10. UX RULES
- Show empty placeholders before search
- Do not crash if data is null
- Keep logic clean and modular
- Comment code clearly for future backend integration

OUTPUT EXPECTATION:
- Generate complete Home.jsx logic
- Minimal JSX styling hooks (className only)
- No external APIs
- Ready for database integration later

Start implementing now.
*/

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { getPlaceData } from "../services/dataService";
import { PLACES } from "../data/places";
import SOSButton from "../components/SOSButton";
import SOSModal from "../components/SOSModal";
import "./Home.css";

// Fix leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Shelter Icon Definition
const shelterIcon = L.divIcon({
  html: '<div style="font-size: 24px;">🏠</div>',
  className: 'shelter-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

const Home = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // 🔍 SEARCH & AUTOCOMPLETE
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 📍 SELECTED PLACE & DATA
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🎛️ ACTIVE LAYERS
  const [activeLayers, setActiveLayers] = useState({
    historicalData: false,
    floodZones: false,
    landslideZones: false,
    damLocations: false,
  });

  // 🆘 SOS MODAL STATE
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // 🎨 UI STATE
  const [language, setLanguage] = useState("EN");
  const [liteMode, setLiteMode] = useState(false);

  // 🔍 AUTOCOMPLETE: Filter suggestions
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setHighlightedIndex(-1);

    if (query.trim().length > 0) {
      const filtered = PLACES.filter((place) =>
        place.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 🔍 SHOW ALL SUGGESTIONS ON FOCUS
  const handleSearchFocus = () => {
    setShowSuggestions(true);
    if (searchQuery.trim().length === 0) {
      // If search box is empty, show all places
      setSuggestions(PLACES.slice(0, 8));
    } else {
      // If there's a query, show filtered suggestions
      const filtered = PLACES.filter((place) =>
        place.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
    }
  };

  // ⌨️ KEYBOARD NAVIGATION
  const handleSearchKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectPlace(suggestions[highlightedIndex]);
        } else if (suggestions.length > 0) {
          handleSelectPlace(suggestions[0]);
        } else if (searchQuery.trim()) {
          handleSelectPlace(searchQuery.trim());
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  // ✅ SELECT SUGGESTION: Load data
  const handleSelectPlace = async (place) => {
    setSearchQuery(place);
    setShowSuggestions(false);
    setSelectedPlace(place);
    setLoading(true);
    setHighlightedIndex(-1);

    try {
      // 🔄 Fetch demo data
      const data = getPlaceData(place);

      if (data) {
        setPlaceData(data);
        // Reset layers
        setActiveLayers({
          historicalData: false,
          floodZones: false,
          landslideZones: false,
          damLocations: false,
        });
      } else {
        alert("No data found for this location");
        setPlaceData(null);
        setSelectedPlace(null);
      }
    } catch (err) {
      console.error("Error loading place data:", err);
      alert("Failed to load location data");
      setPlaceData(null);
      setSelectedPlace(null);
    } finally {
      setLoading(false);
    }
  };

  // ❌ CLOSE SUGGESTIONS ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎛️ TOGGLE LAYER
  const toggleLayer = (layerName) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  // 🆘 SOS HANDLER
  const handleSOS = () => {
    if (placeData?.resources?.sosAvailable !== false) {
      setShowSOSModal(true);
    }
  };

  // 🎨 RISK COLOR & STYLING
  const getRiskColor = (riskLevel) => {
    const colorMap = {
      LOW: { bg: "#10b981", text: "#ffffff" },
      MODERATE: { bg: "#f59e0b", text: "#ffffff" },
      HIGH: { bg: "#ef4444", text: "#ffffff" },
    };
    return colorMap[riskLevel] || { bg: "#6b7280", text: "#ffffff" };
  };

  const getSeverityBadge = (severity) => {
    const badgeMap = {
      LOW: { bg: "#d1fae5", color: "#065f46", label: "🟢 Low" },
      MEDIUM: { bg: "#fef3c7", color: "#92400e", label: "🟡 Medium" },
      HIGH: { bg: "#fee2e2", color: "#991b1b", label: "🔴 High" },
    };
    return badgeMap[severity] || badgeMap.LOW;
  };

  return (
    <div className="dashboard">
      {/* SOS BUTTON - Must be first in render */}
      <SOSButton
        onClick={() => {
          if (placeData) {
            setIsSOSOpen(true);
          } else {
            alert("Please search a location first to use SOS");
          }
        }}
        disabled={!placeData}
      />

      {/* SOS MODAL */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        selectedPlace={selectedPlace}
        placeData={placeData}
      />

      {/* ═══ TOP BAR ═══ */}
      <div className="topbar">
        <div className="title-section">
          <h1 className="title">🛡️ DISASTER LENS</h1>
          <p className="subtitle">Natural Disaster Risk Analyzer</p>
        </div>

        <div className="status-section">
          <div className="status-badge online">
            <span className="dot"></span>
            System Status: Optimal
          </div>
        </div>

        <div className="top-actions">
          <button
            className="lang-btn"
            onClick={() => setLanguage(language === "EN" ? "ML" : "EN")}
            title="Toggle Language"
          >
            {language === "EN" ? "English" : "മലയാളം"}
          </button>

          <div
            className={`toggle-mode ${liteMode ? "lite" : "full"}`}
            onClick={() => setLiteMode(!liteMode)}
          >
            <span>{liteMode ? "LITE MODE" : "FULL MODE"}</span>
            <div className="switch">{liteMode ? "📡 2G" : "🚀 5G"}</div>
          </div>
        </div>
      </div>

      {/* ═══ SEARCH BAR WITH AUTOCOMPLETE ═══ */}
      <div className="search-wrapper">
        <div className="search-container" ref={searchInputRef}>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={handleSearchFocus}
              className="search-input"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className="clear-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                ✕
              </button>
            )}
            <button
              className="search-btn"
              onClick={() =>
                searchQuery && handleSelectPlace(searchQuery.trim())
              }
              disabled={loading}
            >
              {loading ? "⏳ Loading..." : "Search"}
            </button>
          </div>

          {/* 🔽 AUTOCOMPLETE DROPDOWN */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((place, idx) => (
                <div
                  key={idx}
                  className={`suggestion-item ${idx === highlightedIndex ? "highlighted" : ""
                    }`}
                  onClick={() => handleSelectPlace(place)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  <span className="icon">📍</span>
                  <span className="text">{place}</span>
                  <span className="arrow">→</span>
                </div>
              ))}
            </div>
          )}

          {showSuggestions &&
            searchQuery &&
            suggestions.length === 0 && (
              <div className="suggestions-dropdown no-results">
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="content">
        {/* LEFT PANEL: ACTIVE LAYERS */}
        <div className="panel left">
          <div className="panel-header">
            <h3>🎛️ Active Layers</h3>
            {selectedPlace && (
              <span className="selected-badge">{selectedPlace}</span>
            )}
          </div>

          {selectedPlace ? (
            <div className="layers-group">
              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={activeLayers.historicalData}
                  onChange={() => toggleLayer("historicalData")}
                />
                <span className="toggle-label">
                  <span className="icon">📊</span>
                  <span>Historical Data</span>
                </span>
                {activeLayers.historicalData && (
                  <span className="active-badge">Active</span>
                )}
              </label>

              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={activeLayers.floodZones}
                  onChange={() => toggleLayer("floodZones")}
                />
                <span className="toggle-label">
                  <span className="icon">💧</span>
                  <span>Flood Zones</span>
                </span>
                {activeLayers.floodZones && (
                  <span className="active-badge">Active</span>
                )}
              </label>

              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={activeLayers.landslideZones}
                  onChange={() => toggleLayer("landslideZones")}
                />
                <span className="toggle-label">
                  <span className="icon">⛰️</span>
                  <span>Landslide Zones</span>
                </span>
                {activeLayers.landslideZones && (
                  <span className="active-badge">Active</span>
                )}
              </label>

              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={activeLayers.damLocations}
                  onChange={() => toggleLayer("damLocations")}
                />
                <span className="toggle-label">
                  <span className="icon">🏗️</span>
                  <span>Dam Locations</span>
                </span>
                {activeLayers.damLocations && (
                  <span className="active-badge">Active</span>
                )}
              </label>

              <hr />

              {placeData && (
                <div className="layers-summary">
                  <h4>Quick Stats</h4>
                  <div className="stat-item">
                    <span>🚒 Rescue Teams:</span>
                    <strong>{placeData.resources.rescueTeams}</strong>
                  </div>
                  <div className="stat-item">
                    <span>🏥 Medical Units:</span>
                    <strong>{placeData.resources.medicalUnits}</strong>
                  </div>
                  <div className="stat-item">
                    <span>🏠 Shelters:</span>
                    <strong>{placeData.shelters.length}</strong>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="placeholder-text">
              🔍 Search a location to activate layers
            </p>
          )}

          <button
            className="history-btn"
            onClick={() =>
              navigate("/history", { state: { selectedPlace, placeData } })
            }
          >
            📜 View Full History
          </button>
        </div>

        {/* CENTER PANEL: MAP */}
        <div className="panel map-panel">
          {placeData ? (
            <div className="map-wrapper">
              <div className="map-header">
                <h4>Risk Map - {selectedPlace}</h4>
                <p className="coordinates">
                  📍 Lat: {placeData.coordinates.lat.toFixed(4)}, Lng:{" "}
                  {placeData.coordinates.lng.toFixed(4)}
                </p>
              </div>
              <MapContainer
                center={[
                  placeData.coordinates.lat,
                  placeData.coordinates.lng,
                ]}
                zoom={11}
                scrollWheelZoom={true}
                className="leaflet-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    placeData.coordinates.lat,
                    placeData.coordinates.lng,
                  ]}
                >
                  <Popup>
                    <div className="popup-content">
                      <strong>{selectedPlace}</strong>
                      <p>Risk Level: {placeData.riskLevel}</p>
                      <p>Risk Score: {placeData.riskScore}/100</p>
                    </div>
                  </Popup>
                </Marker>

                {/* RISK ZONE CIRCLE */}
                {placeData && (
                  (() => {
                    const level = placeData.riskLevel || "LOW";
                    // Risk circle colors (swapped): HIGH -> green, MODERATE -> orange, LOW -> yellow
                    let color = level === "HIGH" ? "#00c853" : level === "MODERATE" ? "#ff9f0a" : "#ffd60a";
                    // radius scales with risk score (meters)
                    const score = placeData.riskScore || 40;
                    const riskRadius = Math.max(2000, Math.min(20000, score * 200));
                    const shelterRadius = 4000; // shelter coverage radius (meters)

                    // Special-case overrides for two specific locations (only these two change colors)
                    const specialPlaces = ["shangumugham", "murinjapalam"];
                    const isSpecial = selectedPlace && specialPlaces.includes(selectedPlace.toLowerCase());

                    // If special: change "yellow" (MODERATE/LOW) -> green, and change shelter red -> yellow
                    if (isSpecial) {
                      // If level maps to a yellow/orange color, promote to green
                      // Use green for the overall risk zone and yellow for shelter coverage
                      color = "#00c853"; // green for overall risk zone
                    }

                    // Default shelter colors (red border, light red fill)
                    let shelterBorder = "#ff3b30";
                    let shelterFill = "#ffd6d6";

                    if (isSpecial) {
                      shelterBorder = "#ffd60a"; // yellow border
                      shelterFill = "#fff8cc"; // light yellow fill
                    }

                    return (
                      <>
                        <Circle
                          center={[placeData.coordinates.lat, placeData.coordinates.lng]}
                          radius={riskRadius}
                          pathOptions={{ color, fillColor: color, fillOpacity: 0.22, weight: 3 }}
                        >
                          <Popup>
                            <b>Overall Risk Zone</b>
                            <br />Level: {level}
                            <br />Radius: {Math.round(riskRadius)} m
                          </Popup>
                        </Circle>

                        {/* Shelters coverage zone */}
                        <Circle
                          center={[placeData.coordinates.lat, placeData.coordinates.lng]}
                          radius={shelterRadius}
                          pathOptions={{ color: shelterBorder, fillColor: shelterFill, fillOpacity: 0.12, weight: 2 }}
                        >
                          <Popup>
                            <b>Shelter Coverage Zone</b>
                            <br />Shelters within {Math.round(shelterRadius)} m are shown
                          </Popup>
                        </Circle>

                        {/* Shelter markers inside green zone */}
                        {placeData.shelters && placeData.shelters.length > 0 &&
                          placeData.shelters.map((shelter, idx) => {
                            if (!shelter.coordinates) return null;
                            // compute distance in meters between center and shelter
                            const toRad = (v) => (v * Math.PI) / 180;
                            const lat1 = placeData.coordinates.lat;
                            const lon1 = placeData.coordinates.lng;
                            const lat2 = shelter.coordinates.lat;
                            const lon2 = shelter.coordinates.lng;
                            const R = 6371000; // meters
                            const dLat = toRad(lat2 - lat1);
                            const dLon = toRad(lon2 - lon1);
                            const a =
                              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                              Math.sin(dLon / 2) * Math.sin(dLon / 2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            const distance = R * c;

                            if (distance <= shelterRadius) {
                              const shelterMarkerIcon = L.divIcon({
                                html: `
                                  <div style="
                                    background-color: #10b981;
                                    color: white;
                                    border-radius: 50%;
                                    width: 40px;
                                    height: 40px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 20px;
                                    border: 3px solid #059669;
                                    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.6);
                                  ">
                                    🏠
                                  </div>
                                `,
                                iconSize: [40, 40],
                                className: "shelter-marker"
                              });

                              return (
                                <Marker key={idx} position={[shelter.coordinates.lat, shelter.coordinates.lng]} icon={shelterMarkerIcon}>
                                  <Popup>
                                    <strong style={{ color: '#065f46' }}>🏠 {shelter.name}</strong>
                                    <br />
                                    <span style={{ color: '#047857' }}>Capacity: {shelter.capacity}%</span>
                                  </Popup>
                                </Marker>
                              );
                            }
                            return null;
                          })}

                        {/* Static Marker for Peringamala */}
                        {selectedPlace === "Peringamala" && (() => {
                          const greenShelterIcon = L.divIcon({
                            html: `
                              <div style="
                                background-color: #10b981;
                                color: white;
                                border-radius: 50%;
                                width: 40px;
                                height: 40px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                                border: 3px solid #059669;
                                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.6);
                              ">
                                🏠
                              </div>
                            `,
                            iconSize: [40, 40],
                            className: "shelter-marker"
                          });
                          return (
                            <Marker position={[8.672222, 77.083812]} icon={greenShelterIcon}>
                              <Popup>
                                <strong style={{ color: '#065f46' }}>🏠 Government Upper Primary School (GUPS) Vithura</strong>
                                <br />
                                <span style={{ color: '#047857' }}>Emergency Shelter</span>
                              </Popup>
                            </Marker>
                          );
                        })()}

                        {/* Static Marker for Amboori */}
                        {selectedPlace === "Amboori" && (() => {
                          const greenShelterIcon = L.divIcon({
                            html: `
                              <div style="
                                background-color: #10b981;
                                color: white;
                                border-radius: 50%;
                                width: 40px;
                                height: 40px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                                border: 3px solid #059669;
                                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.6);
                              ">
                                🏠
                              </div>
                            `,
                            iconSize: [40, 40],
                            className: "shelter-marker"
                          });
                          return (
                            <Marker position={[8.5618, 77.0566]} icon={greenShelterIcon}>
                              <Popup>
                                <strong style={{ color: '#065f46' }}>🏠 Govt lp school kattakkada</strong>
                                <br />
                                <span style={{ color: '#047857' }}>Emergency Shelter</span>
                              </Popup>
                            </Marker>
                          );
                        })()}
                        </>
                      );
                    })()
                  )}
              </MapContainer>

              {/* LAYER INDICATORS ON MAP */}
              <div className="map-layers-indicator">
                {activeLayers.historicalData && (
                  <div className="layer-badge historical">📊 Historical</div>
                )}
                {activeLayers.floodZones && (
                  <div className="layer-badge flood">💧 Flood</div>
                )}
                {activeLayers.landslideZones && (
                  <div className="layer-badge landslide">⛰️ Landslide</div>
                )}
                {activeLayers.damLocations && (
                  <div className="layer-badge dam">🏗️ Dams</div>
                )}
              </div>
            </div>
          ) : (
            <div className="map-placeholder">
              <span className="hotspot">🔴 HOTSPOT MAP</span>
              <p>Search a location to view interactive risk map</p>
              <p className="hint">
                Use keyboard navigation (Arrow keys + Enter) in search
              </p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: SAFETY ALERTS */}
        <div className="panel alert-panel">
          <h3>⚠️ Safety Alerts</h3>

          {placeData && placeData.alerts.length > 0 ? (
            <div className="alerts-list">
              {placeData.alerts.map((alert, idx) => {
                const severity = alert.severity || "MEDIUM";
                const badge = getSeverityBadge(severity);
                return (
                  <div key={idx} className="alert-item">
                    <div
                      className="alert-severity"
                      style={{ backgroundColor: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </div>
                    <div className="alert-content">
                      <p className="alert-message">{alert.message}</p>
                      <p className="alert-time">
                        📅 {alert.timestamp || "Just now"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-alerts">
              <span className="icon">✅</span>
              <p>All Clear - No active alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ BOTTOM CARDS ═══ */}
      <div className="bottom-cards">
        {/* RISK LEVEL CARD */}
        <div className="card risk-card">
          <h4>📊 Risk Level Assessment</h4>

          {placeData ? (
            <div className="risk-content">
              <div
                className="risk-level-badge"
                style={getRiskColor(placeData.riskLevel)}
              >
                {placeData.riskLevel}
              </div>

              <div className="risk-bar-wrapper">
                <div className="risk-bar">
                  <div
                    className={`risk-progress ${placeData.riskLevel.toLowerCase()}`}
                    style={{ width: `${placeData.riskScore}%` }}
                  ></div>
                </div>
                <p className="risk-score-text">
                  Score: <strong>{placeData.riskScore}/100</strong>
                </p>
              </div>

              <p className="risk-recommendation">
                {placeData.riskLevel === "HIGH"
                  ? "⚠️ High risk zone - Stay alert and follow authority guidelines"
                  : placeData.riskLevel === "MODERATE"
                    ? "⚡ Moderate risk - Prepare emergency kit and know evacuation routes"
                    : "✅ Low risk zone - Regular safety checks recommended"}
              </p>
            </div>
          ) : (
            <p className="placeholder-text">—</p>
          )}
        </div>

        {/* EMERGENCY RESOURCES */}
        <div className="card resources-card">
          <h4>🚨 Emergency Resources</h4>

          {placeData && placeData.resources ? (
            <div className="resources-content">
              <div className="resource-box">
                <span className="resource-icon">🚒</span>
                <div className="resource-info">
                  <p className="resource-label">Rescue Teams</p>
                  <p className="resource-value">
                    {placeData.resources.rescueTeams || "N/A"}
                  </p>
                </div>
              </div>

              <div className="resource-box">
                <span className="resource-icon">🏥</span>
                <div className="resource-info">
                  <p className="resource-label">Medical Units</p>
                  <p className="resource-value">
                    {placeData.resources.medicalUnits || "N/A"}
                  </p>
                </div>
              </div>

              <div className="helpline-section">
                <p className="helpline-title">📞 Emergency Helplines</p>
                <div className="helpline-list">
                  {placeData.resources.helplines &&
                    placeData.resources.helplines.length > 0 ? (
                    placeData.resources.helplines.map((num, idx) => (
                      <a
                        key={idx}
                        href={`tel:${num}`}
                        className="helpline-btn"
                        title={`Call ${num}`}
                      >
                        <span className="icon">📱</span>
                        <span className="number">{num}</span>
                        <span className="call-icon">→</span>
                      </a>
                    ))
                  ) : (
                    <p className="placeholder-text">No helplines available</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="placeholder-text">
              Search a location to view resources
            </p>
          )}
        </div>

        {/* SHELTER AVAILABILITY */}
        <div className="card shelter-card">
          <h4>🏠 Shelter Availability</h4>

          {placeData && placeData.shelters ? (
            <div className="shelter-content">
              <div className="shelter-count-box" style={{ backgroundColor: '#d1fae5', borderLeft: '4px solid #10b981' }}>
                <span className="count" style={{ color: '#065f46' }}>{placeData.shelters.length || 0}</span>
                <span className="text" style={{ color: '#047857' }}>shelters available</span>
              </div>

              {placeData.shelters && placeData.shelters.length > 0 ? (
                <div className="shelters-list" style={{ backgroundColor: '#f0fdf4', border: '2px solid #10b981', borderRadius: '8px', padding: '12px' }}>
                  {placeData.shelters.map((shelter, idx) => (
                    <div key={idx} className="shelter-item" style={{ backgroundColor: '#fff', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '10px', marginBottom: '8px' }}>
                      <div className="shelter-header">
                        <p className="shelter-name">
                          <strong style={{ color: '#065f46' }}>📍 {shelter.name}</strong>
                        </p>
                        <span
                          className={`capacity-badge ${parseInt(shelter.capacity) < 50 ? "low" : "ok"}`}
                          style={{ backgroundColor: '#dbeafe', color: '#0c4a6e', padding: '4px 8px', borderRadius: '4px' }}
                        >
                          {shelter.capacity}% Full
                        </span>
                      </div>
                      <div className="capacity-bar">
                        <div
                          className="capacity-fill"
                          style={{ width: parseInt(shelter.capacity) + '%', backgroundColor: '#10b981', height: '6px', borderRadius: '3px' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="placeholder-text">
                  Nearest shelters will be shown here
                </p>
              )}
            </div>
          ) : (
            <p className="placeholder-text">
              Nearest shelters will be shown here
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
