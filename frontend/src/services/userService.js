import api from '../lib/api';

export const userService = {
  getMyProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },
  updateMyProfile: async (profileData) => {
    const { data } = await api.patch('/users/profile', profileData);
    return data;
  },
  updatePassword: async (passwordData) => {
    const { data } = await api.post('/users/password', passwordData);
    return data;
  },
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'avatars');

    // First upload the image
    const uploadResponse = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Then save the avatar URL
    const { data } = await api.post('/users/avatar', {
      avatarUrl: uploadResponse.data.url
    });
    return data;
  },
};
