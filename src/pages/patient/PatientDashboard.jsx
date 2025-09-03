
// 1. Patient Dashboard - pages/patient/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SearchFilterBar from '../../components/layout/SearchFilterBar';
import { Grid } from '../../components/layout/Grid';
import { DoctorCard } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingCard } from '../../components/ui/Loading';
import { EmptyState } from '../../components/layout/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import api from '../../lib/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

const PatientDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const queryClient = useQueryClient();
  const limit = 6; // 6 doctors per page

  // Fetch Specializations with proper error handling
  const { data: specializationsData, error: specializationsError } = useQuery({
    queryKey: ['specializations'],
    queryFn: async () => {
      try {
        const response = await api.get('/specializations');
        return response.data;
      } catch (error) {
        console.error('Specializations fetch error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch specializations:', error);
    }
  });

  // Safe specializations array with proper data structure handling
  const specializations = React.useMemo(() => {
    if (!specializationsData) return [];
    
    // Handle different API response structures
    if (Array.isArray(specializationsData)) {
      return specializationsData;
    } else if (specializationsData.data && Array.isArray(specializationsData.data)) {
      return specializationsData.data;
    } else if (specializationsData.specializations && Array.isArray(specializationsData.specializations)) {
      return specializationsData.specializations;
    }
    
    console.warn('Unexpected specializations data structure:', specializationsData);
    return [];
  }, [specializationsData]);

  // Fetch Doctors with pagination and filters
  const { 
    data: doctorsData, 
    isLoading: doctorsLoading, 
    error: doctorsError 
  } = useQuery({
    queryKey: ['doctors', currentPage, searchQuery, selectedSpecialization],
    queryFn: async () => {
      try {
        const params = {
          page: currentPage,
          limit,
          ...(searchQuery && { search: searchQuery }),
          ...(selectedSpecialization && { specialization: selectedSpecialization })
        };
        
        const response = await api.get('/doctors', { params });
        return response.data;
      } catch (error) {
        console.error('Doctors fetch error:', error);
        throw error;
      }
    },
    keepPreviousData: true,
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch doctors:', error);
      toast.error('Failed to load doctors. Please try again.');
    }
  });

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

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedSpecialization]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    if (filterName === 'specialization') {
      setSelectedSpecialization(value);
      setCurrentPage(1);
    }
  };

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
        doctorId: selectedDoctor.id,
        date: selectedDate
      });
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  // Get tomorrow's date as minimum selectable date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Safe doctors array handling
  const doctors = React.useMemo(() => {
    if (!doctorsData) return [];
    
    if (Array.isArray(doctorsData)) {
      return doctorsData;
    } else if (doctorsData.data && Array.isArray(doctorsData.data)) {
      return doctorsData.data;
    } else if (doctorsData.doctors && Array.isArray(doctorsData.doctors)) {
      return doctorsData.doctors;
    }
    
    console.warn('Unexpected doctors data structure:', doctorsData);
    return [];
  }, [doctorsData]);

  const totalPages = Math.ceil((doctorsData?.total || doctorsData?.pagination?.total || doctors.length || 0) / limit);

  // Prepare filter options with safe array handling
  const filterOptions = React.useMemo(() => [
    {
      name: 'specialization',
      label: 'Specialization',
      value: selectedSpecialization,
      options: [
        { value: '', label: 'All Specializations' },
        ...specializations.map(spec => {
          // Handle both string and object formats
          if (typeof spec === 'string') {
            return { value: spec, label: spec };
          } else if (spec && typeof spec === 'object') {
            return { 
              value: spec.name || spec.value || spec.specialization, 
              label: spec.label || spec.name || spec.specialization 
            };
          }
          return { value: '', label: 'Unknown' };
        }).filter(option => option.value) // Remove invalid options
      ]
    }
  ], [specializations, selectedSpecialization]);

  // Show specializations error if needed
  useEffect(() => {
    if (specializationsError) {
      console.error('Specializations error:', specializationsError);
      // Don't show toast error for specializations as it's not critical
    }
  }, [specializationsError]);

  return (
    <DashboardLayout
      title="Find Doctors"
      subtitle="Search and book appointments with qualified doctors"
    >
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p>Debug: Specializations count: {specializations.length}</p>
          <p>Debug: Doctors count: {doctors.length}</p>
        </div>
      )}

      {/* Search and Filter Bar */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search doctors by name..."
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        className="mb-6"
      />

      {/* Doctors Grid */}
      <div className="space-y-6">
        {doctorsLoading ? (
          <Grid cols={3} gap={6}>
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </Grid>
        ) : doctorsError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">Failed to load doctors. Please try again.</p>
            <Button 
              variant="primary" 
              onClick={() => {
                queryClient.invalidateQueries(['doctors']);
                queryClient.invalidateQueries(['specializations']);
              }}
            >
              Retry
            </Button>
          </div>
        ) : doctors.length === 0 ? (
          <EmptyState
            icon="👨‍⚕️"
            title="No doctors found"
            description={
              searchQuery || selectedSpecialization
                ? "Try adjusting your search criteria or filters"
                : "No doctors are available at the moment"
            }
            action={
              (searchQuery || selectedSpecialization) && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialization('');
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              )
            }
          />
        ) : (
          <Grid cols={3} gap={6}>
            {doctors.map((doctor, index) => (
              <DoctorCard
                key={doctor.id || `doctor-${index}`}
                doctor={doctor}
                onBookAppointment={handleBookAppointment}
              />
            ))}
          </Grid>
        )}

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
      </div>

      {/* Appointment Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedDoctor(null);
          setSelectedDate('');
        }}
        title="Book Appointment"
        size="md"
      >
        {selectedDoctor && (
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            {/* Doctor Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedDoctor.photo_url || '/api/placeholder/60/60'}
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/60/60';
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dr. {selectedDoctor.name}
                  </h3>
                  <p className="text-gray-600">{selectedDoctor.specialization}</p>
                  <p className="text-sm text-gray-500">{selectedDoctor.email}</p>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Appointment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getTomorrowDate()}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can book appointments for tomorrow and beyond
              </p>
            </div>

            {/* Booking Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Important Note</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your appointment will be pending until confirmed by the doctor. 
                    You'll receive a notification once it's confirmed.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedDoctor(null);
                  setSelectedDate('');
                }}
                className="flex-1"
                disabled={bookingLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={bookingLoading || bookAppointmentMutation.isLoading}
                className="flex-1"
              >
                Book Appointment
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default PatientDashboard;