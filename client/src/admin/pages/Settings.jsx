import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const Settings = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('admin-creation');
  
  // Admin Creation Form
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    district: '',
    password: ''
  });
  
  // Alert Creation Form
  const [newAlert, setNewAlert] = useState({
    title: '',
    placeName: '',
    description: '',
    severity: 'MEDIUM',
    type: 'admin-update',
    district: ''
  });

  const handleCreateAdmin = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const adminApi = new AdminApi(token);
      await adminApi.createAdmin(newAdmin);
      
      setSuccess('Admin created successfully!');
      setNewAdmin({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        district: '',
        password: ''
      });
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create admin');
      console.error('Admin creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const adminApi = new AdminApi(token);
      await adminApi.createAlert(newAlert);
      
      setSuccess('Alert created successfully!');
      setNewAlert({
        title: '',
        placeName: '',
        description: '',
        severity: 'MEDIUM',
        type: 'admin-update',
        district: ''
      });
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create alert');
      console.error('Alert creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <section className="admin-section">
      <h2>Admin Settings</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {/* Settings Navigation */}
      <div className="settings-nav">
        <button
          className={`settings-nav-btn ${activeSection === 'admin-creation' ? 'active' : ''}`}
          onClick={() => { setActiveSection('admin-creation'); clearMessages(); }}
        >
          👤 Create Admin
        </button>
        <button
          className={`settings-nav-btn ${activeSection === 'alert-creation' ? 'active' : ''}`}
          onClick={() => { setActiveSection('alert-creation'); clearMessages(); }}
        >
          🔔 Create Alert
        </button>
        <button
          className={`settings-nav-btn ${activeSection === 'system-info' ? 'active' : ''}`}
          onClick={() => { setActiveSection('system-info'); clearMessages(); }}
        >
          ℹ️ System Info
        </button>
      </div>

      {/* Admin Creation Section */}
      {activeSection === 'admin-creation' && (
        <div className="settings-section">
          <h3>Create New Admin</h3>
          <div className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={newAdmin.firstName}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, firstName: e.target.value }))}
                  className="form-input"
                  placeholder="First name"
                />
              </div>
              
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={newAdmin.lastName}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, lastName: e.target.value }))}
                  className="form-input"
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
                placeholder="admin@example.com"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, phone: e.target.value }))}
                  className="form-input"
                  placeholder="Phone number"
                />
              </div>
              
              <div className="form-group">
                <label>District:</label>
                <input
                  type="text"
                  value={newAdmin.district}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, district: e.target.value }))}
                  className="form-input"
                  placeholder="District"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                className="form-input"
                placeholder="Secure password"
              />
            </div>
            
            <button
              onClick={handleCreateAdmin}
              className="btn-save-settings"
              disabled={loading || !newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.password}
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </div>
      )}

      {/* Alert Creation Section */}
      {activeSection === 'alert-creation' && (
        <div className="settings-section">
          <h3>Create Admin Alert</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>Alert Title:</label>
              <input
                type="text"
                value={newAlert.title}
                onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                className="form-input"
                placeholder="Alert title"
              />
            </div>
            
            <div className="form-group">
              <label>Place Name:</label>
              <input
                type="text"
                value={newAlert.placeName}
                onChange={(e) => setNewAlert(prev => ({ ...prev, placeName: e.target.value }))}
                className="form-input"
                placeholder="Location name"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>District:</label>
                <input
                  type="text"
                  value={newAlert.district}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, district: e.target.value }))}
                  className="form-input"
                  placeholder="District"
                />
              </div>
              
              <div className="form-group">
                <label>Severity:</label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, severity: e.target.value }))}
                  className="form-select"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Alert Type:</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value }))}
                className="form-select"
              >
                <option value="admin-update">Admin Update</option>
                <option value="weather">Weather</option>
                <option value="flood">Flood</option>
                <option value="landslide">Landslide</option>
                <option value="evacuation">Evacuation</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={newAlert.description}
                onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))}
                className="form-textarea"
                placeholder="Alert description..."
                rows="4"
              />
            </div>
            
            <button
              onClick={handleCreateAlert}
              className="btn-save-settings"
              disabled={loading || !newAlert.title || !newAlert.placeName || !newAlert.description}
            >
              {loading ? 'Creating...' : 'Create Alert'}
            </button>
          </div>
        </div>
      )}

      {/* System Info Section */}
      {activeSection === 'system-info' && (
        <div className="settings-section">
          <h3>System Information</h3>
          <div className="system-info">
            <div className="info-card">
              <h4>🔐 Security Settings</h4>
              <ul>
                <li>JWT Authentication: Enabled</li>
                <li>Role-based Access Control: Active</li>
                <li>Admin-only Endpoints: Protected</li>
                <li>Password Hashing: bcrypt (10 rounds)</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h4>🗄️ Database Status</h4>
              <ul>
                <li>MongoDB: Connected</li>
                <li>Collection: disaster_management</li>
                <li>Indexes: Optimized</li>
                <li>Backup: Manual</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h4>🚀 API Configuration</h4>
              <ul>
                <li>Base URL: http://localhost:5000</li>
                <li>Rate Limiting: Not configured</li>
                <li>CORS: Enabled for localhost</li>
                <li>Environment: Development</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h4>📊 System Capabilities</h4>
              <ul>
                <li>Real-time Updates: WebSocket (Not implemented)</li>
                <li>File Uploads: Limited</li>
                <li>Email Notifications: Not configured</li>
                <li>Push Notifications: Not implemented</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h4>🔧 Maintenance</h4>
              <ul>
                <li>Log Level: Development</li>
                <li>Error Tracking: Console only</li>
                <li>Performance Monitoring: Basic</li>
                <li>Health Checks: Manual</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Settings;