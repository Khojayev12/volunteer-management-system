import apiClient from './client';

export const createSkill = async (payload) => {
  const response = await apiClient.post('/skills', payload);
  return response.data;
};

export const getUserSkills = async (userId) => {
  const response = await apiClient.get('/skills', {
    params: {
      user_id: userId,
    },
  });
  return response.data;
};

export const assignSkillToUser = async (userId, skillId) => {
  const normalizedSkillId = Number(skillId);
  const payload = {
    skill_id: Number.isNaN(normalizedSkillId) ? skillId : normalizedSkillId,
  };

  const response = await apiClient.post(`/skills/users/${userId}/assign`, payload);
  return response.data;
};

export const removeSkillFromUser = async (userId, skillId) => {
  const response = await apiClient.delete(`/skills/users/${userId}/remove/${skillId}`);
  return response.data;
};
