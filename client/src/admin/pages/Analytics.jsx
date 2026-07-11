import React, { useState, useEffect } from 'react';
import AdminApi from '../../services/api/adminApi';
import '../admin.css';

const Analytics = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    users: [],
    volunteers: [],
    shelters: [],
    alerts: [],
    applications: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticsData();
  }, [token]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const adminApi = new AdminApi(token);
      
      // Fetch data from multiple endpoints
      const [usersRes, volunteersRes, sheltersRes, alertsRes, applicationsRes] = await Promise.all([
        adminApi.getAllUsers().catch(() => ({ users: [] })),
        adminApi.getAllVolunteers().catch(() => ({ volunteers: [] })),
        adminApi.getAllShelters().catch(() => ({ shelters: [] })),
        adminApi.getAllAlerts().catch(() => ({ alerts: [] })),
        adminApi.getAllApplications().catch(() => ({ applications: [] }))
      ]);

      setAnalyticsData({
        users: usersRes.users || [],
        volunteers: volunteersRes.volunteers || volunteersRes || [],
        shelters: sheltersRes.shelters || sheltersRes || [],
        alerts: alertsRes.alerts || alertsRes || [],
        applications: applicationsRes.applications || applicationsRes || []
      });
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const { users, volunteers, shelters, alerts, applications } = analyticsData;
    
    // User metrics
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const volunteerUsers = users.filter(u => u.role === 'volunteer').length;
    
    // Volunteer metrics
    const totalVolunteers = volunteers.length;
    const approvedVolunteers = volunteers.filter(v => v.status === 'approved').length;
    const pendingVolunteers = volunteers.filter(v => v.status === 'pending').length;
    const rejectedVolunteers = volunteers.filter(v => v.status === 'rejected').length;
    
    // Shelter metrics
    const totalShelters = shelters.length;
    const approvedShelters = shelters.filter(s => s.status === 'approved').length;
    const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const totalOccupancy = shelters.reduce((sum, s) => sum + (s.currentOccupancy || 0), 0);
    const utilizationRate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
    
    // Alert metrics
    const totalAlerts = alerts.length;
    const publishedAlerts = alerts.filter(a => a.status === 'published').length;
    const pendingAlerts = alerts.filter(a => a.status === 'pending').length;
    const highSeverityAlerts = alerts.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length;
    
    // Application metrics
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(a => a.status === 'approved').length;
    const pendingApplications = applications.filter(a => a.status === 'pending').length;
    
    // District distribution
    const districtStats = {};
    [...users, ...volunteers, ...shelters].forEach(item => {
      if (item.district) {
        districtStats[item.district] = (districtStats[item.district] || 0) + 1;
      }
    });
    
    return {
      users: { totalUsers, activeUsers, adminUsers, volunteerUsers },
      volunteers: { totalVolunteers, approvedVolunteers, pendingVolunteers, rejectedVolunteers },
      shelters: { totalShelters, approvedShelters, totalCapacity, totalOccupancy, utilizationRate },
      alerts: { totalAlerts, publishedAlerts, pendingAlerts, highSeverityAlerts },
      applications: { totalApplications, approvedApplications, pendingApplications },
      districtStats
    };
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading analytics...</div>
      </div>
    );
  }

  const metrics = calculateMetrics();

  return (
    <section className="admin-section">
      <h2>System Analytics</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Overview Cards */}
      <div className="analytics-overview">
        <div className="analytics-card">
          <h3>👥 Users Overview</h3>
          <div className="metrics-grid">
            <div className="metric">
              <label>Total Users:</label>
              <span className="value">{metrics.users.totalUsers.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Active Users:</label>
              <span className="value">{metrics.users.activeUsers.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Admins:</label>
              <span className="value">{metrics.users.adminUsers.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Volunteers:</label>
              <span className="value">{metrics.users.volunteerUsers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>🤝 Volunteer Analytics</h3>
          <div className="metrics-grid">
            <div className="metric">
              <label>Total Volunteers:</label>
              <span className="value">{metrics.volunteers.totalVolunteers.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Approved:</label>
              <span className="value">{metrics.volunteers.approvedVolunteers.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Pending:</label>
              <span className="value">{metrics.volunteers.pendingVolunteers.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Rejected:</label>
              <span className="value">{metrics.volunteers.rejectedVolunteers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>⛺ Shelter Analytics</h3>
          <div className="metrics-grid">
            <div className="metric">
              <label>Total Shelters:</label>
              <span className="value">{metrics.shelters.totalShelters.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Approved:</label>
              <span className="value">{metrics.shelters.approvedShelters.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Total Capacity:</label>
              <span className="value">{metrics.shelters.totalCapacity.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Utilization:</label>
              <span className="value">{metrics.shelters.utilizationRate}%</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>🔔 Alert Analytics</h3>
          <div className="metrics-grid">
            <div className="metric">
              <label>Total Alerts:</label>
              <span className="value">{metrics.alerts.totalAlerts.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Published:</label>
              <span className="value">{metrics.alerts.publishedAlerts.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Pending:</label>
              <span className="value">{metrics.alerts.pendingAlerts.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>High Severity:</label>
              <span className="value">{metrics.alerts.highSeverityAlerts.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>📄 Application Analytics</h3>
          <div className="metrics-grid">
            <div className="metric">
              <label>Total Applications:</label>
              <span className="value">{metrics.applications.totalApplications.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Approved:</label>
              <span className="value">{metrics.applications.approvedApplications.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Pending:</label>
              <span className="value">{metrics.applications.pendingApplications.toLocaleString()}</span>
            </div>
            <div className="metric">
              <label>Approval Rate:</label>
              <span className="value">
                {metrics.applications.totalApplications > 0 
                  ? Math.round((metrics.applications.approvedApplications / metrics.applications.totalApplications) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* District Distribution */}
      <div className="analytics-card">
        <h3>🗺️ District Distribution</h3>
        <div className="district-stats">
          {Object.entries(metrics.districtStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([district, count]) => (
              <div key={district} className="district-stat">
                <span className="district-name">{district}</span>
                <div className="district-bar">
                  <div 
                    className="district-fill" 
                    style={{ width: `${(count / Math.max(...Object.values(metrics.districtStats))) * 100}%` }}
                  ></div>
                </div>
                <span className="district-count">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="analytics-card">
        <h3>📊 Key Performance Indicators</h3>
        <div className="kpi-grid">
          <div className="kpi-item">
            <div className="kpi-label">Volunteer Approval Rate</div>
            <div className="kpi-value">
              {metrics.volunteers.totalVolunteers > 0 
                ? Math.round((metrics.volunteers.approvedVolunteers / metrics.volunteers.totalVolunteers) * 100)
                : 0}%
            </div>
          </div>
          
          <div className="kpi-item">
            <div className="kpi-label">Shelter Utilization</div>
            <div className="kpi-value">{metrics.shelters.utilizationRate}%</div>
          </div>
          
          <div className="kpi-item">
            <div className="kpi-label">Alert Response Rate</div>
            <div className="kpi-value">
              {metrics.alerts.totalAlerts > 0 
                ? Math.round((metrics.alerts.publishedAlerts / metrics.alerts.totalAlerts) * 100)
                : 0}%
            </div>
          </div>
          
          <div className="kpi-item">
            <div className="kpi-label">User Engagement</div>
            <div className="kpi-value">
              {metrics.users.totalUsers > 0 
                ? Math.round((metrics.users.activeUsers / metrics.users.totalUsers) * 100)
                : 0}%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
