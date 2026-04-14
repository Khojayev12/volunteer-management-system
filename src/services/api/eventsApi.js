import apiClient from './client';

export const getEvents = async () => {
  const response = await apiClient.get('/events');
  return response.data;
};

export const getEventById = async (eventId) => {
  const response = await apiClient.get(`/events/${eventId}`);
  return response.data;
};

export const registerForEvent = async (eventId, volunteerId) => {
  const normalizedEventId = encodeURIComponent(String(eventId || '').trim());
  const normalizedVolunteerId = encodeURIComponent(String(volunteerId || '').trim());
  const response = await apiClient.post(
    `/participants/${normalizedEventId}/participants/add/${normalizedVolunteerId}`
  );
  return response.data;
};
