import React, { useState } from 'react';
import SOSPanel from '../components/SOSPanel';

export default function SOSPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    severity: 'high',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', location: '', description: '', severity: 'high' });
    }, 3000);
  };

  return (
    <main className="page-content">
      <div className="page-header">
        <h1>🚨 SOS Emergency Request</h1>
        <p>Submit an emergency SOS request for immediate assistance</p>
      </div>
      <div className="sos-page-grid">
        <section className="dashboard-section">
          <div className="sos-form-container">
            <h3>📝 Submit SOS Request</h3>
            {submitted && (
              <div className="success-message">
                ✓ SOS Request Submitted! Emergency response team is on the way.
              </div>
            )}
            <form className="sos-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Current Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Enter your location or describe the area"
                />
              </div>
              <div className="form-group">
                <label htmlFor="severity">Severity Level</label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe your emergency situation"
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">
                🚨 Submit SOS Request
              </button>
            </form>
          </div>
        </section>
        <section className="dashboard-section">
          <SOSPanel />
        </section>
      </div>
    </main>
  );
}
