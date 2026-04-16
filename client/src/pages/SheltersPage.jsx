import React from 'react';
import Shelters from '../components/Shelters';

export default function SheltersPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <h1>🏢 Emergency Shelters</h1>
        <p>Find available emergency shelters near you</p>
      </div>
      <section className="dashboard-section">
        <Shelters />
      </section>
    </main>
  );
}
