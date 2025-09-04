import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/schema';
import api from '../../services/api';
import useAuthStore from '../stores/useAuthStore';
import ErrorMessage from '../Common/ErrorMessage';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', role: 'PATIENT' },
  });
  const [serverError, setServerError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const res = await api.login(data);
      console.log('Full login response:', res);
      const token = res.data?.token || res.data?.data?.token;
      if (!token) throw new Error('No token received');
      const user = {
        userId: res.data?.data?.userId || res.data?.userId,
        name: res.data?.data?.name || 'Unknown',
        email: res.data?.data?.email || data.email,
        photo_url: res.data?.data?.photo_url || 'https://placehold.co/100x100',
        role: data.role,
        specialization: res.data?.data?.specialization || undefined,
      };
      setAuth(token, user);
      alert('Login successful!');
      navigate(user.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setServerError(err.message || 'Login failed: Invalid credentials or server error');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email')}
              placeholder="Email"
              className={`w-full p-2 border rounded-lg focus:ring-2 ${errors.email ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
            />
            <ErrorMessage message={errors.email?.message} />
          </div>
          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className={`w-full p-2 border rounded-lg focus:ring-2 ${errors.password ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
            />
            <ErrorMessage message={errors.password?.message} />
          </div>
          <select
            {...register('role')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
          </select>
          <ErrorMessage message={serverError} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;