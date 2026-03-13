import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiShare2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getMySurveys, deleteSurvey } from '../../services/surveyService';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDate } from '../../utils/dateUtils';

// Survey list page displaying all surveys for the authenticated user
// Provides actions for viewing, editing, deleting, and sharing surveys
function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // Fetch user surveys on component mount
  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await getMySurveys();
      setSurveys(response.data);
    } catch (err) {
      toast.error('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  // Handle survey deletion with confirmation dialog
  const handleDelete = async () => {
    try {
      await deleteSurvey(deleteId);
      setSurveys(surveys.filter((s) => s.id !== deleteId));
      toast.success('Survey deleted successfully');
    } catch (err) {
      toast.error('Failed to delete survey');
    } finally {
      setDeleteId(null);
    }
  };

  // Copy share link to clipboard for distribution
  const copyShareLink = (shareLink) => {
    const url = `${window.location.origin}/survey/${shareLink}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Surveys</h2>
        <Link to="/surveys/new" className="btn-primary flex items-center gap-2">
          <FiPlus />
          Create Survey
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No surveys yet. Create your first survey to get started.</p>
          <Link to="/surveys/new" className="btn-primary inline-flex items-center gap-2">
            <FiPlus />
            Create Survey
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="card flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
                  <StatusBadge status={survey.status} />
                </div>
                <p className="text-sm text-gray-500 mb-2">{survey.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Questions: {survey.questions?.length || 0}</span>
                  <span>Responses: {survey.totalResponses || 0}</span>
                  <span>Created: {formatDate(survey.createdAt)}</span>
                </div>
              </div>

              {/* Action buttons for each survey */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => navigate(`/surveys/${survey.id}`)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  title="View Details"
                >
                  <FiEye />
                </button>
                <button
                  onClick={() => navigate(`/surveys/${survey.id}/edit`)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Edit Survey"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => copyShareLink(survey.shareLink)}
                  className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  title="Copy Share Link"
                >
                  <FiShare2 />
                </button>
                <button
                  onClick={() => setDeleteId(survey.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete Survey"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation dialog for survey deletion */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Survey"
        message="Are you sure you want to delete this survey? This action cannot be undone and all responses will be lost."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

// Status badge with color coding for survey lifecycle states
function StatusBadge({ status }) {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-700',
    ACTIVE: 'bg-green-100 text-green-700',
    CLOSED: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.DRAFT}`}>
      {status}
    </span>
  );
}

export default SurveyList;
