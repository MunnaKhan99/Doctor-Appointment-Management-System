import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../lib/api';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { toast } from '../../lib/toast';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
    specialization: z.string().min(1, 'Specialization is required'),
    photo_url: z.string().url('Photo URL must be a valid URL').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

const DoctorRegistrationForm = ({ onSuccess }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
        resolver: zodResolver(schema)
    });
    const [specializations, setSpecializations] = useState([]);
    const [loadingSpecializations, setLoadingSpecializations] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get('/specializations');
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                if (mounted) setSpecializations(data.map((s) => typeof s === 'string' ? s : (s.name || s.value || s.specialization)).filter(Boolean));
            } catch {
                toast.error('Failed to load specializations');
            } finally {
                if (mounted) setLoadingSpecializations(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const onSubmit = async (values) => {
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                specialization: values.specialization,
                ...(values.photo_url ? { photo_url: values.photo_url } : {})
            };
            const res = await api.post('/auth/register/doctor', payload);
            toast.success(res.data?.message || 'Registration successful');
            reset();
            setValue('specialization', '');
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
            <Select
                label="Specialization"
                {...register('specialization')}
                options={[{ value: '', label: loadingSpecializations ? 'Loading...' : 'Select specialization' }, ...specializations.map((s) => ({ value: s, label: s }))]}
                error={errors.specialization?.message}
            />
            <div>
                <input className={`w-full p-3 border rounded-lg ${errors.photo_url ? 'border-red-400' : 'border-gray-300'}`} placeholder="Photo URL (optional)" {...register('photo_url')} />
                {errors.photo_url && <p className="text-xs text-red-600 mt-1">{errors.photo_url.message}</p>}
            </div>
            <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting} className="w-full">Register as Doctor</Button>
        </form>
    );
};

export default DoctorRegistrationForm;


