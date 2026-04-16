import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('home');
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const [showSOS, setShowSOS] = useState(false);
  const [showToast, setShowToast] = useState(null);

  // Live clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Alert data
  const alertsData = [
    { id: 1, title: 'Flood Alert - Wayanad', desc: 'Water level rising in Kabini river', severity: 'critical', tags: ['Flood', 'Wayanad'], time: '2 hours ago' },
    { id: 2, title: 'Landslide Warning - Idukki', desc: 'Heavy rainfall may trigger slopes', severity: 'high', tags: ['Landslide', 'Idukki'], time: '4 hours ago' },
    { id: 3, title: 'Dam Release - Periyar', desc: 'Scheduled water release 6 PM', severity: 'moderate', tags: ['Dam', 'Ernakulam'], time: '1 hour ago' },
    { id: 4, title: 'Coastal Warning - Kozhikode', desc: 'Fishing ban active - rough seas', severity: 'moderate', tags: ['Coastal', 'Kozhikode'], time: '3 hours ago' },
    { id: 5, title: 'Road Closure - Munnar', desc: 'NH48 closed due to landslide', severity: 'high', tags: ['Road', 'Idukki'], time: '5 hours ago' },
    { id: 6, title: 'Weather Advisory', desc: 'Orange alert for monsoon activity', severity: 'moderate', tags: ['Weather', 'State-wide'], time: '30 mins ago' },
  ];

  // Shelter data
  const shelters = [
    { id: 1, name: 'Govt. HSS Kalpetta', dist: 'Kalpetta, Wayanad', occ: 142, cap: 200, phone: '04936-202020', km: 2.3, status: 'Open' },
    { id: 2, name: 'Community Hall Munnar', dist: 'Munnar, Idukki', occ: 138, cap: 150, phone: '04865-231234', km: 1.1, status: 'Nearly Full' },
    { id: 3, name: "St. Mary's School Tirur", dist: 'Tirur, Malappuram', occ: 88, cap: 300, phone: '0494-242424', km: 4.5, status: 'Open' },
    { id: 4, name: 'Town Hall Thrissur', dist: 'Thrissur City', occ: 120, cap: 250, phone: '0487-232323', km: 3.2, status: 'Open' },
    { id: 5, name: 'Fishermen Hall Kozhikode', dist: 'Beach Road, Kozhikode', occ: 180, cap: 180, phone: '0495-272727', km: 5.8, status: 'Full' },
    { id: 6, name: 'Govt LP School Nilambur', dist: 'Nilambur, Malappuram', occ: 45, cap: 180, phone: '04931-222222', km: 7.2, status: 'Open' },
  ];

  // Districts data
  const districts = [
    { name: 'Wayanad', risk: 'critical' },
    { name: 'Idukki', risk: 'critical' },
    { name: 'Malappuram', risk: 'high' },
    { name: 'Kozhikode', risk: 'high' },
    { name: 'Thrissur', risk: 'moderate' },
    { name: 'Ernakulam', risk: 'moderate' },
    { name: 'TVM', risk: 'safe' },
  ];

  const getSeverityClass = (severity) => {
    const map = { critical: 'af-crit', high: 'af-high', moderate: 'af-mod' };
    return map[severity] || '';
  };

  const getStatusBadge = (status) => {
    const map = { 'Open': 'scb-o', 'Nearly Full': 'scb-n', 'Full': 'scb-f' };
    return map[status] || 'scb-o';
  };

  const getSOS = () => {
    setShowToast({ icon: '🆘', title: 'SOS Sent Successfully!', msg: 'Rescue teams notified. Stay calm and remain at your location.' });
    setShowSOS(false);
    setTimeout(() => setShowToast(null), 5000);
  };

  const navItems = [
    { name: 'home', label: 'Home', icon: '🏠' },
    { name: 'alerts', label: 'Alerts', icon: '🚨' },
    { name: 'map', label: 'Map', icon: '🗺️' },
    { name: 'sos', label: 'SOS', icon: '🆘' },
    { name: 'weather', label: 'Weather', icon: '🌧️' },
    { name: 'shelters', label: 'Shelters', icon: '🏘️' },
    { name: 'guide', label: 'Guide', icon: '📘' },
    { name: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="db-wrapper">
      {/* TOPBAR */}
      <div className="topbar">
        <div className="tb-left">
          <div className="tb-brand">🛡️ Kerala Disaster Management</div>
          <div className="tb-pills">
            <div className="pill pill-green">✓ Connected</div>
            <div className="pill pill-orange">⚠ 3 Alerts</div>
            <div className="pill pill-blue">ℹ Updated</div>
          </div>
        </div>
        <div className="tb-center">
          <div className="tb-clock">🕐 {liveTime}</div>
        </div>
        <div className="tb-right">
          <button className="tb-back" onClick={() => navigate('/login')} title="Back to Login">← Back</button>
          <div className="tb-notification">
            <span className="tb-bell">🔔</span>
            <span className="tb-badge">3</span>
          </div>
          <button className="tb-sos" onClick={() => setShowSOS(true)}>🆘 SOS</button>
          <div className="tb-avatar">KR</div>
        </div>
      </div>

      <div className="db-body">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sb-nav">
            {navItems.map((item) => (
              <div
                key={item.name}
                className={`sb-item ${activePanel === item.name ? 'active' : ''}`}
                onClick={() => setActivePanel(item.name)}
              >
                <span className="sb-icon">{item.icon}</span>
                <span className="sb-label">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="sb-districts">
            <div className="sbd-title">District Risk Status</div>
            {districts.map((d) => (
              <div key={d.name} className={`sbd-item sbd-${d.risk}`}>
                <span className="sbd-dot"></span>
                <span className="sbd-name">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main">
          {/* HOME PANEL */}
          {activePanel === 'home' && (
            <div className="panel active">
              {/* Hero */}
              <div className="home-hero">
                <div><div className="hh-loc">📍 Your Location</div><div className="hh-city">Kochi, Ernakulam</div></div>
                <div className="hh-icon">🌧️</div>
                <div className="hh-temp">28°C</div>
                <div className="hh-desc">Heavy Showers · Southwest Monsoon Active</div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-val">10</div><div className="stat-lbl">Active Alerts</div></div>
                <div className="stat-card"><div className="stat-val">5</div><div className="stat-lbl">SOS Requests</div></div>
                <div className="stat-card"><div className="stat-val">847</div><div className="stat-lbl">Shelter Capacity</div></div>
                <div className="stat-card"><div className="stat-val">23</div><div className="stat-lbl">Rescue Teams</div></div>
              </div>

              {/* District Chips */}
              <div className="dist-chips">
                {districts.map((d) => (
                  <div key={d.name} className={`chip chip-${d.risk}`}>{d.name}</div>
                ))}
              </div>

              {/* 2-Column Layout */}
              <div className="home-grid">
                <div className="home-left">
                  <div style={{fontSize:'12.5px',fontWeight:'700',color:'var(--forest)',marginBottom:'10px'}}>Active Alerts</div>
                  {alertsData.slice(0, 3).map((a) => (
                    <div key={a.id} className={`af-row ${getSeverityClass(a.severity)}`}>
                      <div className="af-icon">⚠️</div>
                      <div className="af-body">
                        <div className="af-title">{a.title}</div>
                        <div className="af-desc">{a.desc}</div>
                        <div className="af-tags">{a.tags.map(t => <span key={t} className="af-tag">{t}</span>)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="home-right">
                  {/* Weather Mini */}
                  <div className="card">
                    <div className="card-hdr"><span className="card-title">🌤️ Weather</span></div>
                    <div style={{padding:'12px 14px',fontSize:'28px',fontWeight:'700',color:'var(--forest)'}}>28°C</div>
                    <div style={{padding:'0 14px 12px',fontSize:'12px',color:'var(--muted)'}}>Heavy Showers, Humidity 88%</div>
                  </div>

                  {/* SOS Card */}
                  <div className="card">
                    <div className="card-hdr"><span className="card-title">🚨 SOS Nearby You</span></div>
                    <div style={{padding:'12px 14px'}}>
                      <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px'}}>5 active SOS requests in your area</div>
                      <button  style={{width:'100%',padding:'8px',background:'var(--red)',color:'white',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'11px',fontWeight:'700'}}>View Requests</button>
                    </div>
                  </div>

                  {/* Helplines */}
                  <div className="card">
                    <div className="card-hdr"><span className="card-title">📞 Emergency Helplines</span></div>
                    <div style={{padding:'10px 14px 14px'}}>
                      <div className="hl-row"><span>Fire & Rescue</span><span style={{fontWeight:'700'}}>101</span></div>
                      <div className="hl-row"><span>Ambulance</span><span style={{fontWeight:'700'}}>100</span></div>
                      <div className="hl-row"><span>Police</span><span style={{fontWeight:'700'}}>108</span></div>
                      <div className="hl-row"><span>KSNDMC Shelter</span><span style={{fontWeight:'700'}}>1077</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Column Bottom */}
              <div className="home-bottom">
                <div><div className="card"><div className="card-hdr"><span className="card-title">🏘️ Nearby Shelters</span></div><div style={{padding:'10px 14px'}}>{shelters.slice(0,2).map(s => <div key={s.id} className="hl-row"><span>{s.name}</span><span style={{fontSize:'10px',color:'var(--muted)'}}>{s.km}km</span></div>)}</div></div></div>
                <div><div className="card"><div className="card-hdr"><span className="card-title">✅ Safety Tips</span></div><div style={{padding:'10px 14px'}}><div className="do-row"><div className="do-dot dd-g">✓</div>Keep emergency kit ready</div><div className="do-row"><div className="do-dot dd-g">✓</div>Know your shelter location</div></div></div></div>
                <div><div className="card"><div className="card-hdr"><span className="card-title">🌊 Flood Zones</span></div><div style={{padding:'10px 14px'}}><div className="hl-row"><span>Kabini River</span><span style={{color:'var(--red)',fontWeight:'700'}}>High</span></div><div className="hl-row"><span>Periyar Dam</span><span style={{color:'var(--amber)',fontWeight:'700'}}>Moderate</span></div></div></div></div>
              </div>
            </div>
          )}

          {/* ALERTS PANEL */}
          {activePanel === 'alerts' && (
            <div className="panel active">
              <div className="filter-bar">
                <button className="fbtn active">All</button>
                <button className="fbtn">Critical</button>
                <button className="fbtn">High</button>
                <button className="fbtn">Moderate</button>
              </div>
              {alertsData.map((a) => (
                <div key={a.id} className={`af-row ${getSeverityClass(a.severity)}`}>
                  <div className="af-icon">⚠️</div>
                  <div className="af-body">
                    <div className="af-title">{a.title}</div>
                    <div className="af-desc">{a.desc}</div>
                    <div className="af-tags">{a.tags.map(t => <span key={t} className="af-tag">{t}</span>)}</div>
                    <div style={{fontSize:'11px',color:'var(--muted)',marginTop:'6px'}}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MAP PANEL */}
          {activePanel === 'map' && (
            <div className="panel active">
              <div className="map-controls">
                <label className="map-toggle"><input type="checkbox" defaultChecked/> Flood Zones</label>
                <label className="map-toggle"><input type="checkbox" defaultChecked/> Shelters</label>
                <label className="map-toggle"><input type="checkbox"/> SOS Points</label>
                <label className="map-toggle"><input type="checkbox" defaultChecked/> Weather</label>
                <label className="map-toggle"><input type="checkbox"/> Dams</label>
              </div>
              <div className="map-placeholder">
                <div style={{textAlign:'center',padding:'80px 20px',color:'var(--muted)'}}>
                  <div style={{fontSize:'48px',marginBottom:'10px'}}>🗺️</div>
                  <div>Interactive map goes here</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',fontSize:'12px',padding:'12px',background:'var(--cream)',borderRadius:'8px'}}>
                <div><div style={{fontWeight:'700'}}>10</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Active Alerts</div></div>
                <div><div style={{fontWeight:'700'}}>5</div><div style={{fontSize:'11px',color:'var(--muted)'}}>SOS Requests</div></div>
                <div><div style={{fontWeight:'700'}}>6</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Shelters</div></div>
                <div><div style={{fontWeight:'700'}}>3</div><div style={{fontSize:'11px',color:'var(--muted)'}}>Dams</div></div>
              </div>
            </div>
          )}

          {/* SOS PANEL */}
          {activePanel === 'sos' && (
            <div className="panel active">
              <div style={{textAlign:'center',marginBottom:'30px'}}>
                <button onClick={() => setShowSOS(true)} style={{width:'200px',height:'200px',borderRadius:'50%',background:'var(--red)',border:'none',color:'white',fontSize:'80px',cursor:'pointer',boxShadow:'0 8px 32px rgba(229, 57, 53, 0.3)',transition:'all 0.3s'}}>🆘</button>
                <div style={{fontSize:'24px',fontWeight:'700',marginTop:'20px',color:'var(--forest)'}}>Emergency SOS</div>
                <div style={{fontSize:'13px',color:'var(--muted)'}}>Tap the button above to send immediate SOS alert</div>
              </div>

              <div className="sos-steps">
                <div style={{fontSize:'12.5px',fontWeight:'700',color:'var(--forest)',marginBottom:'10px'}}>How It Works</div>
                {[
                  '📍 Your location is instantly pinpointed and sent to rescue teams',
                  '🚨 All nearby rescue teams and shelters are notified immediately',
                  '👥 Other app users nearby are alerted to assist if possible',
                  '📞 Your emergency contact and KSNDMC are automatically called',
                  '⏱️ All response times and teams are tracked in real-time'
                ].map((step, i) => (
                  <div key={i} className="sos-step">{step}</div>
                ))}
              </div>

              <div className="card" style={{marginBottom:'0'}}>
                <div className="card-hdr"><span className="card-title">📞 Live SOS Requests</span></div>
                <div style={{padding:'10px 14px'}}>
                  <div className="sos-req-row"><div><div>Flood Rescue - Wayanad</div><div style={{fontSize:'11px',color:'var(--muted)'}}>10 teams responding</div></div><span style={{color:'var(--green-text)',fontWeight:'700'}}>Active</span></div>
                  <div className="sos-req-row"><div><div>Landslide - Idukki</div><div style={{fontSize:'11px',color:'var(--muted)'}}>3 teams en route</div></div><span style={{color:'var(--green-text)',fontWeight:'700'}}>Responding</span></div>
                </div>
              </div>
            </div>
          )}

          {/* WEATHER PANEL */}
          {activePanel === 'weather' && (
            <div className="panel active">
              <div className="weather-hero">
                <div className="wh-top"><div><div className="wh-loc-s">📍 Your Location</div><div className="wh-city">Kochi, Ernakulam</div></div><div className="wh-icon">🌧️</div></div>
                <div className="wh-temp">28°C</div>
                <div className="wh-desc">Heavy Showers · Southwest Monsoon Active · IMD Alert: Orange</div>
                <div className="wh-grid">
                  <div className="wht"><div className="wht-l">Humidity</div><div className="wht-v">88%</div></div>
                  <div className="wht"><div className="wht-l">Wind Speed</div><div className="wht-v">34 km/h</div></div>
                  <div className="wht"><div className="wht-l">Rainfall Today</div><div className="wht-v">87 mm</div></div>
                  <div className="wht"><div className="wht-l">Visibility</div><div className="wht-v">3.2 km</div></div>
                </div>
              </div>

              <div style={{fontSize:'12.5px',fontWeight:'700',color:'var(--forest)',marginBottom:'10px',marginTop:'20px'}}>5-Day Forecast</div>
              <div className="forecast-row">
                {[
                  {day:'Today', icon:'🌧️', hi:29, lo:23, rain:87},
                  {day:'Saturday', icon:'⛈️', hi:27, lo:22, rain:120},
                  {day:'Sunday', icon:'🌧️', hi:28, lo:23, rain:65},
                  {day:'Monday', icon:'🌦️', hi:30, lo:24, rain:30},
                  {day:'Tuesday', icon:'⛅', hi:31, lo:25, rain:10}
                ].map((f, i) => (
                  <div key={i} className={`fc-card ${i === 0 ? 'today' : ''}`}>
                    <div className="fc-day">{f.day}</div>
                    <div className="fc-icon">{f.icon}</div>
                    <div className="fc-hi">{f.hi}°</div>
                    <div className="fc-lo">{f.lo}°</div>
                    <div className="fc-rain">💧 {f.rain}mm</div>
                  </div>
                ))}
              </div>

              <div className="w-alert-grid">
                <div className="wa-card">
                  <div className="wa-title">🚨 IMD District Alerts Today</div>
                  {[
                    {dist:'Wayanad', lvl:'RED'},
                    {dist:'Idukki', lvl:'RED'},
                    {dist:'Malappuram', lvl:'ORANGE'},
                    {dist:'Kozhikode', lvl:'ORANGE'},
                    {dist:'Thrissur', lvl:'YELLOW'},
                    {dist:'Ernakulam', lvl:'YELLOW'},
                    {dist:'TVM', lvl:'GREEN'}
                  ].map((a, i) => (
                    <div key={i} className="wa-row">
                      <span className="wa-dist">{a.dist}</span>
                      <span className={`wa-lvl wal-${a.lvl === 'RED' ? 'r' : a.lvl === 'ORANGE' ? 'o' : a.lvl === 'YELLOW' ? 'y' : 'g'}`}>{a.lvl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SHELTERS PANEL */}
          {activePanel === 'shelters' && (
            <div className="panel active">
              <div className="shelter-cards-grid">
                {shelters.map((s) => (
                  <div key={s.id} className="sh-card">
                    <div className="shc-top">
                      <div><div className="shc-name">{s.name}</div><div className="shc-dist">📍 {s.dist}</div></div>
                      <span className={`shc-sbadge ${getStatusBadge(s.status)}`}>{s.status}</span>
                    </div>
                    <div className="shc-bar-top"><span>Occupancy</span><span>{s.occ} / {s.cap}</span></div>
                    <div className="shc-bar"><div className="shc-fill" style={{width: `${(s.occ/s.cap)*100}%`, background: s.occ === s.cap ? 'var(--red)' : s.occ/s.cap > 0.7 ? 'var(--amber)' : 'var(--green-text)'}}></div></div>
                    <div className="shc-meta"><span>📞 {s.phone}</span><span>🚌 {s.km} km</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GUIDE PANEL */}
          {activePanel === 'guide' && (
            <div className="panel active">
              <div className="ek-card">
                <div className="ek-title">🎒 Emergency Kit Checklist</div>
                <div className="ek-sub">Keep this ready at all times during monsoon season — you may need to leave in minutes</div>
                <div className="ek-grid">
                  {[
                    {icon:'💧', name:'Drinking Water', qty:'3 litres / person'},
                    {icon:'🍱', name:'Non-Perishable Food', qty:'3 days supply'},
                    {icon:'🔦', name:'Torch + Batteries', qty:'Extra batteries'},
                    {icon:'💊', name:'First Aid Kit', qty:'+ prescription meds'},
                    {icon:'📄', name:'ID Documents', qty:'Waterproof bag'},
                    {icon:'🔋', name:'Power Bank', qty:'10,000 mAh+'},
                    {icon:'📻', name:'Battery Radio', qty:'For official alerts'},
                    {icon:'💰', name:'Emergency Cash', qty:'Small denominations'}
                  ].map((item, i) => (
                    <div key={i} className="ek-item">
                      <div className="ek-icon">{item.icon}</div>
                      <div className="ek-name">{item.name}</div>
                      <div className="ek-qty">{item.qty}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="guide-grid">
                {[
                  {title:'Before a Flood — Preparation', icon:'🌊', bg:'var(--blue-bg)', steps:['Monitor water levels in nearby rivers and canals every day during monsoon','Know your nearest evacuation route and relief shelter location in advance','Move valuables, furniture and documents to upper floors','Disconnect all electrical appliances in low-lying areas of your home','Keep emergency kit packed and ready to grab within 2 minutes']},
                  {title:'During a Flood — What To Do', icon:'🌊', bg:'var(--red-bg)', steps:['Move immediately to higher ground — don\'t wait for official order','Never walk, swim or drive through floodwaters — 6 inches can knock you down','Call 1077 or use this app to send SOS if you are trapped','Stay far away from power lines and all electrical equipment','Listen only to official radio, KSNDMC and government updates']},
                  {title:'Landslide Safety — Warning Signs', icon:'⛰️', bg:'var(--amber-bg)', steps:['Unusual sounds — cracking trees, rumbling, boulders rolling','Ground bulging or cracks appearing in roads or slopes near you','Water suddenly becoming muddy in streams and rivers','Leaning trees, tilted poles or fences appearing along slopes','If you see ANY signs, evacuate immediately — do not return']},
                  {title:'After Disaster — Recovery Steps', icon:'✅', bg:'var(--green-bg)', steps:['Return home only after official all-clear from district collector','Do not enter damaged buildings — check for structural safety first','Use bottled water until tap water is tested and declared safe','Document all property damage with photos for insurance claims','Register for government relief at your local panchayat office']}
                ].map((guide, i) => (
                  <div key={i} className="guide-card">
                    <div className="gc-hdr">
                      <div className="gc-icon" style={{background: guide.bg}}>{guide.icon}</div>
                      <div className="gc-title">{guide.title}</div>
                    </div>
                    <div className="gc-body">
                      {guide.steps.map((step, j) => (
                        <div key={j} className="gs-row"><div className="gs-n">{j+1}</div>{step}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE PANEL */}
          {activePanel === 'profile' && (
            <div className="panel active">
              <div className="profile-hero">
                <div className="ph-av">KR</div>
                <div>
                  <div className="ph-name">Krishnajith R.</div>
                  <div className="ph-sub">Member since June 2024 · Public User</div>
                  <div className="ph-dist">📍 Ernakulam District</div>
                </div>
              </div>

              <div className="profile-grid">
                <div className="pc">
                  <div className="pc-title">👤 Personal Information</div>
                  {[
                    {l:'Full Name', v:'Krishnajith R.'},
                    {l:'Phone', v:'+91 98765 43210'},
                    {l:'Email', v:'krishnajithr2005@gmail.com'},
                    {l:'District', v:'Ernakulam'},
                    {l:'Panchayat / Ward', v:'Aluva Municipality'},
                    {l:'Emergency Contact', v:'+91 98765 00000'}
                  ].map((item, i) => (
                    <div key={i} className="pc-row"><span className="pcr-l">{item.l}</span><span className="pcr-v">{item.v}</span></div>
                  ))}
                  <button className="pc-btn pcb-green">Edit Profile</button>
                </div>

                <div className="pc">
                  <div className="pc-title">🔔 Alert Preferences</div>
                  {[
                    {l:'Flood Alerts', sub:'Receive flood warnings for my district'},
                    {l:'Landslide Warnings', sub:'Landslide risk alerts for hilly areas'},
                    {l:'Weather Alerts', sub:'IMD orange/red alerts for my district'},
                    {l:'Cyclone Warnings', sub:'Coastal and sea state warnings'},
                    {l:'Dam Release Alerts', sub:'Notifications for dam water releases'},
                    {l:'Push Notifications', sub:'Allow browser notifications'}
                  ].map((pref, i) => (
                    <div key={i} className="tog-row">
                      <div><div className="tog-l">{pref.l}</div><div className="tog-sub">{pref.sub}</div></div>
                      <div className="tog-sw" onClick={(e) => e.target.classList.toggle('off')}></div>
                    </div>
                  ))}
                </div>

                <div className="pc">
                  <div className="pc-title">📋 My SOS History</div>
                  <div style={{color:'var(--muted)',fontSize:'13px',padding:'20px 0',textAlign:'center'}}>No SOS requests sent yet. Stay safe!</div>
                  <button className="pc-btn pcb-red" onClick={() => setShowSOS(true)}>🆘 Send Emergency SOS</button>
                </div>

                <div className="pc">
                  <div className="pc-title">⚙️ Account Settings</div>
                  {[
                    {l:'Language', v:'English / മലയാളം'},
                    {l:'App Theme', v:'Light Mode'},
                    {l:'Location Access', v:'✓ Enabled', g:true},
                    {l:'Last Login', v:'Today, 11:42 AM'}
                  ].map((item, i) => (
                    <div key={i} className="pc-row"><span className="pcr-l">{item.l}</span><span className="pcr-v" style={{color: item.g ? 'var(--green-text)' : 'inherit'}}>{item.v}</span></div>
                  ))}
                  <button className="pc-btn pcb-muted">Change Password</button>
                  <button className="pc-btn pcb-red" style={{marginTop:'6px'}}>Sign Out</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SOS MODAL */}
      {showSOS && (
        <div className="modal-overlay" onClick={() => setShowSOS(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hdr">🆘 Emergency SOS</div>
            <div className="modal-body">
              <input type="text" placeholder="Your Name (Auto-filled from profile)" className="modal-input" defaultValue="Krishnajith R."/>
              <input type="text" placeholder="Current Location" className="modal-input"/>
              <select className="modal-input">
                <option>Select Emergency Type...</option>
                <option>Flood Emergency</option>
                <option>Landslide</option>
                <option>House Collapse</option>
                <option>Stranded</option>
                <option>Injury Emergency</option>
                <option>Other</option>
              </select>
              <textarea placeholder="Description (Optional)" className="modal-input" style={{minHeight:'80px'}}></textarea>
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowSOS(false)} className="modal-btn modal-btn-gray">Cancel</button>
              <button onClick={getSOS} className="modal-btn modal-btn-red">Send SOS</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="toast-wrap">
          <div className="toast">
            <div className="toast-icon">{showToast.icon}</div>
            <div className="toast-body">
              <div className="toast-t">{showToast.title}</div>
              <div className="toast-m">{showToast.msg}</div>
            </div>
            <div className="toast-x" onClick={() => setShowToast(null)}>✕</div>
          </div>
        </div>
      )}
    </div>
  );
}
