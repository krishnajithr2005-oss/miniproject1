import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DUMMY_SHELTERS = [
  {
    id: 1,
    name: 'District Hospital Shelter',
    location: 'Kochi',
    capacity: 500,
    available: 450,
    status: 'active',
  },
  {
    id: 2,
    name: 'School Complex Shelter',
    location: 'Thiruvananthapuram',
    capacity: 300,
    available: 50,
    status: 'active',
  },
  {
    id: 3,
    name: 'Community Center',
    location: 'Wayanad',
    capacity: 200,
    available: 0,
    status: 'full',
  },
  {
    id: 4,
    name: 'Sports Stadium',
    location: 'Idukki',
    capacity: 1000,
    available: 800,
    status: 'active',
  },
  {
    id: 5,
    name: 'Military Barracks',
    location: 'Ernakulam',
    capacity: 600,
    available: 100,
    status: 'active',
  },
];

export default function Shelters({ limit = null }) {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      const response = await axios.get('/api/shelters');
      setShelters(response.data);
    } catch (error) {
      console.log('Using dummy shelter data');
      setShelters(DUMMY_SHELTERS);
    } finally {
      setLoading(false);
    }
  };

  const displayShelters = limit ? shelters.slice(0, limit) : shelters;

  const getCapacityStatus = (available, capacity) => {
    const percentage = (available / capacity) * 100;
    if (percentage === 0) return 'full';
    if (percentage < 25) return 'almost-full';
    if (percentage < 75) return 'available';
    return 'empty';
  };

  if (loading) return <div className="loading">Loading shelters...</div>;

  return (
    <div className="shelters">
      <h3>🏢 Available Shelters</h3>
      <div className="shelter-grid">
        {displayShelters.length === 0 ? (
          <p className="no-data">No shelters available</p>
        ) : (
          displayShelters.map((shelter) => {
            const capacityStatus = getCapacityStatus(shelter.available, shelter.capacity);
            return (
              <div
                key={shelter.id}
                className={`shelter-card shelter-${capacityStatus}`}
              >
                <div className="shelter-header">
                  <h4>{shelter.name}</h4>
                  <span className={`status-badge ${shelter.status}`}>
                    {shelter.status.toUpperCase()}
                  </span>
                </div>
                <p className="shelter-location">📍 {shelter.location}</p>
                <div className="capacity-info">
                  <div className="capacity-bar">
                    <div
                      className="capacity-fill"
                      style={{
                        width: `${((shelter.capacity - shelter.available) / shelter.capacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="capacity-text">
                    {shelter.available} / {shelter.capacity} available
                  </p>
                </div>
                <button className="directions-btn">📍 Get Directions</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
