import axios from 'axios'
import { useAuthStore } from '@/features/auth/authStore';

export const apiClient = axios.create({ baseURL: '/api' })

  apiClient.interceptors.request.use((config) => {
    const raw = localStorage.getItem('auth-storage')
    const token = JSON.parse(raw)?.state?.token
    if(token) config.headers.Authorization =`Bearer ${token}`
    return config
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if(error.response?.status === 401){
        useAuthStore.getState().logout()
        window.location.href = '/login'
      } 
      return Promise.reject(error)
  }
);

  export default apiClient