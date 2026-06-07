import { apiClient } from './api.js'

export async function login (data){
  const response = await apiClient.post('/auth/login', data)
  return response
};