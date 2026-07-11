import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Topbar.css';

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const noBackPaths = ['/', '/login'];
  const pathname = location.pathname;
  const showBack = !noBackPaths.includes(pathname);

  const fallbackPath = () => {
    if (pathname.startsWith('/district')) return '/districts';
    if (pathname.startsWith('/alerts') || pathname.startsWith('/submit-alert')) return '/alerts';
    if (pathname.startsWith('/shelters')) return '/shelters';
    if (pathname.startsWith('/helplines')) return '/helplines';
    if (pathname.startsWith('/weather')) return '/weather';
    if (pathname.startsWith('/map')) return '/map';
    if (pathname.startsWith('/volunteer')) return '/volunteer';
    if (pathname.startsWith('/profile')) return '/profile';
    if (pathname.startsWith('/about')) return '/about';
    return '/dashboard';
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath());
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {showBack && (
          <button className="topbar-back" onClick={handleBack} title="Go back">
            ← Back
          </button>
        )}
        <h1 className="topbar-title">Kerala Disaster Management</h1>
      </div>
      <div className="topbar-center">
        <span className="clock-icon">🕐</span>
        <span className="digital-clock">{formatTime(time)}</span>
      </div>
      <div className="topbar-right">
        {/* Buttons removed as requested */}
      </div>
    </div>
  );
}
