import React, { useState, useEffect } from 'react';
import './AlertSubmissionModal.css';

export default function AlertSubmissionModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    placeName: '',
    description: '',
    severity: 'moderate',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 
    'Kottayam', 'Ernakulam', 'Idukki', 'Thrissur', 'Palakkad', 
    'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSubmitted(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.placeName.trim()) newErrors.placeName = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.severity) newErrors.severity = 'Severity level is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
          placeName: formData.placeName,
          title: `User Report: ${formData.placeName}`,
          description: formData.description,
          severity: formData.severity,
          email: formData.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit alert');
      }

      const data = await response.json();
      setSubmitted(true);
      
      setTimeout(() => {
        setFormData({
          placeName: '',
          description: '',
          severity: 'moderate',
          email: ''
        });
        setErrors({});
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      setErrors({
        submit: error.message || 'Failed to submit alert. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking on the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick}></div>
      <div className="alert-submission-modal">
        <button className="modal-close" onClick={handleCloseClick} type="button">✕</button>
        
        {submitted ? (
          <div className="submission-success">
            <div className="success-icon">✅</div>
            <h2>Thank You!</h2>
            <p>Your alert report has been submitted successfully.</p>
            <p className="success-message">Our team will verify and review your report within 24 hours. If it's confirmed, it will be published to help protect your community.</p>
            <div className="success-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-text">Our team verifies your report</div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-text">We confirm the details</div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-text">Alert is published to the system</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>📢 Report an Alert</h2>
              <p>Help us protect your community by reporting a disaster or emergency</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {errors.submit && (
                <div className="error-message">{errors.submit}</div>
              )}

              <div className="form-group">
                <label className="form-label">Location / District *</label>
                <select
                  name="placeName"
                  value={formData.placeName}
                  onChange={handleChange}
                  className={`form-control ${errors.placeName ? 'error' : ''}`}
                >
                  <option value="">Select district or location</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.placeName && <div className="field-error">{errors.placeName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">What Happened? *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what you witnessed (at least 10 characters)..."
                  rows="4"
                  className={`form-control ${errors.description ? 'error' : ''}`}
                />
                <div className="char-count">{formData.description.length}/500</div>
                {errors.description && <div className="field-error">{errors.description}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Severity Level *</label>
                <div className="severity-options">
                  {[
                    { value: 'low', label: '🟢 Low', color: '#4CAF50' },
                    { value: 'moderate', label: '🟡 Moderate', color: '#FFC107' },
                    { value: 'high', label: '🔴 High', color: '#F44336' }
                  ].map(option => (
                    <label key={option.value} className="severity-option">
                      <input
                        type="radio"
                        name="severity"
                        value={option.value}
                        checked={formData.severity === option.value}
                        onChange={handleChange}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.severity && <div className="field-error">{errors.severity}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Your Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
                <small>We'll use this to contact you if we need more information about your report.</small>
              </div>

              <div className="form-info">
                <strong>📝 Important:</strong> Please ensure the information you provide is accurate. False reports may result in account restriction.
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseClick}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Alert Report'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
