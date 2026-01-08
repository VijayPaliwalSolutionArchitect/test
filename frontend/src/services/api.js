import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Emergent Points
export const createBulkPoints = async (points) => {
  const response = await api.post('/points/bulk', { points });
  return response.data;
};

export const createPoint = async (point) => {
  const response = await api.post('/points', point);
  return response.data;
};

export const getPoints = async (domain, maturity) => {
  const params = {};
  if (domain) params.domain = domain;
  if (maturity) params.maturity = maturity;
  const response = await api.get('/points', { params });
  return response.data;
};

export const deletePoint = async (pointId) => {
  const response = await api.delete(`/points/${pointId}`);
  return response.data;
};

export const deleteAllPoints = async () => {
  const response = await api.delete('/points');
  return response.data;
};

// Tech Radar
export const generateRadar = async () => {
  const response = await api.post('/radar/generate');
  return response.data;
};

export const getRadar = async () => {
  const response = await api.get('/radar');
  return response.data;
};

// Architectures
export const generateArchitectures = async () => {
  const response = await api.post('/architectures/generate');
  return response.data;
};

export const getArchitectures = async () => {
  const response = await api.get('/architectures');
  return response.data;
};

// Risks & Opportunities
export const generateRisks = async () => {
  const response = await api.post('/risks/generate');
  return response.data;
};

export const getRisks = async () => {
  const response = await api.get('/risks');
  return response.data;
};

// Roadmap
export const generateRoadmap = async () => {
  const response = await api.post('/roadmap/generate');
  return response.data;
};

export const getRoadmap = async () => {
  const response = await api.get('/roadmap');
  return response.data;
};

// Dashboard
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// Generate All
export const generateAllOutputs = async () => {
  const response = await api.post('/generate-all');
  return response.data;
};

export default api;
