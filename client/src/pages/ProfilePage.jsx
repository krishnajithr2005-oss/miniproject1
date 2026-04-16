import React, { useState } from 'react';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543210',
    district: 'Wayanad',
    address: '123 Main Street, Wayanad, Kerala',
    emergencyContact: 'Priya Kumar',
    emergencyPhone: '+91-9123456789',
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setEditing(false);
    alert('✓ Profile updated successfully!');
  };

  return (
    <main className="page-content">
      <div className="page-header">
        <h1>👤 User Profile</h1>
        <p>Manage your account information</p>
      </div>
      <div className="profile-container">
        <section className="dashboard-section profile-section">
          <div className="profile-header">
            <div className="profile-avatar">👤</div>
            <div className="profile-info">
              <h2>{formData.name}</h2>
              <p>{formData.email}</p>
            </div>
            <button
              className="edit-btn"
              onClick={() => setEditing(!editing)}
            >
              {editing ? '✕ Cancel' : '✏️ Edit'}
            </button>
          </div>

          {editing ? (
            <form className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="district">District</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
              <h3 style={{ marginTop: '30px' }}>Emergency Contact</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emergencyContact">Contact Name</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emergencyPhone">Contact Phone</label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button type="button" className="save-btn" onClick={handleSave}>
                💾 Save Changes
              </button>
            </form>
          ) : (
            <div className="profile-details">
              <h3>Personal Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{formData.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{formData.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">District</span>
                  <span className="detail-value">{formData.district}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{formData.address}</span>
                </div>
              </div>
              <h3 style={{ marginTop: '30px' }}>Emergency Contact</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{formData.emergencyContact}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{formData.emergencyPhone}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
