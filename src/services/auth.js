import { apiClient } from './api.js'

export async function login (data){
  const res = await apiClient.post('/auth/login', data)
  return res
};