import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useDoctorAppointments = ({ page, limit, status, date }) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['doctor-appointments', page, limit, status, date],
        queryFn: async () => {
            const params = { page, limit };
            if (status) params.status = status;
            if (date) params.date = date;
            const res = await api.get('/appointments/doctor', { params });
            return res.data;
        },
        keepPreviousData: true,
        refetchInterval: 30000
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }) => {
            return api.patch('/appointments/update-status', { appointment_id: id, status });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['doctor-appointments']);
        }
    });

    const appointments = data?.data || [];
    const total = data?.total || appointments.length || 0;

    return { appointments, total, isLoading, error, refetch, updateStatus };
};


