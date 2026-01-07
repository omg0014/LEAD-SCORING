import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
});

export const getLeads = async () => (await api.get('/leads')).data;
export const getLead = async (id) => (await api.get(`/leads/${id}`)).data;
export const getRules = async () => (await api.get('/rules')).data;
export const updateRule = async (rule) => (await api.post('/rules', rule)).data;
export const sendEvent = async (event) => (await api.post('/events', event)).data;

export default api;
