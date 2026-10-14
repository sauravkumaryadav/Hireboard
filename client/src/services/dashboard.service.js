import api from './api';

export const getStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getWeeklyTrend = async () => {
  const response = await api.get('/dashboard/weekly-trend');
  return response.data;
};

export const getByStatus = async () => {
  const response = await api.get('/dashboard/by-status');
  return response.data;
};

export const getBySource = async () => {
  const response = await api.get('/dashboard/by-source');
  return response.data;
};

export const getResponseTime = async () => {
  const response = await api.get('/dashboard/response-time');
  return response.data;
};
