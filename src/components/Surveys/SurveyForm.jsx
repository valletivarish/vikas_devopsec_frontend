import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { surveySchema } from '../../utils/validators';
import { createSurvey, getSurveyById, updateSurvey } from '../../services/surveyService';
import { toInputDateTime } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';

// Survey form component for creating and editing surveys with dynamic questions
// Supports adding multiple choice, Likert scale, and open text questions
function SurveyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  // Dynamic questions state managed outside react-hook-form
  const [questions, setQuestions] = useState([
    { text: '', type: 'MULTIPLE_CHOICE', questionOrder: 1, required: true, responseOptions: [{ text: '', optionOrder: 1 }], likertMin: null, likertMax: null, maxTextLength: null },
  ]);

  // Initialize form with validation schema
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(surveySchema),
    defaultValues: { visibility: 'PUBLIC' },
  });

  // Load existing survey data when editing
  useEffect(() => {
    if (isEditing) {
      fetchSurvey();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSurvey = async () => {
    try {
      const response = await getSurveyById(id);
      const survey = response.data;
      setValue('title', survey.title);
      setValue('description', survey.description);
      setValue('startDate', toInputDateTime(survey.startDate));
      setValue('endDate', toInputDateTime(survey.endDate));
      setValue('visibility', survey.visibility);
      if (survey.questions?.length > 0) {
        setQuestions(survey.questions.map((q) => ({
          ...q,
          responseOptions: q.responseOptions?.length > 0 ? q.responseOptions : [{ text: '', optionOrder: 1 }],
        })));
      }
    } catch (err) {
      toast.error('Failed to load survey');
      navigate('/surveys');
    } finally {
      setFetching(false);
    }
  };

  // Add a new empty question to the form
  const addQuestion = () => {
    setQuestions([...questions, {
      text: '', type: 'MULTIPLE_CHOICE', questionOrder: questions.length + 1,
      required: true, responseOptions: [{ text: '', optionOrder: 1 }],
      likertMin: null, likertMax: null, maxTextLength: null,
    }]);
  };

  // Remove a question from the form
  const removeQuestion = (index) => {
    if (questions.length <= 1) {
      toast.error('Survey must have at least 1 question');
      return;
    }
    const updated = questions.filter((_, i) => i !== index);
    updated.forEach((q, i) => { q.questionOrder = i + 1; });
    setQuestions(updated);
  };

  // Update a question field value
  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  // Add a response option to a multiple choice question
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].responseOptions.push({
      text: '', optionOrder: updated[qIndex].responseOptions.length + 1,
    });
    setQuestions(updated);
  };

  // Remove a response option from a question
  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].responseOptions = updated[qIndex].responseOptions.filter((_, i) => i !== oIndex);
    updated[qIndex].responseOptions.forEach((o, i) => { o.optionOrder = i + 1; });
    setQuestions(updated);
  };

  // Update a response option text
  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].responseOptions[oIndex].text = value;
    setQuestions(updated);
  };

  // Validate questions before submission
  const validateQuestions = () => {
    for (const q of questions) {
      if (!q.text.trim()) {
        toast.error('All questions must have text');
        return false;
      }
      if (q.type === 'MULTIPLE_CHOICE') {
        if (!q.responseOptions || q.responseOptions.length < 2) {
          toast.error('Multiple choice questions need at least 2 options');
          return false;
        }
        for (const opt of q.responseOptions) {
          if (!opt.text.trim()) {
            toast.error('All response options must have text');
            return false;
          }
        }
      }
      if (q.type === 'LIKERT') {
        if (!q.likertMin || !q.likertMax || q.likertMin >= q.likertMax) {
          toast.error('Likert scale must have valid min and max values');
          return false;
        }
      }
    }
    return true;
  };

  // Handle form submission for creating or updating a survey
  const onSubmit = async (formData) => {
    if (!validateQuestions()) return;

    setLoading(true);
    const surveyData = {
      ...formData,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      questions: questions.map((q) => ({
        ...q,
        likertMin: q.type === 'LIKERT' ? Number(q.likertMin) : null,
        likertMax: q.type === 'LIKERT' ? Number(q.likertMax) : null,
        maxTextLength: q.type === 'OPEN_TEXT' ? Number(q.maxTextLength) || 5000 : null,
        responseOptions: q.type === 'MULTIPLE_CHOICE' ? q.responseOptions : [],
      })),
    };

    try {
      if (isEditing) {
        await updateSurvey(id, surveyData);
        toast.success('Survey updated successfully');
      } else {
        await createSurvey(surveyData);
        toast.success('Survey created successfully');
      }
      navigate('/surveys');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save survey';
      if (err.response?.data?.fieldErrors) {
        Object.values(err.response.data.fieldErrors).forEach((msg) => toast.error(msg));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Survey' : 'Create New Survey'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Survey metadata section */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Survey Details</h3>
          <div className="space-y-4">
            {/* Title input with validation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input {...register('title')} className="input-field" placeholder="Enter survey title" />
              {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea {...register('description')} className="input-field" rows={3} placeholder="Describe the purpose of this survey" />
              {errors.description && <p className="error-text">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input {...register('startDate')} type="datetime-local" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input {...register('endDate')} type="datetime-local" className="input-field" />
                {errors.endDate && <p className="error-text">{errors.endDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select {...register('visibility')} className="input-field">
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic questions section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Questions</h3>
            <button type="button" onClick={addQuestion} className="btn-secondary flex items-center gap-2 text-sm">
              <FiPlus /> Add Question
            </button>
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="card mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">Question {qIndex + 1}</span>
                <button type="button" onClick={() => removeQuestion(qIndex)}
                  className="text-red-400 hover:text-red-600 transition-colors">
                  <FiTrash2 />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  value={question.text}
                  onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  className="input-field"
                  placeholder="Enter question text"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Type</label>
                    <select value={question.type}
                      onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                      className="input-field text-sm">
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="LIKERT">Likert Scale</option>
                      <option value="OPEN_TEXT">Open Text</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={question.required}
                        onChange={(e) => updateQuestion(qIndex, 'required', e.target.checked)}
                        className="rounded border-gray-300" />
                      Required
                    </label>
                  </div>
                </div>

                {/* Multiple choice: response options */}
                {question.type === 'MULTIPLE_CHOICE' && (
                  <div className="pl-4 border-l-2 border-gray-200">
                    <label className="block text-xs text-gray-500 mb-2">Response Options</label>
                    {question.responseOptions.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2 mb-2">
                        <input value={opt.text}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="input-field text-sm flex-1"
                          placeholder={`Option ${oIndex + 1}`} />
                        {question.responseOptions.length > 1 && (
                          <button type="button" onClick={() => removeOption(qIndex, oIndex)}
                            className="text-red-400 hover:text-red-600">
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(qIndex)}
                      className="text-primary-600 text-sm hover:text-primary-700 flex items-center gap-1">
                      <FiPlus size={14} /> Add Option
                    </button>
                  </div>
                )}

                {/* Likert scale: min and max values */}
                {question.type === 'LIKERT' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min Value (1-10)</label>
                      <input type="number" value={question.likertMin || ''}
                        onChange={(e) => updateQuestion(qIndex, 'likertMin', e.target.value)}
                        className="input-field text-sm" min="1" max="10" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max Value (1-10)</label>
                      <input type="number" value={question.likertMax || ''}
                        onChange={(e) => updateQuestion(qIndex, 'likertMax', e.target.value)}
                        className="input-field text-sm" min="1" max="10" />
                    </div>
                  </div>
                )}

                {/* Open text: max character length */}
                {question.type === 'OPEN_TEXT' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Text Length (up to 5000)</label>
                    <input type="number" value={question.maxTextLength || ''}
                      onChange={(e) => updateQuestion(qIndex, 'maxTextLength', e.target.value)}
                      className="input-field text-sm" max="5000" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form action buttons */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <FiSave />
            {loading ? 'Saving...' : isEditing ? 'Update Survey' : 'Create Survey'}
          </button>
          <button type="button" onClick={() => navigate('/surveys')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SurveyForm;
