import apiClient from './client';

export const getEvents = async () => {
  const response = await apiClient.get('/events');
  return response.data;
};

export const getEventById = async (eventId) => {
  const response = await apiClient.get(`/events/${eventId}`);
  return response.data;
};

export const registerForEvent = async (payload) => {
  const response = await apiClient.post('/events/register', payload);
  return response.data;
};
