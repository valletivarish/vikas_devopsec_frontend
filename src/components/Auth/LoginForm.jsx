import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';
import { FiLogIn, FiUser, FiShield, FiBarChart2 } from 'react-icons/fi';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Survey Platform</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                {...register('username')}
                type="text"
                className="input-field"
                placeholder="Enter your username"
              />
              {errors.username && <p className="error-text">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                className="input-field"
                placeholder="Enter your password"
              />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <FiLogIn />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 uppercase tracking-wide">Quick Login</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => fillCredentials('demouser', 'Demo@1234')}
                className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50"
              >
                <FiUser className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">Demo User</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => fillCredentials('admin', 'Admin@1234')}
                className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors disabled:opacity-50"
              >
                <FiShield className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-medium text-gray-700">Admin</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => fillCredentials('analyst', 'Analyst@1234')}
                className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors disabled:opacity-50"
              >
                <FiBarChart2 className="w-5 h-5 text-green-600" />
                <span className="text-xs font-medium text-gray-700">Analyst</span>
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
