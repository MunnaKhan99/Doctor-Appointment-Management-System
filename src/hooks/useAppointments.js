import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAppointmentsStore } from '../store/appointmentsStore';

export const useAppointments = () => {
    const queryClient = useQueryClient();
    const { page, limit, status, setAppointments, setLoading, updateAppointmentStatus } = useAppointmentsStore();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['patient-appointments', status, page],
        queryFn: async () => {
            const params = { page, limit };
            if (status) params.status = status;
            const res = await api.get('/appointments/patient', { params });
            return res.data;
        },
        refetchInterval: 30000
    });

    useEffect(() => { setLoading(isLoading); }, [isLoading, setLoading]);

    useEffect(() => {
        if (!data) return;
        const appointments = data.data || [];
        const total = data.total || appointments.length || 0;
        setAppointments({ appointments, total });
    }, [data, setAppointments]);

    const cancelMutation = useMutation({
        mutationFn: async (appointmentId) => {
            await api.patch('/appointments/update-status', { appointment_id: appointmentId, status: 'CANCELLED' });
        },
        onMutate: async (appointmentId) => {
            updateAppointmentStatus(appointmentId, 'CANCELLED');
        },
        onError: async (_err, appointmentId) => {
            // rollback
            await queryClient.invalidateQueries(['patient-appointments']);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries(['patient-appointments']);
        }
    });

    return { error, refetch, cancelMutation };
};


