import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';
import '../styles/shared.css';
import './SubmitAlertPage.css';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Ernakulam', 'Idukki', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

const DISASTER_TYPES = [
  'Flood', 'Landslide', 'Cyclone', 'Heavy Rainfall',
  'Coastal Erosion', 'Dam Overflow', 'Infrastructure Damage',
  'Avalanche', 'Other'
];

export default function SubmitAlertPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    district: '',
    disasterType: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    severity: 'medium',
    email: user?.email || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div>
        <Topbar />
        <div className="page-content submit-alert-page">
          <div className="auth-required">
            <div className="auth-icon">🔒</div>
            <h2>Authentication Required</h2>
            <p>You need to be logged in to submit an alert.</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/login')}
            >
              ← Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.disasterType) newErrors.disasterType = 'Disaster type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.severity) newErrors.severity = 'Severity level is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/alerts/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          placeName: formData.location,
          title: formData.title,
          description: formData.description,
          severity: formData.severity,
          email: formData.email,
          district: formData.district,
          disasterType: formData.disasterType,
          date: formData.date
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit alert');
      }

      await response.json();
      
      setSuccessMessage('✅ Alert submitted successfully! Our team will review and verify it soon.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        district: '',
        disasterType: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        severity: 'medium',
        email: user?.email || ''
      });
      setErrors({});

      // Redirect to alerts page after 2 seconds
      setTimeout(() => {
        navigate('/alerts');
      }, 2000);
    } catch (error) {
      console.error('Error submitting alert:', error);
      setErrorMessage(error.message || 'An error occurred while submitting your alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Topbar />
      <main className="page-content submit-alert-page">
        <div className="submit-header">
          <button className="back-btn" onClick={() => navigate('/alerts')}>← Back to Alerts</button>
          <div className="header-content">
            <h1 className="page-title">📢 Submit a Disaster Alert</h1>
            <p className="page-subtitle">
              Help keep Kerala safe by reporting disasters and emergencies you witness
            </p>
          </div>
        </div>

        <section className="form-section">
          <div className="info-box">
            <div className="info-icon">ℹ️</div>
            <div className="info-text">
              <h3>How Your Report Helps</h3>
              <p>Your firsthand information helps our team verify and publish accurate alerts that protect thousands of people. Every report is valuable in our mission to keep Kerala safe.</p>
            </div>
          </div>

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="alert-form">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Alert Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Brief title for the alert (e.g., 'Severe Flooding in Kokkanad')"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Detailed description of the disaster or emergency (minimum 20 characters)"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className={errors.description ? 'error' : ''}
              ></textarea>
              <div className="char-count">{formData.description.length} / 500 characters</div>
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            {/* District and Type */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="district">District *</label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={errors.district ? 'error' : ''}
                >
                  <option value="">Select District</option>
                  {KERALA_DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <span className="error-text">{errors.district}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="disasterType">Disaster Type *</label>
                <select
                  id="disasterType"
                  name="disasterType"
                  value={formData.disasterType}
                  onChange={handleChange}
                  className={errors.disasterType ? 'error' : ''}
                >
                  <option value="">Select Type</option>
                  {DISASTER_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.disasterType && <span className="error-text">{errors.disasterType}</span>}
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g., Main Street, City Center"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>

            {/* Date and Severity */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="severity">Severity *</label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className={errors.severity ? 'error' : ''}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                {errors.severity && <span className="error-text">{errors.severity}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                disabled
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Submit Buttons */}
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Alert'}
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => navigate('/alerts')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
