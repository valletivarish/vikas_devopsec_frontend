import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';
import { FiLogIn, FiUser, FiLock, FiShield, FiBarChart2, FiClipboard, FiTrendingUp } from 'react-icons/fi';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (username, password) => {
    setValue('username', username);
    setValue('password', password);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight">Survey Platform</h1>
          <p className="text-primary-200 mt-2 text-lg">Create, share, and analyze surveys with ease</p>
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl"><FiClipboard className="w-6 h-6" /></div>
            <div>
              <h3 className="font-semibold text-lg">Build Surveys</h3>
              <p className="text-primary-200 text-sm">Create polls with multiple choice, Likert scales, and open text questions</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl"><FiBarChart2 className="w-6 h-6" /></div>
            <div>
              <h3 className="font-semibold text-lg">Analyze Results</h3>
              <p className="text-primary-200 text-sm">Get detailed reports and visualizations of survey responses</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl"><FiTrendingUp className="w-6 h-6" /></div>
            <div>
              <h3 className="font-semibold text-lg">Forecast Trends</h3>
              <p className="text-primary-200 text-sm">AI-powered forecasting to predict response trends over time</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-primary-300 text-sm">&copy; 2026 Survey Platform</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to manage your surveys</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input {...register('username')} type="text" className="input-field pl-10" placeholder="Enter your username" />
                </div>
                {errors.username && <p className="error-text">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input {...register('password')} type="password" className="input-field pl-10" placeholder="Enter your password" />
                </div>
                {errors.password && <p className="error-text">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                <FiLogIn className="w-5 h-5" />
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-5">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500 uppercase tracking-wide">Demo Accounts</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button type="button" disabled={loading} onClick={() => fillCredentials('demouser', 'Demo@1234')}
                  className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50">
                  <FiUser className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-medium text-gray-700">Demo User</span>
                </button>
                <button type="button" disabled={loading} onClick={() => fillCredentials('admin', 'Admin@1234')}
                  className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors disabled:opacity-50">
                  <FiShield className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-medium text-gray-700">Admin</span>
                </button>
                <button type="button" disabled={loading} onClick={() => fillCredentials('analyst', 'Analyst@1234')}
                  className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors disabled:opacity-50">
                  <FiBarChart2 className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-medium text-gray-700">Analyst</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
