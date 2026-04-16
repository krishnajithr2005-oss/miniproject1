import React from 'react';

const FLOOD_ZONES = [
  {
    id: 1,
    name: 'Wayanad',
    riskLevel: 'critical',
    rainfall: '125mm',
    status: 'Flood Alert Active',
  },
  {
    id: 2,
    name: 'Idukki',
    riskLevel: 'high',
    rainfall: '98mm',
    status: 'Monitor Closely',
  },
  {
    id: 3,
    name: 'Thrissur',
    riskLevel: 'medium',
    rainfall: '65mm',
    status: 'Alert',
  },
  {
    id: 4,
    name: 'Kottayam',
    riskLevel: 'medium',
    rainfall: '52mm',
    status: 'Alert',
  },
  {
    id: 5,
    name: 'Ernakulam',
    riskLevel: 'low',
    rainfall: '28mm',
    status: 'Safe',
  },
  {
    id: 6,
    name: 'Kannur',
    riskLevel: 'low',
    rainfall: '15mm',
    status: 'Safe',
  },
];

const getRiskColor = (level) => {
  const colors = {
    critical: '#dc2626',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
  };
  return colors[level] || '#999';
};

export default function FloodZones() {
  return (
    <div className="flood-zones">
      <h3>🌊 District Risk Assessment</h3>
      <div className="zones-grid">
        {FLOOD_ZONES.map((zone) => (
          <div key={zone.id} className={`zone-card zone-${zone.riskLevel}`}>
            <div className="zone-indicator" style={{ backgroundColor: getRiskColor(zone.riskLevel) }}></div>
            <div className="zone-content">
              <h4>{zone.name}</h4>
              <p className="zone-risk">
                Risk: <strong>{zone.riskLevel.toUpperCase()}</strong>
              </p>
              <p className="zone-rainfall">Rainfall: {zone.rainfall}</p>
              <p className="zone-status">{zone.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
