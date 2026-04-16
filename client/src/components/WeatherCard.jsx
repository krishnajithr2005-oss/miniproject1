import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DUMMY_WEATHER = {
  temp: 28,
  condition: 'Cloudy',
  humidity: 75,
  windSpeed: 15,
  location: 'Kerala',
  uvIndex: 6,
};

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await axios.get('/api/weather');
      setWeather(response.data);
    } catch (error) {
      console.log('Using dummy weather data');
      setWeather(DUMMY_WEATHER);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="weather-card loading">Loading...</div>;

  return (
    <div className="weather-card">
      <h3>Current Weather</h3>
      <div className="weather-content">
        <div className="weather-main">
          <div className="temp">{weather?.temp}°C</div>
          <div className="condition">
            {weather?.condition === 'Cloudy' ? '☁️' : '🌤️'} {weather?.condition}
          </div>
        </div>
        <div className="weather-details">
          <div className="weather-detail">
            <span className="label">Humidity</span>
            <span className="value">{weather?.humidity}%</span>
          </div>
          <div className="weather-detail">
            <span className="label">Wind Speed</span>
            <span className="value">{weather?.windSpeed} km/h</span>
          </div>
          <div className="weather-detail">
            <span className="label">UV Index</span>
            <span className="value">{weather?.uvIndex}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
