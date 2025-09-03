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
                <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <img
                                src={doctor.photo_url || '/api/placeholder/60/60'}
                                alt={doctor.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Dr. {doctor.name}</h3>
                                <p className="text-sm sm:text-base text-gray-600 truncate">{doctor.specialization}</p>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">{doctor.email}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Select Appointment Date *</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={minDate}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                        <p className="text-xs text-gray-500 mt-1">You can book appointments for tomorrow and beyond</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>Cancel</Button>
                        <Button type="submit" variant="primary" loading={loading} className="flex-1">Book Appointment</Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default BookingModal;


