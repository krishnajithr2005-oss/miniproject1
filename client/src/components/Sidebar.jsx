import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/alerts', label: 'Alerts', icon: '🔔' },
    { path: '/map', label: 'Map', icon: '🗺️' },
    { path: '/shelters', label: 'Shelters', icon: '🏢' },
    { path: '/weather', label: 'Weather', icon: '🌦️' },
    { path: '/helplines', label: 'Helplines', icon: '📞' },
    { path: '/sos', label: 'SOS', icon: '🚨' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
