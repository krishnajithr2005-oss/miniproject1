import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import WeatherCard from '../components/WeatherCard';
import { apiUrl } from '../config/api';

const DUMMY_FORECAST = [
  { day: 'Tomorrow', temp: 26, condition: 'Rainy', icon: '🌧️' },
  { day: 'Day After', temp: 25, condition: 'Cloudy', icon: '☁️' },
  { day: 'Sunday', temp: 29, condition: 'Clear', icon: '☀️' },
  { day: 'Monday', temp: 27, condition: 'Rainy', icon: '🌧️' },
  { day: 'Tuesday', temp: 24, condition: 'Stormy', icon: '⛈️' },
];

export default function Weather() {
  const [forecast, setForecast] = useState(DUMMY_FORECAST);
  const [loading, setLoading] = useState(true);

  const fetchForecast = useCallback(async () => {
    try {
      const response = await axios.get(apiUrl('/api/weather'), {
        params: {
          lat: 9.9312,
          lng: 76.2673
        }
      });

      if (response.data?.forecast?.forecastday) {
        const forecastData = response.data.forecast.forecastday.map((day, idx) => {
          const dayNames = ['Today', 'Tomorrow', 'Day After', 'Day 4', 'Day 5'];
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return {
            day: dayNames[idx] || dayName,
            temp: Math.round(day.day.avgtemp_c),
            condition: day.day.condition.text,
            icon: getWeatherIcon(day.day.condition.text),
            code: day.day.condition.code
          };
        });
        setForecast(forecastData);
      }
    } catch (error) {
      console.log('Using dummy forecast data:', error.message);
      setForecast(DUMMY_FORECAST);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  const getWeatherIcon = (condition) => {
    if (!condition) return '🌤️';
    const text = condition.toLowerCase();
    if (text.includes('cloud')) return '☁️';
    if (text.includes('rain')) return '🌧️';
    if (text.includes('clear') || text.includes('sunny')) return '☀️';
    if (text.includes('storm') || text.includes('thunder')) return '⛈️';
    if (text.includes('snow')) return '❄️';
    if (text.includes('overcast')) return '⛅';
    if (text.includes('wind')) return '💨';
    return '🌤️';
  };

  if (loading) return <div className="page-content"><p>Loading weather forecast...</p></div>;

  return (
    <main className="page-content">
      <div className="page-header">
        <h1>🌦️ Weather Information</h1>
        <p>Current weather and 5-day forecast for Kerala</p>
      </div>
      <div className="weather-container">
        <section className="dashboard-section large">
          <WeatherCard />
        </section>
        <section className="dashboard-section">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.map((day, idx) => (
              <div key={idx} className="forecast-card">
                <p className="forecast-day">{day.day}</p>
                <p className="forecast-icon">{day.icon}</p>
                <p className="forecast-temp">{day.temp}°C</p>
                <p className="forecast-condition">{day.condition}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
