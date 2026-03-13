import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import SurveyList from './components/Surveys/SurveyList';
import SurveyForm from './components/Surveys/SurveyForm';
import SurveyDetail from './components/Surveys/SurveyDetail';
import PublicSurvey from './components/Surveys/PublicSurvey';
import ResponseList from './components/Responses/ResponseList';
import ReportList from './components/Reports/ReportList';
import ForecastPage from './components/Forecast/ForecastPage';

// Main application component defining all routes
// Protected routes require JWT authentication, public routes are accessible to all
function App() {
  return (
    <Routes>
      {/* Public authentication routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Public survey access via share link */}
      <Route path="/survey/:shareLink" element={<PublicSurvey />} />

      {/* Protected routes wrapped in MainLayout with sidebar navigation */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/surveys/new" element={<SurveyForm />} />
          <Route path="/surveys/:id" element={<SurveyDetail />} />
          <Route path="/surveys/:id/edit" element={<SurveyForm />} />
          <Route path="/surveys/:id/responses" element={<ResponseList />} />
          <Route path="/reports" element={<ReportList />} />
          <Route path="/forecast" element={<ForecastPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
