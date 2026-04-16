import React from 'react';
import Helplines from '../components/Helplines';

export default function HelplinesPage() {
  return (
    <main className="page-content">
      <div className="page-header">
        <h1>📞 Emergency Helplines</h1>
        <p>Quick access to all emergency contact numbers</p>
      </div>
      <section className="dashboard-section">
        <Helplines />
      </section>
    </main>
  );
}
