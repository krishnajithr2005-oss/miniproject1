import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const ManageAlerts = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    search: ''
  });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    placeName: '',
    description: '',
    severity: 'MEDIUM',
    type: 'admin-update',
    district: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, [token, filters.status, filters.severity]);

  useEffect(() => {
    applyFilters();
  }, [alerts, filters.search]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      const params = {
        ...(filters.status && { status: filters.status }),
        ...(filters.severity && { severity: filters.severity })
      };
      
      const data = await adminApi.getAllAlerts(params);
      setAlerts(data.alerts || data || []);
    } catch (err) {
      setError('Failed to load alerts');
      console.error('Alerts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = alerts;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.title?.toLowerCase().includes(searchLower) ||
        alert.placeName?.toLowerCase().includes(searchLower) ||
        alert.description?.toLowerCase().includes(searchLower) ||
        alert.district?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredAlerts(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePublish = async (alertId) => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.publishAlert(alertId);
      fetchAlerts();
      setShowApprovalModal(false);
      setSelectedAlert(null);
    } catch (err) {
      setError('Failed to publish alert');
      console.error('Publish error:', err);
    }
  };

  const handleReject = async (alertId) => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.rejectAlert(alertId);
      fetchAlerts();
      setShowApprovalModal(false);
      setSelectedAlert(null);
    } catch (err) {
      setError('Failed to reject alert');
      console.error('Rejection error:', err);
    }
  };

  const handleCreateAlert = async () => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.createAlert(newAlert);
      fetchAlerts();
      setShowCreateModal(false);
      setNewAlert({
        title: '',
        placeName: '',
        description: '',
        severity: 'MEDIUM',
        type: 'admin-update',
        district: ''
      });
    } catch (err) {
      setError('Failed to create alert');
      console.error('Create error:', err);
    }
  };

  const openApprovalModal = (alert, action) => {
    setSelectedAlert({ ...alert, action });
    setShowApprovalModal(true);
  };

  const getAlertStats = () => {
    const total = alerts.length;
    const pending = alerts.filter(alert => alert.status === 'pending').length;
    const published = alerts.filter(alert => alert.status === 'published').length;
    const rejected = alerts.filter(alert => alert.status === 'rejected').length;
    
    return { total, pending, published, rejected };
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading alerts...</div>
      </div>
    );
  }

  const stats = getAlertStats();

  return (
    <section className="admin-section">
      <h2>Alert Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">🔔</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total.toLocaleString()}</div>
            <div className="stat-label">Total Alerts</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending.toLocaleString()}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.published.toLocaleString()}</div>
            <div className="stat-label">Published</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-value">{stats.rejected.toLocaleString()}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-bar">
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-create"
        >
          + Create New Alert
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search alerts..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="filter-select"
          >
            <option value="">All Severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Place</th>
              <th>Type</th>
              <th>Severity</th>
              <th>District</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map(alert => (
              <tr key={alert._id} className={`severity-${alert.severity?.toLowerCase()} status-${alert.status}`}>
                <td>
                  <div className="alert-title">{alert.title}</div>
                </td>
                <td>{alert.placeName}</td>
                <td>
                  <span className="type-badge">{alert.type?.replace('-', ' ').toUpperCase() || 'UNKNOWN'}</span>
                </td>
                <td>
                  <span className={`severity-badge severity-${alert.severity?.toLowerCase()}`}>
                    {alert.severity?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </td>
                <td>{alert.district || 'N/A'}</td>
                <td>
                  <span className={`status-badge status-${alert.status}`}>
                    {alert.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </td>
                <td>{new Date(alert.createdAt || alert.timestamp).toLocaleDateString()}</td>
                <td className="action-cell">
                  {alert.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => openApprovalModal(alert, 'publish')}
                        className="btn-approve"
                        title="Publish Alert"
                      >
                        ✓ Publish
                      </button>
                      <button
                        onClick={() => openApprovalModal(alert, 'reject')}
                        className="btn-reject"
                        title="Reject Alert"
                      >
                        ✕ Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-badge status-${alert.status}`}>
                      {alert.status?.toUpperCase()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAlerts.length === 0 && (
          <div className="empty-message">
            {filters.search || filters.status || filters.severity
              ? 'No alerts found matching the filters'
              : 'No alerts found'}
          </div>
        )}
      </div>

      {/* Simple Create Alert Modal */}
      {showCreateModal && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '999999'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              console.log('Clicked outside create modal - closing');
              setShowCreateModal(false);
            }
          }}
        >
          <div 
            style={{
              background: 'white',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 24px 0', color: '#2c3e50' }}>Create New Alert</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title:</label>
                <input
                  type="text"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Alert title"
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Place Name:</label>
                <input
                  type="text"
                  value={newAlert.placeName}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, placeName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Location name"
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>District:</label>
                <input
                  type="text"
                  value={newAlert.district}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, district: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="District"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Severity:</label>
                  <select
                    value={newAlert.severity}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, severity: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Type:</label>
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="admin-update">Admin Update</option>
                    <option value="weather">Weather</option>
                    <option value="flood">Flood</option>
                    <option value="landslide">Landslide</option>
                    <option value="evacuation">Evacuation</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description:</label>
                <textarea
                  value={newAlert.description}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  placeholder="Alert description..."
                  rows="4"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  console.log('Create alert button clicked!');
                  handleCreateAlert();
                }}
                disabled={!newAlert.title || !newAlert.placeName || !newAlert.description}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  opacity: (!newAlert.title || !newAlert.placeName || !newAlert.description) ? 0.6 : 1
                }}
              >
                Create Alert
              </button>
              <button
                onClick={() => {
                  console.log('Cancel create button clicked!');
                  setShowCreateModal(false);
                  setNewAlert({
                    title: '',
                    placeName: '',
                    description: '',
                    severity: 'MEDIUM',
                    type: 'admin-update',
                    district: ''
                  });
                }}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Approval/Rejection Modal */}
      {showApprovalModal && selectedAlert && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '999999'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              console.log('Clicked outside modal - closing');
              setShowApprovalModal(false);
              setSelectedAlert(null);
            }
          }}
        >
          <div 
            style={{
              background: 'white',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 24px 0', color: '#2c3e50' }}>
              {selectedAlert.action === 'publish' ? 'Publish Alert' : 'Reject Alert'}
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Title:</strong> {selectedAlert.title}</p>
                <p><strong>Place:</strong> {selectedAlert.placeName}</p>
                <p><strong>Severity:</strong> {selectedAlert.severity}</p>
                <p><strong>Type:</strong> {selectedAlert.type}</p>
                <p><strong>Description:</strong> {selectedAlert.description}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {selectedAlert.action === 'publish' ? (
                <button
                  onClick={() => {
                    console.log('Publish alert button clicked!');
                    handlePublish(selectedAlert._id);
                  }}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}
                >
                  Publish Alert
                </button>
              ) : (
                <button
                  onClick={() => {
                    console.log('Reject alert button clicked!');
                    handleReject(selectedAlert._id);
                  }}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}
                >
                  Reject Alert
                </button>
              )}
              <button
                onClick={() => {
                  console.log('Cancel button clicked!');
                  setShowApprovalModal(false);
                  setSelectedAlert(null);
                }}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageAlerts;