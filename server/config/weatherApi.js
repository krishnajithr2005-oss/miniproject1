const axios = require('axios');

const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY || 'your_weatherapi_key_here';
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

// Dummy weather fallback if API fails
const DUMMY_WEATHER = {
  location: 'Kerala',
  current: {
    temp_c: 28,
    temp_f: 82,
    condition: { text: 'Cloudy', icon: '//cdn.weatherapi.com/weather/128x128/night/122.png' },
    humidity: 75,
    wind_kph: 15,
    uv: 5,
  },
  forecast: {
    forecastday: [
      { date: '2026-04-28', day: { avgtemp_c: 28, condition: { text: 'Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/122.png' } } },
      { date: '2026-04-29', day: { avgtemp_c: 29, condition: { text: 'Rainy', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' } } },
      { date: '2026-04-30', day: { avgtemp_c: 27, condition: { text: 'Rainy', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' } } },
      { date: '2026-05-01', day: { avgtemp_c: 28, condition: { text: 'Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/122.png' } } },
      { date: '2026-05-02', day: { avgtemp_c: 30, condition: { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' } } },
    ]
  }
};

/**
 * Fetch real weather data from WeatherAPI.com
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<object>} weather data or fallback
 */
async function getWeather(latitude, longitude) {
  try {
    if (WEATHERAPI_KEY === 'your_weatherapi_key_here') {
      console.warn('⚠️ WeatherAPI key not set, using dummy data');
      return DUMMY_WEATHER;
    }

    const response = await axios.get(
      `${WEATHERAPI_BASE_URL}/forecast.json`,
      {
        params: {
          key: WEATHERAPI_KEY,
          q: `${latitude},${longitude}`,
          days: 5,
          aqi: 'yes'
        }
      }
    );

    return {
      location: response.data.location,
      current: response.data.current,
      forecast: response.data.forecast
    };
  } catch (error) {
    console.error('❌ Weather API error:', error.message);
    return DUMMY_WEATHER;
  }
}

module.exports = {
  getWeather,
  DUMMY_WEATHER
};
