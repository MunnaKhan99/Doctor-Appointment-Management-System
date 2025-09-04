import { useState } from 'react';
import { usePatientAppointments } from '../../hooks/useAppointments';
import Pagination from '../Common/Pagination';
import ConfirmationDialog from '../Common/ConfirmationDialog';
import api from '../../services/api';
import useAuthStore from '../stores/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

const MyAppointments = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = usePatientAppointments({ status, page });

  const handleCancel = async () => {
    try {
      await api.cancelAppointment(selectedAppointment, token);
      queryClient.invalidateQueries('patientAppointments');
      setDialogOpen(false);
    } catch (err) {
      console.error('Error canceling appointment:', err);
    }
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">Failed to load appointments: {error.message}</p>;

  const appointments = data?.appointments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Appointments</h2>
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      {appointments.length === 0 ? (
        <p className="text-center">No appointments found</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Dr. {appt.doctor.name}</h3>
                <p className="text-gray-600">Date: {new Date(appt.date).toLocaleString()}</p>
                <p className="text-gray-600">Status: {appt.status}</p>
              </div>
              {appt.status === 'Pending' && (
                <button
                  onClick={() => {
                    setSelectedAppointment(appt.id);
                    setDialogOpen(true);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleCancel}
        message="Are you sure you want to cancel this appointment?"
      />
    </div>
  );
};

export default MyAppointments;