import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSurveyByShareLink } from '../../services/surveyService';
import { submitPublicResponse } from '../../services/responseService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { FiSend } from 'react-icons/fi';

// Public survey page accessible via share link without authentication
// Renders the survey questions and handles response submission
function PublicSurvey() {
  const { shareLink } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});

  // Fetch survey by share link on mount
  useEffect(() => {
    fetchSurvey();
  }, [shareLink]);

  const fetchSurvey = async () => {
    try {
      const response = await getSurveyByShareLink(shareLink);
      setSurvey(response.data);
    } catch (err) {
      setError('Survey not found or is no longer available');
    } finally {
      setLoading(false);
    }
  };

  // Update answer state for a specific question
  const setAnswer = (questionId, value, optionId = null) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { answerValue: value, selectedOptionId: optionId },
    }));
  };

  // Validate required questions are answered before submission
  const validateAnswers = () => {
    for (const question of survey.questions) {
      if (question.required && !answers[question.id]?.answerValue) {
        toast.error(`Please answer: "${question.text}"`);
        return false;
      }
    }
    return true;
  };

  // Submit the survey response
  const handleSubmit = async () => {
    if (!validateAnswers()) return;

    setSubmitting(true);
    try {
      const responseData = {
        surveyId: survey.id,
        completed: true,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: Number(questionId),
          answerValue: answer.answerValue,
          selectedOptionId: answer.selectedOptionId,
        })),
      };

      await submitPublicResponse(survey.id, responseData);
      setSubmitted(true);
      toast.success('Response submitted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="min-h-screen flex items-center justify-center"><ErrorMessage message={error} /></div>;

  // Show thank you page after successful submission
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card text-center max-w-md">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h2>
          <p className="text-gray-600">Your response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{survey.title}</h1>
          {survey.description && <p className="text-gray-600">{survey.description}</p>}
        </div>

        {/* Render each question based on its type */}
        {survey.questions?.map((question) => (
          <div key={question.id} className="card mb-4">
            <p className="font-medium text-gray-900 mb-3">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </p>

            {/* Multiple choice: radio buttons for each option */}
            {question.type === 'MULTIPLE_CHOICE' && (
              <div className="space-y-2">
                {question.responseOptions?.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={opt.text}
                      onChange={() => setAnswer(question.id, opt.text, opt.id)}
                      className="text-primary-600"
                    />
                    <span className="text-gray-700">{opt.text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Likert scale: number buttons for rating */}
            {question.type === 'LIKERT' && (
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  { length: (question.likertMax || 5) - (question.likertMin || 1) + 1 },
                  (_, i) => (question.likertMin || 1) + i
                ).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAnswer(question.id, String(val))}
                    className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                      answers[question.id]?.answerValue === String(val)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 text-gray-700 hover:border-primary-400'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            )}

            {/* Open text: textarea input */}
            {question.type === 'OPEN_TEXT' && (
              <textarea
                value={answers[question.id]?.answerValue || ''}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                className="input-field"
                rows={3}
                maxLength={question.maxTextLength || 5000}
                placeholder="Type your answer here..."
              />
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary flex items-center gap-2"
        >
          <FiSend />
          {submitting ? 'Submitting...' : 'Submit Response'}
        </button>
      </div>
    </div>
  );
}

export default PublicSurvey;
