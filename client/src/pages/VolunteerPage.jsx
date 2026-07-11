import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';
import './VolunteerPage.css';
import { apiUrl } from '../config/api';

export default function VolunteerPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(true); // Form always visible for testing
  
  // Debug: Log form state changes
  console.log("🤝 VOLUNTEER PAGE: showForm state:", showForm);
  
  // Debug: Log page load
  console.log("📱 VOLUNTEER PAGE LOADED");
  
  // Debug: Log blue button click
  const handleBlueButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔵 BLUE REGISTER BUTTON CLICKED");
    console.log("🔍 SETTING SHOWFORM TO TRUE");
    setShowForm(true);
  };
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    skills: [],
    experience: '',
    availability: '',
    languages: [],
    motivation: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const KERALA_DISTRICTS = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
    'Kottayam', 'Ernakulam', 'Idukki', 'Thrissur', 'Palakkad',
    'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const SKILLS_OPTIONS = [
    { id: 'first-aid', label: 'First Aid' },
    { id: 'swimming', label: 'Swimming' },
    { id: 'driving', label: 'Driving' },
    { id: 'medical', label: 'Medical Background' },
    { id: 'counseling', label: 'Counseling' },
    { id: 'rescue', label: 'Rescue Operations' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'communication', label: 'Communication' },
  ];

  const LANGUAGE_OPTIONS = [
    'Malayalam', 'English', 'Hindi', 'Tamil', 'Telugu'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'skills') {
        setFormData(prev => ({
          ...prev,
          skills: checked
            ? [...prev.skills, value]
            : prev.skills.filter(s => s !== value)
        }));
      } else if (name === 'languages') {
        setFormData(prev => ({
          ...prev,
          languages: checked
            ? [...prev.languages, value]
            : prev.languages.filter(l => l !== value)
        }));
      }
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, document: e.target.files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Please enter a valid 10-digit phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.district) newErrors.district = 'Please select a district';
    if (formData.skills.length === 0) newErrors.skills = 'Please select at least one skill';
    if (!formData.availability) newErrors.availability = 'Please select availability';
    if (formData.languages.length === 0) newErrors.languages = 'Please select at least one language';
    if (!formData.motivation.trim()) newErrors.motivation = 'Please tell us your motivation';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 VOLUNTEER FORM SUBMIT CLICKED");
    if (!validateForm()) {
      console.log("❌ FORM VALIDATION FAILED");
      return;
    }

    console.log("✅ FORM VALIDATION PASSED, SETTING LOADING");
    setLoading(true);
    
    // Debug: Check if form is actually visible
    console.log("🔍 FORM VISIBILITY CHECK - showForm:", showForm, "formData:", formData);

    try {
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(/\s+/);

      const response = await fetch(apiUrl('/api/volunteers/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName: lastNameParts.join(' ') || firstName,
          email: formData.email,
          phone: formData.phone,
          district: formData.district,
          skillsAndExperience: [
            `Skills: ${formData.skills.join(', ')}`,
            formData.experience ? `Experience: ${formData.experience}` : '',
            formData.motivation ? `Motivation: ${formData.motivation}` : '',
            formData.languages.length ? `Languages: ${formData.languages.join(', ')}` : ''
          ].filter(Boolean).join(' | '),
          availability: formData.availability,
          address: formData.address,
          documentProof: formData.document?.name || null,
          userId: user?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit volunteer application');
      }

      setSuccessMessage('✅ Thank you for applying! Our team will review your application within 48 hours.');

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        district: '',
        skills: [],
        experience: '',
        availability: '',
        languages: [],
        motivation: '',
        document: null,
      });

      // Close form after 2 seconds
      setTimeout(() => {
        setShowForm(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      setErrors({ submit: error.message || 'Failed to submit. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Topbar />
      <main className="page-content">
        {/* Hero Section */}
        <section className="volunteer-hero">
          <div className="hero-content">
            <h1>🤝 Join Our Volunteer Network</h1>
            <p>Be the change in your community. Help those in need during emergencies and disasters.</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="volunteer-content">
          <div className="volunteer-container">
            {/* What We Do */}
            <div className="what-we-do">
              <h2>What Volunteers Do</h2>
              <div className="activities-grid">
                <div className="activity-card">
                  <span className="activity-icon">🚑</span>
                  <h4>Emergency Response</h4>
                  <p>Assist in rescue and relief operations</p>
                </div>
                <div className="activity-card">
                  <span className="activity-icon">🤝</span>
                  <h4>Community Support</h4>
                  <p>Help vulnerable people and provide care</p>
                </div>
                <div className="activity-card">
                  <span className="activity-icon">📱</span>
                  <h4>Communication</h4>
                  <p>Spread awareness and coordinate relief</p>
                </div>
                <div className="activity-card">
                  <span className="activity-icon">📚</span>
                  <h4>Training & Education</h4>
                  <p>Conduct disaster preparedness workshops</p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="requirements-section">
              <h2>Volunteer Requirements</h2>
              <ul className="requirements-list">
                <li>✓ Must be at least 18 years old</li>
                <li>✓ Sound physical and mental health</li>
                <li>✓ Willing to undergo training</li>
                <li>✓ Commitment to community service</li>
                <li>✓ Valid ID proof</li>
              </ul>
            </div>

            {/* CTA Button */}
            {!showForm && (
              <div className="cta-section">
                <button
                  className="btn-apply-now"
                  onClick={(e) => handleBlueButtonClick(e)}
                  style={{
                    position: 'relative',
                    zIndex: 1001,
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                  }}
                >
                  Register Here
                </button>
              </div>
            )}

            {/* Volunteer Form Modal */}
            {showForm && (
              <div className="volunteer-form-modal" style={{zIndex: 1000}}>
                <div className="form-backdrop" style={{zIndex: 999, pointerEvents: 'none'}}></div>
                <div className="form-container" style={{zIndex: 1001, pointerEvents: 'auto'}}>
                  <div className="form-header">
                    <h2>🤝 Volunteer Registration Form</h2>
                    <button className="close-form" onClick={() => setShowForm(false)}>✕</button>
                  </div>

                  {successMessage && (
                    <div className="success-message">{successMessage}</div>
                  )}

                  {errors.submit && (
                    <div className="error-message">{errors.submit}</div>
                  )}

                  <form onSubmit={handleSubmit} className="volunteer-form">
                    {/* Personal Information */}
                    <div className="form-section">
                      <h3>📋 Personal Information</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={errors.fullName ? 'error' : ''}
                          />
                          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                        </div>
                        <div className="form-group">
                          <label>Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className={errors.email ? 'error' : ''}
                          />
                          {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="10-digit phone number"
                            className={errors.phone ? 'error' : ''}
                          />
                          {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>
                        <div className="form-group">
                          <label>District *</label>
                          <select
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
                      </div>

                      <div className="form-group">
                        <label>Address *</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter your full address"
                          rows="3"
                          className={errors.address ? 'error' : ''}
                        ></textarea>
                        {errors.address && <span className="error-text">{errors.address}</span>}
                      </div>
                    </div>

                    {/* Skills & Experience */}
                    <div className="form-section">
                      <h3>🎯 Skills & Experience</h3>
                      
                      <div className="form-group">
                        <label>Skills *</label>
                        <div className="skills-grid">
                          {SKILLS_OPTIONS.map(skill => (
                            <label key={skill.id} className="checkbox-item">
                              <input
                                type="checkbox"
                                name="skills"
                                value={skill.id}
                                checked={formData.skills.includes(skill.id)}
                                onChange={handleChange}
                              />
                              <span>{skill.label}</span>
                            </label>
                          ))}
                        </div>
                        {errors.skills && <span className="error-text">{errors.skills}</span>}
                      </div>

                      <div className="form-group">
                        <label>Years of Experience</label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                        >
                          <option value="">Select Experience Level</option>
                          <option value="beginner">Beginner (0-1 year)</option>
                          <option value="intermediate">Intermediate (1-3 years)</option>
                          <option value="experienced">Experienced (3+ years)</option>
                        </select>
                      </div>
                    </div>

                    {/* Availability & Languages */}
                    <div className="form-section">
                      <h3>🌍 Availability & Communication</h3>
                      
                      <div className="form-group">
                        <label>Availability *</label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          className={errors.availability ? 'error' : ''}
                        >
                          <option value="">Select Availability</option>
                          <option value="full-time">Full-Time</option>
                          <option value="part-time">Part-Time</option>
                          <option value="weekends">Weekends Only</option>
                          <option value="emergencies">During Emergencies Only</option>
                        </select>
                        {errors.availability && <span className="error-text">{errors.availability}</span>}
                      </div>

                      <div className="form-group">
                        <label>Languages *</label>
                        <div className="languages-grid">
                          {LANGUAGE_OPTIONS.map(lang => (
                            <label key={lang} className="checkbox-item">
                              <input
                                type="checkbox"
                                name="languages"
                                value={lang}
                                checked={formData.languages.includes(lang)}
                                onChange={handleChange}
                              />
                              <span>{lang}</span>
                            </label>
                          ))}
                        </div>
                        {errors.languages && <span className="error-text">{errors.languages}</span>}
                      </div>
                    </div>

                    {/* Motivation */}
                    <div className="form-section">
                      <h3>💬 Tell Us More</h3>
                      
                      <div className="form-group">
                        <label>Why do you want to volunteer? *</label>
                        <textarea
                          name="motivation"
                          value={formData.motivation}
                          onChange={handleChange}
                          placeholder="Share your motivation and what you hope to contribute..."
                          rows="4"
                          className={errors.motivation ? 'error' : ''}
                        ></textarea>
                        {errors.motivation && <span className="error-text">{errors.motivation}</span>}
                      </div>
                    </div>

                    
                    {/* Form Actions */}
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setShowForm(false)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-submit-volunteer"
                        disabled={loading}
                      >
                        {loading ? '⏳ Submitting...' : '✓ Submit Application'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
