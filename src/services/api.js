import axios from 'axios'

export const apiClient = axios.create({ baseURL: '/api' })

  apiClient.interceptors.request.use((config) => {
    const raw = localStorage.getItem('auth-storage')
    const token = JSON.parse(raw)?.state?.token
    if(token) config.headers.Authorization =`Bearer ${token}`
    return config
  });

  export default apiClient