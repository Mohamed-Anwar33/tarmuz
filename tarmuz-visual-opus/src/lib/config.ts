export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
export const API_PREFIX = `${API_BASE}/api`;

// Login form toggles (optional email field)
export const LOGIN_SHOW_EMAIL: boolean = (import.meta.env.VITE_LOGIN_SHOW_EMAIL ?? 'false') === 'true';
export const LOGIN_ENABLE_EMAIL: boolean = (import.meta.env.VITE_LOGIN_ENABLE_EMAIL ?? 'true') === 'true';
