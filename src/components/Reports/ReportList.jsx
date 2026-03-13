import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiFileText, FiTrash2, FiPlus } from 'react-icons/fi';
import { getMySurveys } from '../../services/surveyService';
import { getReportsBySurvey, generateReport, deleteReport } from '../../services/reportService';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDateTime } from '../../utils/dateUtils';

// Reports page for generating and viewing result reports for surveys
// Allows creating new reports and viewing existing ones with analytics data
function ReportList() {
  const [surveys, setSurveys] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch surveys and all reports on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const surveyRes = await getMySurveys();
      setSurveys(surveyRes.data);

      // Fetch reports for all surveys
      const allReports = [];
      for (const survey of surveyRes.data) {
        const reportRes = await getReportsBySurvey(survey.id);
        allReports.push(...reportRes.data);
      }
      setReports(allReports);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Generate a new result report for the selected survey
  const handleGenerate = async () => {
    if (!selectedSurvey) {
      toast.error('Please select a survey');
      return;
    }
    if (!reportTitle.trim()) {
      toast.error('Please enter a report title');
      return;
    }

    setGenerating(true);
    try {
      const response = await generateReport(selectedSurvey, reportTitle);
      setReports([response.data, ...reports]);
      setReportTitle('');
      setSelectedSurvey('');
      toast.success('Report generated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  // Delete a report with confirmation
  const handleDelete = async () => {
    try {
      await deleteReport(deleteId);
      setReports(reports.filter((r) => r.id !== deleteId));
      toast.success('Report deleted');
    } catch (err) {
      toast.error('Failed to delete report');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Result Reports</h2>

      {/* Report generation form */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Generate New Report</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={selectedSurvey}
            onChange={(e) => setSelectedSurvey(e.target.value)}
            className="input-field md:w-1/3"
          >
            <option value="">Select a survey</option>
            {surveys.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
          <input
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="input-field md:flex-1"
            placeholder="Report title (max 200 characters)"
            maxLength={200}
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <FiPlus />
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Reports list */}
      {reports.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">No reports generated yet. Select a survey and generate your first report.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FiFileText className="text-primary-600 text-xl" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-500">Generated: {formatDateTime(report.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(report.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>

              {/* Report summary metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-blue-600 text-xs">Total Responses</span>
                  <p className="text-lg font-bold text-blue-900">{report.totalResponses || 0}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <span className="text-green-600 text-xs">Completion Rate</span>
                  <p className="text-lg font-bold text-green-900">{report.completionRate?.toFixed(1) || 0}%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <span className="text-purple-600 text-xs">Avg Time</span>
                  <p className="text-lg font-bold text-purple-900">
                    {report.averageTimeSeconds ? `${Math.round(report.averageTimeSeconds / 60)}m` : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-600 text-xs">Generated By</span>
                  <p className="text-lg font-bold text-gray-900">{report.generatedByUsername || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Report"
        message="Are you sure you want to delete this report?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default ReportList;
