import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Card';
import Button from '../ui/Button';

const DoctorAppointmentCard = ({ appointment, onComplete, onCancel, updating = false }) => {
    const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <Card hover>
            <CardContent>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <img
                            src={appointment.patient?.photo_url || '/api/placeholder/48/48'}
                            alt={appointment.patient?.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{appointment.patient?.name}</h3>
                            {appointment.patient?.email && (
                                <p className="text-gray-600">{appointment.patient.email}</p>
                            )}
                        </div>
                    </div>
                    <StatusBadge status={appointment.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Appointment</p>
                        <p className="text-gray-900">{formatDate(appointment.date)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">Status</p>
                        <p className="text-gray-900 capitalize">{appointment.status?.toLowerCase()}</p>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    {appointment.status === 'PENDING' && (
                        <>
                            <Button variant="danger" size="sm" onClick={() => onCancel(appointment)} disabled={updating}>Cancel</Button>
                            <Button variant="primary" size="sm" onClick={() => onComplete(appointment)} disabled={updating}>Mark Completed</Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default DoctorAppointmentCard;


