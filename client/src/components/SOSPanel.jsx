import React, { useState } from 'react';

const DUMMY_SOS_REQUESTS = [
  {
    id: 1,
    requester: 'John Doe',
    location: 'Wayanad District',
    status: 'Active',
    time: '2 min ago',
    priority: 'high',
  },
  {
    id: 2,
    requester: 'Jane Smith',
    location: 'Idukki District',
    status: 'Active',
    time: '5 min ago',
    priority: 'critical',
  },
  {
    id: 3,
    requester: 'Ahmed Khan',
    location: 'Thrissur District',
    status: 'Assigned',
    time: '10 min ago',
    priority: 'high',
  },
];

export default function SOSPanel({ limit = 3 }) {
  const [requests, setRequests] = useState(DUMMY_SOS_REQUESTS);

  const resolveRequest = (id) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

  const displayRequests = requests.slice(0, limit);

  return (
    <div className="sos-panel">
      <h3>🚨 Live SOS Requests</h3>
      {displayRequests.length === 0 ? (
        <p className="no-data">No active SOS requests</p>
      ) : (
        <div className="sos-list">
          {displayRequests.map((req) => (
            <div key={req.id} className={`sos-item sos-${req.status.toLowerCase()}`}>
              <div className="sos-blinking"></div>
              <div className="sos-info">
                <div className="sos-header">
                  <h4>{req.requester}</h4>
                  <span className={`priority-badge ${req.priority}`}>
                    {req.priority.toUpperCase()}
                  </span>
                </div>
                <p className="sos-location">📍 {req.location}</p>
                <p className="sos-status">Status: {req.status}</p>
                <span className="sos-time">{req.time}</span>
              </div>
              <button
                className="resolve-btn"
                onClick={() => resolveRequest(req.id)}
              >
                ✓ Resolve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
