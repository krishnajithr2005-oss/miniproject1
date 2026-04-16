import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDistrictByName } from '../data/districtData';
import Topbar from '../components/Topbar';
import RiskMap from '../components/RiskMap';
import '../styles/shared.css';
import './DistrictDetail.css';

export default function DistrictDetailPage() {
  const { districtName } = useParams();
  const navigate = useNavigate();
  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (districtName) {
      const districtData = getDistrictByName(decodeURIComponent(districtName));
      if (districtData) {
        setDistrict(districtData);
      }
      setLoading(false);
    }
  }, [districtName]);

  if (loading) {
    return (
      <div>
        <Topbar />
        <div className="page-content">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading district information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!district) {
    return (
      <div>
        <Topbar />
        <div className="page-content">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>District not found</h2>
            <button 
              onClick={() => navigate('/districts')}
              style={{
                padding: '10px 20px',
                marginTop: '20px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ← Back to Districts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getRiskBadgeColor = (level) => {
    if (level === 'High') return '#F44336';
    if (level === 'Moderate') return '#FFC107';
    return '#4CAF50';
  };

  const getSeverityColor = (severity) => {
    if (severity === 'Critical') return '#d32f2f';
    if (severity === 'High') return '#f44336';
    if (severity === 'Medium') return '#ffc107';
    return '#4caf50';
  };

  return (
    <div>
      <Topbar />
      <main className="page-content district-detail">
        {/* Header */}
        <div className="district-header">
          <button 
            className="back-btn"
            onClick={() => navigate('/districts')}
            title="Back to Districts"
          >
            ← Back
          </button>
          <div className="header-content">
            <h1 className="district-title">📍 {district.name}</h1>
            <p className="district-desc">{district.description}</p>
            <div className="risk-badge" style={{ backgroundColor: getRiskBadgeColor(district.riskLevel) + '20', borderColor: getRiskBadgeColor(district.riskLevel) }}>
              <span style={{ color: getRiskBadgeColor(district.riskLevel), fontWeight: '600' }}>
                ● {district.riskLevel} Risk
              </span>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="district-section">
          <h2 className="section-heading">📍 Location Map</h2>
          <div className="map-container">
            <RiskMap 
              position={[district.coordinates.lat, district.coordinates.lng]}
              riskLevel={district.riskLevel.toUpperCase()}
              district={district.name}
            />
          </div>
        </section>

        {/* Current Updates Section */}
        <section className="district-section">
          <h2 className="section-heading">📢 Current Updates & Alerts</h2>
          {district.currentAlerts && district.currentAlerts.length > 0 ? (
            <div className="alerts-grid">
              {district.currentAlerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className="alert-card"
                  style={{ borderLeftColor: getSeverityColor(alert.severity) }}
                >
                  <div className="alert-header">
                    <h4 className="alert-type">{alert.type}</h4>
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(alert.severity) }}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#666' }}>No active alerts for this district.</p>
            </div>
          )}
        </section>

        {/* Disaster History Section */}
        <section className="district-section">
          <h2 className="section-heading">📊 Disaster History</h2>
          {district.disasterHistory && district.disasterHistory.length > 0 ? (
            <div className="history-list">
              {district.disasterHistory.map((disaster, idx) => (
                <div 
                  key={idx} 
                  className="history-card"
                  style={{ borderLeftColor: getSeverityColor(disaster.severity) }}
                >
                  <div className="history-header">
                    <div style={{ flex: 1 }}>
                      <h4 className="disaster-type">{disaster.type}</h4>
                      <p className="disaster-date">{new Date(disaster.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(disaster.severity) }}
                    >
                      {disaster.severity}
                    </span>
                  </div>

                  <p className="disaster-description">{disaster.description}</p>

                  <div className="disaster-stats">
                    <div className="stat-item">
                      <span className="stat-label">Deaths</span>
                      <span className="stat-value" style={{ color: '#d32f2f' }}>{disaster.deaths}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Displaced</span>
                      <span className="stat-value" style={{ color: '#f57c00' }}>{disaster.displaced.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#666' }}>No historical disaster data available.</p>
            </div>
          )}
        </section>

        {/* District Statistics */}
        <section className="district-section">
          <h2 className="section-heading">📈 District Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <h4>Total Disasters (Recent 3 years)</h4>
              <p className="stat-number">{district.disasterHistory.length}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">😢</div>
              <h4>Total Deaths (Recent 3 years)</h4>
              <p className="stat-number">{district.disasterHistory.reduce((sum, d) => sum + d.deaths, 0)}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏘️</div>
              <h4>Total Displaced (Recent 3 years)</h4>
              <p className="stat-number">{(district.disasterHistory.reduce((sum, d) => sum + d.displaced, 0)).toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚨</div>
              <h4>Active Alerts</h4>
              <p className="stat-number">{district.currentAlerts.length}</p>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="district-section recommendations-section">
          <h2 className="section-heading">💡 Safety Recommendations</h2>
          <div className="recommendations">
            {district.riskLevel === 'High' && (
              <ul>
                <li>🔴 <strong>High Risk Area:</strong> Stay alert and monitor official channels frequently.</li>
                <li>📱 <strong>Download Alert App:</strong> Receive instant notifications about disasters and emergencies.</li>
                <li>🏠 <strong>Know Your Safe Zone:</strong> Identify and practice evacuation routes from your home.</li>
                <li>👨‍👩‍👧 <strong>Family Plan:</strong> Have a disaster communication plan with family members.</li>
                <li>⛺ <strong>Find Shelters:</strong> Identify nearest relief centers and evacuation points.</li>
                <li>📞 <strong>Emergency Numbers:</strong> Save important helpline numbers: Police 100, Fire 101, Ambulance 108, KSNDMC 1077</li>
              </ul>
            )}
            {district.riskLevel === 'Moderate' && (
              <ul>
                <li>🟡 <strong>Moderate Risk Area:</strong> Be prepared and stay informed during monsoon season.</li>
                <li>📱 <strong>Enable Notifications:</strong> Turn on disaster alerts for timely warnings.</li>
                <li>🎒 <strong>Emergency Kit:</strong> Keep essential supplies ready (water, first aid, important documents).</li>
                <li>🏠 <strong>Home Safety:</strong> Ensure drainage systems are clear and buildings are well-maintained.</li>
                <li>📢 <strong>Community Awareness:</strong> Participate in disaster awareness programs.</li>
              </ul>
            )}
            {district.riskLevel === 'Low' && (
              <ul>
                <li>🟢 <strong>Low Risk Area:</strong> Generally safe, but stay prepared for unexpected situations.</li>
                <li>📖 <strong>Stay Informed:</strong> Knowledge is the best preparation. Learn about local hazards.</li>
                <li>🚨 <strong>Emergency Contacts:</strong> Keep helpline numbers handy: Police 100, Fire 101, Ambulance 108</li>
                <li>👨‍👩‍👧 <strong>Family Preparedness:</strong> Discuss basic disaster response with family.</li>
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
