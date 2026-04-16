import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/AlertsPage';
import SubmitAlertPage from './pages/SubmitAlertPage';
import DistrictsPage from './pages/DistrictsPage';
import DistrictDetailPage from './pages/DistrictDetailPage';
import MapPage from './pages/MapPage';
import WeatherPage from './pages/WeatherPage';
import SheltersPage from './pages/SheltersPage';
import SOSPage from './pages/SOSPage';
import HelplinesPage from './pages/HelplinesPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/submit-alert" element={<SubmitAlertPage />} />
          <Route path="/districts" element={<DistrictsPage />} />
          <Route path="/district/:districtName" element={<DistrictDetailPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/shelters" element={<SheltersPage />} />
          <Route path="/sos" element={<SOSPage />} />
          <Route path="/helplines" element={<HelplinesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Container */}
        <div id="toastContainer" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '10000' }}></div>
      </div>
    </AuthProvider>
  );
}

export default App;

