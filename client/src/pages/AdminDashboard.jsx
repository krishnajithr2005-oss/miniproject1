import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';
import { apiUrl } from '../config/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading, logout } = useAuth();
  
  // Check if user is admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);
  const [sosStats, setSosStats] = useState({ total: 0, active: 0, responding: 0, resolved: 0, critical: 0 });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingApprovals: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalDistricts: 0
  });
  const [latestSubmissions, setLatestSubmissions] = useState([]);
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherFetching, setWeatherFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    district: '',
    password: ''
  });
  const [newPlace, setNewPlace] = useState({
    name: '',
    district: '',
    state: 'Kerala',
    latitude: '',
    longitude: '',
    riskLevel: 'MEDIUM',
    riskScore: 50,
    description: ''
  });
  const [newAlert, setNewAlert] = useState({
    title: '',
    placeName: '',
    description: '',
    severity: 'MEDIUM',
    type: 'admin-update',
    district: ''
  });
  const [newKnowledge, setNewKnowledge] = useState({
    title: '',
    category: 'general',
    content: ''
  });

  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  // Kerala districts with coordinates for weather
  const keralaDistricts = [
    { name: 'Thiruvananthapuram', coordinates: { lat: 8.5241, lng: 76.9366 } },
    { name: 'Kollam', coordinates: { lat: 8.8932, lng: 76.6082 } },
    { name: 'Pathanamthitta', coordinates: { lat: 9.4333, lng: 76.7833 } },
    { name: 'Alappuzha', coordinates: { lat: 9.4981, lng: 76.3380 } },
    { name: 'Kottayam', coordinates: { lat: 9.5914, lng: 76.5216 } },
    { name: 'Idukki', coordinates: { lat: 9.8467, lng: 76.9723 } },
    { name: 'Ernakulam', coordinates: { lat: 10.0265, lng: 76.3125 } },
    { name: 'Thrissur', coordinates: { lat: 10.5204, lng: 76.2144 } },
    { name: 'Palakkad', coordinates: { lat: 10.7867, lng: 76.6548 } },
    { name: 'Malappuram', coordinates: { lat: 11.0728, lng: 76.0770 } },
    { name: 'Kozhikode', coordinates: { lat: 11.2588, lng: 75.7804 } },
    { name: 'Wayanad', coordinates: { lat: 11.6067, lng: 76.0833 } },
    { name: 'Kannur', coordinates: { lat: 11.8745, lng: 75.3704 } },
    { name: 'Kasargod', coordinates: { lat: 12.4997, lng: 74.8490 } }
  ];

  // Weather helper functions
  const getWeatherCondition = (code) => {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '☁️';
  };

  // Fetch real weather from Open-Meteo API
  const fetchRealWeather = async (districtName) => {
    const district = keralaDistricts.find(d => d.name === districtName);
    if (!district) return null;

    try {
      setWeatherFetching(true);
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${district.coordinates.lat}&longitude=${district.coordinates.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia/Kolkata`
      );
      const data = await response.json();

      return {
        temperature: Math.round(data.current.temperature_2m),
        condition: getWeatherCondition(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        feelsLike: Math.round(data.current.apparent_temperature)
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    } finally {
      setWeatherFetching(false);
    }
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [dashboardRes, volunteersRes, sheltersRes, alertsRes, placesRes, knowledgeRes, sosRes] = await Promise.all([
        axios.get(apiUrl('/api/admin/dashboard'), { headers: authHeaders }).catch(() => ({ data: {} })),
        axios.get(apiUrl('/api/volunteers'), { headers: authHeaders }).catch(() => ({ data: [] })),
        axios.get(apiUrl('/api/shelters/applications'), { headers: authHeaders }).catch(() => ({ data: [] })),
        axios.get(apiUrl('/api/alerts/applications'), { headers: authHeaders }).catch(() => ({ data: [] })),
        axios.get(apiUrl('/api/places')).catch(() => ({ data: [] })),
        axios.get(apiUrl('/api/admin/knowledge'), { headers: authHeaders }).catch(() => ({ data: [] })),
        axios.get(apiUrl('/api/admin/sos'), { headers: authHeaders }).catch(() => ({ data: { requests: [], stats: {} } }))
      ]);

      const volunteersData = volunteersRes.data || [];
      const sheltersData = sheltersRes.data || [];
      const alertsData = alertsRes.data || [];
      const placesData = placesRes.data || [];
      const dashboardData = dashboardRes.data || {};

      setVolunteers(volunteersData);
      setShelters(sheltersData);
      setAlerts(alertsData);
      setPlaces(placesData);
      setSosRequests(sosRes.data?.requests || []);
      setSosStats(sosRes.data?.stats || { total: 0, active: 0, responding: 0, resolved: 0, critical: 0 });
      setLatestSubmissions(dashboardData.latestSubmissions || []);
      setKnowledgeItems(knowledgeRes.data || []);
      setStats({
        totalUsers: dashboardData.totalUsers || 0,
        totalApplications: dashboardData.totalApplications || 0,
        pendingApprovals: dashboardData.pendingCount || 0,
        approvedCount: dashboardData.approvedCount || 0,
        rejectedCount: dashboardData.rejectedCount || 0,
        totalDistricts: placesData.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [token, authHeaders]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Fetch weather for admin's district
  useEffect(() => {
    const loadWeather = async () => {
      if (user?.district) {
        const weather = await fetchRealWeather(user.district);
        if (weather) {
          setCurrentWeather(weather);
        }
      }
    };
    loadWeather();
  }, [user?.district]);

  // Handle volunteer approval
  const approveVolunteer = async (id) => {
    try {
      await axios.put(apiUrl(`/api/volunteers/${id}/verify`), {
        action: 'approve',
        approvedBy: user?.email || 'admin'
      }, {
        headers: authHeaders
      });
      fetchData();
    } catch (error) {
      console.error('Error approving volunteer:', error);
    }
  };

  const rejectVolunteer = async (id) => {
    try {
      await axios.put(apiUrl(`/api/volunteers/${id}/verify`), {
        action: 'reject',
        approvedBy: user?.email || 'admin'
      }, {
        headers: authHeaders
      });
      fetchData();
    } catch (error) {
      console.error('Error rejecting volunteer:', error);
    }
  };

  // Handle shelter approval
  const approveShelter = async (id) => {
    try {
      await axios.put(apiUrl(`/api/shelters/${id}/verify`), {
        action: 'approve',
        approvedBy: user?.email || 'admin'
      }, {
        headers: authHeaders
      });
      fetchData();
    } catch (error) {
      console.error('Error approving shelter:', error);
    }
  };

  const rejectShelter = async (id) => {
    try {
      await axios.put(apiUrl(`/api/shelters/${id}/verify`), {
        action: 'reject',
        approvedBy: user?.email || 'admin'
      }, {
        headers: authHeaders
      });
      fetchData();
    } catch (error) {
      console.error('Error rejecting shelter:', error);
    }
  };

  // Handle alert approval
  const publishAlert = async (id) => {
    try {
      await axios.put(apiUrl(`/api/alerts/${id}/verify`), {
        action: 'publish',
        verifiedBy: user?.email || 'admin'
      }, {
        headers: authHeaders
      });
      fetchData();
    } catch (error) {
      console.error('Error publishing alert:', error);
    }
  };

  const rejectAlert = async (id) => {
    try {
      await axios.put(apiUrl(`/api/alerts/${id}/verify`), {
        action: 'reject',
        verifiedBy: user?.email || 'admin'
      }, {
        headers: authHeaders
      });
      fetchData();
    } catch (error) {
      console.error('Error rejecting alert:', error);
    }
  };

  // SOS Management Functions
  const respondToSOS = async (id, note) => {
    try {
      await axios.put(apiUrl(`/api/admin/sos/${id}/respond`), { note }, { headers: authHeaders });
      fetchData();
    } catch (error) {
      console.error('Error responding to SOS:', error);
    }
  };

  const resolveSOS = async (id, note) => {
    try {
      await axios.put(apiUrl(`/api/admin/sos/${id}/resolve`), { note }, { headers: authHeaders });
      fetchData();
    } catch (error) {
      console.error('Error resolving SOS:', error);
    }
  };

  const deleteSOS = async (id) => {
    if (!window.confirm('Are you sure you want to delete this SOS request?')) return;
    try {
      await axios.delete(apiUrl(`/api/admin/sos/${id}`), { headers: authHeaders });
      fetchData();
    } catch (error) {
      console.error('Error deleting SOS:', error);
    }
  };

  const createAdmin = async () => {
    try {
      await axios.post(apiUrl('/api/admin/users/create-admin'), newAdmin, { headers: authHeaders });
      setMessage('Admin created successfully.');
      setNewAdmin({ firstName: '', lastName: '', email: '', phone: '', district: '', password: '' });
      fetchData();
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Failed to create admin.');
    }
  };

  const createDistrict = async () => {
    try {
      await axios.post(apiUrl('/api/admin/places'), newPlace, { headers: authHeaders });
      setMessage('District added successfully.');
      setNewPlace({ name: '', district: '', state: 'Kerala', latitude: '', longitude: '', riskLevel: 'MEDIUM', riskScore: 50, description: '' });
      fetchData();
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Failed to add district.');
    }
  };

  const deleteDistrict = async (id) => {
    try {
      await axios.delete(apiUrl(`/api/admin/places/${id}`), { headers: authHeaders });
      fetchData();
    } catch (error) {
      setMessage('Failed to delete district.');
    }
  };

  const createManualAlert = async () => {
    try {
      await axios.post(apiUrl('/api/admin/alerts'), newAlert, { headers: authHeaders });
      setMessage('Admin alert published.');
      setNewAlert({ title: '', placeName: '', description: '', severity: 'MEDIUM', type: 'admin-update', district: '' });
      fetchData();
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Failed to create admin alert.');
    }
  };

  const publishKnowledge = async () => {
    try {
      await axios.post(apiUrl('/api/admin/knowledge'), newKnowledge, { headers: authHeaders });
      setMessage('Knowledge entry published.');
      setNewKnowledge({ title: '', category: 'general', content: '' });
      fetchData();
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Failed to publish knowledge.');
    }
  };

  if (loading) {
    return <div className="admin-dashboard"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>👨‍💼 Admin Control Center</h1>
          <div className="admin-user-info">
            <span>{user?.firstName || 'Admin'}</span>
            <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="admin-container">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'volunteers' ? 'active' : ''}`}
              onClick={() => setActiveTab('volunteers')}
            >
              🤝 Volunteers
            </button>
            <button 
              className={`nav-item ${activeTab === 'shelters' ? 'active' : ''}`}
              onClick={() => setActiveTab('shelters')}
            >
              ⛺ Shelters
            </button>
            <button 
              className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
            >
              🔔 Alerts ({alerts.filter(a => a.status === 'pending').length})
            </button>
            <button 
              className={`nav-item ${activeTab === 'sos' ? 'active' : ''}`}
              onClick={() => setActiveTab('sos')}
            >
              🆘 SOS Requests ({sosStats.active + sosStats.responding})
            </button>
            <button 
              className={`nav-item ${activeTab === 'places' ? 'active' : ''}`}
              onClick={() => setActiveTab('places')}
            >
              🗺️ Districts
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-content">
          {message && <p className="empty-message">{message}</p>}
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <section className="admin-section">
              <h2>Dashboard Overview</h2>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🤝</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalApplications}</div>
                    <div className="stat-label">Total Applications</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">⛺</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.approvedCount}</div>
                    <div className="stat-label">Approved</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🔔</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.rejectedCount}</div>
                    <div className="stat-label">Rejected</div>
                  </div>
                </div>
                <div className="stat-box highlight">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.pendingApprovals}</div>
                    <div className="stat-label">Pending Approvals</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🗺️</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalDistricts}</div>
                    <div className="stat-label">Districts Covered</div>
                  </div>
                </div>
              </div>

              {/* Admin Location-Based Dashboard */}
              <div className="admin-location-dashboard" style={{marginTop: '30px', marginBottom: '30px'}}>
                <h3 style={{marginBottom: '20px', color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  📍 Your District Overview: <span style={{color: '#059669'}}>{user?.district || 'Kerala'}</span>
                </h3>
                
                <div className="location-cards-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px'}}>
                  {/* Weather Card */}
                  <div className="location-card" style={{background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '20px', borderRadius: '12px', border: '1px solid #93c5fd'}}>
                    <div style={{fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '10px'}}>🌤️ Weather in {user?.district || 'Kerala'}</div>
                    <div style={{fontSize: '32px', fontWeight: '700', color: '#1e3a8a'}}>
                      {currentWeather?.temperature || 28}°C
                    </div>
                    <div style={{fontSize: '13px', color: '#3b82f6', marginTop: '5px'}}>
                      {currentWeather?.condition || 'Partly Cloudy'} • Humidity {currentWeather?.humidity || 75}%
                    </div>
                    <div style={{fontSize: '24px', marginTop: '10px'}}>{currentWeather?.icon || '⛅'}</div>
                  </div>

                  {/* Live Alerts Card */}
                  <div className="location-card" style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', padding: '20px', borderRadius: '12px', border: '1px solid #fcd34d'}}>
                    <div style={{fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '10px'}}>🔔 Live Alerts in {user?.district || 'Kerala'}</div>
                    <div style={{fontSize: '32px', fontWeight: '700', color: '#92400e'}}>
                      {alerts.filter(a => 
                        a.status === 'published' && 
                        (a.district === user?.district || a.placeName?.includes(user?.district))
                      ).length || 0}
                    </div>
                    <div style={{fontSize: '13px', color: '#b45309', marginTop: '5px'}}>
                      Active alert(s) requiring attention
                    </div>
                    <button 
                      onClick={() => setActiveTab('alerts')}
                      style={{marginTop: '10px', padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer'}}
                    >
                      View & Manage
                    </button>
                  </div>

                  {/* SOS Card */}
                  <div className="location-card" style={{background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', padding: '20px', borderRadius: '12px', border: '1px solid #fca5a5'}}>
                    <div style={{fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '10px'}}>🚨 SOS Requests in {user?.district || 'Kerala'}</div>
                    <div style={{fontSize: '32px', fontWeight: '700', color: '#991b1b'}}>
                      {alerts.filter(a => 
                        a.status === 'published' && 
                        a.type?.toLowerCase().includes('sos') &&
                        (a.district === user?.district || a.placeName?.includes(user?.district))
                      ).length || 0}
                    </div>
                    <div style={{fontSize: '13px', color: '#b91c1c', marginTop: '5px'}}>
                      Emergency request(s) in your district
                    </div>
                    <button 
                      onClick={() => setActiveTab('alerts')}
                      style={{marginTop: '10px', padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer'}}
                    >
                      Respond Now
                    </button>
                  </div>

                  {/* Shelters Card */}
                  <div className="location-card" style={{background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', padding: '20px', borderRadius: '12px', border: '1px solid #6ee7b7'}}>
                    <div style={{fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '10px'}}>🏘️ Shelters in {user?.district || 'Kerala'}</div>
                    <div style={{fontSize: '32px', fontWeight: '700', color: '#065f46'}}>
                      {shelters.filter(s => 
                        (s.district === user?.district || s.placeName?.includes(user?.district)) && 
                        s.status === 'approved'
                      ).length || 
                      shelters.filter(s => s.district === user?.district).length || 0}
                    </div>
                    <div style={{fontSize: '13px', color: '#047857', marginTop: '5px'}}>
                      Active shelter(s) in your district
                    </div>
                    <button 
                      onClick={() => setActiveTab('shelters')}
                      style={{marginTop: '10px', padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer'}}
                    >
                      Manage Shelters
                    </button>
                  </div>
                </div>

                {/* District Summary */}
                <div className="district-summary" style={{background: '#f9fafb', padding: '15px 20px', borderRadius: '10px', border: '1px solid #e5e7eb'}}>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px'}}>
                    <span><strong>📍 District:</strong> {user?.district || 'Kerala'}</span>
                    <span><strong>👥 Total Volunteers:</strong> {volunteers.filter(v => v.district === user?.district).length}</span>
                    <span><strong>⛺ Pending Shelters:</strong> {shelters.filter(s => s.district === user?.district && s.status === 'pending').length}</span>
                    <span><strong>🔔 Pending Alerts:</strong> {alerts.filter(a => a.district === user?.district && a.status === 'pending').length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions - Pending Approvals</h3>
                <div className="action-buttons">
                  <button onClick={() => setActiveTab('volunteers')} className="action-btn">
                    👥 Review Volunteers ({volunteers.filter(v => v.status === 'pending').length})
                  </button>
                  <button onClick={() => setActiveTab('shelters')} className="action-btn">
                    ⛺ Review Shelters ({shelters.filter(s => s.status === 'pending').length})
                  </button>
                  <button onClick={() => setActiveTab('alerts')} className="action-btn">
                    🔔 Review Alerts ({alerts.filter(a => a.status === 'pending').length})
                  </button>
                </div>
              </div>
              <div className="quick-actions">
                <h3>Latest Submissions</h3>
                {latestSubmissions.length === 0 && <p className="empty-message">No submissions yet</p>}
                {latestSubmissions.map((submission) => (
                  <div key={`${submission.type}-${submission.id}`} className="setting-item">
                    <strong>{submission.type.toUpperCase()}</strong> - {submission.name} ({submission.status})
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Volunteers Tab */}
          {activeTab === 'volunteers' && (
            <section className="admin-section">
              <h2>Volunteer Management ({volunteers.length})</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>District</th>
                      <th>Availability</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteers.map(v => (
                      <tr key={v._id} className={`status-${v.status}`}>
                        <td>{v.firstName} {v.lastName}</td>
                        <td>{v.email}</td>
                        <td>{v.phone}</td>
                        <td>{v.district}</td>
                        <td>{v.availability || 'N/A'}</td>
                        <td><span className={`status-badge status-${v.status}`}>{v.status.toUpperCase()}</span></td>
                        <td className="action-cell">
                          {v.status === 'pending' ? (
                            <>
                              <button onClick={() => approveVolunteer(v._id)} className="btn-approve">✓ Approve</button>
                              <button onClick={() => rejectVolunteer(v._id)} className="btn-reject">✕ Reject</button>
                            </>
                          ) : (
                            <span className={`status-badge status-${v.status}`}>✓ {v.status.toUpperCase()}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {volunteers.length === 0 && <p className="empty-message">No volunteers found</p>}
              </div>
            </section>
          )}

          {/* Shelters Tab */}
          {activeTab === 'shelters' && (
            <section className="admin-section">
              <h2>Shelter Applications ({shelters.length})</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Shelter Name</th>
                      <th>Owner</th>
                      <th>Email</th>
                      <th>District</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shelters.map(s => (
                      <tr key={s._id} className={`status-${s.status}`}>
                        <td>{s.shelterName || s.name}</td>
                        <td>{s.ownerName}</td>
                        <td>{s.ownerEmail}</td>
                        <td>{s.district}</td>
                        <td>{s.capacity}</td>
                        <td><span className={`status-badge status-${s.status}`}>{s.status.toUpperCase()}</span></td>
                        <td className="action-cell">
                          {s.status === 'pending' ? (
                            <>
                              <button onClick={() => approveShelter(s._id)} className="btn-approve">✓ Approve</button>
                              <button onClick={() => rejectShelter(s._id)} className="btn-reject">✕ Reject</button>
                            </>
                          ) : (
                            <span className={`status-badge status-${s.status}`}>✓ {s.status.toUpperCase()}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {shelters.length === 0 && <p className="empty-message">No pending shelter applications</p>}
              </div>
            </section>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <section className="admin-section">
              <h2>🔔 Alert Management ({alerts.length})</h2>

              {/* Demo Data Controls */}
              <div className="demo-controls" style={{background: '#f3f4f6', padding: '15px 20px', borderRadius: '10px', marginBottom: '25px'}}>
                <h3 style={{marginBottom: '12px', fontSize: '16px'}}>🎮 Demo Data Controls</h3>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                  <button 
                    onClick={async () => {
                      try {
                        await axios.post(apiUrl('/api/admin/alerts/seed-demo'), 
                          { district: user?.district || 'Thiruvananthapuram' }, 
                          { headers: authHeaders }
                        );
                        fetchData();
                        setMessage('Demo alerts created successfully!');
                      } catch (error) {
                        setMessage('Failed to create demo alerts');
                      }
                    }}
                    className="btn-approve"
                    style={{background: '#10b981', fontSize: '13px'}}
                  >
                    ➕ Generate Demo Alerts
                  </button>
                  <button 
                    onClick={async () => {
                      if (!window.confirm('Clear all demo alerts?')) return;
                      try {
                        await axios.delete(apiUrl('/api/admin/alerts/clear-demo'), { headers: authHeaders });
                        fetchData();
                        setMessage('Demo alerts cleared!');
                      } catch (error) {
                        setMessage('Failed to clear demo alerts');
                      }
                    }}
                    className="btn-reject"
                    style={{fontSize: '13px'}}
                  >
                    🗑️ Clear Demo Data
                  </button>
                  <span style={{fontSize: '12px', color: '#6b7280', marginLeft: '10px'}}>
                    Creates CRITICAL, HIGH, MODERATE, LOW sample alerts
                  </span>
                </div>
              </div>

              {/* Severity Stats */}
              <div className="stats-grid" style={{marginBottom: '25px'}}>
                <div className="stat-box" style={{background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', borderColor: '#ef4444'}}>
                  <div className="stat-icon">🚨</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{color: '#dc2626'}}>
                      {alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'published').length}
                    </div>
                    <div className="stat-label">CRITICAL</div>
                  </div>
                </div>
                <div className="stat-box" style={{background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', borderColor: '#f97316'}}>
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{color: '#ea580c'}}>
                      {alerts.filter(a => a.severity === 'HIGH' && a.status === 'published').length}
                    </div>
                    <div className="stat-label">HIGH</div>
                  </div>
                </div>
                <div className="stat-box" style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderColor: '#eab308'}}>
                  <div className="stat-icon">🔶</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{color: '#ca8a04'}}>
                      {alerts.filter(a => a.severity === 'MODERATE' && a.status === 'published').length}
                    </div>
                    <div className="stat-label">MODERATE</div>
                  </div>
                </div>
                <div className="stat-box" style={{background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', borderColor: '#22c55e'}}>
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{color: '#16a34a'}}>
                      {alerts.filter(a => a.severity === 'LOW' && a.status === 'published').length}
                    </div>
                    <div className="stat-label">LOW</div>
                  </div>
                </div>
                <div className="stat-box" style={{background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', borderColor: '#6366f1'}}>
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{color: '#4f46e5'}}>
                      {alerts.filter(a => a.status === 'pending').length}
                    </div>
                    <div className="stat-label">PENDING</div>
                  </div>
                </div>
              </div>

              {/* Alerts by Severity Sections */}
              {['CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((severity) => {
                const severityAlerts = alerts.filter(a => a.severity === severity);
                if (severityAlerts.length === 0) return null;
                
                const colors = {
                  CRITICAL: { bg: '#fef2f2', border: '#ef4444', text: '#dc2626' },
                  HIGH: { bg: '#fff7ed', border: '#f97316', text: '#ea580c' },
                  MODERATE: { bg: '#fefce8', border: '#eab308', text: '#ca8a04' },
                  LOW: { bg: '#f0fdf4', border: '#22c55e', text: '#16a34a' }
                };
                
                return (
                  <div key={severity} style={{marginBottom: '25px', background: colors[severity].bg, border: `2px solid ${colors[severity].border}`, borderRadius: '12px', padding: '20px'}}>
                    <h3 style={{color: colors[severity].text, marginBottom: '15px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      {severity === 'CRITICAL' && '🚨'}
                      {severity === 'HIGH' && '⚠️'}
                      {severity === 'MODERATE' && '🔶'}
                      {severity === 'LOW' && '✅'}
                      {severity} Alerts ({severityAlerts.length})
                    </h3>
                    <div className="table-container" style={{background: 'white', borderRadius: '8px', overflow: 'hidden'}}>
                      <table className="admin-table" style={{margin: 0}}>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>District</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {severityAlerts.slice(0, 5).map(a => (
                            <tr key={a._id}>
                              <td style={{fontWeight: '500'}}>{a.title}</td>
                              <td>{a.district || a.placeName}</td>
                              <td>
                                <span style={{textTransform: 'capitalize', fontSize: '12px', padding: '4px 8px', background: '#f3f4f6', borderRadius: '4px'}}>
                                  {a.type === 'flood' && '🌊 '}
                                  {a.type === 'landslide' && '⛰️ '}
                                  {a.type === 'coastal' && '🏖️ '}
                                  {a.type === 'dam' && '🏗️ '}
                                  {a.type}
                                </span>
                              </td>
                              <td>
                                <span className={`status-badge status-${a.status}`}>
                                  {a.status?.toUpperCase()}
                                </span>
                              </td>
                              <td style={{fontSize: '13px', color: '#6b7280'}}>
                                {new Date(a.createdAt || a.timestamp).toLocaleString()}
                              </td>
                              <td className="action-cell">
                                {a.status === 'pending' ? (
                                  <>
                                    <button onClick={() => publishAlert(a._id)} className="btn-approve" style={{marginRight: '5px'}}>✓ Publish</button>
                                    <button onClick={() => rejectAlert(a._id)} className="btn-reject">✕ Reject</button>
                                  </>
                                ) : a.status === 'published' ? (
                                  <>
                                    <button 
                                      onClick={() => {
                                        if (window.confirm('Unpublish this alert?')) {
                                          axios.put(apiUrl(`/api/alerts/${a._id}/verify`), { action: 'reject' }, { headers: authHeaders }).then(() => fetchData());
                                        }
                                      }}
                                      className="btn-reject"
                                      style={{fontSize: '12px'}}
                                    >
                                      ↩ Unpublish
                                    </button>
                                  </>
                                ) : (
                                  <span style={{fontSize: '12px', color: '#6b7280'}}>{a.status}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {severityAlerts.length > 5 && (
                        <div style={{padding: '10px', textAlign: 'center', fontSize: '13px', color: '#6b7280', borderTop: '1px solid #e5e7eb'}}>
                          +{severityAlerts.length - 5} more {severity} alerts
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {alerts.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px'}}>
                  <div style={{fontSize: '48px', marginBottom: '10px'}}>🔔</div>
                  <p className="empty-message" style={{fontSize: '16px', color: '#6b7280'}}>No alerts found</p>
                  <p style={{fontSize: '13px', color: '#9ca3af', marginTop: '8px'}}>Use "Generate Demo Alerts" to create sample data</p>
                </div>
              )}
            </section>
          )}

          {/* Places Tab */}
          {activeTab === 'places' && (
            <section className="admin-section">
              <h2>Districts Coverage ({places.length})</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>Risk Level</th>
                      <th>Risk Score</th>
                      <th>Coordinates</th>
                      <th>Active Layers</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {places.map(p => (
                      <tr key={p._id} className={`risk-${p.riskLevel?.toLowerCase()}`}>
                        <td><strong>{p.name}</strong></td>
                        <td>
                          <span className={`status-badge status-${p.riskLevel?.toLowerCase()}`}>
                            {p.riskLevel}
                          </span>
                        </td>
                        <td>{p.riskScore}/100</td>
                        <td>{p.coordinates?.latitude.toFixed(4)}, {p.coordinates?.longitude.toFixed(4)}</td>
                        <td>
                          {[
                            p.activeLayers?.flood && '🌊 Flood',
                            p.activeLayers?.landslide && '⛏️ Landslide',
                            p.activeLayers?.coastal && '🏖️ Coastal',
                            p.activeLayers?.dam && '🏗️ Dam'
                          ].filter(Boolean).join(', ')}
                        </td>
                        <td>
                          <button onClick={() => deleteDistrict(p._id)} className="btn-reject">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="settings-group">
                <h3>Add New District</h3>
                <div className="setting-item">
                  <input placeholder="District Name" value={newPlace.name} onChange={(e) => setNewPlace(prev => ({ ...prev, name: e.target.value, district: e.target.value }))} />
                </div>
                <div className="setting-item">
                  <select value={newPlace.riskLevel} onChange={(e) => setNewPlace(prev => ({ ...prev, riskLevel: e.target.value }))}>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
                <div className="setting-item">
                  <input type="number" placeholder="Risk Score" value={newPlace.riskScore} onChange={(e) => setNewPlace(prev => ({ ...prev, riskScore: e.target.value }))} />
                </div>
                <div className="setting-item">
                  <input placeholder="Latitude" value={newPlace.latitude} onChange={(e) => setNewPlace(prev => ({ ...prev, latitude: e.target.value }))} />
                </div>
                <div className="setting-item">
                  <input placeholder="Longitude" value={newPlace.longitude} onChange={(e) => setNewPlace(prev => ({ ...prev, longitude: e.target.value }))} />
                </div>
                <div className="setting-item">
                  <textarea placeholder="Description" value={newPlace.description} onChange={(e) => setNewPlace(prev => ({ ...prev, description: e.target.value }))} />
                </div>
                <button className="btn-save-settings" onClick={createDistrict}>Add District</button>
              </div>
            </section>
          )}

          {/* SOS Management Tab */}
          {activeTab === 'sos' && (
            <section className="admin-section">
              <h2>🆘 SOS Emergency Management</h2>
              
              {/* SOS Stats */}
              <div className="stats-grid" style={{marginBottom: '30px'}}>
                <div className="stat-box" style={{background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', borderColor: '#fca5a5'}}>
                  <div className="stat-icon">🚨</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{color: '#dc2626'}}>{sosStats.active}</div>
                    <div className="stat-label">Active SOS</div>
                  </div>
                </div>
                <div className="stat-box" style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderColor: '#fcd34d'}}>
                  <div className="stat-icon">🚑</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{color: '#d97706'}}>{sosStats.responding}</div>
                    <div className="stat-label">Responding</div>
                  </div>
                </div>
                <div className="stat-box" style={{background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderColor: '#6ee7b7'}}>
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{color: '#059669'}}>{sosStats.resolved}</div>
                    <div className="stat-label">Resolved</div>
                  </div>
                </div>
                <div className="stat-box" style={{background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', borderColor: '#a5b4fc'}}>
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <div className="stat-value" style={{color: '#4f46e5'}}>{sosStats.total}</div>
                    <div className="stat-label">Total Requests</div>
                  </div>
                </div>
              </div>

              {/* SOS Requests Table */}
              <div className="table-container">
                <h3 style={{marginBottom: '15px'}}>All SOS Requests</h3>
                {sosRequests.length === 0 ? (
                  <p className="empty-message">No SOS requests found</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>District</th>
                        <th>Location</th>
                        <th>Emergency Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sosRequests.map((sos) => (
                        <tr key={sos._id} className={`sos-row status-${sos.status} priority-${sos.priority}`}>
                          <td>
                            <strong>{sos.userName}</strong>
                            <div style={{fontSize: '12px', color: '#666'}}>{sos.phone}</div>
                          </td>
                          <td>{sos.district}</td>
                          <td>
                            <div>{sos.location}</div>
                            {sos.latitude && (
                              <div style={{fontSize: '11px', color: '#888'}}>
                                📍 {sos.latitude.toFixed(4)}, {sos.longitude.toFixed(4)}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className="emergency-type">
                              {sos.emergencyType === 'flood' && '🌊 Flood'}
                              {sos.emergencyType === 'landslide' && '⛰️ Landslide'}
                              {sos.emergencyType === 'fire' && '🔥 Fire'}
                              {sos.emergencyType === 'medical' && '🏥 Medical'}
                              {sos.emergencyType === 'trapped' && '🆘 Trapped'}
                              {sos.emergencyType === 'other' && '⚠️ Other'}
                            </span>
                          </td>
                          <td>
                            <span className={`priority-badge priority-${sos.priority}`}>
                              {sos.priority.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge status-${sos.status}`}>
                              {sos.status.toUpperCase()}
                            </span>
                          </td>
                          <td>{new Date(sos.createdAt).toLocaleString()}</td>
                          <td className="action-cell">
                            {sos.status === 'active' && (
                              <button 
                                onClick={() => respondToSOS(sos._id, 'Response team dispatched')}
                                className="btn-approve"
                                style={{background: '#f59e0b', marginRight: '5px'}}
                              >
                                Respond
                              </button>
                            )}
                            {(sos.status === 'active' || sos.status === 'responding') && (
                              <>
                                <button 
                                  onClick={() => {
                                    const note = prompt('Enter resolution notes:');
                                    if (note) resolveSOS(sos._id, note);
                                  }}
                                  className="btn-approve"
                                  style={{marginRight: '5px'}}
                                >
                                  Resolve
                                </button>
                                <button 
                                  onClick={() => deleteSOS(sos._id)}
                                  className="btn-reject"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                            {sos.status === 'resolved' && (
                              <button 
                                onClick={() => deleteSOS(sos._id)}
                                className="btn-reject"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* SOS by District Summary */}
              {sosStats.byDistrict && sosStats.byDistrict.length > 0 && (
                <div className="settings-group" style={{marginTop: '30px'}}>
                  <h3>SOS Requests by District</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                    {sosStats.byDistrict.map((item) => (
                      <div key={item._id} className="stat-box" style={{padding: '15px'}}>
                        <div style={{fontWeight: '600', color: '#374151'}}>{item._id}</div>
                        <div style={{fontSize: '24px', fontWeight: '700', color: '#dc2626'}}>{item.count}</div>
                        <div style={{fontSize: '12px', color: '#6b7280'}}>Active SOS requests</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <section className="admin-section">
              <h2>System Analytics</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>📊 System Overview</h3>
                  <div className="metric">
                    <label>Total Volunteers:</label>
                    <span className="value">{volunteers.length}</span>
                  </div>
                  <div className="metric">
                    <label>Total Shelters:</label>
                    <span className="value">{shelters.length}</span>
                  </div>
                  <div className="metric">
                    <label>Active Alerts:</label>
                    <span className="value">{stats.approvedCount}</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>🤝 Volunteer Stats</h3>
                  <div className="metric">
                    <label>Approved:</label>
                    <span className="value">{volunteers.filter(v => v.status === 'approved').length}</span>
                  </div>
                  <div className="metric">
                    <label>Pending:</label>
                    <span className="value">{volunteers.filter(v => v.status === 'pending').length}</span>
                  </div>
                  <div className="metric">
                    <label>Rejected:</label>
                    <span className="value">{volunteers.filter(v => v.status === 'rejected').length}</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>⛺ Shelter Stats</h3>
                  <div className="metric">
                    <label>Total Capacity:</label>
                    <span className="value">{shelters.reduce((sum, s) => sum + s.capacity, 0)}</span>
                  </div>
                  <div className="metric">
                    <label>Total Occupancy:</label>
                    <span className="value">{shelters.reduce((sum, s) => sum + s.currentOccupancy, 0)}</span>
                  </div>
                  <div className="metric">
                    <label>Utilization:</label>
                    <span className="value">{Math.round((shelters.reduce((sum, s) => sum + s.currentOccupancy, 0) / shelters.reduce((sum, s) => sum + s.capacity, 0)) * 100)}%</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <section className="admin-section">
              <h2>Admin Control Panel</h2>
              <div className="settings-container">
                <div className="settings-group">
                  <h3>Create New Admin</h3>
                  <div className="setting-item">
                    <input placeholder="First Name" value={newAdmin.firstName} onChange={(e) => setNewAdmin(prev => ({ ...prev, firstName: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <input placeholder="Last Name" value={newAdmin.lastName} onChange={(e) => setNewAdmin(prev => ({ ...prev, lastName: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <input placeholder="Email" value={newAdmin.email} onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <input placeholder="Phone" value={newAdmin.phone} onChange={(e) => setNewAdmin(prev => ({ ...prev, phone: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <input placeholder="District" value={newAdmin.district} onChange={(e) => setNewAdmin(prev => ({ ...prev, district: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <input type="password" placeholder="Password" value={newAdmin.password} onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))} />
                  </div>
                  <button className="btn-save-settings" onClick={createAdmin}>Create Admin</button>
                </div>

                <div className="settings-group">
                  <h3>Publish Admin Alert</h3>
                  <div className="setting-item">
                    <input placeholder="Alert Title" value={newAlert.title} onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <input placeholder="Place Name" value={newAlert.placeName} onChange={(e) => setNewAlert(prev => ({ ...prev, placeName: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <input placeholder="District" value={newAlert.district} onChange={(e) => setNewAlert(prev => ({ ...prev, district: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <select value={newAlert.severity} onChange={(e) => setNewAlert(prev => ({ ...prev, severity: e.target.value }))}>
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <textarea placeholder="Alert Description" value={newAlert.description} onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))} />
                  </div>
                  <button className="btn-save-settings" onClick={createManualAlert}>Publish Alert</button>
                </div>

                <div className="settings-group">
                  <h3>Knowledge Base Management</h3>
                  <div className="setting-item">
                    <input placeholder="Knowledge Title" value={newKnowledge.title} onChange={(e) => setNewKnowledge(prev => ({ ...prev, title: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <input placeholder="Category" value={newKnowledge.category} onChange={(e) => setNewKnowledge(prev => ({ ...prev, category: e.target.value }))} />
                  </div>
                  <div className="setting-item">
                    <textarea placeholder="Knowledge Content" value={newKnowledge.content} onChange={(e) => setNewKnowledge(prev => ({ ...prev, content: e.target.value }))} />
                  </div>
                  <button className="btn-save-settings" onClick={publishKnowledge}>Publish Knowledge</button>
                  <div className="table-container">
                    {knowledgeItems.map((item) => (
                      <div key={item._id} className="setting-item">
                        <strong>{item.title}</strong> ({item.category})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
