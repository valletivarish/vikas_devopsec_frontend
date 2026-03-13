import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMySurveys } from '../../services/surveyService';
import { getForecast } from '../../services/dashboardService';
import LoadingSpinner from '../common/LoadingSpinner';

// Forecast page displaying ML-based response rate predictions
// Uses linear regression results from the backend to visualize trends
function ForecastPage() {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(false);

  // Fetch user surveys on mount
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

  // Fetch forecast data when a survey is selected
  const handleSurveySelect = async (surveyId) => {
    setSelectedSurvey(surveyId);
    if (!surveyId) {
      setForecast(null);
      return;
    }

    setForecastLoading(true);
    try {
      const response = await getForecast(surveyId);
      setForecast(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Not enough data for forecast');
      setForecast(null);
    } finally {
      setForecastLoading(false);
    }
  };

  // Get the trend icon based on direction
  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'INCREASING': return <FiTrendingUp className="text-green-600 text-xl" />;
      case 'DECREASING': return <FiTrendingDown className="text-red-600 text-xl" />;
      default: return <FiMinus className="text-gray-600 text-xl" />;
    }
  };

  // Combine historical and predicted data for the chart
  const getChartData = () => {
    if (!forecast) return [];
    const historical = (forecast.historicalData || []).map((d) => ({
      label: d.label,
      actual: d.value,
    }));
    const predicted = (forecast.predictedData || []).map((d) => ({
      label: d.label,
      predicted: d.value,
    }));
    return [...historical, ...predicted];
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Response Rate Forecast</h2>

      {/* Survey selector for forecast generation */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Survey for Forecast</h3>
        <select
          value={selectedSurvey}
          onChange={(e) => handleSurveySelect(e.target.value)}
          className="input-field max-w-md"
        >
          <option value="">Choose a survey...</option>
          {surveys.map((s) => (
            <option key={s.id} value={s.id}>{s.title} ({s.totalResponses || 0} responses)</option>
          ))}
        </select>
      </div>

      {forecastLoading && <LoadingSpinner />}

      {forecast && (
        <>
          {/* Forecast summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card flex items-center gap-3">
              {getTrendIcon(forecast.trendDirection)}
              <div>
                <p className="text-sm text-gray-500">Trend</p>
                <p className="font-bold text-gray-900">{forecast.trendDirection}</p>
              </div>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Predicted Completion Rate</p>
              <p className="text-2xl font-bold text-primary-700">{forecast.predictedCompletionRate}%</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Confidence Score (R2)</p>
              <p className="text-2xl font-bold text-gray-900">{forecast.confidenceScore}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Trend Slope</p>
              <p className="text-2xl font-bold text-gray-900">{forecast.trendSlope}</p>
            </div>
          </div>

          {/* Forecast chart showing historical and predicted data */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Response Trend and Prediction</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2}
                  name="Actual Responses" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="predicted" stroke="#F59E0B" strokeWidth={2}
                  strokeDasharray="5 5" name="Predicted Responses" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {!forecast && !forecastLoading && selectedSurvey && (
        <div className="card text-center py-8">
          <p className="text-gray-500">
            Not enough response data to generate a forecast.
            The survey needs responses before predictions can be made.
          </p>
        </div>
      )}
    </div>
  );
}

export default ForecastPage;
