import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KERALA_DISTRICTS } from '../data/districtData';
import './DistrictDropdown.css';

export default function DistrictDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const filteredDistricts = KERALA_DISTRICTS.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectDistrict = (districtName) => {
    navigate(`/district/${encodeURIComponent(districtName)}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleViewAllDistricts = () => {
    navigate('/districts');
    setIsOpen(false);
    setSearchTerm('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen]);

  return (
    <div className="district-dropdown" ref={dropdownRef}>
      <button
        className="district-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Select District"
      >
        📍 Districts
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="district-dropdown-menu">
          <div className="dropdown-search">
            <input
              type="text"
              placeholder="Search district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="district-search-input"
            />
          </div>
          <div className="dropdown-list">
            {filteredDistricts.length > 0 ? (
              <>
                {filteredDistricts.map((district, idx) => (
                  <div
                    key={idx}
                    className="dropdown-item"
                    onClick={() => handleSelectDistrict(district.name)}
                  >
                    <div className="item-icon">
                      <span
                        className="risk-indicator"
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor:
                            district.riskLevel === 'High'
                              ? '#f44336'
                              : district.riskLevel === 'Moderate'
                              ? '#ffc107'
                              : '#4caf50',
                          display: 'inline-block'
                        }}
                      ></span>
                    </div>
                    <div className="item-content">
                      <div className="item-name">{district.name}</div>
                      <div className="item-risk">{district.riskLevel} Risk</div>
                    </div>
                    <div className="item-alert-count">
                      {district.currentAlerts.length}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="no-results">
                No districts found
              </div>
            )}
          </div>

          {/* View All Districts - 15th Option */}
          <div className="dropdown-footer">
            <button
              className="view-all-btn"
              onClick={handleViewAllDistricts}
            >
              📊 View All Districts →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
