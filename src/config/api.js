// API Configuration with fallback
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://student-review-api.railway.app/api'  // Use Railway for backend
  : 'http://localhost:3001/api';  // In development, use local server

export default API_BASE_URL;