// All HTTP, upload and socket clients share one deployment configuration.
const configured = import.meta.env.VITE_API_URL || (import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`);
export const API_URL = configured.replace(/\/+$/, '').replace(/(?:\/api)?$/, '/api');
export const BASE_URL = (import.meta.env.VITE_BASE_URL || API_URL.replace(/\/api$/, '')).replace(/\/+$/, '');
