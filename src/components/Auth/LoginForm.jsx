import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';
import { FiLogIn } from 'react-icons/fi';

// Login form component with client-side validation matching backend rules
// Authenticates user credentials and stores JWT token via AuthContext
function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form with yup validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Handle form submission with error handling
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Survey Platform</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username input with validation error display */}
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

            {/* Password input with validation error display */}
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
