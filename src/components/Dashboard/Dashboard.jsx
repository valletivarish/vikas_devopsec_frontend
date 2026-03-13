import { useState, useEffect } from 'react';
import { FiFileText, FiMessageSquare, FiActivity, FiPercent } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { getDashboard } from '../../services/dashboardService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

// Dashboard page displaying summary cards, response bar chart,
// question type pie chart, and recent activity table
function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard analytics data on component mount
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();
      setData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Colors for the pie chart segments
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Transform question type distribution data for the pie chart
  const pieData = data?.questionTypeDistribution
    ? Object.entries(data.questionTypeDistribution).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
      }))
    : [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* Summary cards row showing key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="Total Surveys"
          value={data?.totalSurveys || 0}
          icon={FiFileText}
          color="bg-blue-500"
        />
        <SummaryCard
          title="Total Responses"
          value={data?.totalResponses || 0}
          icon={FiMessageSquare}
          color="bg-green-500"
        />
        <SummaryCard
          title="Active Surveys"
          value={data?.activeSurveys || 0}
          icon={FiActivity}
          color="bg-yellow-500"
        />
        <SummaryCard
          title="Avg Completion Rate"
          value={`${data?.averageCompletionRate || 0}%`}
          icon={FiPercent}
          color="bg-purple-500"
        />
      </div>

      {/* Charts row: bar chart for responses per survey and pie chart for question types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Responses Per Survey</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.responsesPerSurvey || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="responses" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity table showing latest surveys */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Survey</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Responses</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentActivity || []).map((activity, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{activity.title}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={activity.status} />
                  </td>
                  <td className="py-3 px-4">{activity.responses}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {(!data?.recentActivity || data.recentActivity.length === 0) && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No surveys yet. Create your first survey to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Summary card component for displaying a single metric
function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`${color} text-white p-3 rounded-lg`}>
        <Icon className="text-xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Status badge component with color-coded labels
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

export default Dashboard;
