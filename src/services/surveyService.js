import api from './api';

// Service layer for survey-related API calls
// Provides methods for all survey CRUD operations

// Get all surveys for the authenticated user
export const getMySurveys = () => api.get('/api/surveys');

// Get all surveys in the platform
export const getAllSurveys = () => api.get('/api/surveys/all');

// Get a specific survey by ID
export const getSurveyById = (id) => api.get(`/api/surveys/${id}`);

// Get a survey by its share link (public access)
export const getSurveyByShareLink = (shareLink) => api.get(`/api/surveys/share/${shareLink}`);

// Create a new survey with questions and response options
export const createSurvey = (data) => api.post('/api/surveys', data);

// Update an existing survey
export const updateSurvey = (id, data) => api.put(`/api/surveys/${id}`, data);

// Delete a survey
export const deleteSurvey = (id) => api.delete(`/api/surveys/${id}`);
