import apiClient from './client';

export const registerUser = async (payload) => {
  const response = await apiClient.post('/users/register', payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await apiClient.post('/users/login', payload);
  return response.data;
};
