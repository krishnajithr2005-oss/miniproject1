import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const ManageUsers = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    district: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    district: '',
    role: 'user',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [token, filters.page, filters.role, filters.status, filters.district]);

  useEffect(() => {
    applyFilters();
  }, [users, filters.search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      const params = {
        page: filters.page,
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status }),
        ...(filters.district && { district: filters.district })
      };
      
      const response = await adminApi.getAllUsers(params);
      setUsers(response.users || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0
      });
    } catch (err) {
      setError('Failed to load users');
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.includes(searchLower) ||
        user.district?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredUsers(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.updateUserRole(userId, newRole);
      fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to update user role');
      console.error('Role update error:', err);
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.updateUserStatus(userId, isActive);
      fetchUsers();
      setShowStatusModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to update user status');
      console.error('Status update error:', err);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const openStatusModal = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  const handleCreateUser = async () => {
    try {
      const adminApi = new AdminApi(token);
      await adminApi.createUser(newUser);
      fetchUsers();
      setShowCreateModal(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        district: '',
        role: 'user',
        password: ''
      });
    } catch (err) {
      setError('Failed to create user');
      console.error('User creation error:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  return (
    <section className="admin-section">
      <h2>User Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Action Buttons */}
      <div className="action-bar">
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-create"
        >
          + Create New User
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
            <option value="shelter_operator">Shelter Operator</option>
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
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

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-label">Total Users:</span>
          <span className="stat-value">{pagination.total.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Filtered:</span>
          <span className="stat-value">{filteredUsers.length.toLocaleString()}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>District</th>
              <th>Role</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className={`status-${user.status}`}>
                <td>
                  <div className="user-name">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.district || 'N/A'}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role?.replace('_', ' ').toUpperCase() || 'USER'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${user.status}`}>
                    {user.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </td>
                <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                <td className="action-cell">
                  <button
                    type="button"
                    onClick={() => openRoleModal(user)}
                    className="btn-role"
                    title="Change Role"
                  >
                    🔄 Role
                  </button>
                  <button
                    type="button"
                    onClick={() => openStatusModal(user)}
                    className={`btn-status ${user.status === 'active' ? 'btn-suspend' : 'btn-activate'}`}
                    title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                  >
                    {user.status === 'active' ? '⏸️ Suspend' : '▶️ Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="empty-message">
            {filters.search || filters.role || filters.status || filters.district
              ? 'No users found matching the filters'
              : 'No users found'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Change User Role</h3>
            <div className="modal-content">
              <p><strong>User:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>Current Role:</strong> {selectedUser.role}</p>
              
              <div className="form-group">
                <label>New Role:</label>
                <select
                  defaultValue={selectedUser.role}
                  onChange={(e) => setSelectedUser(prev => ({ ...prev, newRole: e.target.value }))}
                  className="form-select"
                >
                  <option value="user">User</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                  <option value="shelter_operator">Shelter Operator</option>
                </select>
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={() => handleRoleChange(selectedUser._id, selectedUser.newRole || selectedUser.role)}
                className="btn-confirm"
              >
                Change Role
              </button>
              <button
                onClick={() => { setShowRoleModal(false); setSelectedUser(null); }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Change User Status</h3>
            <div className="modal-content">
              <p><strong>User:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>Current Status:</strong> {selectedUser.status}</p>
              
              <div className="form-group">
                <label>New Status:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      defaultChecked={selectedUser.status === 'active'}
                      onChange={() => setSelectedUser(prev => ({ ...prev, newStatus: 'active' }))}
                    />
                    Active
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="suspended"
                      defaultChecked={selectedUser.status === 'suspended'}
                      onChange={() => setSelectedUser(prev => ({ ...prev, newStatus: 'suspended' }))}
                    />
                    Suspended
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={() => handleStatusChange(selectedUser._id, selectedUser.newStatus === 'active')}
                className="btn-confirm"
              >
                Update Status
              </button>
              <button
                onClick={() => { setShowStatusModal(false); setSelectedUser(null); }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    {/* Simple Create User Modal */}
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
            <h3 style={{ margin: '0 0 24px 0', color: '#2c3e50' }}>Create New User</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>First Name:</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
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
                    value={newUser.lastName}
                    onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
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
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="user@example.com"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Phone:</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
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
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>District:</label>
                  <input
                    type="text"
                    value={newUser.district}
                    onChange={(e) => setNewUser(prev => ({ ...prev, district: e.target.value }))}
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
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Role:</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="user">User</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                    <option value="shelter_operator">Shelter Operator</option>
                  </select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password:</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Secure password"
                  />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  console.log('Create user button clicked!');
                  handleCreateUser();
                }}
                disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  opacity: (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) ? 0.6 : 1
                }}
              >
                Create User
              </button>
              <button
                onClick={() => {
                  console.log('Cancel create button clicked!');
                  setShowCreateModal(false);
                  setNewUser({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    district: '',
                    role: 'user',
                    password: ''
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

export default ManageUsers;