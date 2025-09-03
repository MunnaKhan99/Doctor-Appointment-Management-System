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
import { toast } from '../../components/ui/Toast';
import api from '../../lib/api';

const PatientAppointments = () => {
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
          onClick={() => window.location.href = '/patient/dashboard'}
        >
          Book New Appointment
        </Button>
      ]}
    >
      {/* Status Filter */}
      <div className="mb-6">
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    statusFilter === option.value
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
                onClick={() => window.location.href = '/patient/dashboard'}
              >
                Book Your First Appointment
              </Button>
            }
          />
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} hover>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={appointment.doctor?.photo_url || '/api/placeholder/48/48'}
                      alt={appointment.doctor?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {appointment.doctor?.name}
                      </h3>
                      <p className="text-gray-600">{appointment.doctor?.specialization}</p>
                    </div>
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Appointment Date</p>
                    <p className="text-gray-900">{formatDate(appointment.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <p className="text-gray-900 capitalize">{appointment.status.toLowerCase()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  {appointment.status === 'PENDING' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelClick(appointment)}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                  
                  {appointment.status === 'COMPLETED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = '/patient/dashboard'}
                    >
                      Book Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
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

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setAppointmentToCancel(null);
        }}
        title="Cancel Appointment"
        size="md"
      >
        {appointmentToCancel && (
          <div className="space-y-6">
            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Confirm Cancellation</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Are you sure you want to cancel this appointment? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Appointment Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Doctor:</span> Dr. {appointmentToCancel.doctor?.name}</p>
                <p><span className="font-medium">Specialization:</span> {appointmentToCancel.doctor?.specialization}</p>
                <p><span className="font-medium">Date:</span> {formatDate(appointmentToCancel.date)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCancelModal(false);
                  setAppointmentToCancel(null);
                }}
                className="flex-1"
              >
                Keep Appointment
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleCancelConfirm}
                loading={cancelAppointmentMutation.isLoading}
                className="flex-1"
              >
                Cancel Appointment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default PatientAppointments;