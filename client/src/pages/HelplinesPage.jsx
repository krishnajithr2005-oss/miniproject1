import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Helplines from '../components/Helplines';
import './HelplinesPage.css';

export default function HelplinesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('helplines'); // 'helplines' or 'volunteer'

  const EMERGENCY_CATEGORIES = [
    {
      category: 'Police & Law Enforcement',
      helplines: [
        { name: 'Police Control Room', number: '100', icon: '👮' },
        { name: 'Emergency Services', number: '112', icon: '🚔' },
        { name: 'Women Helpline', number: '1091', icon: '👩' },
      ]
    },
    {
      category: 'Medical & Health',
      helplines: [
        { name: 'Ambulance Services', number: '102', icon: '🚑' },
        { name: 'National Health Emergency', number: '1075', icon: '⚕️' },
        { name: 'Poison Control', number: '1800-225-0444', icon: '⚠️' },
      ]
    },
    {
      category: 'Fire & Rescue',
      helplines: [
        { name: 'Fire Department', number: '101', icon: '🚒' },
        { name: 'Disaster Management', number: '1070', icon: '🆘' },
        { name: 'Coastal Guard', number: '1544', icon: '⛵' },
      ]
    },
    {
      category: 'Utilities & Services',
      helplines: [
        { name: 'Electricity Emergency', number: '1912', icon: '⚡' },
        { name: 'Water Supply Issues', number: '1916', icon: '💧' },
        { name: 'Gas Emergency', number: '1906', icon: '🔥' },
      ]
    },
  ];

  return (
    <div>
      <Topbar />
      <main className="page-content">
        {/* Hero Section */}
        <section className="helplines-hero">
          <div className="hero-content">
            <h1>📞 Emergency Services & Community Help</h1>
            <p>Quick access to emergency contacts and volunteer opportunities</p>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="helplines-tabs">
          <button
            className={`tab-btn ${activeTab === 'helplines' ? 'active' : ''}`}
            onClick={() => setActiveTab('helplines')}
          >
            📞 Emergency Helplines
          </button>
          <button
            className={`tab-btn ${activeTab === 'volunteer' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteer')}
          >
            🤝 Volunteer Portal
          </button>
        </section>

        {/* Helplines Tab */}
        {activeTab === 'helplines' && (
          <section className="helplines-section">
            <div className="helplines-intro">
              <p>📌 Save these numbers in your phone. In case of emergency, call immediately.</p>
            </div>

            {EMERGENCY_CATEGORIES.map((category, idx) => (
              <div key={idx} className="helpline-category">
                <h3 className="category-title">{category.category}</h3>
                <div className="helpline-cards-grid">
                  {category.helplines.map((helpline, i) => (
                    <div key={i} className="helpline-card-large">
                      <div className="helpline-icon">{helpline.icon}</div>
                      <div className="helpline-content">
                        <h4>{helpline.name}</h4>
                        <p className="helpline-number">{helpline.number}</p>
                      </div>
                      <button 
                        className="call-btn"
                        onClick={() => alert(`📞 Calling ${helpline.name}...\nNumber: ${helpline.number}`)}
                      >
                        📞 Call
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Volunteer Tab */}
        {activeTab === 'volunteer' && (
          <section className="volunteer-section">
            <div className="volunteer-intro">
              <h2>🤝 Become a Volunteer</h2>
              <p>Join our community of heroes and help others during emergencies. Your contribution can save lives.</p>
              
              <div className="volunteer-benefits">
                <h3>Why Become a Volunteer?</h3>
                <div className="benefits-grid">
                  <div className="benefit-card">
                    <span className="benefit-icon">❤️</span>
                    <h4>Make a Difference</h4>
                    <p>Help people during critical times and emergencies</p>
                  </div>
                  <div className="benefit-card">
                    <span className="benefit-icon">🌍</span>
                    <h4>Community Service</h4>
                    <p>Be part of a nationwide disaster relief network</p>
                  </div>
                  <div className="benefit-card">
                    <span className="benefit-icon">🏆</span>
                    <h4>Recognition</h4>
                    <p>Get official certificates and community recognition</p>
                  </div>
                  <div className="benefit-card">
                    <span className="benefit-icon">🎓</span>
                    <h4>Training</h4>
                    <p>Receive free disaster management training</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="volunteer-cta">
              <button 
                className="btn-register-volunteer"
                onClick={() => {
                  console.log("🤝 VOLUNTEER REGISTER BUTTON CLICKED");
                  navigate('/volunteer');
                }}
              >
                Register as Volunteer
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
