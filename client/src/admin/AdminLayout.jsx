import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './admin.css';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'applications', label: 'Applications', icon: '📄' },
    { id: 'volunteers', label: 'Volunteers', icon: '🤝' },
    { id: 'shelters', label: 'Shelters', icon: '⛺' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
    { id: 'knowledge', label: 'Knowledge', icon: '📚' },
    { id: 'places', label: 'Places & Risk', icon: '🗺️' },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: '🏠' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>👨‍💼 Kerala Disaster Management - Admin Control Center</h1>
          <div className="admin-user-info">
            <span>{user?.firstName || 'Admin'} {user?.lastName || ''}</span>
            <span className="user-role">{user?.role?.toUpperCase() || 'ADMIN'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="admin-container">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;