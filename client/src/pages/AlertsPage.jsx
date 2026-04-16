import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/shared.css';
import './AlertsPage.css';
import Topbar from '../components/Topbar';
import AlertSubmissionModal from '../components/AlertSubmissionModal';
import AlertSignupModal from '../components/AlertSignupModal';
import AlertList from '../components/AlertList';

export default function AlertsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasCheckedUrl = useRef(false);

  // Only check location state on mount to auto-open from login flow
  useEffect(() => {
    if (!hasCheckedUrl.current) {
      try {
        if (location && location.state && location.state.signup) {
          setShowSignupModal(true);
          // Clean up navigation state so modal doesn't reopen
          navigate(location.pathname, { replace: true, state: {} });
        }
      } catch (err) {
        // fallback: do nothing
      }
      hasCheckedUrl.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Fetch published alerts on component mount
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data || []);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleOpenSignupModal = () => {
    setShowSignupModal(true);
  };

  const handleCloseSignupModal = () => {
    setShowSignupModal(false);
  };

  const handleSubmissionSuccess = () => {
    setShowSubmissionModal(false);
    // Show success toast
    alert('✅ Thank you! Your alert report has been submitted. Our team will review and verify it soon.');
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    // Show success toast
    alert('✅ You have successfully signed up for alerts!');
  };

  return (
    <div className="alerts-page">
      <Topbar />

      {/* Hero Section */}
      <section className="alerts-hero">
        <div className="alerts-bg"></div>
        <div className="alerts-hero-inner">
          <div className="alerts-badge">🔔 Keeping Kerala Safe</div>
          <h1 className="alerts-title">
            How Alerts Work
            <br />
            on Your Disaster Portal
          </h1>
          <p className="alerts-desc">
            We provide real-time disaster alerts to keep you and your community safe.
            Learn how our alert system works and how you can contribute to making Kerala stronger.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="alerts-how-section">
        <div className="alerts-container">
          <h2 className="section-title">How Alerts Are Delivered</h2>
          <div className="how-grid">
            <div className="how-card">
              <div className="how-icon">📡</div>
              <h3>Real-Time Detection</h3>
              <p>Our system monitors official sources including IMD, KSNDMC, and district authorities 24/7 for disaster updates.</p>
            </div>
            <div className="how-card">
              <div className="how-icon">🔍</div>
              <h3>Verification</h3>
              <p>Each alert is verified by our expert team to ensure accuracy and relevance for your location.</p>
            </div>
            <div className="how-card">
              <div className="how-icon">📱</div>
              <h3>Instant Notification</h3>
              <p>Get alerts instantly on your device. Customize by district and alert type to receive only what matters to you.</p>
            </div>
            <div className="how-card">
              <div className="how-icon">✅</div>
              <h3>Rich Information</h3>
              <p>Each alert includes severity level, location details, recommended actions, and links to emergency resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="alerts-action-section">
        <div className="alerts-container">
          <h2 className="section-title">Get Involved</h2>
          <p className="section-subtitle">
            Choose how you want to stay informed and help protect your community
          </p>
          <div className="action-buttons">
            <button 
              className="btn-primary large"
              onClick={handleOpenSignupModal}
            >
              <span className="btn-icon">🔔</span>
              Sign Up for Alerts
              <span className="btn-subtext">Receive alerts for your district</span>
            </button>
            <button 
              className="btn-secondary large"
              onClick={() => setShowSubmissionModal(true)}
            >
              <span className="btn-icon">📢</span>
              Report an Alert
              <span className="btn-subtext">Tell us about a disaster you witnessed</span>
            </button>
          </div>
        </div>
      </section>

      {/* Alert Types Section */}
      <section className="alerts-types-section">
        <div className="alerts-container">
          <h2 className="section-title">Alert Types We Monitor</h2>
          <div className="alert-types-grid">
            <div className="alert-type-card alert-flood">
              <div className="alert-type-icon">🌊</div>
              <h4>Flood Alerts</h4>
              <p>Water level warnings, dam releases, river overflows, and flash flood warnings</p>
            </div>
            <div className="alert-type-card alert-landslide">
              <div className="alert-type-icon">⛰️</div>
              <h4>Landslide Warnings</h4>
              <p>Slope failures, road closures, and terrain hazards in high-risk areas</p>
            </div>
            <div className="alert-type-card alert-weather">
              <div className="alert-type-icon">🌧️</div>
              <h4>Weather Alerts</h4>
              <p>Heavy rainfall, strong winds, high tides, and meteorological warnings</p>
            </div>
            <div className="alert-type-card alert-evacuation">
              <div className="alert-type-icon">🚨</div>
              <h4>Evacuation Orders</h4>
              <p>Mandatory evacuations, zone closures, and safety advisories</p>
            </div>
            <div className="alert-type-card alert-infrastructure">
              <div className="alert-type-icon">🏗️</div>
              <h4>Infrastructure Issues</h4>
              <p>Road damage, bridge closures, power outages, and access restrictions</p>
            </div>
            <div className="alert-type-card alert-advisory">
              <div className="alert-type-icon">📋</div>
              <h4>General Advisories</h4>
              <p>Safety tips, preparedness guidance, and resource information</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Alerts Section */}
      <section className="alerts-live-section">
        <div className="alerts-container">
          <h2 className="section-title">Recent Published Alerts</h2>
          {loading ? (
            <div className="loading">Loading alerts...</div>
          ) : alerts.length > 0 ? (
            <div className="alerts-list-container">
              <AlertList limit={5} />
            </div>
          ) : (
            <div className="no-alerts">
              <div className="no-alerts-icon">✅</div>
              <p>Great news! There are no active alerts at this moment.</p>
              <p className="no-alerts-sub">Stay prepared. Stay informed.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Report Section */}
      <section className="alerts-why-report-section">
        <div className="alerts-container">
          <h2 className="section-title">Why Report an Alert?</h2>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-number">1</div>
              <h4>Community Protection</h4>
              <p>Your firsthand information helps us warn others in affected areas and coordinate rescue efforts.</p>
            </div>
            <div className="why-card">
              <div className="why-number">2</div>
              <h4>Verified by Experts</h4>
              <p>Our team verifies every report before publishing it to ensure accuracy and prevent false information.</p>
            </div>
            <div className="why-card">
              <div className="why-number">3</div>
              <h4>Official Distribution</h4>
              <p>Verified reports become official alerts and reach thousands of residents who can take preventive action.</p>
            </div>
            <div className="why-card">
              <div className="why-number">4</div>
              <h4>Recognition</h4>
              <p>Citizen reporters who contribute verified information are recognized for helping keep Kerala safe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="alerts-cta-section">
        <h2>Ready to Stay Informed?</h2>
        <p>Start receiving alerts and help protect your community today.</p>
        <div className="cta-buttons">
          <button 
            className="btn-primary"
            onClick={handleOpenSignupModal}
          >
            Sign Me Up
          </button>
          <button 
            className="btn-secondary"
            onClick={() => setShowSubmissionModal(true)}
          >
            Report an Alert
          </button>
        </div>
      </section>

      {/* Modals */}
      <AlertSubmissionModal 
        isOpen={showSubmissionModal} 
        onClose={() => setShowSubmissionModal(false)}
        onSuccess={handleSubmissionSuccess}
      />
      <AlertSignupModal 
        isOpen={showSignupModal} 
        onClose={handleCloseSignupModal}
        onSuccess={handleSignupSuccess}
      />
    </div>
  );
}
