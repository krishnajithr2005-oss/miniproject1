import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const ManageKnowledge = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    content: ''
  });

  useEffect(() => {
    fetchKnowledge();
  }, [token]);

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      const data = await adminApi.getAllKnowledge();
      setKnowledgeItems(data || []);
    } catch (err) {
      setError('Failed to load knowledge items');
      console.error('Knowledge fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const adminApi = new AdminApi(token);
      if (editingItem) {
        await adminApi.updateKnowledge(editingItem._id, formData);
      } else {
        await adminApi.createKnowledge(formData);
      }
      fetchKnowledge();
      setShowCreateModal(false);
      setEditingItem(null);
      setFormData({ title: '', category: 'general', content: '' });
    } catch (err) {
      setError('Failed to save knowledge item');
      console.error('Save error:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      content: item.content
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this knowledge item?')) {
      try {
        const adminApi = new AdminApi(token);
        await adminApi.deleteKnowledge(itemId);
        fetchKnowledge();
      } catch (err) {
        setError('Failed to delete knowledge item');
        console.error('Delete error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading knowledge items...</div>
      </div>
    );
  }

  return (
    <section className="admin-section">
      <h2>Knowledge Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Action Button */}
      <div className="action-bar">
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-create"
        >
          + Create Knowledge Item
        </button>
      </div>

      {/* Knowledge Grid */}
      <div className="knowledge-grid">
        {knowledgeItems.map(item => (
          <div key={item._id} className="knowledge-card">
            <div className="knowledge-header">
              <h3>{item.title}</h3>
              <span className="category-badge">{item.category}</span>
            </div>
            <div className="knowledge-content">
              <p>{item.content.substring(0, 200)}{item.content.length > 200 ? '...' : ''}</p>
            </div>
            <div className="knowledge-meta">
              <span className="date">{new Date(item.createdAt).toLocaleDateString()}</span>
              <div className="knowledge-actions">
                <button
                  onClick={() => handleEdit(item)}
                  className="btn-edit"
                  title="Edit"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="btn-delete"
                  title="Delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {knowledgeItems.length === 0 && (
          <div className="empty-message">No knowledge items found</div>
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
              {editingItem ? 'Edit Knowledge Item' : 'Create Knowledge Item'}
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Knowledge title"
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="general">General</option>
                  <option value="emergency">Emergency</option>
                  <option value="safety">Safety</option>
                  <option value="medical">Medical</option>
                  <option value="evacuation">Evacuation</option>
                  <option value="weather">Weather</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Content:</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    minHeight: '120px',
                    resize: 'vertical'
                  }}
                  placeholder="Knowledge content..."
                  rows="6"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  console.log('Create/Update knowledge button clicked!');
                  handleCreate();
                }}
                disabled={!formData.title || !formData.content}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  opacity: (!formData.title || !formData.content) ? 0.6 : 1
                }}
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => {
                  console.log('Cancel create button clicked!');
                  setShowCreateModal(false);
                  setEditingItem(null);
                  setFormData({ title: '', category: 'general', content: '' });
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

export default ManageKnowledge;
