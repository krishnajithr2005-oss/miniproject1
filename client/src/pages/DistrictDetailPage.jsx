import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDistrictByName } from '../data/districtData';
import Topbar from '../components/Topbar';
import RiskMap from '../components/RiskMap';
import '../styles/shared.css';
import './DistrictDetail.css';
import { apiUrl } from '../config/api';

export default function DistrictDetailPage() {
  const { districtName } = useParams();
  const navigate = useNavigate();
  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDistrict = async () => {
      if (!districtName) return;

      const name = decodeURIComponent(districtName);
      try {
        const response = await fetch(apiUrl(`/api/analyze?place=${encodeURIComponent(name)}`));
        if (!response.ok) throw new Error('District API request failed');
        const data = await response.json();

        const parseCoordinates = (coords) => {
          if (Array.isArray(coords)) return { lat: coords[0], lng: coords[1] };
          if (coords && typeof coords === 'object') {
            return {
              lat: coords.latitude || coords.lat || 9.9312,
              lng: coords.longitude || coords.lng || 76.2673,
            };
          }
          return { lat: 9.9312, lng: 76.2673 };
        };

        const formatLocation = (location) => {
          if (!location) return 'Unknown location';
          if (typeof location === 'string') return location;
          if (typeof location === 'object') {
            const lat = location.latitude ?? location.lat;
            const lng = location.longitude ?? location.lng;
            if (lat !== undefined && lng !== undefined) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            return location.address || 'Unknown location';
          }
          return String(location);
        };

        setDistrict({
          name: data.place,
          description: data.description || `${data.district} district with current ${data.risk.level} risk status.`,
          coordinates: parseCoordinates(data.coordinates),
          riskLevel: formatLevel(data.risk.level),
          riskScore: data.risk?.score ?? data.riskScore ?? approximateScore(data.risk?.level || data.riskLevel),
          riskColor: data.risk.color || getRiskColor(data.risk.level),
          activeLayers: data.activeLayers || {},
          currentAlerts: (data.alerts || []).map((alert) => ({
            type: alert.type || alert.title || 'Alert',
            message: alert.description || alert.message || alert.title,
            severity: formatLevel(alert.severity),
          })),
          disasterHistory: (data.history || []).map((item) => ({
            type: item.type || 'Disaster',
            date: item.date,
            severity: formatLevel(item.severity),
            description: item.description || item.damageAssessment || 'No description available',
            deaths: item.deaths || 0,
            displaced: item.displaced || 0,
          })),
          shelters: (data.shelters || []).map((shelter) => ({
            name: shelter.name,
            location: formatLocation(shelter.location || shelter.address),
            capacity: shelter.capacity || 'N/A',
            phone: shelter.phone || shelter.contact || 'N/A',
          })),
          resources: (data.resources || []).map((resource) => ({
            name: resource.name,
            type: resource.type,
            contact: resource.contact || 'N/A',
            responseTime: resource.responseTime || 'N/A',
          })),
          emergencyContacts: buildEmergencyContacts(data.resources || []),
        });
      } catch (error) {
        const districtData = getDistrictByName(name);
        if (districtData) {
          setDistrict({
            ...districtData,
            riskScore: districtData.riskScore ?? approximateScore(districtData.riskLevel),
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadDistrict();
  }, [districtName]);

  const formatLevel = (level = '') => {
    const normalized = String(level).toLowerCase();
    if (normalized === 'high' || normalized === 'critical') return 'High';
    if (normalized === 'medium' || normalized === 'moderate') return 'Moderate';
    return 'Low';
  };

  const approximateScore = (level = '') => {
    const normalized = String(level).toLowerCase();
    if (normalized === 'high' || normalized === 'critical') return 80;
    if (normalized === 'medium' || normalized === 'moderate') return 55;
    if (normalized === 'low') return 30;
    return 50;
  };

  const getRiskColor = (level = '') => {
    const normalized = String(level).toLowerCase();
    if (normalized === 'high' || normalized === 'critical') return '#F44336';
    if (normalized === 'medium' || normalized === 'moderate') return '#FFC107';
    return '#4CAF50';
  };

  const buildEmergencyContacts = (resources) => {
    const contacts = {
      controlRoom: '108',
      police: '100',
      fire: '101',
      ambulance: '108',
      operations: '1077',
    };

    resources.forEach((resource) => {
      const type = String(resource.type || '').toLowerCase();
      if (type === 'police') contacts.police = resource.contact || contacts.police;
      if (type === 'fire') contacts.fire = resource.contact || contacts.fire;
      if (type === 'medical') contacts.ambulance = resource.contact || contacts.ambulance;
      if (type === 'rescue') contacts.operations = resource.contact || contacts.operations;
    });

    return contacts;
  };

  if (loading) {
    return (
      <div>
        <Topbar />
        <div className="page-content loading-state">
          <div className="loading-card">
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
        <div className="page-content empty-state">
          <div className="status-card">
            <h2>District not found</h2>
            <button className="primary-button" onClick={() => navigate('/districts')}>
              ← Back to Districts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getBadgeColor = (level) => {
    return getRiskColor(level);
  };

  const getSeverityColor = (severity) => {
    const normalized = String(severity).toLowerCase();
    if (normalized === 'critical' || normalized === 'high') return '#d32f2f';
    if (normalized === 'medium') return '#ff9800';
    return '#4caf50';
  };

  const formatLayerLabel = (layer) => {
    const labels = {
      flood: 'Flood Zone',
      landslide: 'Landslide Zone',
      coastal: 'Coastal Zone',
      dam: 'Dam Impact',
    };
    return labels[layer] || layer;
  };

  return (
    <div>
      <Topbar />
      <main className="page-content district-detail">
        <section className="hero-panel">
          <div className="hero-copy">
            <button className="back-btn" onClick={() => navigate('/districts')}>
              ← Back to Districts
            </button>
            <div className="hero-title">
              <span className="hero-tag">District Intelligence</span>
              <h1>{district.name}</h1>
              <p>{district.description}</p>
            </div>
            <div className="hero-overview">
              <div className="overview-card">
                <span className="overview-title">Risk Level</span>
                <strong>{district.riskLevel}</strong>
                <span className="status-pill" style={{ backgroundColor: getBadgeColor(district.riskLevel) + '22', color: getBadgeColor(district.riskLevel) }}>
                  {district.riskLevel}
                </span>
              </div>
              <div className="overview-card">
                <span className="overview-title">Risk Score</span>
                <strong>{district.riskScore !== undefined ? `${district.riskScore}/100` : 'N/A'}</strong>
                <span className="detail-text">Higher score means greater urgency</span>
              </div>
              <div className="overview-card">
                <span className="overview-title">Alerts</span>
                <strong>{district.currentAlerts?.length || 0}</strong>
                <span className="detail-text">Active and published events</span>
              </div>
              <div className="overview-card">
                <span className="overview-title">Shelters</span>
                <strong>{district.shelters?.length || 0}</strong>
                <span className="detail-text">Available safe locations</span>
              </div>
            </div>
          </div>
          <div className="hero-side">
            <div className="side-card risk-summary-card">
              <div className="side-card-header">
                <span>Risk Summary</span>
                <span className="status-pill" style={{ backgroundColor: getBadgeColor(district.riskLevel) + '22', color: getBadgeColor(district.riskLevel) }}>
                  {district.riskLevel}
                </span>
              </div>
              <div className="risk-list">
                {Object.keys(district.activeLayers || {}).map((layer) => (
                  district.activeLayers[layer] && (
                    <span key={layer} className="layer-pill">
                      {formatLayerLabel(layer)}
                    </span>
                  )
                ))}
              </div>
              <div className="risk-chart">
                <span className="chart-label">Current risk band</span>
                <div className="risk-bar" style={{ background: `linear-gradient(90deg, #4caf50 0%, #FFC107 50%, #F44336 100%)` }}>
                  <div className="risk-pointer" style={{ left: `${Math.min(100, Math.max(10, district.riskScore))}%` }} />
                </div>
              </div>
            </div>
            <div className="side-card contact-summary-card">
              <div className="side-card-header">
                <span>Emergency Contacts</span>
              </div>
              <div className="contact-list">
                <div className="contact-row"><span>Control Room</span><strong>{district.emergencyContacts?.controlRoom}</strong></div>
                <div className="contact-row"><span>Police</span><strong>{district.emergencyContacts?.police}</strong></div>
                <div className="contact-row"><span>Fire</span><strong>{district.emergencyContacts?.fire}</strong></div>
                <div className="contact-row"><span>Ambulance</span><strong>{district.emergencyContacts?.ambulance}</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-grid">
          <div className="card card-strong">
            <h2 className="section-heading-card">Active Alerts</h2>
            {district.currentAlerts?.length > 0 ? (
              <div className="alerts-grid">
                {district.currentAlerts.map((alert, idx) => (
                  <div key={idx} className="alert-card modern-alert" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
                    <div className="alert-header">
                      <h4>{alert.type}</h4>
                      <span className="severity-badge" style={{ backgroundColor: getSeverityColor(alert.severity) }}>
                        {alert.severity}
                      </span>
                    </div>
                    <p>{alert.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-panel">
                <p>No active alerts available for this district.</p>
              </div>
            )}
          </div>

          <div className="card card-strong">
            <h2 className="section-heading-card">Response Resources</h2>
            {district.resources?.length > 0 ? (
              <div className="resources-grid">
                {district.resources.map((resource, idx) => (
                  <div key={idx} className="resource-card">
                    <div className="resource-icon">{resource.type === 'medical' ? '🏥' : resource.type === 'fire' ? '🔥' : resource.type === 'police' ? '🚓' : '🛟'}</div>
                    <h4>{resource.name}</h4>
                    <p>Contact: {resource.contact}</p>
                    <p>Response: {resource.responseTime}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-panel">
                <p>No response resources are available for this district.</p>
              </div>
            )}
          </div>
        </section>

        <section className="section-grid">
          <div className="card card-strong">
            <h2 className="section-heading-card">Shelters & Safe Spots</h2>
            {district.shelters?.length > 0 ? (
              <div className="shelters-grid modern-shelters">
                {district.shelters.map((shelter, idx) => (
                  <div key={idx} className="shelter-card modern-shelter-card">
                    <div className="shelter-header">
                      <h4>{shelter.name}</h4>
                      <span className="capacity-badge">{shelter.capacity}</span>
                    </div>
                    <p>{shelter.location}</p>
                    <p>{shelter.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-panel">
                <p>No shelter information available for this district.</p>
              </div>
            )}
          </div>

          <div className="card card-strong map-card">
            <h2 className="section-heading-card">District Map</h2>
            <div className="map-container modern-map">
              <RiskMap position={[district.coordinates.lat, district.coordinates.lng]} riskLevel={district.riskLevel.toUpperCase()} district={district.name} />
            </div>
          </div>
        </section>

        <section className="card card-strong history-card-section">
          <h2 className="section-heading-card">Disaster History</h2>
          {district.disasterHistory?.length > 0 ? (
            <div className="history-list modern-history-list">
              {district.disasterHistory.map((disaster, idx) => (
                <div key={idx} className="history-card modern-history-card" style={{ borderLeftColor: getSeverityColor(disaster.severity) }}>
                  <div className="history-header">
                    <div>
                      <h4>{disaster.type}</h4>
                      <p>{new Date(disaster.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span className="severity-badge" style={{ backgroundColor: getSeverityColor(disaster.severity) }}>
                      {disaster.severity}
                    </span>
                  </div>
                  <p>{disaster.description}</p>
                  <div className="disaster-stats">
                    <div className="stat-item">
                      <span>Deaths</span>
                      <strong>{disaster.deaths}</strong>
                    </div>
                    <div className="stat-item">
                      <span>Displaced</span>
                      <strong>{disaster.displaced.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-panel">
              <p>No historical disaster records found for this district.</p>
            </div>
          )}
        </section>

        <section className="card card-strong recommendations-section">
          <h2 className="section-heading-card">Safety Recommendations</h2>
          <div className="recommendations">
            {(district.riskLevel === 'High' || district.riskLevel === 'Moderate') && (
              <ul>
                <li>Stay updated with official weather and alert notifications.</li>
                <li>Identify evacuation routes and nearest safe shelters.</li>
                <li>Keep emergency supplies and a communication plan ready.</li>
                <li>Support family members and neighbors during high-risk conditions.</li>
              </ul>
            )}
            {district.riskLevel === 'Low' && (
              <ul>
                <li>Maintain basic preparedness and keep emergency contacts handy.</li>
                <li>Monitor local weather updates during monsoon season.</li>
                <li>Ensure home drainage and nearby roads are clear.</li>
                <li>Encourage family disaster readiness and safe evacuation habits.</li>
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
