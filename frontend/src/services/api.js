import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Room-related API calls
export const roomAPI = {
  // Get all rooms
  getAllRooms: async () => {
    try {
      const response = await api.get('/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  // Get room statistics
  getRoomStats: async () => {
    try {
      const response = await api.get('/rooms/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching room stats:', error);
      throw error;
    }
  },

  // Get single room details
  getRoomById: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room ${roomId}:`, error);
      throw error;
    }
  },

  // Get room activity
  getRoomActivity: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}/activity`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room activity for ${roomId}:`, error);
      throw error;
    }
  },
};

// Device-related API calls
export const deviceAPI = {
  // Get all devices
  getAllDevices: async () => {
    try {
      const response = await api.get('/devices');
      return response.data;
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  },

  // Get device statistics
  getDeviceStats: async () => {
    try {
      const response = await api.get('/devices/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching device stats:', error);
      throw error;
    }
  },
};

// Alerts API calls
export const alertAPI = {
  // Get all alerts
  getAllAlerts: async () => {
    try {
      const response = await api.get('/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },
};

// Location API calls
export const locationAPI = {
  // Get all locations
  getAllLocations: async () => {
    try {
      const response = await api.get('/locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },
};

export default api;
