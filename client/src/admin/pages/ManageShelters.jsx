import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const ManageShelters = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [shelters, setShelters] = useState([]);
  const [filteredShelters, setFilteredShelters] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    district: '',
    search: ''
  });
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShelter, setNewShelter] = useState({
    name: '',
    district: '',
    address: '',
    capacity: '',
    facilities: [],
    contactPerson: '',
    phone: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    fetchShelters();
  }, [token, filters.status, filters.district]);

  useEffect(() => {
    applyFilters();
  }, [shelters, filters.search]);

  const fetchShelters = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      const params = {
        ...(filters.status && { status: filters.status }),
        ...(filters.district && { district: filters.district })
      };
      
      const data = await adminApi.getAllShelters(params);
      setShelters(data.shelters || data || []);
    } catch (err) {
      setError('Failed to load shelters');
      console.error('Shelters fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = shelters;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(shelter => 
        shelter.shelterName?.toLowerCase().includes(searchLower) ||
        shelter.ownerName?.toLowerCase().includes(searchLower) ||
        shelter.ownerEmail?.toLowerCase().includes(searchLower) ||
        shelter.district?.toLowerCase().includes(searchLower) ||
        shelter.address?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredShelters(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApprove = async (shelterId) => {
    try {
      console.log('Approving shelter:', shelterId);
      const adminApi = new AdminApi(token);
      await adminApi.approveShelter(shelterId, approvalNotes);
      console.log('Shelter approved successfully');
      fetchShelters();
      setShowApprovalModal(false);
      setSelectedShelter(null);
      setApprovalNotes('');
      setError('');
    } catch (err) {
      console.error('Approval error:', err);
      setError('Failed to approve shelter: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleReject = async (shelterId) => {
    try {
      console.log('Rejecting shelter:', shelterId);
      const adminApi = new AdminApi(token);
      await adminApi.rejectShelter(shelterId, approvalNotes);
      console.log('Shelter rejected successfully');
      fetchShelters();
      setShowApprovalModal(false);
      setSelectedShelter(null);
      setApprovalNotes('');
      setError('');
    } catch (err) {
      console.error('Rejection error:', err);
      setError('Failed to reject shelter: ' + (err.response?.data?.error || err.message));
    }
  };

  const openApprovalModal = (shelter, action) => {
    console.log('Opening approval modal for shelter:', shelter);
    console.log('Action:', action);
    setSelectedShelter({ ...shelter, action });
    setShowApprovalModal(true);
  };

  const handleCreateShelter = async () => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.createShelter(newShelter);
      fetchShelters();
      setShowCreateModal(false);
      setNewShelter({
        name: '',
        district: '',
        address: '',
        capacity: '',
        facilities: [],
        contactPerson: '',
        phone: '',
        latitude: '',
        longitude: ''
      });
    } catch (err) {
      setError('Failed to create shelter');
      console.error('Shelter creation error:', err);
    }
  };

  const handleFacilityChange = (facility) => {
    setNewShelter(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const getShelterStats = () => {
    const total = shelters.length;
    const pending = shelters.filter(shelter => shelter.status === 'pending').length;
    const approved = shelters.filter(shelter => shelter.status === 'approved').length;
    const rejected = shelters.filter(shelter => shelter.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading shelters...</div>
      </div>
    );
  }

  const stats = getShelterStats();

  return (
    <section className="admin-section">
      <h2>Shelter Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">⛺</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total.toLocaleString()}</div>
            <div className="stat-label">Total Shelters</div>
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
          + Create New Shelter
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search shelters..."
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

      {/* Shelters Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Shelter Name</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Phone</th>
              <th>District</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShelters.map(shelter => (
              <tr key={shelter._id} className={`status-${shelter.status}`}>
                <td>
                  <div className="shelter-name">
                    {shelter.shelterName}
                  </div>
                </td>
                <td>{shelter.ownerName}</td>
                <td>{shelter.ownerEmail}</td>
                <td>{shelter.ownerPhone || 'N/A'}</td>
                <td>{shelter.district}</td>
                <td>
                  <span className="capacity-badge">
                    {shelter.capacity || 'N/A'} people
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${shelter.status}`}>
                    {shelter.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </td>
                <td>{new Date(shelter.submittedDate).toLocaleDateString()}</td>
                <td className="action-cell">
                  {shelter.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => openApprovalModal(shelter, 'approve')}
                        className="btn-approve"
                        title="Approve Shelter"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => openApprovalModal(shelter, 'reject')}
                        className="btn-reject"
                        title="Reject Shelter"
                      >
                        ✕ Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-badge status-${shelter.status}`}>
                      {shelter.status?.toUpperCase()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredShelters.length === 0 && (
          <div className="empty-message">
            {filters.search || filters.status || filters.district
              ? 'No shelters found matching the filters'
              : 'No shelters found'}
          </div>
        )}
      </div>

      {/* Simple Approval/Rejection Modal */}
      {showApprovalModal && selectedShelter && (
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
              setSelectedShelter(null);
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
              {selectedShelter.action === 'approve' ? 'Approve Shelter' : 'Reject Shelter'}
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Shelter Name:</strong> {selectedShelter.shelterName}</p>
                <p><strong>Owner:</strong> {selectedShelter.ownerName}</p>
                <p><strong>Email:</strong> {selectedShelter.ownerEmail}</p>
                <p><strong>Phone:</strong> {selectedShelter.ownerPhone || 'N/A'}</p>
                <p><strong>District:</strong> {selectedShelter.district}</p>
                <p><strong>Capacity:</strong> {selectedShelter.capacity} people</p>
                {selectedShelter.address && <p><strong>Address:</strong> {selectedShelter.address}</p>}
                {selectedShelter.description && <p><strong>Description:</strong> {selectedShelter.description}</p>}
                {selectedShelter.facilities && <p><strong>Facilities:</strong> {selectedShelter.facilities.join(', ')}</p>}
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
              {selectedShelter.action === 'approve' ? (
                <button
                  onClick={() => {
                    console.log('Approve button clicked!');
                    handleApprove(selectedShelter._id);
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
                  Approve Shelter
                </button>
              ) : (
                <button
                  onClick={() => {
                    console.log('Reject button clicked!');
                    handleReject(selectedShelter._id);
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
                  Reject Shelter
                </button>
              )}
              <button
                onClick={() => {
                  console.log('Cancel button clicked!');
                  setShowApprovalModal(false);
                  setSelectedShelter(null);
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
    {/* Simple Create Shelter Modal */}
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
            <h3 style={{ margin: '0 0 24px 0', color: '#2c3e50' }}>Create New Shelter</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Shelter Name:</label>
                <input
                  type="text"
                  value={newShelter.name}
                  onChange={(e) => setNewShelter(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Shelter name"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>District:</label>
                  <input
                    type="text"
                    value={newShelter.district}
                    onChange={(e) => setNewShelter(prev => ({ ...prev, district: e.target.value }))}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Capacity:</label>
                  <input
                    type="number"
                    value={newShelter.capacity}
                    onChange={(e) => setNewShelter(prev => ({ ...prev, capacity: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Maximum capacity"
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Address:</label>
                <textarea
                  value={newShelter.address}
                  onChange={(e) => setNewShelter(prev => ({ ...prev, address: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Full address"
                  rows="2"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Latitude:</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newShelter.latitude}
                    onChange={(e) => setNewShelter(prev => ({ ...prev, latitude: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Latitude"
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Longitude:</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newShelter.longitude}
                    onChange={(e) => setNewShelter(prev => ({ ...prev, longitude: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Longitude"
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Contact Person:</label>
                  <input
                    type="text"
                    value={newShelter.contactPerson}
                    onChange={(e) => setNewShelter(prev => ({ ...prev, contactPerson: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Contact person name"
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Phone:</label>
                  <input
                    type="tel"
                    value={newShelter.phone}
                    onChange={(e) => setNewShelter(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Contact phone"
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Facilities:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {['food', 'water', 'medical', 'bathroom', 'electricity', 'internet', 'parking', 'security'].map(facility => (
                    <label key={facility} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newShelter.facilities.includes(facility)}
                        onChange={() => handleFacilityChange(facility)}
                        style={{ cursor: 'pointer' }}
                      />
                      {facility.charAt(0).toUpperCase() + facility.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  console.log('Create shelter button clicked!');
                  handleCreateShelter();
                }}
                disabled={!newShelter.name || !newShelter.district || !newShelter.capacity || newShelter.facilities.length === 0}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  opacity: (!newShelter.name || !newShelter.district || !newShelter.capacity || newShelter.facilities.length === 0) ? 0.6 : 1
                }}
              >
                Create Shelter
              </button>
              <button
                onClick={() => {
                  console.log('Cancel create button clicked!');
                  setShowCreateModal(false);
                  setNewShelter({
                    name: '',
                    district: '',
                    address: '',
                    capacity: '',
                    facilities: [],
                    contactPerson: '',
                    phone: '',
                    latitude: '',
                    longitude: ''
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

export default ManageShelters;