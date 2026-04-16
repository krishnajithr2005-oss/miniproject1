import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';
import '../styles/Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosForm, setSosForm] = useState({
    name: '',
    emergencyType: '🌊 Flood — Stranded / Need Evacuation',
    location: '',
    peopleAffected: '1'
  });
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate quotes every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % 6);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSOS = () => {
    console.log('SOS button clicked');
    setSosModalOpen(true);
  };

  const handleSOSSubmit = (e) => {
    e.preventDefault();
    if (!sosForm.name.trim() || !sosForm.location.trim()) {
      alert('⚠️ Please fill in all fields');
      return;
    }
    alert(`🆘 SOS Request Sent!\n\nName: ${sosForm.name}\nType: ${sosForm.emergencyType}\nLocation: ${sosForm.location}\nPeople: ${sosForm.peopleAffected}\n\nRescue teams have been notified. Your location is being shared.`);
    setSosModalOpen(false);
    setSosForm({ name: '', emergencyType: '🌊 Flood — Stranded / Need Evacuation', location: '', peopleAffected: '1' });
  };

  const handleSOSClose = () => {
    setSosModalOpen(false);
  };

  const handleLearnMore = () => {
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quotes = [
    { text: 'EVERYONE IS HERO', author: 'Kerala Disaster Management', emoji: '🦸', color: '#ff6b35', style: 'hero' },
    { text: 'Your safety is our priority. Every second counts when help is needed.', author: 'Kerala Disaster Management', emoji: '🚨', color: '#e53935' },
    { text: '14 districts. 24/7 monitoring. Real-time alerts to keep you safe.', author: 'KD Portal', emoji: '📍', color: '#1976d2' },
    { text: 'Know your evacuation route. Know the nearest shelter. Be prepared.', author: 'KSNDMC', emoji: '🚶', color: '#fb8c00' },
    { text: 'In emergencies, information is as vital as water and food.', author: 'Disaster Management', emoji: '📡', color: '#5e35b1' },
    { text: 'Community resilience starts with individual preparedness.', author: 'Kerala Safety Initiative', emoji: '👥', color: '#00838f' }
  ];

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const districts = [
    { name: 'Wayanad', level: 'Critical', risk: 'high' },
    { name: 'Idukki', level: 'High', risk: 'high' },
    { name: 'Malappuram', level: 'Moderate', risk: 'med' },
    { name: 'Kozhikode', level: 'Moderate', risk: 'med' },
    { name: 'Thrissur', level: 'Moderate', risk: 'med' },
    { name: 'Ernakulam', level: 'Low', risk: 'low' },
    { name: 'Kottayam', level: 'Low', risk: 'low' },
    { name: 'Kollam', level: 'Low', risk: 'low' },
    { name: 'Thiruvananthapuram', level: 'Safe', risk: 'safe' },
    { name: 'Palakkad', level: 'Safe', risk: 'safe' },
    { name: 'Alappuzha', level: 'Safe', risk: 'safe' },
    { name: 'Kannur', level: 'Safe', risk: 'safe' },
    { name: 'Kasaragod', level: 'Safe', risk: 'safe' },
    { name: 'Pathanamthitta', level: 'Safe', risk: 'safe' }
  ];

  const features = [
    { icon: '🔔', title: 'Real-Time Alerts', desc: 'Instant notifications for floods, landslides, cyclones and more. District-wise alerts from IMD, KSNDMC and official sources. Never miss a critical warning.', color: 'red' },
    { icon: '🗺️', title: 'Interactive Risk Map', desc: 'Live map showing flood zones, landslide areas, dam locations and shelter positions across all 14 districts. Color-coded risk levels at a glance.', color: 'green' },
    { icon: '🆘', title: 'Emergency SOS', desc: 'One-tap SOS that shares your location instantly with rescue teams. Track your request status in real-time. Priority routing to nearest available team.', color: 'red' },
    { icon: '🌧️', title: 'Weather Intelligence', desc: 'Hyperlocal weather data with 5-day forecasts. Rainfall intensity maps, wind speed monitoring and IMD alert integration. Know before it hits.', color: 'blue' },
    { icon: '⛺', title: 'Shelter Finder', desc: 'Find nearest open relief shelters with real-time capacity updates. Get directions, contact numbers and live occupancy data for all 14 districts.', color: 'green' },
    { icon: '📋', title: 'Preparedness Guide', desc: "Step-by-step disaster preparedness guides, emergency kit checklists, evacuation routes and do's & don'ts tailored for Kerala's specific risks.", color: 'amber' }
  ];

  const steps = [
    { num: 'STEP 01', icon: '📱', title: 'Sign Up', desc: 'Create your account with your name, district and phone number. Takes 60 seconds.' },
    { num: 'STEP 02', icon: '🔔', title: 'Get Alerts', desc: 'Receive real-time alerts for your district. Weather, floods, landslides, all in one feed.' },
    { num: 'STEP 03', icon: '🗺️', title: 'Check the Map', desc: 'View live risk map to find safe zones, shelters and rescue team locations near you.' },
    { num: 'STEP 04', icon: '🆘', title: 'Get Help Instantly', desc: 'Send SOS with one tap. Rescue teams are notified immediately with your location.' }
  ];

  return (
    <div id="landing">
      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">
          <div className="nav-mark">KD</div>
          <div>
            <div className="nav-name">Kerala Disaster Management</div>
          </div>
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/alerts', { state: {} })}>Alerts</button>
          <button className="nav-link" onClick={() => navigate('/districts')}>Districts</button>
          <button className="nav-link" onClick={() => navigate('/shelters')}>Shelters</button>
          <button className="nav-link" onClick={() => navigate('/helplines')}>Helplines</button>
          <button className="nav-link" onClick={() => navigate('/about')}>About</button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn-sos" style={{ padding: '9px 20px', fontSize: '13px' }} onClick={handleSOS}>🆘 SOS</button>
          <button className="nav-cta" onClick={() => navigate('/login')}>Login / Sign Up</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-blob1"></div>
        <div className="hero-blob2"></div>
        <div className="hero-grid-pattern"></div>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge fade-up">
              <span className="hero-badge-dot"></span>Live · 10 Active Alerts Across Kerala
            </div>
            <h1 className="hero-h1 fade-up-1">
              Kerala's <span>Disaster</span>
              <br />Management
              <br />Portal
            </h1>
            <p className="hero-p fade-up-2">
              Real-time alerts, district risk levels, shelter locations and emergency helplines — all in one place. Built to protect every citizen of Kerala during disasters.
            </p>
            <div className="hero-btns fade-up-3">
              <button className="btn-primary" onClick={() => navigate('/login')}>Get Started →</button>
              <button className="btn-sos" onClick={handleSOS}>🆘 Emergency SOS</button>
              <button className="btn-secondary" onClick={handleLearnMore}>Learn More</button>
            </div>
            <div className="hero-stats fade-up-4">
              <div className="hero-stat">
                <div className="hs-num">14</div>
                <div className="hs-label">Districts Monitored</div>
              </div>
              <div className="hero-stat">
                <div className="hs-num">24/7</div>
                <div className="hs-label">Live Monitoring</div>
              </div>
              <div className="hero-stat">
                <div className="hs-num">1077</div>
                <div className="hs-label">KSNDMC Helpline</div>
              </div>
            </div>
          </div>

          <div className="hero-right fade-up-2">
            <div className="quote-carousel">
              {/* Background decorative elements */}
              <div className="quote-blob-1"></div>
              <div className="quote-blob-2"></div>

              {/* Quote Card */}
              <div className={`quote-card ${quoteIndex === 0 ? 'quote-hero' : ''}`} style={{ backgroundColor: quotes[quoteIndex].color + '15' }}>
                <div className="quote-emoji">{quotes[quoteIndex].emoji}</div>
                <div className={`quote-text ${quoteIndex === 0 ? 'hero-text' : ''}`}>"{quotes[quoteIndex].text}"</div>
                <div className="quote-author">— {quotes[quoteIndex].author}</div>
              </div>

              {/* Navigation Dots */}
              <div className="quote-dots">
                {quotes.map((_, idx) => (
                  <div
                    key={idx}
                    className={`quote-dot ${idx === quoteIndex ? 'active' : ''}`}
                    onClick={() => setQuoteIndex(idx)}
                    style={{
                      backgroundColor: idx === quoteIndex ? quotes[quoteIndex].color : '#ccc'
                    }}
                  ></div>
                ))}
              </div>

              {/* Arrow Buttons */}
              <button className="quote-arrow quote-arrow-prev" onClick={prevQuote}>
                &lt;
              </button>
              <button className="quote-arrow quote-arrow-next" onClick={nextQuote}>
                &gt;
              </button>

              {/* Quote Counter */}
              <div className="quote-counter">
                <span style={{ color: quotes[quoteIndex].color }}>{quoteIndex + 1}</span> / {quotes.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-label">🔴 LIVE ALERTS</div>
        <div className="ticker-track">
          <div className="ticker-inner">
            <div className="ticker-item"><span className="ticker-dot"></span>⚠️ RED ALERT — Wayanad: Flash flood warning issued. Evacuation advised near Chaliyar river basin.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>⛰️ LANDSLIDE RISK — Idukki: Munnar-Marayoor route closed. Do not travel.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>🌬️ HIGH TIDE WARNING — Kozhikode coast: Gusts up to 60 km/h. Fishermen must not venture into sea.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>🌧️ ORANGE ALERT — Malappuram: 120mm rainfall expected in 6 hours. Low-lying areas may flood.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>✅ ALL CLEAR — Thiruvananthapuram: No active alerts. Normal conditions.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>🏠 14 Relief shelters operational across Kerala · 847 people currently housed · Call 1077 for help</div>
            <div className="ticker-item"><span className="ticker-dot"></span>⚠️ RED ALERT — Wayanad: Flash flood warning issued. Evacuation advised near Chaliyar river basin.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>⛰️ LANDSLIDE RISK — Idukki: Munnar-Marayoor route closed. Do not travel.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>🌬️ HIGH TIDE WARNING — Kozhikode coast: Gusts up to 60 km/h. Fishermen must not venture into sea.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>🌧️ ORANGE ALERT — Malappuram: 120mm rainfall expected in 6 hours. Low-lying areas may flood.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>✅ ALL CLEAR — Thiruvananthapuram: No active alerts. Normal conditions.</div>
            <div className="ticker-item"><span className="ticker-dot"></span>🏠 14 Relief shelters operational across Kerala · 847 people currently housed · Call 1077 for help</div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-label">Features</div>
          <h2 className="section-h2">Everything you need<br />in a crisis.</h2>
          <p className="section-p">A comprehensive platform built for Kerala's unique geography — from the Western Ghats to the Arabian Sea coast.</p>
          <div className="features-grid">
            {features.map((feat, i) => (
              <div key={i} className={`feat-card fade-up-${i % 3}`}>
                <div className={`feat-icon fi-${feat.color}`}>{feat.icon}</div>
                <div className="feat-title">{feat.title}</div>
                <div className="feat-desc">{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISTRICTS SECTION */}
      <section className="districts-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-label">Districts</div>
          <h2 className="section-h2">All 14 Districts.<br />Real-Time Risk.</h2>
          <p className="section-p">Live risk assessment for every district updated every 30 minutes from official sources.</p>
          <div className="districts-grid">
            {districts.map((dist, i) => (
              <div key={i} className={`district-pill dp-${dist.risk}`}>
                <span className="dp-dot"></span>
                <span className="dp-name">{dist.name}</span>
                <span className="dp-level">{dist.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="stats-band">
        <div className="stats-band-inner">
          <div className="sb-stat">
            <div className="sbs-num">14</div>
            <div className="sbs-label">Districts Monitored</div>
          </div>
          <div className="sb-stat">
            <div className="sbs-num">24/7</div>
            <div className="sbs-label">Live Coverage</div>
          </div>
          <div className="sb-stat">
            <div className="sbs-num">847</div>
            <div className="sbs-label">Evacuees Currently Safe</div>
          </div>
          <div className="sb-stat">
            <div className="sbs-num">23</div>
            <div className="sbs-label">Rescue Teams Active</div>
          </div>
        </div>
      </section>

      {/* HOW SECTION */}
      <section className="how-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-label">How It Works</div>
          <h2 className="section-h2">Simple. Fast. Life-saving.</h2>
          <p className="section-p">From registration to getting help in under 2 minutes.</p>
          <div className="how-steps">
            {steps.map((step, i) => (
              <div key={i} className="how-step">
                <div className="hs-circle">{step.icon}</div>
                <div className="hs-num">{step.num}</div>
                <div className="hs-title">{step.title}</div>
                <div className="hs-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <h2 className="cta-h2">Be Prepared.<br />Not Caught Off Guard.</h2>
        <p className="cta-p">Join thousands of Kerala citizens staying safe with real-time disaster information.</p>
        <div className="cta-btns">
          <button className="btn-primary" style={{ fontSize: '15px', padding: '16px 36px' }} onClick={() => navigate('/login')}>Create Free Account →</button>
          <button className="btn-sos" style={{ fontSize: '15px', padding: '16px 36px' }} onClick={handleSOS}>🆘 Emergency SOS</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-mark">KD</div>
          <div>
            <div className="footer-name">Kerala Disaster Management</div>
            <div className="footer-sub">Government of Kerala · KSNDMC</div>
          </div>
        </div>
        <div className="footer-links">
          <span className="footer-link">About</span>
          <span className="footer-link">Privacy</span>
          <span className="footer-link">Contact</span>
          <span className="footer-link">API</span>
        </div>
        <div className="footer-right">© 2024 Kerala State Disaster Management · Emergency: 1077</div>
      </footer>

      {/* SOS MODAL */}
      {sosModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            width: '480px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'fadeUp 0.3s ease',
            position: 'relative'
          }}>
            <button 
              onClick={handleSOSClose}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e53935',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'all 0.2s',
                zIndex: 10001
              }}
              onMouseEnter={(e) => e.target.style.background = '#c62828'}
              onMouseLeave={(e) => e.target.style.background = '#e53935'}
            >
              ✕
            </button>
            
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: '800', color: '#1b4332', marginBottom: '6px' }}>
              🆘 Send Emergency SOS
            </div>
            
            <div style={{ fontSize: '14px', color: '#6a8f6a', marginBottom: '24px' }}>
              Your location will be shared with rescue teams immediately.
            </div>
            
            <div style={{
              padding: '14px',
              borderRadius: '12px',
              background: '#ffebee',
              border: '1px solid #ffcdd2',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#c62828',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              ⚠️ Only use this for genuine emergencies. False alerts may divert resources from real victims.
            </div>
            
            <form onSubmit={handleSOSSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#2d4a2d', marginBottom: '7px', display: 'block', letterSpacing: '0.2px' }}>
                  Your Name
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your full name"
                  value={sosForm.name}
                  onChange={(e) => setSosForm({...sosForm, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #d0e8d0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', sans-serif",
                    background: '#fff',
                    color: '#0d1f0d',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#2d4a2d', marginBottom: '7px', display: 'block', letterSpacing: '0.2px' }}>
                  Emergency Type
                </label>
                <select 
                  value={sosForm.emergencyType}
                  onChange={(e) => setSosForm({...sosForm, emergencyType: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #d0e8d0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', sans-serif",
                    background: '#fff',
                    color: '#0d1f0d',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    appearance: 'none'
                  }}
                >
                  <option>🌊 Flood — Stranded / Need Evacuation</option>
                  <option>⛰️ Landslide — Trapped / Injured</option>
                  <option>🏠 House Collapse / Structural Damage</option>
                  <option>🏥 Medical Emergency</option>
                  <option>🔥 Fire</option>
                  <option>Other Emergency</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#2d4a2d', marginBottom: '7px', display: 'block', letterSpacing: '0.2px' }}>
                  Your Location / Landmark
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Near Chaliyar bridge, Kalpetta"
                  value={sosForm.location}
                  onChange={(e) => setSosForm({...sosForm, location: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #d0e8d0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', sans-serif",
                    background: '#fff',
                    color: '#0d1f0d',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#2d4a2d', marginBottom: '7px', display: 'block', letterSpacing: '0.2px' }}>
                  Number of People Affected
                </label>
                <input 
                  type="number" 
                  placeholder="e.g. 4" 
                  min="1"
                  value={sosForm.peopleAffected}
                  onChange={(e) => setSosForm({...sosForm, peopleAffected: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #d0e8d0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: "'DM Sans', sans-serif",
                    background: '#fff',
                    color: '#0d1f0d',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <button 
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#e53935',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.25s',
                  marginTop: '10px',
                  boxSizing: 'border-box'
                }}
              >
                🆘 Send SOS Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
