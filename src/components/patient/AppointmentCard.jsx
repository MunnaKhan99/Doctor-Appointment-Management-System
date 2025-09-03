import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Card';
import Button from '../ui/Button';

const AppointmentCard = ({ appointment, onCancel }) => {
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <Card hover>
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <img
                            src={appointment.doctor?.photo_url || '/api/placeholder/48/48'}
                            alt={appointment.doctor?.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">Dr. {appointment.doctor?.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{appointment.doctor?.specialization}</p>
                        </div>
                    </div>
                    <StatusBadge status={appointment.status} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700">Appointment Date</p>
                        <p className="text-sm sm:text-base text-gray-900">{formatDate(appointment.date)}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700">Status</p>
                        <p className="text-sm sm:text-base text-gray-900 capitalize">{appointment.status?.toLowerCase()}</p>
                    </div>
                </div>
                <div className="flex justify-end">
                    {appointment.status === 'PENDING' && (
                        <Button variant="danger" size="sm" onClick={() => onCancel(appointment)} className="text-xs sm:text-sm">
                            Cancel Appointment
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AppointmentCard;


