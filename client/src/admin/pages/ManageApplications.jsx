import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const ManageApplications = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [token, filters.status, filters.type]);

  useEffect(() => {
    applyFilters();
  }, [applications, filters.search]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      const params = {
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type })
      };
      
      const data = await adminApi.getAllApplications(params);
      setApplications(data.applications || data || []);
    } catch (err) {
      setError('Failed to load applications');
      console.error('Applications fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = applications;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.name?.toLowerCase().includes(searchLower) ||
        app.email?.toLowerCase().includes(searchLower) ||
        app.type?.toLowerCase().includes(searchLower) ||
        app.district?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredApplications(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApprove = async (applicationId) => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.approveApplication(applicationId, approvalNotes);
      fetchApplications();
      setShowApprovalModal(false);
      setSelectedApplication(null);
      setApprovalNotes('');
    } catch (err) {
      setError('Failed to approve application');
      console.error('Approval error:', err);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.rejectApplication(applicationId, approvalNotes);
      fetchApplications();
      setShowApprovalModal(false);
      setSelectedApplication(null);
      setApprovalNotes('');
    } catch (err) {
      setError('Failed to reject application');
      console.error('Rejection error:', err);
    }
  };

  const openApprovalModal = (application, action) => {
    setSelectedApplication({ ...application, action });
    setShowApprovalModal(true);
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading applications...</div>
      </div>
    );
  }

  const stats = getApplicationStats();

  return (
    <section className="admin-section">
      <h2>Application Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total.toLocaleString()}</div>
            <div className="stat-label">Total Applications</div>
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
            <div className="stat-value">{stats.approved.toLocaleString()}</div>
            <div className="stat-label">Approved</div>
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

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search applications..."
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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="volunteer">Volunteer</option>
            <option value="shelter">Shelter</option>
            <option value="beneficiary">Beneficiary</option>
            <option value="resource">Resource</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Type</th>
              <th>Email</th>
              <th>Phone</th>
              <th>District</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map(app => (
              <tr key={app._id} className={`status-${app.status}`}>
                <td>
                  <div className="applicant-info">
                    <div className="applicant-name">{app.name || app.firstName + ' ' + app.lastName}</div>
                    {app.organization && <div className="organization">{app.organization}</div>}
                  </div>
                </td>
                <td>
                  <span className="type-badge">{app.type?.toUpperCase() || 'UNKNOWN'}</span>
                </td>
                <td>{app.email}</td>
                <td>{app.phone || 'N/A'}</td>
                <td>{app.district || 'N/A'}</td>
                <td>
                  <span className={`status-badge status-${app.status}`}>
                    {app.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </td>
                <td>{new Date(app.createdAt || app.submittedDate || app.registrationDate).toLocaleDateString()}</td>
                <td className="action-cell">
                  {app.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => openApprovalModal(app, 'approve')}
                        className="btn-approve"
                        title="Approve Application"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => openApprovalModal(app, 'reject')}
                        className="btn-reject"
                        title="Reject Application"
                      >
                        ✕ Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-badge status-${app.status}`}>
                      {app.status?.toUpperCase()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredApplications.length === 0 && (
          <div className="empty-message">
            {filters.search || filters.status || filters.type
              ? 'No applications found matching the filters'
              : 'No applications found'}
          </div>
        )}
      </div>

      {/* Simple Approval/Rejection Modal */}
      {showApprovalModal && selectedApplication && (
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
              setSelectedApplication(null);
              setApprovalNotes('');
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
              {selectedApplication.action === 'approve' ? 'Approve Application' : 'Reject Application'}
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Applicant:</strong> {selectedApplication.name || selectedApplication.firstName + ' ' + selectedApplication.lastName}</p>
                <p><strong>Type:</strong> {selectedApplication.type}</p>
                <p><strong>Email:</strong> {selectedApplication.email}</p>
                <p><strong>District:</strong> {selectedApplication.district}</p>
                {selectedApplication.organization && <p><strong>Organization:</strong> {selectedApplication.organization}</p>}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Notes (Optional):</label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any notes about this decision..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  rows="3"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {selectedApplication.action === 'approve' ? (
                <button
                  onClick={() => {
                    console.log('Approve application button clicked!');
                    handleApprove(selectedApplication._id);
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
                  Approve Application
                </button>
              ) : (
                <button
                  onClick={() => {
                    console.log('Reject application button clicked!');
                    handleReject(selectedApplication._id);
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
                  Reject Application
                </button>
              )}
              <button
                onClick={() => {
                  console.log('Cancel button clicked!');
                  setShowApprovalModal(false);
                  setSelectedApplication(null);
                  setApprovalNotes('');
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

export default ManageApplications;
