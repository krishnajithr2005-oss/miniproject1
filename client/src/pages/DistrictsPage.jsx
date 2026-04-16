import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { KERALA_DISTRICTS } from '../data/districtData';
import './DistrictsPage.css';

export default function DistrictsPage() {
  // District selection and view management
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('dropdown'); // 'dropdown' or 'grid'
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = viewMode === 'grid' 
    ? KERALA_DISTRICTS.filter(district =>
        district.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDistrictSelect = (districtName) => {
    if (districtName === 'view-all') {
      setViewMode('grid');
      setSelectedDistrict('');
      return;
    }
    setSelectedDistrict(districtName);
    navigate(`/district/${encodeURIComponent(districtName)}`);
  };

  const handleDistrictClick = (districtName) => {
    navigate(`/district/${encodeURIComponent(districtName)}`);
  };

  // Dropdown View
  if (viewMode === 'dropdown') {
    return (
      <div>
        <Topbar />
        <main className="page-content">
          <div className="dropdown-container">
            <div className="dropdown-header">
              <h1>📍 Select a Kerala District</h1>
              <p>Choose a district to view detailed risk assessment, active alerts, and disaster information</p>
            </div>

            <div className="dropdown-wrapper">
              <select 
                className="districts-dropdown"
                value={selectedDistrict}
                onChange={(e) => handleDistrictSelect(e.target.value)}
              >
                <option value="">-- Select a District --</option>
                {KERALA_DISTRICTS.map((district) => (
                  <option key={district.name} value={district.name}>
                    {district.name}
                  </option>
                ))}
                <option value="view-all">👁️ View All Districts</option>
              </select>
            </div>

            <div className="dropdown-info">
              <div className="info-card">
                <div className="info-icon">📊</div>
                <h3>14 Districts</h3>
                <p>Comprehensive coverage of all Kerala districts</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🔔</div>
                <h3>Real-Time Alerts</h3>
                <p>Live disaster and emergency updates</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📈</div>
                <h3>Risk Assessment</h3>
                <p>Current risk levels and status</p>
              </div>
              <div className="info-card">
                <div className="info-icon">⚠️</div>
                <h3>Historical Data</h3>
                <p>Past disasters and patterns</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Grid View (View All Districts)
  return (
    <div>
      <Topbar />
      <main className="page-content">
        <div className="page-header">
          <h1>📍 Districts of Kerala</h1>
          <p>Explore real-time risk assessments and disaster information for all 14 districts</p>
        </div>

        {/* Search Bar */}
        <section className="dashboard-section">
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setViewMode('dropdown')}
              style={{
                padding: '12px 20px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
            >
              ← Back to Dropdown
            </button>
            <input
              type="text"
              placeholder="Search districts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Clear
              </button>
            )}
          </div>
          <p style={{ marginTop: '0', color: '#888', fontSize: '0.9rem' }}>
            Showing {filteredDistricts.length} of {KERALA_DISTRICTS.length} districts
          </p>
        </section>

        {/* Districts Grid */}
        <section className="dashboard-section">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {filteredDistricts.map((district, idx) => (
              <div
                key={idx}
                onClick={() => handleDistrictClick(district.name)}
                style={{
                  padding: '20px',
                  border: `3px solid ${district.color}`,
                  borderRadius: '10px',
                  backgroundColor: district.color + '15',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${district.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>
                  {district.name}
                </h3>
                <p style={{
                  margin: '0 0 15px 0',
                  fontSize: '0.85rem',
                  color: '#666',
                  minHeight: '40px',
                  lineHeight: '1.4'
                }}>
                  {district.description}
                </p>
                <p style={{
                  margin: '0',
                  fontSize: '0.9rem',
                  color: district.color,
                  fontWeight: '600'
                }}>
                  ● {district.riskLevel} Risk
                </p>
                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: `1px solid ${district.color}30`,
                  fontSize: '0.85rem',
                  color: '#888'
                }}>
                  <p style={{ margin: 0 }}>
                    {district.disasterHistory ? district.disasterHistory.length : 0} historical disasters
                  </p>
                  <p style={{ margin: 0, marginTop: '5px' }}>
                    {district.currentAlerts ? district.currentAlerts.length : 0} active alerts
                  </p>
                </div>
                <button
                  style={{
                    marginTop: '15px',
                    padding: '8px 16px',
                    backgroundColor: district.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
          {filteredDistricts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#888'
            }}>
              <p style={{ fontSize: '1.1rem' }}>No districts found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Show All Districts
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
