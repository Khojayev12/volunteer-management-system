import apiClient from './client';

export const getOrganizationById = async (organizationId) => {
  const response = await apiClient.get(`/organizations/${organizationId}`);
  return response.data;
};
