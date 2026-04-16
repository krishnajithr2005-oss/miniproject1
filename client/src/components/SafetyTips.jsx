import React from 'react';

const SAFETY_TIPS = [
  {
    id: 1,
    title: 'Flood Safety',
    tips: [
      'Move to higher ground immediately',
      'Never drive through flooded roads',
      'Keep emergency supplies ready',
      'Stay tuned to official information',
    ],
  },
  {
    id: 2,
    title: 'Landslide Safety',
    tips: [
      'Stay away from slopes during heavy rain',
      'Know evacuation routes',
      'Keep monitoring systems active',
      'Follow official warnings',
    ],
  },
  {
    id: 3,
    title: 'Storm Safety',
    tips: [
      'Seek shelter indoors',
      'Avoid using phones',
      'Stay away from windows',
      'Listen to weather updates',
    ],
  },
  {
    id: 4,
    title: 'General Emergency',
    tips: [
      'Keep emergency contacts ready',
      'Have an evacuation plan',
      'Store essential documents safely',
      'Stay calm and follow official guidance',
    ],
  },
];

export default function SafetyTips() {
  return (
    <div className="safety-tips">
      <h3>🛡️ Safety Tips</h3>
      <div className="tips-grid">
        {SAFETY_TIPS.map((section) => (
          <div key={section.id} className="tip-card">
            <h4>{section.title}</h4>
            <ul className="tips-list">
              {section.tips.map((tip, idx) => (
                <li key={idx}>✓ {tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
