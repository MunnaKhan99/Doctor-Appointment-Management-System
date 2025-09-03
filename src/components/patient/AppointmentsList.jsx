import React from 'react';
import AppointmentCard from './AppointmentCard';

const AppointmentsList = ({ appointments, onCancel }) => {
    return (
        <div className="space-y-4">
            {appointments.map((a) => (
                <AppointmentCard key={a.id} appointment={a} onCancel={onCancel} />
            ))}
        </div>
    );
};

export default AppointmentsList;


