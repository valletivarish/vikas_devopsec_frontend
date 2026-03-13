// Format an ISO date string to a human-readable format
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format an ISO date string to include time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format an ISO date string to datetime-local input format
export const toInputDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().slice(0, 16);
};
