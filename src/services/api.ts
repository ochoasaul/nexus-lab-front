import axios from 'axios'
import { CONFIG } from '../config'

const api = axios.create({
  baseURL: CONFIG.apiBaseUrl,
  timeout: 15000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error)
    return Promise.reject(error)
  },
)

export default api
