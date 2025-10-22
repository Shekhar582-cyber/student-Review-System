// API Configuration with fallback
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://student-review-system.onrender.com/api'  // Your Render backend URL
  : 'http://localhost:3001/api';  // In development, use local server

export default API_BASE_URL;