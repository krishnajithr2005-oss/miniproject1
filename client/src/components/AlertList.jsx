import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DUMMY_ALERTS = [
  {
    id: 1,
    type: 'Flood Warning',
    location: 'Wayanad',
    severity: 'high',
    time: '5 min ago',
    message: 'Heavy rainfall alert in Wayanad district',
  },
  {
    id: 2,
    type: 'Landslide Alert',
    location: 'Idukki',
    severity: 'critical',
    time: '12 min ago',
    message: 'Landslide warning issued for Idukki region',
  },
  {
    id: 3,
    type: 'Storm Warning',
    location: 'Kottayam',
    severity: 'medium',
    time: '25 min ago',
    message: 'Thunderstorm alert for Kottayam district',
  },
  {
    id: 4,
    type: 'Evacuation Order',
    location: 'Thrissur',
    severity: 'high',
    time: '1 hour ago',
    message: 'Evacuation orders in force for low-lying areas',
  },
];

export default function AlertList({ limit = null }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.log('Using dummy data for alerts');
      setAlerts(DUMMY_ALERTS);
    } finally {
      setLoading(false);
    }
  };

  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

  if (loading) return <div className="loading">Loading alerts...</div>;

  return (
    <div className="alert-list">
      {displayAlerts.length === 0 ? (
        <p className="no-data">No active alerts</p>
      ) : (
        displayAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert-item alert-${alert.severity}`}
          >
            <div className="alert-indicator"></div>
            <div className="alert-content">
              <div className="alert-header">
                <h3>{alert.type}</h3>
                <span className={`severity-badge ${alert.severity}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
              <p className="alert-location">📍 {alert.location}</p>
              <p className="alert-message">{alert.message}</p>
              <span className="alert-time">{alert.time}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
