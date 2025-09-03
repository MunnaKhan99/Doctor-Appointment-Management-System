import { create } from 'zustand';

export const useAppointmentsStore = create((set, get) => ({
    appointments: [],
    total: 0,
    page: 1,
    limit: 10,
    status: '',
    loading: false,

    setAppointments: ({ appointments, total }) => set({ appointments, total }),
    setLoading: (loading) => set({ loading }),
    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit }),
    setStatus: (status) => set({ status, page: 1 }),
    updateAppointmentStatus: (id, status) => {
        const appointments = get().appointments.map((a) => a.id === id ? { ...a, status } : a);
        set({ appointments });
    }
}));


