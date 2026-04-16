import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DistrictDropdown from './DistrictDropdown';

export default function Topbar() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">Kerala Disaster Management</h1>
      </div>
      <div className="topbar-center">
        <span className="clock-icon">🕐</span>
        <span className="digital-clock">{formatTime(time)}</span>
      </div>
      <div className="topbar-right">
        <DistrictDropdown />
        <button
          className="alert-icon-btn"
          title="Alerts"
          onClick={() => navigate('/alerts', { state: {} })}
        >
          🔔
          <span className="notification-badge">3</span>
        </button>
        <button
          className="sos-btn-topbar"
          onClick={() => navigate('/sos')}
        >
          🚨 SOS
        </button>
      </div>
    </div>
  );
}
