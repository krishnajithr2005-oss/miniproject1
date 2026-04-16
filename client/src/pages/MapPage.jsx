import React from 'react';
import FloodZones from '../components/FloodZones';

export default function Map() {
  return (
    <main className="page-content">
      <div className="page-header">
        <h1>🗺️ District Risk Map</h1>
        <p>Real-time risk assessment for all districts</p>
      </div>
      <section className="dashboard-section">
        <FloodZones />
      </section>
      <section className="dashboard-section">
        <div className="map-placeholder">
          <div className="placeholder-content">
            <h3>Interactive Map View</h3>
            <p>📍 Real-time Flood Zone Mapping</p>
            <p style={{ fontSize: '3rem', marginTop: '20px' }}>🗺️</p>
          </div>
        </div>
      </section>
    </main>
  );
}
