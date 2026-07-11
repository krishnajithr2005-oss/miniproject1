import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import ManageApplications from './pages/ManageApplications';
import ManageVolunteers from './pages/ManageVolunteers';
import ManageShelters from './pages/ManageShelters';
import ManageAlerts from './pages/ManageAlerts';
import ManageKnowledge from './pages/ManageKnowledge';
import ManagePlaces from './pages/ManagePlaces';
import ManageBeneficiaries from './pages/ManageBeneficiaries';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import './admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setLoading(false);
    }
  }, [user]);

  const renderActiveTab = () => {
    const commonProps = { token };

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'users':
        return <ManageUsers {...commonProps} />;
      case 'applications':
        return <ManageApplications {...commonProps} />;
      case 'volunteers':
        return <ManageVolunteers {...commonProps} />;
      case 'shelters':
        return <ManageShelters {...commonProps} />;
      case 'alerts':
        return <ManageAlerts {...commonProps} />;
      case 'knowledge':
        return <ManageKnowledge {...commonProps} />;
      case 'places':
        return <ManagePlaces {...commonProps} />;
      case 'beneficiaries':
        return <ManageBeneficiaries {...commonProps} />;
      case 'analytics':
        return <Analytics {...commonProps} />;
      case 'settings':
        return <Settings {...commonProps} />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <div className="error-message">Access denied. Admin privileges required.</div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveTab()}
    </AdminLayout>
  );
};

export default AdminDashboard;
