import axios from 'axios';
import { apiUrl } from '../../config/api';

class UserApi {
  constructor(token) {
    this.token = token;
    this.headers = token ? { Authorization: `Bearer ${token}` } : {};
    this.axiosInstance = axios.create({
      timeout: 5000, // 5 second timeout
      headers: this.headers
    });
  }

  // Get published alerts for users
  async getPublishedAlerts() {
    try {
      const response = await this.axiosInstance.get(apiUrl('/api/alerts'));
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get all places/districts with risk levels
  async getPlaces() {
    try {
      const response = await this.axiosInstance.get(apiUrl('/api/places'));
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get shelters information
  async getShelters() {
    try {
      const response = await this.axiosInstance.get(apiUrl('/api/shelters'));
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get knowledge articles for users
  async getKnowledge() {
    try {
      const response = await this.axiosInstance.get(apiUrl('/api/knowledge'));
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Submit SOS request
  async submitSOS(sosData) {
    try {
      const response = await this.axiosInstance.post(apiUrl('/api/sos'), sosData);
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get nearby resources
  async getNearbyResources(district) {
    try {
      const response = await this.axiosInstance.get(apiUrl(`/api/resources/${district}`));
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get historical disasters for a place
  async getHistory(placeName) {
    try {
      const response = await this.axiosInstance.get(apiUrl(`/api/history/${placeName}`));
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get weather information
  async getWeather(district) {
    try {
      const response = await this.axiosInstance.get(apiUrl(`/api/weather/${district}`));
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get approved volunteers for users
  async getVolunteers(district) {
    try {
      const url = district ? apiUrl(`/api/public/volunteers?district=${district}`) : apiUrl('/api/public/volunteers');
      const response = await this.axiosInstance.get(url);
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }
}

export default UserApi;
