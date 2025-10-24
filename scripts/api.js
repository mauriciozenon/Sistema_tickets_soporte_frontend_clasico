import { API_BASE } from '../config/endpoints.js';

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const getTickets = async () => {
  const res = await fetch(`${API_BASE}/tickets`);
  return res.json();
};