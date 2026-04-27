import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Locations
export const getLocations   = (params)   => API.get('/locations', { params });
export const getLocation    = (id)        => API.get(`/locations/${id}`);
export const createLocation = (data)      => API.post('/locations', data);
export const updateLocation = (id, data)  => API.put(`/locations/${id}`, data);
export const deleteLocation = (id)        => API.delete(`/locations/${id}`);
export const seedLocations  = ()          => API.post('/locations/seed/demo');

// Markers
export const getMarkers     = ()          => API.get('/markers');
export const createMarker   = (data)      => API.post('/markers', data);
export const deleteMarker   = (id)        => API.delete(`/markers/${id}`);
export const seedMarkers    = ()          => API.post('/markers/seed/demo');

// Search
export const searchLocations = (q, type) => API.get('/search', { params: { q, type } });

export default API;
