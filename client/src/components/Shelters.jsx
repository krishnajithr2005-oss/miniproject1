import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Shelters.css';
import { apiUrl } from '../config/api';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DUMMY_SHELTERS = [
  {
    id: 1,
    name: 'District Hospital Shelter',
    location: 'Kochi',
    capacity: 500,
    available: 450,
    status: 'active',
    lat: 9.9312,
    lng: 76.2673,
    amenities: ['medical', 'water', 'electricity', 'bathrooms'],
    contact: '+91 8000-9000-00',
    address: 'District Hospital Road, Kochi, Kerala',
  },
  {
    id: 2,
    name: 'School Complex Shelter',
    location: 'Thiruvananthapuram',
    capacity: 300,
    available: 50,
    status: 'active',
    lat: 8.5241,
    lng: 76.9366,
    amenities: ['water', 'bedding', 'food', 'bathrooms'],
    contact: '+91 8100-9100-00',
    address: 'School Complex Street, Thiruvananthapuram, Kerala',
  },
  {
    id: 3,
    name: 'Community Center',
    location: 'Wayanad',
    capacity: 200,
    available: 0,
    status: 'full',
    lat: 11.6068,
    lng: 75.7753,
    amenities: ['water', 'electricity', 'bathrooms'],
    contact: '+91 8200-9200-00',
    address: 'Community Center Lane, Wayanad, Kerala',
  },
  {
    id: 4,
    name: 'Sports Stadium',
    location: 'Idukki',
    capacity: 1000,
    available: 800,
    status: 'active',
    lat: 10.4410,
    lng: 77.2390,
    amenities: ['water', 'electricity', 'bedding', 'food', 'bathrooms', 'wifi'],
    contact: '+91 8300-9300-00',
    address: 'Sports Complex Road, Idukki, Kerala',
  },
  {
    id: 5,
    name: 'Military Barracks',
    location: 'Ernakulam',
    capacity: 600,
    available: 100,
    status: 'active',
    lat: 10.2381,
    lng: 76.3675,
    amenities: ['water', 'electricity', 'bedding', 'food', 'bathrooms', 'heating', 'medical'],
    contact: '+91 8400-9400-00',
    address: 'Military Camp, Ernakulam, Kerala',
  },
];

