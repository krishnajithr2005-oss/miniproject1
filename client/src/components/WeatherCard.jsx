import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';

const DUMMY_WEATHER = {
  location: { name: 'Kerala' },
  current: {
    temp_c: 28,
    condition: { text: 'Cloudy' },
    humidity: 75,
    wind_kph: 15,
    uv: 6,
  },
};

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // Default to Kochi (Kerala capital) coordinates
      const response = await axios.get(apiUrl('/api/weather'), {
        params: {
          lat: 9.9312,
          lng: 76.2673
        }
      });
      setWeather(response.data);
    } catch (error) {
      console.log('Using dummy weather data:', error.message);
      setWeather(DUMMY_WEATHER);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="weather-card loading">Loading...</div>;

  const temp = weather?.current?.temp_c || weather?.temp || 28;
  const condition = weather?.current?.condition?.text || weather?.condition || 'Cloudy';
  const humidity = weather?.current?.humidity || weather?.humidity || 75;
  const windSpeed = weather?.current?.wind_kph || weather?.windSpeed || 15;
  const uvIndex = weather?.current?.uv || weather?.uvIndex || 6;
  const location = weather?.location?.name || weather?.location || 'Kerala';

  const getWeatherIcon = () => {
    const text = condition?.toLowerCase() || '';
    if (text.includes('cloud')) return '☁️';
    if (text.includes('rain')) return '🌧️';
    if (text.includes('clear') || text.includes('sunny')) return '☀️';
    if (text.includes('overcast')) return '⛅';
    return '🌤️';
  };

  return (
    <div className="weather-card">
      <h3>Current Weather - {location}</h3>
      <div className="weather-content">
        <div className="weather-main">
          <div className="temp">{Math.round(temp)}°C</div>
          <div className="condition">
            {getWeatherIcon()} {condition}
          </div>
        </div>
        <div className="weather-details">
          <div className="weather-detail">
            <span className="label">Humidity</span>
            <span className="value">{humidity}%</span>
          </div>
          <div className="weather-detail">
            <span className="label">Wind Speed</span>
            <span className="value">{Math.round(windSpeed)} km/h</span>
          </div>
          <div className="weather-detail">
            <span className="label">UV Index</span>
            <span className="value">{uvIndex}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
