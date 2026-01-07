import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://lead-scoring-5r0r.onrender.com' : 'http://localhost:5001');

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});

export const getLeads = async () => (await api.get('/leads')).data;
export const getLead = async (id) => (await api.get(`/leads/${id}`)).data;
export const getRules = async () => (await api.get('/rules')).data;
export const updateRule = async (rule) => (await api.post('/rules', rule)).data;
export const sendEvent = async (event) => (await api.post('/events', event)).data;

export default api;