export default function Shelters({ limit = null }) {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [selectedShelter, setSelectedShelter] = useState(null);
  const mapRef = useRef(null);

  const getCapacityStatus = (available, capacity) => {
    const percentage = (available / capacity) * 100;
    if (percentage === 0) return 'full';
    if (percentage < 25) return 'almost-full';
    if (percentage < 75) return 'available';
    return 'empty';
  };

  const fetchShelters = async () => {
    try {
      const response = await axios.get(apiUrl('/api/shelters'));
      
      // Map API response to component format
      const mappedShelters = response.data.map(shelter => ({
        id: shelter._id,
        name: shelter.name,
        location: shelter.district || shelter.placeName || 'Kerala',
        capacity: shelter.capacity,
        available: shelter.capacity - shelter.currentOccupancy,
        currentOccupancy: shelter.currentOccupancy,
        status: shelter.currentOccupancy >= shelter.capacity ? 'full' : 'active',
        lat: shelter.location?.latitude || 10.8505,
        lng: shelter.location?.longitude || 76.2711,
        amenities: shelter.facilities || ['water', 'electricity', 'bathrooms'],
        contact: shelter.phone || 'N/A',
        address: shelter.address || `${shelter.district} District`,
        contactPerson: shelter.contactPerson
      }));
      
      setShelters(mappedShelters);
    } catch (error) {
      console.log('Using dummy shelter data:', error.message);
      setShelters(DUMMY_SHELTERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  useEffect(() => {
    if (viewMode === 'map' && shelters.length > 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        // Clear any existing map first
        if (mapRef.current) {
          try {
            mapRef.current.off();
            mapRef.current.remove();
          } catch (e) {
            console.log('Map cleanup error:', e);
          }
          mapRef.current = null;
        }

        const mapContainer = document.getElementById('shelters-map');
        if (!mapContainer) return;

        // Clear the container to ensure Leaflet doesn't reuse it
        mapContainer.innerHTML = '';

        try {
          // Center of Kerala
          const centerLat = 10.8505;
          const centerLng = 76.2711;

          const map = L.map(mapContainer).setView([centerLat, centerLng], 8);
          mapRef.current = map;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);

          // Add markers for each shelter
          const displayShelters = limit ? shelters.slice(0, limit) : shelters;
          
          displayShelters.forEach((shelter) => {
            const getCapacityStatus = (available, capacity) => {
              const percentage = (available / capacity) * 100;
              if (percentage === 0) return 'full';
              if (percentage < 25) return 'almost-full';
              if (percentage < 75) return 'available';
              return 'empty';
            };

            const status = getCapacityStatus(shelter.available, shelter.capacity);
            let markerColor = status === 'full' ? 'red' : status === 'almost-full' ? 'orange' : status === 'empty' ? 'green' : 'blue';
            
            const markerIcon = L.divIcon({
              className: `custom-marker marker-${status}`,
              html: `
                <div style="background-color: ${markerColor}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.3);">
                  🏢
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16],
            });

            const marker = L.marker([shelter.lat, shelter.lng], { icon: markerIcon }).addTo(map);

            const popupContent = `
              <div class="shelter-popup">
                <h4>${shelter.name}</h4>
                <p><strong>Location:</strong> ${shelter.location}</p>
                <p><strong>Available:</strong> ${shelter.available} / ${shelter.capacity}</p>
                <p><strong>Status:</strong> <span class="status-${shelter.status}">${shelter.status.toUpperCase()}</span></p>
                <a href="https://maps.google.com/?q=${shelter.lat},${shelter.lng}" target="_blank" class="popup-direction-btn">📍 Get Directions</a>
              </div>
            `;

            marker.bindPopup(popupContent);
            marker.on('click', () => setSelectedShelter(shelter));
          });
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Cleanup map when switching away
      if (mapRef.current) {
        try {
          mapRef.current.off();
          mapRef.current.remove();
        } catch (e) {
          console.log('Map cleanup error:', e);
        }
        mapRef.current = null;
      }
    }
  }, [viewMode, shelters, limit]);

  const displayShelters = limit ? shelters.slice(0, limit) : shelters;

  if (loading) return <div className="loading">Loading shelters...</div>;

  return (
    <div className="shelters-container">
      <div className="shelters-header">
        <h3>🏢 Available Shelters Network</h3>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ Map View
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List View
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="map-view">
          <div id="shelters-map" className="shelters-map"></div>
          {selectedShelter && (
            <div className="shelter-details-panel">
              <button className="close-panel" onClick={() => setSelectedShelter(null)}>✕</button>
              <h4>{selectedShelter.name}</h4>
              <p className="detail-item"><strong>📍 Location:</strong> {selectedShelter.location}</p>
              <p className="detail-item"><strong>📞 Contact:</strong> {selectedShelter.contact}</p>
              <p className="detail-item"><strong>🏠 Address:</strong> {selectedShelter.address}</p>
              <p className="detail-item"><strong>👥 Capacity:</strong> {selectedShelter.capacity} people</p>
              <p className="detail-item"><strong>✅ Available:</strong> {selectedShelter.available}/{selectedShelter.capacity}</p>
              <p className="detail-item"><strong>🎯 Amenities:</strong> {selectedShelter.amenities.join(', ')}</p>
              <a href={`https://maps.google.com/?q=${selectedShelter.lat},${selectedShelter.lng}`} target="_blank" rel="noopener noreferrer" className="direction-btn">📍 Get Directions</a>
            </div>
          )}
        </div>
      ) : (
        <div className="list-view">
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
                    onClick={() => {
                      setViewMode('map');
                      setSelectedShelter(shelter);
                    }}
                  >
                    <div className="shelter-header">
                      <h4>{shelter.name}</h4>
                      <span className={`status-badge status-${shelter.status}`}>
                        {shelter.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="shelter-location">📍 {shelter.location}</p>
                    <p className="shelter-address">{shelter.address}</p>
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
                    <div className="amenities-list">
                      {shelter.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="amenity-tag">{amenity}</span>
                      ))}
                      {shelter.amenities.length > 3 && <span className="amenity-tag">+{shelter.amenities.length - 3}</span>}
                    </div>
                    <button className="directions-btn">📍 Get Directions</button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
