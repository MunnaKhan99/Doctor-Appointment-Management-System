
// 1. Patient Dashboard - pages/patient/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pagination } from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { toast } from '../../lib/toast';
import api from '../../lib/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingModal from '../../components/modals/BookingModal';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import DoctorList from '../../components/patient/DoctorList';
import { useDoctorsStore } from '../../store/doctorsStore';
import { useDoctors } from '../../hooks/useDoctors';

const PatientDashboard = () => {
  const { page, limit: storeLimit, search, specialization, specializations, setPage, setSearch, setSpecialization } = useDoctorsStore();
  const [currentPage, setCurrentPage] = useState(page);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const queryClient = useQueryClient();
  const limit = storeLimit || 6; // default to 6 if store not set

  // Fetch doctors and specializations via centralized hook/store
  const { error: doctorsError, refetch } = useDoctors();

  // track current page in local state but reflect to store for hook
  useEffect(() => { setPage(currentPage); }, [currentPage, setPage]);

  // Book Appointment Mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (appointmentData) => {
      try {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
      } catch (error) {
        console.error('Booking appointment error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Appointment booked successfully!');
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setSelectedDate('');
      // Optionally refresh appointments data
      queryClient.invalidateQueries(['patient-appointments']);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to book appointment';
      toast.error(errorMessage);
      console.error('Appointment booking failed:', error);
    },
  });

  // Debounce search and specialization changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, specialization, setPage]);

  // handled inline in Select onChange

  // Handle book appointment
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  // Handle appointment booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    // Check if date is in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    const appointmentDate = new Date(selectedDate);

    if (appointmentDate <= today) {
      toast.error('Please select a future date');
      return;
    }

    setBookingLoading(true);

    try {
      await bookAppointmentMutation.mutateAsync({
        doctorId: selectedDoctor.id || selectedDoctor._id,
        date: selectedDate
      });
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  // getTomorrowDate was used in inline input previously; BookingModal now handles min date.

  // derive totalPages from store-managed total via hook: recompute via query invalidations
  // We rely on DoctorList's data from store; compute total from store via useDoctorsStore if needed
  const { doctors, total } = useDoctorsStore.getState();
  const totalPages = Math.ceil((total || doctors.length || 0) / limit);

  // Legacy filter options and error handling removed in favor of store-driven UI

  return (
    <DashboardLayout
      title="Find Doctors"
      subtitle="Search and book appointments with qualified doctors"
    >
      {/* Debug info - remove in production */}
      {/* Debug panel disabled in production build */}

      {/* Search and Filter Bar (refactored) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search doctors by name..." />
        </div>
        <Select
          label="Specialization"
          value={specialization}
          onChange={(e) => { setSpecialization(e.target.value); setCurrentPage(1); }}
          options={[{ value: '', label: 'All Specializations' }, ...specializations.map((s) => (
            typeof s === 'string' ? { value: s, label: s } : { value: s?.name || s?.value || s?.specialization, label: s?.label || s?.name || s?.specialization }
          )).filter((o) => o.value)]}
        />
      </div>

      {/* Doctors Grid */}
      <div className="space-y-6">
        <DoctorList
          isLoading={useDoctorsStore.getState().loading}
          error={doctorsError}
          onRetry={() => refetch()}
          onBook={handleBookAppointment}
        />
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* Appointment Booking Modal (refactored) */}
      <BookingModal
        isOpen={showBookingModal}
        doctor={selectedDoctor}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedDoctor(null);
          setSelectedDate('');
        }}
        onSubmit={handleBookingSubmit}
        loading={bookingLoading || bookAppointmentMutation.isLoading}
      />
    </DashboardLayout>
  );
};

export default PatientDashboard;