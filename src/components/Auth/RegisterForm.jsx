import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientRegisterSchema, doctorRegisterSchema } from '../../utils/schema';
import { useSpecializations } from '../../hooks/useSpecialization';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../Common/ErrorMessage';
import useAuthStore from '../stores/useAuthStore';
import { useState } from 'react';

const RegisterForm = ({ role }) => {
  const schema = role === 'PATIENT' ? patientRegisterSchema : doctorRegisterSchema;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });
  const { data: specializations = [], isLoading: specLoading } = useSpecializations();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const res = await api.register(data, role);
      console.log('Registration response:', res);
      const token = res.data?.token || res.data?.data?.token;
      const user = {
        userId: res.data?.data?.userId || res.data?.userId,
        name: data.name,
        email: data.email,
        photo_url: data.photo_url || 'https://placehold.co/100x100',
        role,
        specialization: data.specialization || undefined,
      };
      setAuth(token, user);
      alert('Registration successful!');
      navigate(role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setServerError(err.message || 'Registration failed');
      console.error('Registration error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('name')}
          placeholder="Name"
          className={`w-full p-2 border rounded-lg focus:ring-2 ${errors.name ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
        />
        <ErrorMessage message={errors.name?.message} />
      </div>
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
      <div>
        <input
          {...register('photo_url')}
          placeholder="Photo URL (optional)"
          className={`w-full p-2 border rounded-lg focus:ring-2 ${errors.photo_url ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
        />
        <ErrorMessage message={errors.photo_url?.message} />
      </div>
      {role === 'DOCTOR' && (
        <div>
          <select
            {...register('specialization')}
            className={`w-full p-2 border rounded-lg focus:ring-2 ${errors.specialization ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
            disabled={specLoading}
          >
            <option value="">Select Specialization</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <ErrorMessage message={errors.specialization?.message} />
        </div>
      )}
      <ErrorMessage message={serverError} />
      <button
        type="submit"
        disabled={isSubmitting || specLoading}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;