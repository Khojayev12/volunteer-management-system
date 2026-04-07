import apiClient from './client';

export const getUserSocialMediaLinks = async (userId) => {
  const response = await apiClient.get('/social-media-links', {
    params: {
      user_id: userId,
    },
  });
  return response.data;
};

export const createSocialMediaLink = async (payload) => {
  const response = await apiClient.post('/social-media-links', payload);
  return response.data;
};
