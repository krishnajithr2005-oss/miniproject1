import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { KERALA_DISTRICTS } from '../data/districtData';

/* Fix default icon path for Leaflet */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const shelterIcon = L.divIcon({
  html: '<div style="font-size: 28px; text-shadow: 0 0 5px rgba(0,0,0,0.3);">🏠</div>',
  className: 'dashboard-map-shelter-icon',
  iconSize: [34, 34],
  iconAnchor: [17, 34]
});

const alertIcon = L.divIcon({
  html: '<div style="font-size: 28px; text-shadow: 0 0 5px rgba(0,0,0,0.3);">⚠️</div>',
  className: 'dashboard-map-alert-icon',
  iconSize: [34, 34],
  iconAnchor: [17, 34]
});

const damIcon = L.divIcon({
  html: '<div style="font-size: 28px; text-shadow: 0 0 5px rgba(0,0,0,0.3);">🏗️</div>',
  className: 'dashboard-map-dam-icon',
  iconSize: [34, 34],
  iconAnchor: [17, 34]
});

const floodIcon = L.divIcon({
  html: '<div style="font-size: 28px; text-shadow: 0 0 5px rgba(0,0,0,0.3);">🌊</div>',
  className: 'dashboard-map-flood-icon',
  iconSize: [34, 34],
  iconAnchor: [17, 34]
});

const sosIcon = L.divIcon({
  html: '<div style="font-size: 28px; text-shadow: 0 0 5px rgba(0,0,0,0.3);">🆘</div>',
  className: 'dashboard-map-sos-icon',
  iconSize: [34, 34],
  iconAnchor: [17, 34]
});

const weatherIcon = L.divIcon({
  html: '<div style="font-size: 28px; text-shadow: 0 0 5px rgba(0,0,0,0.3);">☁️</div>',
  className: 'dashboard-map-weather-icon',
  iconSize: [34, 34],
  iconAnchor: [17, 34]
});

const defaultCenter = [10.8505, 76.2711];

