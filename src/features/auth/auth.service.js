import { apiClient } from '@/lib/api.js'

export async function login(data) {
  const res = await apiClient.post('/auth/login', data)
  return res.data
};

export async function getCurrentUser() {
  const res = await apiClient.get('/auth/user')
  return res.data
};

export async function register(data) {
  const res = await apiClient.post('/auth/register', data)
  return res.data
}

