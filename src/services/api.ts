import axios from 'axios'
import { CONFIG } from '@/config'

const api = axios.create({
  baseURL: CONFIG.apiBaseUrl,
  timeout: 15000,
})

// Interceptor: Agrega el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor: Maneja errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
