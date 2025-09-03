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
            <CardContent>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <img
                            src={appointment.doctor?.photo_url || '/api/placeholder/48/48'}
                            alt={appointment.doctor?.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Dr. {appointment.doctor?.name}</h3>
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
                        <p className="text-gray-900 capitalize">{appointment.status?.toLowerCase()}</p>
                    </div>
                </div>
                <div className="flex justify-end">
                    {appointment.status === 'PENDING' && (
                        <Button variant="danger" size="sm" onClick={() => onCancel(appointment)}>
                            Cancel Appointment
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AppointmentCard;


