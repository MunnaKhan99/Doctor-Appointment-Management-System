import { create } from 'zustand';

export const useDoctorsStore = create((set) => ({
    doctors: [],
    total: 0,
    page: 1,
    limit: 6,
    search: '',
    specialization: '',
    specializations: [],
    loading: false,

    setDoctors: ({ doctors, total }) => set({ doctors, total }),
    setLoading: (loading) => set({ loading }),
    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit }),
    setSearch: (search) => set({ search }),
    setSpecialization: (specialization) => set({ specialization }),
    setSpecializations: (specializations) => set({ specializations }),
    clearFilters: () => set({ search: '', specialization: '', page: 1 })
}));


