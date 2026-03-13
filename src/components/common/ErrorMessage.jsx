import { FiAlertCircle } from 'react-icons/fi';

// Reusable error message component displaying error details with an icon
function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <FiAlertCircle className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export default ErrorMessage;
