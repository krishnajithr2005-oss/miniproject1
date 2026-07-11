import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const ManageVolunteers = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    district: '',
    search: ''
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    district: '',
    skills: [],
    availability: 'part-time',
    experience: ''
  });

  useEffect(() => {
    fetchVolunteers();
  }, [token, filters.status, filters.district]);

  useEffect(() => {
    applyFilters();
  }, [volunteers, filters.search]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      const params = {
        ...(filters.status && { status: filters.status }),
        ...(filters.district && { district: filters.district })
      };
      
      const data = await adminApi.getAllVolunteers(params);
      setVolunteers(data.volunteers || data || []);
    } catch (err) {
      setError('Failed to load volunteers');
      console.error('Volunteers fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = volunteers;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(vol => 
        vol.firstName?.toLowerCase().includes(searchLower) ||
        vol.lastName?.toLowerCase().includes(searchLower) ||
        vol.email?.toLowerCase().includes(searchLower) ||
        vol.phone?.includes(searchLower) ||
        vol.district?.toLowerCase().includes(searchLower) ||
        vol.skills?.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredVolunteers(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApprove = async (volunteerId) => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.approveVolunteer(volunteerId, approvalNotes);
      fetchVolunteers();
      setShowApprovalModal(false);
      setSelectedVolunteer(null);
      setApprovalNotes('');
    } catch (err) {
      setError('Failed to approve volunteer');
      console.error('Approval error:', err);
    }
  };

  const handleReject = async (volunteerId) => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.rejectVolunteer(volunteerId, approvalNotes);
      fetchVolunteers();
      setShowApprovalModal(false);
      setSelectedVolunteer(null);
      setApprovalNotes('');
    } catch (err) {
      setError('Failed to reject volunteer');
      console.error('Rejection error:', err);
    }
  };

  const openApprovalModal = (volunteer, action) => {
    setSelectedVolunteer({ ...volunteer, action });
    setShowApprovalModal(true);
  };

  const handleCreateVolunteer = async () => {
    try {
      console.log('Creating volunteer with data:', newVolunteer);
      const adminApi = new AdminApi(token);
      // Set status to 'approved' so volunteers appear in public dashboard
      const volunteerData = { ...newVolunteer, status: 'approved' };
      const response = await adminApi.createVolunteer(volunteerData);
      console.log('Volunteer created successfully:', response);
      fetchVolunteers();
      setShowCreateModal(false);
      setNewVolunteer({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        district: '',
        skills: [],
        availability: 'part-time',
        experience: ''
      });
      setError('');
      alert('✅ Volunteer created successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create volunteer';
      setError(errorMessage);
      console.error('Volunteer creation error:', err);
      alert(`❌ Error: ${errorMessage}`);
    }
  };

  const handleSkillChange = (skill) => {
    setNewVolunteer(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const getVolunteerStats = () => {
    const total = volunteers.length;
    const pending = volunteers.filter(vol => vol.status === 'pending').length;
    const approved = volunteers.filter(vol => vol.status === 'approved').length;
    const rejected = volunteers.filter(vol => vol.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading volunteers...</div>
      </div>
    );
  }

  const stats = getVolunteerStats();

  return (
    <section className="admin-section">
      <h2>Volunteer Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">🤝</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total.toLocaleString()}</div>
            <div className="stat-label">Total Volunteers</div>
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

      {/* Action Buttons */}
      <div className="action-bar">
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-create"
        >
          + Create New Volunteer
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search volunteers..."
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
          <input
            type="text"
            placeholder="District"
            value={filters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>District</th>
              <th>Skills</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolunteers.map(vol => (
              <tr key={vol._id} className={`status-${vol.status}`}>
                <td>
                  <div className="volunteer-name">
                    {vol.firstName} {vol.lastName}
                  </div>
                </td>
                <td>{vol.email}</td>
                <td>{vol.phone || 'N/A'}</td>
                <td>{vol.district || 'N/A'}</td>
                <td>
                  <div className="skills-list">
                    {vol.skills && vol.skills.length > 0 ? (
                      vol.skills.slice(0, 2).map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="no-skills">No skills listed</span>
                    )}
                    {vol.skills && vol.skills.length > 2 && (
                      <span className="more-skills">+{vol.skills.length - 2}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="availability-badge">
                    {vol.availability || 'Not specified'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${vol.status}`}>
                    {vol.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </td>
                <td>{new Date(vol.registrationDate || vol.createdAt).toLocaleDateString()}</td>
                <td className="action-cell">
                  {vol.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => openApprovalModal(vol, 'approve')}
                        className="btn-approve"
                        title="Approve Volunteer"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => openApprovalModal(vol, 'reject')}
                        className="btn-reject"
                        title="Reject Volunteer"
                      >
                        ✕ Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-badge status-${vol.status}`}>
                      {vol.status?.toUpperCase()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredVolunteers.length === 0 && (
          <div className="empty-message">
            {filters.search || filters.status || filters.district
              ? 'No volunteers found matching the filters'
              : 'No volunteers found'}
          </div>
        )}
      </div>

      {/* Simple Approval/Rejection Modal */}
      {showApprovalModal && selectedVolunteer && (
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
              setSelectedVolunteer(null);
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
              {selectedVolunteer.action === 'approve' ? 'Approve Volunteer' : 'Reject Volunteer'}
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Name:</strong> {selectedVolunteer.firstName} {selectedVolunteer.lastName}</p>
                <p><strong>Email:</strong> {selectedVolunteer.email}</p>
                <p><strong>Phone:</strong> {selectedVolunteer.phone}</p>
                <p><strong>District:</strong> {selectedVolunteer.district}</p>
                {selectedVolunteer.skills && (
                  <p><strong>Skills:</strong> {selectedVolunteer.skills.join(', ')}</p>
                )}
                {selectedVolunteer.availability && (
                  <p><strong>Availability:</strong> {selectedVolunteer.availability}</p>
                )}
                {selectedVolunteer.experience && (
                  <p><strong>Experience:</strong> {selectedVolunteer.experience}</p>
                )}
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
              {selectedVolunteer.action === 'approve' ? (
                <button
                  onClick={() => {
                    console.log('Approve volunteer button clicked!');
                    handleApprove(selectedVolunteer._id);
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
                  Approve Volunteer
                </button>
              ) : (
                <button
                  onClick={() => {
                    console.log('Reject volunteer button clicked!');
                    handleReject(selectedVolunteer._id);
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
                  Reject Volunteer
                </button>
              )}
              <button
                onClick={() => {
                  console.log('Cancel button clicked!');
                  setShowApprovalModal(false);
                  setSelectedVolunteer(null);
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
    {/* Simple Create Volunteer Modal */}
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
            <h3 style={{ margin: '0 0 24px 0', color: '#2c3e50' }}>Create New Volunteer</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>First Name:</label>
                  <input
                    type="text"
                    value={newVolunteer.firstName}
                    onChange={(e) => setNewVolunteer(prev => ({ ...prev, firstName: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="First name"
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Last Name:</label>
                  <input
                    type="text"
                    value={newVolunteer.lastName}
                    onChange={(e) => setNewVolunteer(prev => ({ ...prev, lastName: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email:</label>
                  <input
                    type="email"
                    value={newVolunteer.email}
                    onChange={(e) => setNewVolunteer(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="volunteer@example.com"
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Phone:</label>
                  <input
                    type="tel"
                    value={newVolunteer.phone}
                    onChange={(e) => setNewVolunteer(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>District:</label>
                  <input
                    type="text"
                    value={newVolunteer.district}
                    onChange={(e) => setNewVolunteer(prev => ({ ...prev, district: e.target.value }))}
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
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Availability:</label>
                  <select
                    value={newVolunteer.availability}
                    onChange={(e) => setNewVolunteer(prev => ({ ...prev, availability: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="emergency">Emergency Only</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Skills:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {['First Aid', 'Rescue Operations', 'Medical Support', 'Communication', 'Logistics', 'Psychological Support', 'Search & Rescue', 'Fire Safety'].map(skill => (
                    <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newVolunteer.skills.includes(skill)}
                        onChange={() => handleSkillChange(skill)}
                        style={{ cursor: 'pointer' }}
                      />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Experience:</label>
                <textarea
                  value={newVolunteer.experience}
                  onChange={(e) => setNewVolunteer(prev => ({ ...prev, experience: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe relevant experience..."
                  rows="3"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  console.log('Create volunteer button clicked!');
                  handleCreateVolunteer();
                }}
                disabled={!newVolunteer.firstName || !newVolunteer.lastName || !newVolunteer.email || newVolunteer.skills.length === 0}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  opacity: (!newVolunteer.firstName || !newVolunteer.lastName || !newVolunteer.email || newVolunteer.skills.length === 0) ? 0.6 : 1
                }}
              >
                Create Volunteer
              </button>
              <button
                onClick={() => {
                  console.log('Cancel create button clicked!');
                  setShowCreateModal(false);
                  setNewVolunteer({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    district: '',
                    skills: [],
                    availability: 'part-time',
                    experience: ''
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
    </section>
  );
};

export default ManageVolunteers;