import React from 'react';

const HELPLINES = [
  { id: 1, name: 'Emergency Services', number: '112', type: 'emergency' },
  { id: 2, name: 'Police Control Room', number: '100', type: 'police' },
  { id: 3, name: 'Fire Department', number: '101', type: 'fire' },
  { id: 4, name: 'Ambulance Services', number: '102', type: 'medical' },
  { id: 5, name: 'Disaster Management', number: '1070', type: 'disaster' },
  { id: 6, name: 'Toll Free Helpline', number: '18003456789', type: 'helpline' },
];

export default function Helplines({ compact = false }) {
  const handleCall = (number, name) => {
    alert(`📞 Calling ${name}...\n Number: ${number}`);
  };

  const displayHelplines = compact ? HELPLINES.slice(0, 3) : HELPLINES;

  return (
    <div className="helplines">
      <h3>📞 Emergency Helplines</h3>
      <div className={`helpline-grid ${compact ? 'compact' : ''}`}>
        {displayHelplines.map((helpline) => (
          <div
            key={helpline.id}
            className={`helpline-card helpline-${helpline.type}`}
          >
            <div className="helpline-content">
              <h4>{helpline.name}</h4>
              <p className="helpline-number">{helpline.number}</p>
            </div>
            <button
              className="call-btn"
              onClick={() => handleCall(helpline.number, helpline.name)}
            >
              📞 Call
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
