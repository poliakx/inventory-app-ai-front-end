import axios from 'axios'
import { useAuthStore } from '@/features/auth/authStore.js';

let refreshPromise = null

export const apiClient = axios.create({ 
  // Same-origin in every environment: Vite's dev proxy locally, a
  // vercel.json rewrite in prod. Keeps the refresh cookie first-party.
  baseURL: '/api',
  withCredentials: true
})

  apiClient.interceptors.request.use((config) => {
    const raw = localStorage.getItem('auth-storage')
    const token = JSON.parse(raw)?.state?.token
    if(token) config.headers.Authorization =`Bearer ${token}`
    return config
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
     console.error(error)
     const originalRequest = error.config

     if(originalRequest.url === '/auth/refresh') {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error)
     }

     if(originalRequest._retry && error.response?.status === 401){
       useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error)
     }
     if (error.response?.status === 401) {
      try {
        if(refreshPromise === null){
        refreshPromise = apiClient.post('/auth/refresh')
      }
      const response = await refreshPromise
      useAuthStore.getState().setToken(response.data.data.accessToken)
    } catch (refreshError){
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(refreshError)
    } finally {
      refreshPromise = null
    }

     try {
      originalRequest._retry = true
      return await apiClient(originalRequest)
    } catch (retryError){
      return Promise.reject(retryError)
    }
    }

    
    
      return Promise.reject(error)
  }
);

  export default apiClient