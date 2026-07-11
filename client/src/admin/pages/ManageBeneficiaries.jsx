import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const ManageBeneficiaries = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    familySize: '',
    assisted: false
  });
  const [filters, setFilters] = useState({
    status: '',
    district: '',
    search: ''
  });

  useEffect(() => {
    fetchBeneficiaries();
  }, [token]);

  useEffect(() => {
    applyFilters();
  }, [beneficiaries, filters.search]);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      const data = await adminApi.getAllBeneficiaries();
      setBeneficiaries(data || []);
    } catch (err) {
      setError('Failed to load beneficiaries');
      console.error('Beneficiaries fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = beneficiaries;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(beneficiary => 
        beneficiary.name?.toLowerCase().includes(searchLower) ||
        beneficiary.email?.toLowerCase().includes(searchLower) ||
        beneficiary.phone?.includes(searchLower) ||
        beneficiary.district?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredBeneficiaries(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getBeneficiaryStats = () => {
    const total = beneficiaries.length;
    const assisted = beneficiaries.filter(b => b.assisted).length;
    const notAssisted = beneficiaries.filter(b => !b.assisted).length;
    
    return { total, assisted, notAssisted, active: notAssisted, pending: 0 };
  };

  const handleCreateBeneficiary = async () => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.createBeneficiary(newBeneficiary);
      fetchBeneficiaries();
      setShowCreateModal(false);
      setNewBeneficiary({
        name: '',
        email: '',
        phone: '',
        district: '',
        familySize: '',
        assisted: false
      });
    } catch (err) {
      setError('Failed to create beneficiary');
      console.error('Beneficiary creation error:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading beneficiaries...</div>
      </div>
    );
  }

  const stats = getBeneficiaryStats();

  return (
    <section className="admin-section">
      <h2>Beneficiary Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">🏠</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total.toLocaleString()}</div>
            <div className="stat-label">Total Beneficiaries</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.active.toLocaleString()}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">🤝</div>
          <div className="stat-info">
            <div className="stat-value">{stats.assisted.toLocaleString()}</div>
            <div className="stat-label">Assisted</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending.toLocaleString()}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-bar">
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-create"
        >
          + Create New Beneficiary
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search beneficiaries..."
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
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

      {/* Beneficiaries Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>District</th>
              <th>Family Size</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Assisted</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeneficiaries.map(beneficiary => (
              <tr key={beneficiary._id} className={`status-${beneficiary.status}`}>
                <td>
                  <div className="beneficiary-name">
                    {beneficiary.name}
                  </div>
                </td>
                <td>{beneficiary.email}</td>
                <td>{beneficiary.phone || 'N/A'}</td>
                <td>{beneficiary.district}</td>
                <td>
                  <span className="family-size-badge">
                    {beneficiary.familySize || 1} people
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${beneficiary.status}`}>
                    {beneficiary.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </td>
                <td>{new Date(beneficiary.approvedAt || beneficiary.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`assistance-badge ${beneficiary.assisted ? 'assisted' : 'not-assisted'}`}>
                    {beneficiary.assisted ? '✓ Assisted' : 'Not Assisted'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredBeneficiaries.length === 0 && (
          <div className="empty-message">
            {filters.search || filters.status || filters.district
              ? 'No beneficiaries found matching the filters'
              : 'No beneficiaries found'}
          </div>
        )}
      </div>
    {/* Simple Create Beneficiary Modal */}
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
            <h3 style={{ margin: '0 0 24px 0', color: '#2c3e50' }}>Create New Beneficiary</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Full Name:</label>
                <input
                  type="text"
                  value={newBeneficiary.name}
                  onChange={(e) => setNewBeneficiary(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Beneficiary full name"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email:</label>
                  <input
                    type="email"
                    value={newBeneficiary.email}
                    onChange={(e) => setNewBeneficiary(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="beneficiary@example.com"
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Phone:</label>
                  <input
                    type="tel"
                    value={newBeneficiary.phone}
                    onChange={(e) => setNewBeneficiary(prev => ({ ...prev, phone: e.target.value }))}
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
                    value={newBeneficiary.district}
                    onChange={(e) => setNewBeneficiary(prev => ({ ...prev, district: e.target.value }))}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Family Size:</label>
                  <input
                    type="number"
                    value={newBeneficiary.familySize}
                    onChange={(e) => setNewBeneficiary(prev => ({ ...prev, familySize: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Number of family members"
                    min="1"
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newBeneficiary.assisted}
                    onChange={(e) => setNewBeneficiary(prev => ({ ...prev, assisted: e.target.checked }))}
                    style={{ cursor: 'pointer' }}
                  />
                  Mark as Assisted
                </label>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  console.log('Create beneficiary button clicked!');
                  handleCreateBeneficiary();
                }}
                disabled={!newBeneficiary.name || !newBeneficiary.district || !newBeneficiary.familySize}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  opacity: (!newBeneficiary.name || !newBeneficiary.district || !newBeneficiary.familySize) ? 0.6 : 1
                }}
              >
                Create Beneficiary
              </button>
              <button
                onClick={() => {
                  console.log('Cancel create button clicked!');
                  setShowCreateModal(false);
                  setNewBeneficiary({
                    name: '',
                    email: '',
                    phone: '',
                    district: '',
                    familySize: '',
                    assisted: false
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

export default ManageBeneficiaries;
