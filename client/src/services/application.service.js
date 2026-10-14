import api from './api';

export const getApplications = async () => {
  const response = await api.get('/applications/listing');
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (data) => {
  const response = await api.post('/applications/create', data);
  return response.data;
};

export const updateApplication = async (id, data) => {
  const response = await api.put(`/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}/status`, { status });
  return response.data;
};

export const uploadResume = async (id, file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post(`/applications/${id}/resume`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const downloadResume = async (id) => {
  const response = await api.get(`/applications/${id}/resume`, {
    responseType: 'blob',
  });
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await api.delete(`/applications/${id}/resume`);
  return response.data;
};

// why service layer - lets say tomorrow backedn changes the api endpoint then we dont need to change it everywhere just chenge here 