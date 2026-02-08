import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

const Map = ({ analysis, layers }) => {
  // 🛑 Safety guard
  if (!analysis || !analysis.center) return null;

  const center = analysis.center; // [lat, lng]

  // 🔒 Helper: layer must be enabled by USER + allowed by BACKEND
  const isLayerActive = (layerName) =>
    layers?.[layerName] && analysis.activeLayers?.[layerName];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer center={center} zoom={9} style={{ height: "100%" }}>
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 MAIN LOCATION MARKER */}
        <Marker position={center}>
          <Popup>
            <b>{analysis.place}</b><br />
            Risk Level: {analysis.risk.level}<br />
            Risk Score: {analysis.risk.score}
          </Popup>
        </Marker>

        {/* 🔴 OVERALL RISK ZONE */}
        <Circle
          center={center}
          radius={8000}
          pathOptions={{
            color: analysis.risk.color,
            fillColor: analysis.risk.color,
            fillOpacity: 0.35,
          }}
        >
          <Popup>
            <b>Overall Risk Zone</b><br />
            Level: {analysis.risk.level}<br />
            Score: {analysis.risk.score}
          </Popup>
        </Circle>

        {/* 🌊 FLOOD RISK */}
        {isLayerActive("flood") && (
          <Circle
            center={center}
            radius={12000}
            pathOptions={{
              color: "#0066ff",
              fillOpacity: 0.25,
            }}
          >
            <Popup>
              <b>Flood Risk Area</b><br />
              Reason: Heavy rainfall & river overflow
            </Popup>
          </Circle>
        )}

        {/* ⛰️ LANDSLIDE RISK */}
        {isLayerActive("landslide") && (
          <Circle
            center={center}
            radius={6000}
            pathOptions={{
              color: "#8b4513",
              fillOpacity: 0.3,
            }}
          >
            <Popup>
              <b>Landslide Prone Zone</b><br />
              Reason: Hilly terrain & soil saturation
            </Popup>
          </Circle>
        )}

        {/* 🌊 COASTAL RISK (ONLY IF BACKEND ENABLES IT) */}
        {isLayerActive("coastal") && (
          <Circle
            center={center}
            radius={15000}
            pathOptions={{
              color: "#00cfcf",
              fillOpacity: 0.2,
            }}
          >
            <Popup>
              <b>Coastal Risk Zone</b><br />
              Reason: Storm surge / sea level rise
            </Popup>
          </Circle>
        )}

        {/* 🚧 DAM IMPACT ZONE */}
        {isLayerActive("dam") && (
          <Circle
            center={center}
            radius={10000}
            pathOptions={{
              color: "#555555",
              fillOpacity: 0.25,
            }}
          >
            <Popup>
              <b>Dam Impact Area</b><br />
              Reason: Emergency water release
            </Popup>
          </Circle>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
