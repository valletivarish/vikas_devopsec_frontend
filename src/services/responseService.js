import api from './api';

// Service layer for survey response API calls
// Handles response submission and retrieval

// Submit a survey response (authenticated)
export const submitResponse = (data) => api.post('/api/responses', data);

// Submit a public survey response via share link
export const submitPublicResponse = (surveyId, data) =>
  api.post(`/api/responses/surveys/${surveyId}/respond`, data);

// Get all responses for a specific survey
export const getResponsesBySurvey = (surveyId) =>
  api.get(`/api/responses/survey/${surveyId}`);

// Get a specific response by ID
export const getResponseById = (id) => api.get(`/api/responses/${id}`);
