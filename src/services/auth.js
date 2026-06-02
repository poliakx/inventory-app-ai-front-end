import axios from 'axios'

export async function login (data){
  const response = await axios.post("/api/auth/login", data)
  return response
};