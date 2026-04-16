import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Your Safety is Our Priority</h1>
        <p>Stay informed, stay safe. Real-time disaster management alerts and resources.</p>
        <div className="hero-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/alerts', { state: {} })}
          >
            📢 View Live Alerts
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/shelters')}
          >
            🏢 Find Nearest Shelter
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/map')}
          >
            📍 My District Info
          </button>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-gradient">🛡️</div>
      </div>
    </section>
  );
}
