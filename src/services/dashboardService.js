import api from './api';

// Service layer for dashboard and forecast API calls

// Get dashboard analytics data for the authenticated user
export const getDashboard = () => api.get('/api/dashboard');

// Get response rate forecast for a specific survey
export const getForecast = (surveyId) => api.get(`/api/forecast/survey/${surveyId}`);

// Get forecasts for all surveys with sufficient data
export const getAllForecasts = () => api.get('/api/forecast/all');
