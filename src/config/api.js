// API Configuration
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // In production, use relative path (Vercel will handle routing)
  : 'http://localhost:3001/api';  // In development, use local server

export default API_BASE_URL;