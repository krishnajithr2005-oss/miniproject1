import React from 'react';
import Topbar from '../components/Topbar';
import './Dashboard.css';

export default function AboutPage() {
  return (
    <div>
      <Topbar />
      <main className="page-content">
        <div className="page-header">
          <h1>ℹ️ About</h1>
          <p>Learn more about Kerala Disaster Management Portal</p>
        </div>
        <section className="dashboard-section">
          <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.8' }}>
            
            <h2>Our Mission</h2>
            <p>
              Kerala Disaster Management Portal is built to provide real-time disaster alerts, information, and support to citizens across all 14 districts of Kerala. We aim to save lives through quick, accurate, and actionable information during emergencies.
            </p>

            <h2>What We Do</h2>
            <ul style={{ fontSize: '1rem' }}>
              <li>📡 Monitor disaster situations 24/7 from official sources (IMD, KSNDMC)</li>
              <li>🔔 Send real-time alerts to citizens in affected areas</li>
              <li>🗺️ Display interactive maps of risk zones and shelter locations</li>
              <li>🆘 Enable one-tap SOS requests connected to rescue teams</li>
              <li>📚 Provide preparedness guides and safety information</li>
              <li>👥 Empower citizens to report disasters and help their communities</li>
            </ul>

            <h2>Our Team</h2>
            <p>
              We are a dedicated team of disaster management professionals, software engineers, and community advocates working to make Kerala safer.
            </p>

            <h2>Key Features</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>🔔 Real-Time Alerts</h4>
                <p>Instant notifications for disasters in your area</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>🗺️ Risk Maps</h4>
                <p>Live visualization of flood zones and risk areas</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>⛺ Shelter Finder</h4>
                <p>Locate nearest relief shelters with real-time capacity</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>🌧️ Weather Intelligence</h4>
                <p>Hyperlocal weather data and forecasts</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>🆘 Emergency SOS</h4>
                <p>One-tap rescue request with location sharing</p>
              </div>
              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4>📋 Preparedness Guides</h4>
                <p>Step-by-step disaster readiness information</p>
              </div>
            </div>

            <h2>Contact Us</h2>
            <p>
              <strong>Emergency Helpline:</strong> 1077 (KSNDMC)<br />
              <strong>Fire:</strong> 101<br />
              <strong>Police:</strong> 100<br />
              <strong>Ambulance:</strong> 108
            </p>

            <h2>Follow Us</h2>
            <p>
              Stay connected for updates on disaster preparedness and community safety initiatives.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
