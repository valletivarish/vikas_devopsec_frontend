import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getResponsesBySurvey } from '../../services/responseService';
import { getSurveyById } from '../../services/surveyService';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDateTime } from '../../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Response list page showing all submissions for a survey with analytics
function ResponseList() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);

  // Fetch survey details and responses on mount
  useEffect(() => {
    fetchData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      const [surveyRes, responsesRes] = await Promise.all([
        getSurveyById(id),
        getResponsesBySurvey(id),
      ]);
      setSurvey(surveyRes.data);
      setResponses(responsesRes.data);
    } catch (err) {
      toast.error('Failed to load responses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Calculate answer distribution for multiple choice questions
  const getAnswerDistribution = (questionId) => {
    const question = survey?.questions?.find((q) => q.id === questionId);
    if (!question || question.type !== 'MULTIPLE_CHOICE') return [];

    const counts = {};
    question.responseOptions?.forEach((opt) => { counts[opt.text] = 0; });

    responses.forEach((r) => {
      const answer = r.answers?.find((a) => a.questionId === questionId);
      if (answer?.answerValue) {
        counts[answer.answerValue] = (counts[answer.answerValue] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Responses: {survey?.title}
      </h2>
      <p className="text-gray-500 mb-6">Total responses: {responses.length}</p>

      {/* Answer distribution charts for multiple choice questions */}
      {survey?.questions?.filter((q) => q.type === 'MULTIPLE_CHOICE').map((question) => (
        <div key={question.id} className="card mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">{question.text}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getAnswerDistribution(question.id)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}

      {/* Response table listing all individual submissions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Individual Responses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Respondent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Submitted</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response, index) => (
                <tr key={response.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{response.respondentUsername || 'Anonymous'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      response.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {response.completed ? 'Completed' : 'Partial'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{formatDateTime(response.submittedAt)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedResponse(selectedResponse === response.id ? null : response.id)}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      {selectedResponse === response.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
              {responses.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No responses yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Expandable response detail view */}
        {selectedResponse && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Response Details</h4>
            {responses.find((r) => r.id === selectedResponse)?.answers?.map((answer) => {
              const question = survey?.questions?.find((q) => q.id === answer.questionId);
              return (
                <div key={answer.id} className="mb-2">
                  <p className="text-sm text-gray-500">{question?.text || `Question ${answer.questionId}`}</p>
                  <p className="font-medium">{answer.answerValue || 'No answer'}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponseList;
