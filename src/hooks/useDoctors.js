import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useDoctorsStore } from '../store/doctorsStore';

export const useDoctors = () => {
    const { page, limit, search, specialization, setDoctors, setSpecializations, setLoading } = useDoctorsStore();

    const { data: specializations } = useQuery({
        queryKey: ['specializations'],
        queryFn: async () => (await api.get('/specializations')).data,
        staleTime: 5 * 60 * 1000
    });

    useEffect(() => {
        if (specializations) {
            const list = Array.isArray(specializations) ? specializations : (specializations?.data || []);
            setSpecializations(list);
        }
    }, [specializations, setSpecializations]);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['doctors', page, limit, search, specialization],
        queryFn: async () => {
            const params = { page, limit };
            if (search) params.search = search;
            if (specialization) params.specialization = specialization;
            const res = await api.get('/doctors', { params });
            return res.data;
        },
        keepPreviousData: true
    });

    useEffect(() => { setLoading(isLoading); }, [isLoading, setLoading]);

    useEffect(() => {
        if (!data) return;
        const doctors = Array.isArray(data) ? data : (data.data || data.doctors || []);
        const total = data.total || data?.pagination?.total || doctors.length || 0;
        setDoctors({ doctors, total });
    }, [data, setDoctors]);

    return { error, refetch };
};


