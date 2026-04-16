import React from 'react';
import WeatherCard from '../components/WeatherCard';

const FORECAST = [
  { day: 'Tomorrow', temp: '26°C', condition: 'Rainy', icon: '🌧️' },
  { day: 'Day After', temp: '25°C', condition: 'Cloudy', icon: '☁️' },
  { day: 'Sun', temp: '29°C', condition: 'Clear', icon: '☀️' },
  { day: 'Mon', temp: '27°C', condition: 'Rainy', icon: '🌧️' },
  { day: 'Tue', temp: '24°C', condition: 'Stormy', icon: '⛈️' },
];

export default function Weather() {
  return (
    <main className="page-content">
      <div className="page-header">
        <h1>🌦️ Weather Information</h1>
        <p>Current weather and forecast for Kerala</p>
      </div>
      <div className="weather-container">
        <section className="dashboard-section large">
          <WeatherCard />
        </section>
        <section className="dashboard-section">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {FORECAST.map((day, idx) => (
              <div key={idx} className="forecast-card">
                <p className="forecast-day">{day.day}</p>
                <p className="forecast-icon">{day.icon}</p>
                <p className="forecast-temp">{day.temp}</p>
                <p className="forecast-condition">{day.condition}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
