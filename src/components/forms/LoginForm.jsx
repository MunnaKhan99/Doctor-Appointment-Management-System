import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AUTH_ROLES, getPostLoginRedirect } from '../../lib/auth';
import api from '../../lib/api';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { toast } from '../../lib/toast';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(AUTH_ROLES, {
        errorMap: () => ({ message: 'Role is required' })
    })
});

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { role: AUTH_ROLES.PATIENT }
    });

    const onSubmit = async (values) => {
        try {
            const payload = {
                email: values.email.trim(),
                password: values.password,
                role: String(values.role || '').toUpperCase(),
            };
            const res = await api.post('/auth/login', payload);
            const token = res?.data?.token || res?.data?.data?.token;
            const user = res?.data?.user || res?.data?.data?.user;
            if (!token) {
                toast.error('Login succeeded but no token returned');
                return;
            }
            login({ token, user, role: values.role });
            toast.success('Logged in successfully');
            navigate(getPostLoginRedirect(values.role), { replace: true });
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                    className={`w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:outline-none text-sm sm:text-base ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    {...register('password')}
                    className={`w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:outline-none text-sm sm:text-base ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <Select
                label="Login as"
                {...register('role')}
                options={[
                    { value: AUTH_ROLES.PATIENT, label: 'Patient' },
                    { value: AUTH_ROLES.DOCTOR, label: 'Doctor' },
                ]}
                error={errors.role?.message}
            />
            <Button type="submit" variant="primary" disabled={isSubmitting} loading={isSubmitting} className="w-full text-sm sm:text-base">
                Login
            </Button>
        </form>
    );
};

export default LoginForm;


