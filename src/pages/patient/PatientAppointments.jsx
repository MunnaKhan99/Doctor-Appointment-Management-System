// 2. Patient Appointments Page - pages/patient/Appointments.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/Loading';
import { EmptyState } from '../../components/layout/EmptyState';
import Modal from '../../components/ui/Modal';
import { toast } from '../../lib/toast';
import api from '../../lib/api';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AppointmentsList from '../../components/patient/AppointmentsList';
import { useNavigate } from 'react-router-dom';

const PatientAppointments = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const queryClient = useQueryClient();
  const limit = 10;

  // Fetch Patient Appointments
  const {
    data: appointmentsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['patient-appointments', statusFilter, currentPage],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit,
        ...(statusFilter && { status: statusFilter })
      };

      const response = await api.get('/appointments/patient', { params });
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  // Cancel Appointment Mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId) => {
      const response = await api.patch('/appointments/update-status', {
        appointment_id: appointmentId,
        status: 'CANCELLED'
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Appointment cancelled successfully');
      setShowCancelModal(false);
      setAppointmentToCancel(null);
      queryClient.invalidateQueries(['patient-appointments']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    },
  });

  const appointments = appointmentsData?.data || [];
  const totalPages = Math.ceil((appointmentsData?.total || 0) / limit);

  // Handle cancel appointment
  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (appointmentToCancel) {
      await cancelAppointmentMutation.mutateAsync(appointmentToCancel.id);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Status filter options
  const statusOptions = [
    { value: '', label: 'All Appointments' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  return (
    <DashboardLayout
      title="My Appointments"
      subtitle="Manage your scheduled appointments"
      actions={[
        <Button
          key="book-new"
          variant="primary"
          onClick={() => navigate('/patient/dashboard')}
        >
          Book New Appointment
        </Button>
      ]}
    >
      {/* Status Filter - Mobile responsive */}
      <div className="mb-4 sm:mb-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setCurrentPage(1);
                  }}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${statusFilter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <LoadingSkeleton width="200px" height="20px" />
                    <LoadingSkeleton width="80px" height="24px" />
                  </div>
                  <LoadingSkeleton width="150px" height="16px" />
                  <LoadingSkeleton width="100px" height="16px" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-red-600">Failed to load appointments. Please try again.</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => queryClient.invalidateQueries(['patient-appointments'])}
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : appointments.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No appointments found"
            description={
              statusFilter
                ? `No ${statusFilter.toLowerCase()} appointments found`
                : "You haven't booked any appointments yet"
            }
            action={
              <Button
                variant="primary"
                onClick={() => navigate('/patient/dashboard')}
              >
                Book Your First Appointment
              </Button>
            }
          />
        ) : (
          <AppointmentsList appointments={appointments} onCancel={handleCancelClick} />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Cancel Confirmation Modal (refactored to ConfirmDialog) */}
      <ConfirmDialog
        isOpen={showCancelModal}
        title="Cancel Appointment"
        description={appointmentToCancel ? `Cancel appointment with Dr. ${appointmentToCancel.doctor?.name} on ${formatDate(appointmentToCancel.date)}?` : ''}
        confirmText="Cancel Appointment"
        onConfirm={handleCancelConfirm}
        onCancel={() => { setShowCancelModal(false); setAppointmentToCancel(null); }}
        loading={cancelAppointmentMutation.isLoading}
      />
    </DashboardLayout>
  );
};

export default PatientAppointments;