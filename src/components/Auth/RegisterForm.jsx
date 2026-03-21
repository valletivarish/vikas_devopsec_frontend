import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { registerSchema } from '../../utils/validators';
import { FiUserPlus, FiUser, FiMail, FiLock, FiClipboard, FiBarChart2, FiTrendingUp } from 'react-icons/fi';

function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      if (error.response?.data?.fieldErrors) {
        Object.values(error.response.data.fieldErrors).forEach((msg) => toast.error(msg));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="text-gray-500 mt-2">Join the platform and start creating surveys</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input {...register('username')} type="text" className="input-field pl-10" placeholder="Choose a username (3-50 characters)" />
                </div>
                {errors.username && <p className="error-text">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input {...register('email')} type="email" className="input-field pl-10" placeholder="Enter your email address" />
                </div>
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUserPlus className="h-5 w-5 text-gray-400" />
                  </div>
                  <input {...register('fullName')} type="text" className="input-field pl-10" placeholder="Enter your full name" />
                </div>
                {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input {...register('password')} type="password" className="input-field pl-10" placeholder="Choose a password (min 8 characters)" />
                </div>
                {errors.password && <p className="error-text">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                <FiUserPlus className="w-5 h-5" />
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
