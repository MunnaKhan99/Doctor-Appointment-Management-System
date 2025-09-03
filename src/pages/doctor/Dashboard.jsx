import React, { useMemo, useRef, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DoctorAppointmentsList from '../../components/doctor/DoctorAppointmentsList';
import StatusFilter from '../../components/ui/StatusFilter';
import SearchInput from '../../components/ui/SearchInput';
import Button from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/layout/EmptyState';
import { useDoctorAppointments } from '../../hooks/useDoctorAppointments';
import AppointmentStatusManager from '../../components/doctor/AppointmentStatusManager';

const DoctorDashboard = () => {
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [date, setDate] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const { appointments, total, isLoading, error, refetch, updateStatus } = useDoctorAppointments({ page, limit, status, date });
    const statusManagerRef = useRef(null);
    const manager = AppointmentStatusManager({
        onConfirm: async (action, appointment) => {
            setUpdatingId(appointment.id);
            try {
                await updateStatus.mutateAsync({ id: appointment.id, status: action });
            } finally {
                setUpdatingId(null);
            }
        },
        loading: updateStatus.isLoading
    });

    const totalPages = useMemo(() => Math.ceil((total || 0) / limit), [total, limit]);

    return (
        <DashboardLayout
            title="My Appointments"
            subtitle="Manage your appointments with patients"
            actions={[
                <Button key="refresh" variant="outline" onClick={() => refetch()}>Refresh</Button>
            ]}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by status</label>
                        <StatusFilter
                            value={status}
                            onChange={(v) => { setStatus(v); setPage(1); }}
                            options={[
                                { value: '', label: 'All' },
                                { value: 'PENDING', label: 'Pending' },
                                { value: 'COMPLETED', label: 'Completed' },
                                { value: 'CANCELLED', label: 'Cancelled' },
                            ]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setPage(1); }}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button variant="secondary" onClick={() => { setStatus(''); setDate(''); setPage(1); }}>
                            Clear Filters
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-600">Failed to load appointments. Please try again.</p>
                        <Button variant="primary" className="mt-4" onClick={() => refetch()}>Retry</Button>
                    </div>
                ) : appointments.length === 0 ? (
                    <EmptyState icon="🩺" title="No appointments" description="No appointments match your filters." />
                ) : (
                    <DoctorAppointmentsList
                        appointments={appointments}
                        onCancel={(a) => manager.request('CANCELLED', a)}
                        onComplete={(a) => manager.request('COMPLETED', a)}
                        updatingId={updatingId}
                    />
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>

            {manager.dialog}
        </DashboardLayout>
    );
};

export default DoctorDashboard;


