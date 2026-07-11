import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const ManagePlaces = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    state: 'Kerala',
    latitude: '',
    longitude: '',
    riskLevel: 'MEDIUM',
    riskScore: 50,
    description: ''
  });

  useEffect(() => {
    fetchPlaces();
  }, [token]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      const data = await adminApi.getAllPlaces();
      setPlaces(data || []);
    } catch (err) {
      setError('Failed to load places');
      console.error('Places fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const adminApi = new AdminApi(token);
      if (editingPlace) {
        await adminApi.updatePlace(editingPlace._id, formData);
      } else {
        await adminApi.createPlace(formData);
      }
      fetchPlaces();
      setShowCreateModal(false);
      setEditingPlace(null);
      setFormData({
        name: '',
        district: '',
        state: 'Kerala',
        latitude: '',
        longitude: '',
        riskLevel: 'MEDIUM',
        riskScore: 50,
        description: ''
      });
    } catch (err) {
      setError('Failed to save place');
      console.error('Save error:', err);
    }
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      district: place.district,
      state: place.state || 'Kerala',
      latitude: place.coordinates?.latitude || '',
      longitude: place.coordinates?.longitude || '',
      riskLevel: place.riskLevel || 'MEDIUM',
      riskScore: place.riskScore || 50,
      description: place.description || ''
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (placeId) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        const adminApi = new AdminApi(token);
        await adminApi.deletePlace(placeId);
        fetchPlaces();
      } catch (err) {
        setError('Failed to delete place');
        console.error('Delete error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading places...</div>
      </div>
    );
  }

  return (
    <section className="admin-section">
      <h2>Places & Risk Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Action Button */}
      <div className="action-bar">
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-create"
        >
          + Add New Place
        </button>
      </div>

      {/* Places Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>District</th>
              <th>State</th>
              <th>Risk Level</th>
              <th>Risk Score</th>
              <th>Coordinates</th>
              <th>Active Layers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {places.map(place => (
              <tr key={place._id} className={`risk-${place.riskLevel?.toLowerCase()}`}>
                <td><strong>{place.name}</strong></td>
                <td>{place.district}</td>
                <td>{place.state || 'Kerala'}</td>
                <td>
                  <span className={`status-badge status-${place.riskLevel?.toLowerCase()}`}>
                    {place.riskLevel || 'MEDIUM'}
                  </span>
                </td>
                <td>{place.riskScore || 50}/100</td>
                <td>
                  {place.coordinates ? 
                    `${place.coordinates.latitude?.toFixed(4)}, ${place.coordinates.longitude?.toFixed(4)}` : 
                    'N/A'
                  }
                </td>
                <td>
                  {[
                    place.activeLayers?.flood && '🌊 Flood',
                    place.activeLayers?.landslide && '⛏️ Landslide',
                    place.activeLayers?.coastal && '🏖️ Coastal',
                    place.activeLayers?.dam && '🏗️ Dam'
                  ].filter(Boolean).join(', ') || 'None'}
                </td>
                <td className="action-cell">
                  <button
                    onClick={() => handleEdit(place)}
                    className="btn-edit"
                    title="Edit Place"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(place._id)}
                    className="btn-delete"
                    title="Delete Place"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {places.length === 0 && (
          <div className="empty-message">No places found</div>
        )}
      </div>

      {/* Simple Create/Edit Modal */}
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
            <h3 style={{ margin: '0 0 24px 0', color: '#2c3e50' }}>
              {editingPlace ? 'Edit Place' : 'Add New Place'}
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Place name"
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>District:</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
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
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>State:</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="State"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Latitude:</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
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
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Risk Level:</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, riskLevel: e.target.value }))}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Risk Score (0-100):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.riskScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, riskScore: parseInt(e.target.value) }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Place description..."
                  rows="3"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  console.log('Create/Update place button clicked!');
                  handleCreate();
                }}
                disabled={!formData.name || !formData.district}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  opacity: (!formData.name || !formData.district) ? 0.6 : 1
                }}
              >
                {editingPlace ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => {
                  console.log('Cancel create button clicked!');
                  setShowCreateModal(false);
                  setEditingPlace(null);
                  setFormData({
                    name: '',
                    district: '',
                    state: 'Kerala',
                    latitude: '',
                    longitude: '',
                    riskLevel: 'MEDIUM',
                    riskScore: 50,
                    description: ''
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

export default ManagePlaces;
