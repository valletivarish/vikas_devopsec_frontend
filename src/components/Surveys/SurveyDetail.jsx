import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiShare2, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getSurveyById } from '../../services/surveyService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { formatDateTime } from '../../utils/dateUtils';

// Survey detail page showing survey metadata, questions, and action buttons
function SurveyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch survey details on mount
  useEffect(() => {
    fetchSurvey();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSurvey = async () => {
    try {
      const response = await getSurveyById(id);
      setSurvey(response.data);
    } catch (err) {
      setError('Failed to load survey details');
    } finally {
      setLoading(false);
    }
  };

  // Copy the public share link for this survey
  const copyShareLink = () => {
    const url = `${window.location.origin}/survey/${survey.shareLink}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!survey) return <ErrorMessage message="Survey not found" />;

  return (
    <div className="max-w-4xl">
      {/* Survey header with title and status */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{survey.title}</h2>
          <p className="text-gray-500 mt-1">{survey.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          survey.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
          survey.status === 'CLOSED' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {survey.status}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => navigate(`/surveys/${id}/edit`)} className="btn-primary flex items-center gap-2">
          <FiEdit2 /> Edit
        </button>
        <button onClick={copyShareLink} className="btn-secondary flex items-center gap-2">
          <FiShare2 /> Share
        </button>
        <button onClick={() => navigate(`/surveys/${id}/responses`)} className="btn-secondary flex items-center gap-2">
          <FiMessageSquare /> Responses ({survey.totalResponses || 0})
        </button>
      </div>

      {/* Survey metadata card */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-3">Survey Info</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Created</span>
            <p className="font-medium">{formatDateTime(survey.createdAt)}</p>
          </div>
          <div>
            <span className="text-gray-500">Start Date</span>
            <p className="font-medium">{formatDateTime(survey.startDate)}</p>
          </div>
          <div>
            <span className="text-gray-500">End Date</span>
            <p className="font-medium">{formatDateTime(survey.endDate)}</p>
          </div>
          <div>
            <span className="text-gray-500">Visibility</span>
            <p className="font-medium">{survey.visibility}</p>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Questions ({survey.questions?.length || 0})</h3>
        <div className="space-y-4">
          {survey.questions?.map((question, index) => (
            <div key={question.id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                  Q{question.questionOrder}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {question.type.replace('_', ' ')}
                </span>
                {question.required && (
                  <span className="text-xs text-red-500">Required</span>
                )}
              </div>
              <p className="font-medium text-gray-900">{question.text}</p>

              {/* Show response options for multiple choice */}
              {question.type === 'MULTIPLE_CHOICE' && question.responseOptions?.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {question.responseOptions.map((opt, optIndex) => (
                    <li key={opt.id || optIndex} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-4 h-4 border border-gray-300 rounded-full flex-shrink-0"></span>
                      {opt.text}
                    </li>
                  ))}
                </ul>
              )}

              {/* Show Likert scale range */}
              {question.type === 'LIKERT' && (
                <p className="text-sm text-gray-500 mt-1">
                  Scale: {question.likertMin} - {question.likertMax}
                </p>
              )}

              {/* Show max text length for open text */}
              {question.type === 'OPEN_TEXT' && question.maxTextLength && (
                <p className="text-sm text-gray-500 mt-1">
                  Max length: {question.maxTextLength} characters
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SurveyDetail;
