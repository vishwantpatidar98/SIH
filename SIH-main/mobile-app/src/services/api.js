import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../utils/constants'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('sih_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const setAuthToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem('sih_token', token)
  }
}

export const clearAuthToken = async () => {
  await AsyncStorage.removeItem('sih_token')
}

export const authService = {
  login: (payload) => api.post('/auth/login', payload),
  profile: () => api.get('/users/me'),
}

export const alertsService = {
  getLatest: () => api.get('/alerts'),
}

export const complaintsService = {
  create: (payload) => api.post('/complaints', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export const mlService = {
  predict: (payload) => api.post('/ml/predict', payload),
}

export default api

