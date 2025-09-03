import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Card';
import Button from '../ui/Button';
import { LoadingSpinner, LoadingSkeleton } from '../ui/Loading';
import { EmptyState } from '../layout/EmptyState';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import { toast } from '../../lib/toast';

const DoctorAppointments = () => {
    // State management
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [itemsPerPage] = useState(10);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Confirmation modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [actionType, setActionType] = useState(''); // 'complete' or 'cancel'
    const [updating, setUpdating] = useState(false);

    // API base URL
    const API_BASE_URL = 'https://appointment-manager-node.onrender.com/api/v1';

    // Fetch appointments function
    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage
            };

            if (statusFilter) {
                params.status = statusFilter;
            }

            if (dateFilter) {
                params.date = dateFilter;
            }

            const response = await axios.get(`${API_BASE_URL}/appointments/doctor`, {
                params,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = response.data;
            setAppointments(data.data || []);
            setTotalAppointments(data.total || 0);
            setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));

        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(err.response?.data?.message || 'Failed to fetch appointments');
            toast.error(err.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    // Update appointment status
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        setUpdating(true);

        try {
            await axios.patch(`${API_BASE_URL}/appointments/update-status`, {
                appointment_id: appointmentId,
                status: newStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            toast.success(`Appointment ${newStatus.toLowerCase()} successfully`);

            // Refresh the appointments list
            await fetchAppointments();

        } catch (err) {
            console.error('Error updating appointment status:', err);
            toast.error(err.response?.data?.message || 'Failed to update appointment status');
        } finally {
            setUpdating(false);
            setShowConfirmModal(false);
            setSelectedAppointment(null);
            setActionType('');
        }
    };

    // Handle status update with confirmation
    const handleStatusUpdate = (appointment, action) => {
        setSelectedAppointment(appointment);
        setActionType(action);
        setShowConfirmModal(true);
    };

    // Confirm status update
    const confirmStatusUpdate = async () => {
        if (!selectedAppointment || !actionType) return;

        const newStatus = actionType === 'complete' ? 'COMPLETED' : 'CANCELLED';
        await updateAppointmentStatus(selectedAppointment.id, newStatus);
    };

    // Handle filter changes
    const handleFilterChange = () => {
        setCurrentPage(1); // Reset to first page when filters change
        fetchAppointments();
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format date for input (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    // Get tomorrow's date for date input min
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    // Fetch appointments on component mount and when dependencies change
    useEffect(() => {
        fetchAppointments();
    }, [currentPage]);

    // Status filter options
    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Manage your appointments with patients
                    </p>
                </div>
                <div className="text-sm text-gray-500">
                    Total: {totalAppointments} appointments
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Filter by Status
                            </label>
                            <Select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    handleFilterChange();
                                }}
                                options={statusOptions}
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Filter by Date
                            </label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                    handleFilterChange();
                                }}
                                className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setStatusFilter('');
                                    setDateFilter('');
                                    setCurrentPage(1);
                                    fetchAppointments();
                                }}
                                className="w-full sm:w-auto"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Appointments List */}
            <div className="space-y-4">
                {loading ? (
                    // Loading state
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Card key={index}>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center space-x-4">
                                        <LoadingSkeleton width="48px" height="48px" className="rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <LoadingSkeleton width="200px" height="20px" />
                                            <LoadingSkeleton width="150px" height="16px" />
                                            <LoadingSkeleton width="100px" height="16px" />
                                        </div>
                                        <LoadingSkeleton width="80px" height="24px" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : error ? (
                    // Error state
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-red-600 mb-4">
                                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm sm:text-base">{error}</p>
                            </div>
                            <Button variant="primary" onClick={fetchAppointments}>
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                ) : appointments.length === 0 ? (
                    // Empty state
                    <EmptyState
                        icon="📅"
                        title="No appointments found"
                        description={
                            statusFilter || dateFilter
                                ? "No appointments match your current filters. Try adjusting your search criteria."
                                : "You don't have any appointments yet."
                        }
                        action={
                            (statusFilter || dateFilter) && (
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setStatusFilter('');
                                        setDateFilter('');
                                        setCurrentPage(1);
                                        fetchAppointments();
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )
                        }
                    />
                ) : (
                    // Appointments list
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <Card key={appointment.id} hover>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        {/* Patient Info */}
                                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                                            <img
                                                src={appointment.patient?.photo_url || '/api/placeholder/48/48'}
                                                alt={appointment.patient?.name || 'Patient'}
                                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
                                                onError={(e) => {
                                                    e.target.src = '/api/placeholder/48/48';
                                                }}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">
                                                    {appointment.patient?.name || 'Unknown Patient'}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                    {appointment.patient?.email || 'No email provided'}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                    {formatDate(appointment.date)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status and Actions */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                            <StatusBadge status={appointment.status} />

                                            {appointment.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(appointment, 'complete')}
                                                        disabled={updating}
                                                        className="text-xs sm:text-sm"
                                                    >
                                                        ✅ Complete
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(appointment, 'cancel')}
                                                        disabled={updating}
                                                        className="text-xs sm:text-sm"
                                                    >
                                                        ❌ Cancel
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Previous Button */}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                        >
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">Prev</span>
                        </Button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                disabled={loading}
                                className="min-w-[40px]"
                            >
                                {page}
                            </Button>
                        ))}

                        {/* Next Button */}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || loading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedAppointment(null);
                    setActionType('');
                }}
                title={`${actionType === 'complete' ? 'Complete' : 'Cancel'} Appointment`}
                size="md"
            >
                <div className="space-y-4">
                    {selectedAppointment && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={selectedAppointment.patient?.photo_url || '/api/placeholder/48/48'}
                                    alt={selectedAppointment.patient?.name || 'Patient'}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {selectedAppointment.patient?.name || 'Unknown Patient'}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(selectedAppointment.date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="text-sm text-gray-700">
                        Are you sure you want to {actionType === 'complete' ? 'mark this appointment as completed' : 'cancel this appointment'}?
                        {actionType === 'cancel' && (
                            <span className="block mt-1 text-red-600 font-medium">
                                This action cannot be undone.
                            </span>
                        )}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowConfirmModal(false);
                                setSelectedAppointment(null);
                                setActionType('');
                            }}
                            className="flex-1"
                            disabled={updating}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={actionType === 'complete' ? 'success' : 'danger'}
                            onClick={confirmStatusUpdate}
                            loading={updating}
                            className="flex-1"
                        >
                            {updating ? 'Processing...' : `${actionType === 'complete' ? 'Complete' : 'Cancel'} Appointment`}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DoctorAppointments;
