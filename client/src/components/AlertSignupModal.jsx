import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AlertSignupModal.css';

export default function AlertSignupModal({ isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    district: '',
    password: '',
    confirmPassword: '',
    districts: [],
    alertTypes: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  const keralaDistricts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
    'Kottayam', 'Ernakulam', 'Idukki', 'Thrissur', 'Palakkad',
    'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const alertTypes = [
    { id: 'flood', label: '🌊 Flood Alerts', icon: '🌊' },
    { id: 'landslide', label: '⛰️ Landslide Warnings', icon: '⛰️' },
    { id: 'weather', label: '🌧️ Weather Alerts', icon: '🌧️' },
    { id: 'evacuation', label: '🚨 Evacuation Orders', icon: '🚨' },
    { id: 'infrastructure', label: '🏗️ Infrastructure Issues', icon: '🏗️' },
    { id: 'advisory', label: '📋 General Advisories', icon: '📋' }
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
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit phone number';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.district) newErrors.district = 'Please select your district';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.districts.length === 0) newErrors.districts = 'Please select at least one alert district';
    if (formData.alertTypes.length === 0) newErrors.alertTypes = 'Please select at least one alert type';
    return newErrors;
  };

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    const strengthLevels = [
      { score: 0, label: 'Too Weak', color: '#e53935' },
      { score: 1, label: 'Weak', color: '#fb8c00' },
      { score: 2, label: 'Fair', color: '#ffb300' },
      { score: 3, label: 'Good', color: '#52b788' },
      { score: 4, label: 'Strong', color: '#1b4332' },
      { score: 5, label: 'Very Strong', color: '#081c15' }
    ];

    return strengthLevels[Math.min(score, 5)];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password' && value) {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDistrictToggle = (district) => {
    setFormData(prev => ({
      ...prev,
      districts: prev.districts.includes(district)
        ? prev.districts.filter(d => d !== district)
        : [...prev.districts, district]
    }));
    if (errors.districts) {
      setErrors(prev => ({
        ...prev,
        districts: ''
      }));
    }
  };

  const handleAlertTypeToggle = (typeId) => {
    setFormData(prev => ({
      ...prev,
      alertTypes: prev.alertTypes.includes(typeId)
        ? prev.alertTypes.filter(t => t !== typeId)
        : [...prev.alertTypes, typeId]
    }));
    if (errors.alertTypes) {
      setErrors(prev => ({
        ...prev,
        alertTypes: ''
      }));
    }
  };

  const handleSelectAllDistricts = () => {
    if (formData.districts.length === keralaDistricts.length) {
      setFormData(prev => ({
        ...prev,
        districts: []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        districts: [...keralaDistricts]
      }));
    }
  };

  const handleSelectAllTypes = () => {
    if (formData.alertTypes.length === alertTypes.length) {
      setFormData(prev => ({
        ...prev,
        alertTypes: []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        alertTypes: alertTypes.map(t => t.id)
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
      // Store user profile
      localStorage.setItem('userProfile', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        district: formData.district,
        signupDate: new Date().toISOString()
      }));

      // Store alert preferences
      localStorage.setItem('alertPreferences', JSON.stringify({
        email: formData.email,
        districts: formData.districts,
        alertTypes: formData.alertTypes,
        signupDate: new Date().toISOString()
      }));

      setSubmitted(true);

      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          district: '',
          password: '',
          confirmPassword: '',
          districts: [],
          alertTypes: []
        });
        setErrors({});
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      setErrors({
        submit: error.message || 'Failed to complete signup. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAlreadyHaveAccount = () => {
    onClose();
    navigate('/login');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleReturn = () => {
    handleCloseClick({ preventDefault: () => {}, stopPropagation: () => {} });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick}></div>
      <div className="alert-signup-modal large">
        <button className="modal-close" onClick={handleCloseClick} type="button">✕</button>

        {submitted ? (
          <div className="signup-success">
            <div className="success-icon">✅</div>
            <h2>Welcome, {formData.firstName}!</h2>
            <p>Your account has been created successfully!</p>
            <div className="success-summary">
              <div className="summary-section">
                <strong>Profile Information:</strong>
                <div className="summary-info">
                  <p>👤 {formData.firstName} {formData.lastName}</p>
                  <p>📧 {formData.email}</p>
                  <p>📱 {formData.phone}</p>
                  <p>📍 {formData.district}</p>
                </div>
              </div>
              <div className="summary-section">
                <strong>Alert Preferences:</strong>
                <div className="summary-items">
                  {formData.districts.map(d => (
                    <span key={d} className="summary-item">📍 {d}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="success-message">
              🎉 You're now receiving alerts for {formData.districts.length} district{formData.districts.length !== 1 ? 's' : ''}. Check your email for important updates!
            </p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>🔔 Sign Up for Alerts</h2>
              <p>Create your account and receive real-time disaster alerts</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {errors.submit && (
                <div className="error-message">{errors.submit}</div>
              )}

              {/* Personal Information Section */}
              <div className="form-section">
                <h3 className="section-title">👤 Your Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={`form-control ${errors.firstName ? 'error' : ''}`}
                    />
                    {errors.firstName && <div className="field-error">{errors.firstName}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={`form-control ${errors.lastName ? 'error' : ''}`}
                    />
                    {errors.lastName && <div className="field-error">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={`form-control ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <div className="field-error">{errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength="10"
                      className={`form-control ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone && <div className="field-error">{errors.phone}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Location (District) *</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={`form-control ${errors.district ? 'error' : ''}`}
                  >
                    <option value="">Select your district</option>
                    {keralaDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && <div className="field-error">{errors.district}</div>}
                </div>
              </div>

              {/* Security Section */}
              <div className="form-section">
                <h3 className="section-title">🔒 Security</h3>
                
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={`form-control ${errors.password ? 'error' : ''}`}
                  />
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div
                          className={`strength-fill ${passwordStrength.label.replace(' ', '-').toLowerCase()}`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            backgroundColor: passwordStrength.color
                          }}
                        ></div>
                      </div>
                      <span style={{ color: passwordStrength.color, fontSize: '0.85rem' }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                  {errors.password && <div className="field-error">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                  />
                  {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                </div>
              </div>

              {/* Alert Preferences Section */}
              <div className="form-section">
                <h3 className="section-title">🔔 Alert Preferences</h3>
                
                <div className="form-group">
                  <div className="field-header">
                    <label className="form-label">Select Alert Districts *</label>
                    <button
                      type="button"
                      className="select-all-btn"
                      onClick={handleSelectAllDistricts}
                    >
                      {formData.districts.length === keralaDistricts.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="checkbox-grid">
                    {keralaDistricts.map(district => (
                      <label key={district} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={formData.districts.includes(district)}
                          onChange={() => handleDistrictToggle(district)}
                        />
                        <span>{district}</span>
                      </label>
                    ))}
                  </div>
                  {errors.districts && <div className="field-error">{errors.districts}</div>}
                  <div className="selection-count">
                    {formData.districts.length} district{formData.districts.length !== 1 ? 's' : ''} selected
                  </div>
                </div>

                <div className="form-group">
                  <div className="field-header">
                    <label className="form-label">Alert Types *</label>
                    <button
                      type="button"
                      className="select-all-btn"
                      onClick={handleSelectAllTypes}
                    >
                      {formData.alertTypes.length === alertTypes.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="alert-types-grid">
                    {alertTypes.map(type => (
                      <label key={type.id} className="alert-type-checkbox">
                        <input
                          type="checkbox"
                          value={type.id}
                          checked={formData.alertTypes.includes(type.id)}
                          onChange={() => handleAlertTypeToggle(type.id)}
                        />
                        <span className="type-icon">{type.icon}</span>
                        <span className="type-label">{type.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.alertTypes && <div className="field-error">{errors.alertTypes}</div>}
                  <div className="selection-count">
                    {formData.alertTypes.length} alert type{formData.alertTypes.length !== 1 ? 's' : ''} selected
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="form-info">
                <strong>ℹ️ What Happens Next:</strong>
                <ul>
                  <li>Your account will be created with the credentials you provided</li>
                  <li>You can log in anytime to update your preferences</li>
                  <li>Alerts will be sent to your email address</li>
                  <li>Your data is secure and never shared with third parties</li>
                </ul>
              </div>

              {/* Privacy Notice */}
              <div className="privacy-notice">
                By signing up, you agree to our Privacy Policy and Terms of Service
              </div>

              {/* Buttons */}
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
                  {loading ? 'Creating Account...' : '✓ Create Account & Get Alerts'}
                </button>
              </div>

              {/* Already Have Account Link */}
              <div className="account-link">
                Already have an account? 
                <button
                  type="button"
                  className="text-link"
                  onClick={handleAlreadyHaveAccount}
                >
                  Log in here
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
