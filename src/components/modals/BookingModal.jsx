import React, { useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const BookingModal = ({ isOpen, doctor, selectedDate, setSelectedDate, onClose, onSubmit, loading }) => {
    const minDate = useMemo(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Book Appointment" size="md">
            {doctor && (
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                            <img
                                src={doctor.photo_url || '/api/placeholder/60/60'}
                                alt={doctor.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Dr. {doctor.name}</h3>
                                <p className="text-gray-600">{doctor.specialization}</p>
                                <p className="text-sm text-gray-500">{doctor.email}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Appointment Date *</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={minDate}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">You can book appointments for tomorrow and beyond</p>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>Cancel</Button>
                        <Button type="submit" variant="primary" loading={loading} className="flex-1">Book Appointment</Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default BookingModal;


