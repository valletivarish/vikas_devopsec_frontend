import api from './api';

// Service layer for result report API calls
// Handles report generation, retrieval, and deletion

// Generate a result report for a survey
export const generateReport = (surveyId, title) =>
  api.post(`/api/reports/survey/${surveyId}?title=${encodeURIComponent(title)}`);

// Get all reports for a specific survey
export const getReportsBySurvey = (surveyId) =>
  api.get(`/api/reports/survey/${surveyId}`);

// Get a specific report by ID
export const getReportById = (id) => api.get(`/api/reports/${id}`);

// Delete a report
export const deleteReport = (id) => api.delete(`/api/reports/${id}`);
