import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema } from '../../utils/schema';
import api from '../../services/api';
import useAuthStore from '../stores/useAuthStore';
import { formatDateTime } from '../../utils/dataUtils';
import ErrorMessage from '../Common/ErrorMessage';
import { useQueryClient } from '@tanstack/react-query';

const AppointmentForm = ({ doctor, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(appointmentSchema),
  });
  const { token } = useAuthStore();
  const [serverError, setServerError] = useState('');
  const queryClient = useQueryClient();

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const formattedDate = formatDateTime(new Date(data.date), data.time);
      const payload = { doctorId: doctor.id, date: formattedDate };
      console.log('Booking appointment with payload:', payload);
      await api.createAppointment(payload, token);
      queryClient.invalidateQueries('patientAppointments');
      alert('Appointment booked successfully!');
      onSuccess();
    } catch (err) {
      setServerError(err.message || 'Failed to book appointment');
      console.error('Booking error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Book Appointment with Dr. {doctor.name}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="date"
              {...register('date')}
              className={`w-full p-2 border rounded-lg focus:ring-2 ${errors.date ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
            />
            <ErrorMessage message={errors.date?.message} />
          </div>
          <div>
            <input
              type="time"
              {...register('time')}
              className={`w-full p-2 border rounded-lg focus:ring-2 ${errors.time ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
            />
            <ErrorMessage message={errors.time?.message} />
          </div>
          <ErrorMessage message={serverError} />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Booking...' : 'Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;