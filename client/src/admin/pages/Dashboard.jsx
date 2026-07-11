import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const Dashboard = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalDistricts: 0
  });
  const [latestSubmissions, setLatestSubmissions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      const data = await adminApi.getDashboardStats();
      
      setStats({
        totalUsers: data.totalUsers || 0,
        totalApplications: data.totalApplications || 0,
        pendingCount: data.pendingCount || 0,
        approvedCount: data.approvedCount || 0,
        rejectedCount: data.rejectedCount || 0,
        totalDistricts: data.totalDistricts || 0
      });
      
      setLatestSubmissions(data.latestSubmissions || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <section className="admin-section">
      <h2>Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalApplications.toLocaleString()}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.approvedCount.toLocaleString()}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-value">{stats.rejectedCount.toLocaleString()}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
        
        <div className="stat-box highlight">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingCount.toLocaleString()}</div>
            <div className="stat-label">Pending Approvals</div>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">🗺️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalDistricts.toLocaleString()}</div>
            <div className="stat-label">Districts Covered</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions - Pending Approvals</h3>
        <div className="action-buttons">
          <div className="action-card">
            <div className="action-icon">🤝</div>
            <div className="action-content">
              <h4>Review Volunteers</h4>
              <p>Approve or reject volunteer applications</p>
              <div className="action-count">{stats.pendingCount} pending</div>
            </div>
          </div>
          
          <div className="action-card">
            <div className="action-icon">⛺</div>
            <div className="action-content">
              <h4>Review Shelters</h4>
              <p>Manage shelter registration requests</p>
              <div className="action-count">{stats.pendingCount} pending</div>
            </div>
          </div>
          
          <div className="action-card">
            <div className="action-icon">🔔</div>
            <div className="action-content">
              <h4>Review Alerts</h4>
              <p>Publish or reject alert submissions</p>
              <div className="action-count">{stats.pendingCount} pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Submissions */}
      <div className="latest-submissions">
        <h3>Latest Submissions</h3>
        {latestSubmissions.length === 0 ? (
          <p className="empty-message">No submissions yet</p>
        ) : (
          <div className="submissions-list">
            {latestSubmissions.map((submission, index) => (
              <div key={`${submission.type}-${submission.id || index}`} className="submission-item">
                <div className="submission-type">
                  <span className="type-badge">{submission.type?.toUpperCase() || 'UNKNOWN'}</span>
                </div>
                <div className="submission-details">
                  <div className="submission-name">{submission.name || 'Unknown'}</div>
                  <div className="submission-meta">
                    <span className="submission-date">{new Date(submission.date || Date.now()).toLocaleDateString()}</span>
                    <span className={`status-badge status-${submission.status?.toLowerCase() || 'unknown'}`}>
                      {submission.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Health */}
      <div className="system-health">
        <h3>System Health</h3>
        <div className="health-grid">
          <div className="health-item">
            <div className="health-icon">🟢</div>
            <div className="health-info">
              <div className="health-label">Database</div>
              <div className="health-status">Connected</div>
            </div>
          </div>
          
          <div className="health-item">
            <div className="health-icon">🟢</div>
            <div className="health-info">
              <div className="health-label">API Services</div>
              <div className="health-status">Operational</div>
            </div>
          </div>
          
          <div className="health-item">
            <div className="health-icon">🟢</div>
            <div className="health-info">
              <div className="health-label">Authentication</div>
              <div className="health-status">Secure</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;