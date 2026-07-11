import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';
import Shelters from '../components/Shelters';
import './SheltersPage.css';
import { apiUrl } from '../config/api';

export default function SheltersPage() {
  const { user, isAuthenticated } = useAuth();
  const [showAddShelterForm, setShowAddShelterForm] = useState(false);
  const [formData, setFormData] = useState({
    shelterName: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    address: '',
    district: '',
    capacity: '',
    amenities: [],
    description: '',
    coordinates: { lat: '', lng: '' },
    contactPerson: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const KERALA_DISTRICTS = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
    'Kottayam', 'Ernakulam', 'Idukki', 'Thrissur', 'Palakkad',
    'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const AMENITIES_OPTIONS = [
    { id: 'water', label: '💧 Water Supply' },
    { id: 'food', label: '🍽️ Food Facilities' },
    { id: 'medical', label: '🏥 Medical Care' },
    { id: 'electricity', label: '⚡ Electricity' },
    { id: 'bathrooms', label: '🚽 Bathrooms' },
    { id: 'bedding', label: '🛏️ Bedding' },
    { id: 'heating', label: '🔥 Heating' },
    { id: 'wifi', label: '📶 WiFi' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, name]
          : prev.amenities.filter(a => a !== name)
      }));
    } else if (name.includes('coordinate')) {
      const coord = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        coordinates: { ...prev.coordinates, [coord]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const isValidPersonName = (name) => /^[A-Za-z\s.'-]+$/.test(name.trim());

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shelterName.trim()) newErrors.shelterName = 'Shelter name is required';
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    } else if (!isValidPersonName(formData.ownerName)) {
      newErrors.ownerName = 'Owner name must contain only letters and spaces';
    }
    if (!formData.ownerEmail.trim()) newErrors.ownerEmail = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) newErrors.ownerEmail = 'Invalid email';
    if (!formData.ownerPhone.trim()) newErrors.ownerPhone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.capacity || isNaN(formData.capacity) || formData.capacity < 1) newErrors.capacity = 'Capacity must be a valid number';
    if (formData.amenities.length === 0) newErrors.amenities = 'Select at least one amenity';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    } else if (!isValidPersonName(formData.contactPerson)) {
      newErrors.contactPerson = 'Contact person name must contain only letters and spaces';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch(apiUrl('/api/shelters/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shelterName: formData.shelterName,
          ownerName: formData.ownerName,
          ownerEmail: formData.ownerEmail,
          district: formData.district,
          address: formData.address,
          capacity: formData.capacity,
          amenities: formData.amenities,
          contactPerson: formData.contactPerson,
          ownerPhone: formData.ownerPhone,
          coordinates: {
            latitude: Number(formData.coordinates.lat) || 0,
            longitude: Number(formData.coordinates.lng) || 0
          },
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit shelter registration');
      }

      setSuccessMessage('✅ Shelter registration submitted! Our team will review and approve it within 24-48 hours.');
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        shelterName: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        address: '',
        district: '',
        capacity: '',
        amenities: [],
        description: '',
        coordinates: { lat: '', lng: '' },
        contactPerson: ''
      });
    } catch (error) {
      console.error('Error submitting shelter:', error);
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
        <section className="shelters-hero">
          <div className="shelter-hero-content">
            <h1>🏢 Emergency Shelters Network</h1>
            <p>Find safe places to stay during disasters and emergencies</p>
          </div>
        </section>

        {/* Map Section */}
        <section className="shelters-map-section">
          <div className="map-container">
            <Shelters />
          </div>
        </section>

        {/* Add Shelter CTA Section */}
        <section className="add-shelter-section">
          <div className="add-shelter-container">
            <div className="add-shelter-content">
              <div className="add-shelter-icon">🏠</div>
              <h2>Can You Offer a Shelter?</h2>
              <p>
                If you own a building, property, or facility that can accommodate people during emergencies, 
                we'd love to have you join our shelter network. Your contribution can save lives.
              </p>
              
              <div className="why-join">
                <h3>Why Join as a Shelter Provider?</h3>
                <ul>
                  <li>
                    <span className="benefit-icon">🛡️</span>
                    <div>
                      <strong>Community Support</strong>
                      <p>Help vulnerable people during critical times</p>
                    </div>
                  </li>
                  <li>
                    <span className="benefit-icon">📱</span>
                    <div>
                      <strong>Wide Visibility</strong>
                      <p>Your shelter appears on our platform reaching thousands</p>
                    </div>
                  </li>
                  <li>
                    <span className="benefit-icon">✅</span>
                    <div>
                      <strong>Official Recognition</strong>
                      <p>Government verified and publicly recognized</p>
                    </div>
                  </li>
                  <li>
                    <span className="benefit-icon">📞</span>
                    <div>
                      <strong>24/7 Support</strong>
                      <p>We provide coordination and assistance when needed</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="requirements">
                <h3>Requirements</h3>
                <p>To register your shelter, you need:</p>
                <ul className="requirements-list">
                  <li>✓ Valid property ownership or authorization</li>
                  <li>✓ Minimum capacity of 5 people</li>
                  <li>✓ Basic amenities (water, bathrooms)</li>
                  <li>✓ Valid contact information</li>
                  <li>✓ Document proof of ownership/authorization</li>
                </ul>
              </div>

              <div className="register-note">
                <p>
                  You can submit your shelter details now. Our team will review your registration and forward it to admin for verification before it is published on the dashboard.
                </p>
              </div>

              <button
                className="btn-add-shelter"
                onClick={() => setShowAddShelterForm(true)}
              >
                + Register Your Shelter
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Add Shelter Modal */}
      {showAddShelterForm && (
        <>
          <div className="modal-backdrop" onClick={() => setShowAddShelterForm(false)}></div>
          <div className="shelter-form-modal">
            <button 
              className="modal-close" 
              onClick={() => setShowAddShelterForm(false)}
              type="button"
            >
              ✕
            </button>

            <div className="form-header">
              <h2>🏠 Register Your Shelter</h2>
              <p>Fill in the details below. Our team will review and approve your shelter within 24-48 hours.</p>
            </div>

            {errors.submit && (
              <div className="error-alert">{errors.submit}</div>
            )}

            {successMessage && (
              <div className="success-alert">{successMessage}</div>
            )}

            <form onSubmit={handleSubmit} className="shelter-form">
              {/* Section 1: Shelter Information */}
              <div className="form-section">
                <h3>📋 Shelter Information</h3>
                
                <div className="form-group">
                  <label>Shelter Name *</label>
                  <input
                    type="text"
                    name="shelterName"
                    value={formData.shelterName}
                    onChange={handleChange}
                    placeholder="e.g., Community Center, School Building, Hotel"
                    className={errors.shelterName ? 'error' : ''}
                  />
                  {errors.shelterName && <span className="error-text">{errors.shelterName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Capacity (Number of People) *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="Minimum 5 people"
                      min="5"
                      className={errors.capacity ? 'error' : ''}
                    />
                    {errors.capacity && <span className="error-text">{errors.capacity}</span>}
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
                      {KERALA_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.district && <span className="error-text">{errors.district}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address, city, postal code"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label>Description of Shelter *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the shelter facilities, building type, etc."
                    rows="3"
                    className={errors.description ? 'error' : ''}
                  ></textarea>
                  {errors.description && <span className="error-text">{errors.description}</span>}
                </div>
              </div>

              {/* Section 2: Owner/Contact Information */}
              <div className="form-section">
                <h3>👤 Owner/Contact Information</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name (Owner) *</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={errors.ownerName ? 'error' : ''}
                    />
                    {errors.ownerName && <span className="error-text">{errors.ownerName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Contact Person Name *</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="Name of person to contact"
                      className={errors.contactPerson ? 'error' : ''}
                    />
                    {errors.contactPerson && <span className="error-text">{errors.contactPerson}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.ownerEmail ? 'error' : ''}
                    />
                    {errors.ownerEmail && <span className="error-text">{errors.ownerEmail}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className={errors.ownerPhone ? 'error' : ''}
                    />
                    {errors.ownerPhone && <span className="error-text">{errors.ownerPhone}</span>}
                  </div>
                </div>
              </div>

              {/* Section 3: Amenities */}
              <div className="form-section">
                <h3>🛏️ Available Amenities *</h3>
                <p className="section-note">Select at least one amenity</p>
                
                <div className="amenities-grid">
                  {AMENITIES_OPTIONS.map(amenity => (
                    <label key={amenity.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        name={amenity.id}
                        checked={formData.amenities.includes(amenity.id)}
                        onChange={handleChange}
                      />
                      <span>{amenity.label}</span>
                    </label>
                  ))}
                </div>
                {errors.amenities && <span className="error-text">{errors.amenities}</span>}
              </div>

              {/* Section 4: Location (Optional) */}
              <div className="form-section">
                <h3>📍 Location Coordinates (Optional)</h3>
                <p className="section-note">Help us pinpoint your shelter on the map</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      name="coordinate_lat"
                      value={formData.coordinates.lat}
                      onChange={handleChange}
                      placeholder="e.g., 8.5241"
                      step="0.0001"
                    />
                  </div>

                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      name="coordinate_lng"
                      value={formData.coordinates.lng}
                      onChange={handleChange}
                      placeholder="e.g., 76.9366"
                      step="0.0001"
                    />
                  </div>
                </div>
              </div>


              {/* Terms Agreement */}
              <div className="form-section terms-section">
                <label className="checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>I certify that the information provided is accurate and I have authority to register this shelter</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddShelterForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit-shelter"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {showSuccessModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowSuccessModal(false)}></div>
          <div className="confirmation-modal">
            <button
              className="modal-close"
              type="button"
              onClick={() => setShowSuccessModal(false)}
            >
              ✕
            </button>
            <div className="confirmation-content">
              <div className="confirmation-icon">✅</div>
              <h3>Submission Received</h3>
              <p>Your shelter registration has been submitted successfully.</p>
              <p>Our team will review it and notify the admin for verification. Once approved, it will appear on the dashboard.</p>
              <button
                type="button"
                className="btn-submit-shelter"
                onClick={() => {
                  setShowSuccessModal(false);
                  setShowAddShelterForm(false);
                  setSuccessMessage('');
                }}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
