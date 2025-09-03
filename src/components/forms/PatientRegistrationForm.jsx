import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../lib/api';
import Button from '../ui/Button';
import { toast } from '../../lib/toast';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
    photo_url: z.string().url('Photo URL must be a valid URL').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

const PatientRegistrationForm = ({ onSuccess }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (values) => {
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                ...(values.photo_url ? { photo_url: values.photo_url } : {})
            };
            const res = await api.post('/auth/register/patient', payload);
            toast.success(res.data?.message || 'Registration successful');
            reset();
            onSuccess?.();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <input className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-400' : 'border-gray-300'}`} placeholder="Name" {...register('name')} />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <input className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-400' : 'border-gray-300'}`} placeholder="Email" type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <input className={`w-full p-3 border rounded-lg ${errors.password ? 'border-red-400' : 'border-gray-300'}`} placeholder="Password" type="password" {...register('password')} />
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <div>
                <input className={`w-full p-3 border rounded-lg ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`} placeholder="Confirm Password" type="password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <div>
                <input className={`w-full p-3 border rounded-lg ${errors.photo_url ? 'border-red-400' : 'border-gray-300'}`} placeholder="Photo URL (optional)" {...register('photo_url')} />
                {errors.photo_url && <p className="text-xs text-red-600 mt-1">{errors.photo_url.message}</p>}
            </div>
            <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting} className="w-full">Register as Patient</Button>
        </form>
    );
};

export default PatientRegistrationForm;