const DashboardMap = ({
  alerts = [],
  shelters = [],
  userDistrict = '',
  currentWeather = null,
  showFloodZones = true,
  showShelters = true,
  showSOSPoints = false,
  showWeather = true,
  showDams = false
}) => {
  const [map, setMap] = React.useState(null);

  const districtCoords = useMemo(() => {
    return KERALA_DISTRICTS.reduce((acc, district) => {
      if (district?.coordinates?.lat && district?.coordinates?.lng) {
        acc[district.name] = [district.coordinates.lat, district.coordinates.lng];
      }
      return acc;
    }, {});
  }, []);

  const getPosition = (districtOrPlace) => {
    if (!districtOrPlace) return defaultCenter;
    const normalized = districtOrPlace.trim();
    if (districtCoords[normalized]) return districtCoords[normalized];
    const found = Object.keys(districtCoords).find((key) => normalized.toLowerCase().includes(key.toLowerCase()));
    return found ? districtCoords[found] : defaultCenter;
  };

  React.useEffect(() => {
    if (map) {
      setTimeout(() => map.invalidateSize(), 250);
    }
  }, [map, showFloodZones, showShelters, showSOSPoints, showWeather, showDams]);

  const alertMarkers = useMemo(() => {
    return alerts
      .map((alert) => {
        const source = alert.district || alert.placeName || userDistrict;
        const position = getPosition(source);
        return {
          id: alert._id || `${alert.title}-${Math.random()}`,
          position,
          title: alert.title || 'Alert',
          details: alert.description || alert.type || 'No details available',
          severity: (alert.severity || 'moderate').toLowerCase(),
          label: source || 'Kerala'
        };
      })
      .filter((item) => item.position != null);
  }, [alerts, userDistrict]);

  const shelterMarkers = useMemo(() => {
    return shelters
      .map((shelter) => {
        const source = shelter.district || shelter.placeName || userDistrict;
        const position = getPosition(source);
        return {
          id: shelter._id || shelter.name || `${source}-${Math.random()}`,
          position,
          title: shelter.name || 'Shelter',
          details: `Capacity: ${shelter.capacity || 'N/A'} · Occupancy: ${shelter.currentOccupancy || 0}`,
          label: source || 'Kerala'
        };
      })
      .filter((item) => item.position != null);
  }, [shelters, userDistrict]);

  const damMarkers = useMemo(() => [
    { id: 'idukki-dam', title: 'Idukki Dam', position: [9.8315, 76.8725], details: 'Major reservoir and hydroelectric dam' },
    { id: 'malampuzha-dam', title: 'Malampuzha Dam', position: [10.7530, 76.6590], details: 'Popular dam and irrigation project' },
    { id: 'chittar-dam', title: 'Chittar Dam', position: [9.4453, 77.0837], details: 'Local dam supporting agriculture' }
  ], []);

  const centerPosition = getPosition(userDistrict) || defaultCenter;

  const sosMarkers = useMemo(() => [
    { id: 'sos-1', title: 'Emergency SOS Point', position: [centerPosition[0] + 0.25, centerPosition[1] + 0.25], details: 'Nearby SOS response location' },
    { id: 'sos-2', title: 'SOS Response Team', position: [centerPosition[0] - 0.2, centerPosition[1] - 0.2], details: 'Rescue team staging area' }
  ], [centerPosition]);

  const floodMarkers = useMemo(() => {
    return alertMarkers.filter((alert) => {
      const text = `${alert.title} ${alert.details} ${alert.label}`.toLowerCase();
      return text.includes('flood') || alert.severity === 'critical' || alert.severity === 'high';
    });
  }, [alertMarkers]);

  const weatherMarker = useMemo(() => {
    if (!currentWeather) return null;
    return {
      id: 'weather-1',
      position: centerPosition,
      title: `${currentWeather.condition || 'Weather'}`,
      details: `${currentWeather.temperature || '--'}°C · ${currentWeather.description || 'Current weather'}`
    };
  }, [currentWeather, centerPosition]);

  return (
    <div className="dashboard-map-container">
      <MapContainer
        center={centerPosition}
        zoom={8}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {alertMarkers.map((alert) => (
          <React.Fragment key={`alert-${alert.id}`}>
            <Marker position={alert.position} icon={alertIcon}>
              <Popup>
                <strong>🚨 {alert.title}</strong>
                <div style={{ marginTop: '6px' }}>{alert.details}</div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#4b5563' }}>{alert.label}</div>
              </Popup>
            </Marker>
            {showFloodZones && (
              <Circle
                center={alert.position}
                radius={4500}
                pathOptions={{ color: '#dc2626', fillColor: '#fca5a5', fillOpacity: 0.15 }}
              />
            )}
          </React.Fragment>
        ))}

        {showFloodZones && floodMarkers.map((alert) => (
          <Marker key={`flood-${alert.id}`} position={alert.position} icon={floodIcon}>
            <Popup>
              <strong>🌊 Flood alert</strong>
              <div style={{ marginTop: '6px' }}>{alert.title}</div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#4b5563' }}>{alert.label}</div>
            </Popup>
          </Marker>
        ))}

        {showShelters && shelterMarkers.map((shelter) => (
          <Marker key={`shelter-${shelter.id}`} position={shelter.position} icon={shelterIcon}>
            <Popup>
              <strong>🏠 {shelter.title}</strong>
              <div style={{ marginTop: '6px' }}>{shelter.details}</div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#4b5563' }}>{shelter.label}</div>
            </Popup>
          </Marker>
        ))}

        {showDams && damMarkers.map((dam) => (
          <Marker key={`dam-${dam.id}`} position={dam.position} icon={damIcon}>
            <Popup>
              <strong>🏗️ {dam.title}</strong>
              <div style={{ marginTop: '6px' }}>{dam.details}</div>
            </Popup>
          </Marker>
        ))}

        {showSOSPoints && sosMarkers.map((sos) => (
          <Marker key={`sos-${sos.id}`} position={sos.position} icon={sosIcon}>
            <Popup>
              <strong>🆘 {sos.title}</strong>
              <div style={{ marginTop: '6px' }}>{sos.details}</div>
            </Popup>
          </Marker>
        ))}

        {showWeather && weatherMarker && (
          <Marker position={weatherMarker.position} icon={weatherIcon}>
            <Popup>
              <strong>☁️ {weatherMarker.title}</strong>
              <div style={{ marginTop: '6px' }}>{weatherMarker.details}</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default DashboardMap;
