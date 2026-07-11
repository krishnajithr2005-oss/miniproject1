import React from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import './AboutPage.css';

export default function AboutPage() {
  const navigate = useNavigate();
  const stats = [
    { icon: '🏘️', number: '14', label: 'Districts' },
    { icon: '👥', number: '50K+', label: 'Active Users' },
    { icon: '⚡', number: '24/7', label: 'Real-Time Monitoring' },
    { icon: '🆘', number: '1000+', label: 'Lives Saved' }
  ];

  const features = [
    { icon: '🔔', title: 'Real-Time Alerts', description: 'Instant notifications for disasters in your area with precise location targeting' },
    { icon: '🗺️', title: 'Interactive Risk Maps', description: 'Live visualization of flood zones, landslide areas, and risk assessment data' },
    { icon: '⛺', title: 'Shelter Finder', description: 'Locate nearest relief shelters with real-time capacity and amenities information' },
    { icon: '🌧️', title: 'Weather Intelligence', description: 'Hyperlocal weather data, forecasts, and climate alerts for Kerala' },
    { icon: '🆘', title: 'Emergency SOS', description: 'One-tap rescue request with automatic location sharing to rescue teams' },
    { icon: '📚', title: 'Preparedness Guides', description: 'Comprehensive disaster readiness and safety information for all citizens' },
    { icon: '🤝', title: 'Volunteer Network', description: 'Join community volunteers to help those in need during emergencies' },
    { icon: '📞', title: 'Emergency Helplines', description: 'Quick access to 24/7 emergency contact numbers and medical assistance' }
  ];

  const coreValues = [
    { title: 'Community First', description: 'Every decision prioritizes citizen safety and welfare' },
    { title: 'Transparency', description: 'Real-time information and honest communication always' },
    { title: 'Innovation', description: 'Latest technology to improve disaster management' },
    { title: 'Reliability', description: '24/7 monitoring and support when you need it most' }
  ];

  return (
    <div>
      <Topbar />
      <main className="about-page">
        <section className="about-hero">
          <div className="hero-content">
            <h1>🛡️ Kerala Disaster Management System</h1>
            <p>Empowering Citizens. Saving Lives. Building Resilience.</p>
            <div className="hero-underline"></div>
          </div>
        </section>

        <section className="about-section mission-section">
          <div className="section-container">
            <div className="mission-grid">
              <div className="mission-content">
                <h2>Our Mission</h2>
                <p className="mission-statement">
                  To provide real-time disaster alerts, critical information, and community support to all citizens across Kerala's 14 districts. We aim to save lives through quick, accurate, and actionable information during emergencies and disasters.
                </p>
                <div className="mission-highlights">
                  <div className="highlight"><span className="highlight-icon">✓</span><span>24/7 Real-Time Monitoring</span></div>
                  <div className="highlight"><span className="highlight-icon">✓</span><span>Community-Driven Support</span></div>
                  <div className="highlight"><span className="highlight-icon">✓</span><span>Data-Driven Decisions</span></div>
                  <div className="highlight"><span className="highlight-icon">✓</span><span>Inclusive & Accessible</span></div>
                </div>
              </div>
              <div className="mission-visual">
                <div className="mission-icon-box">🛡️</div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section stats-section">
          <div className="section-container">
            <h2 className="section-title">Our Impact</h2>
            <div className="stats-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section values-section">
          <div className="section-container">
            <h2 className="section-title">Our Core Values</h2>
            <div className="values-grid">
              {coreValues.map((value, idx) => (
                <div key={idx} className="value-card">
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section features-section">
          <div className="section-container">
            <h2 className="section-title">Comprehensive Features</h2>
            <p className="section-subtitle">Everything you need to stay safe and informed during disasters</p>
            <div className="features-grid">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section how-it-works">
          <div className="section-container">
            <h2 className="section-title">How It Works</h2>
            <div className="workflow">
              <div className="workflow-step"><div className="step-number">1</div><h4>Register</h4><p>Create your account and set your location preferences</p></div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step"><div className="step-number">2</div><h4>Receive Alerts</h4><p>Get real-time notifications for disasters near you</p></div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step"><div className="step-number">3</div><h4>Take Action</h4><p>Use our tools to find shelters, send SOS, or help others</p></div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step"><div className="step-number">4</div><h4>Stay Safe</h4><p>Build resilience with preparedness guides and community support</p></div>
            </div>
          </div>
        </section>

        <section className="about-section tech-section">
          <div className="section-container">
            <h2 className="section-title">Built With Modern Technology</h2>
            <div className="tech-stack">
              <div className="tech-item"><h4>Frontend</h4><p>React.js, Leaflet.js, Responsive Design</p></div>
              <div className="tech-item"><h4>Backend</h4><p>Node.js, Express, RESTful APIs</p></div>
              <div className="tech-item"><h4>Database</h4><p>MongoDB, Real-time Data Synchronization</p></div>
              <div className="tech-item"><h4>Infrastructure</h4><p>Cloud-hosted, 99.9% Uptime, Secure</p></div>
            </div>
          </div>
        </section>

        <section className="about-section cta-section">
          <div className="section-container">
            <h2>Ready to Stay Safe?</h2>
            <p>Join thousands of Keralites using our platform to stay informed and help their communities</p>
            <button className="cta-button" onClick={() => navigate('/login')}>Get Started Now</button>
          </div>
        </section>

        <section className="about-section contact-section">
          <div className="section-container">
            <h2 className="section-title">Get In Touch</h2>
            <div className="contact-grid">
              <div className="contact-item"><h4>🚨 Emergency</h4><p><strong>KSNDMC Helpline:</strong> 1077</p></div>
              <div className="contact-item"><h4>🚒 Fire Services</h4><p><strong>Toll Free:</strong> 101</p></div>
              <div className="contact-item"><h4>👮 Police</h4><p><strong>Emergency:</strong> 100</p></div>
              <div className="contact-item"><h4>🚑 Ambulance</h4><p><strong>Medical Emergency:</strong> 108</p></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
