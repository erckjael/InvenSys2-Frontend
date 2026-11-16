import axios from 'axios'

/**
 * Instancia de Axios preconfigurada para la API de InvenSys2.
 * Todas las peticiones usarán la baseURL definida aquí.
 * Para producción, cambiar la URL con una variable de entorno.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
})

export default api
