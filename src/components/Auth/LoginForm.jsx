import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';
import { FiLogIn, FiUser, FiLock, FiShield, FiBarChart2 } from 'react-icons/fi';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-400/30 mb-4">
            <FiBarChart2 className="w-8 h-8 text-violet-300" />
          </div>
          <h1 className="text-3xl font-bold text-white">Survey Platform</h1>
          <p className="text-violet-300 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-violet-200 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 text-violet-400" />
                </div>
                <input
                  {...register('username')}
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-200 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="h-4 w-4 text-violet-400" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/25"
            >
              <FiLogIn className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs text-violet-300/70 text-center mb-3 uppercase tracking-wider">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => fillCredentials('demouser', 'Demo@1234')}
                className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-violet-400/40 transition-all disabled:opacity-50"
              >
                <FiUser className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-violet-200">Demo User</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => fillCredentials('admin', 'Admin@1234')}
                className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-violet-400/40 transition-all disabled:opacity-50"
              >
                <FiShield className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-violet-200">Admin</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => fillCredentials('analyst', 'Analyst@1234')}
                className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-violet-400/40 transition-all disabled:opacity-50"
              >
                <FiBarChart2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-violet-200">Analyst</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-violet-300/70 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-violet-300 hover:text-white font-medium transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
