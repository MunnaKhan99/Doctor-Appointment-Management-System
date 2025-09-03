import React from 'react';
import DoctorAppointmentCard from './DoctorAppointmentCard';

const DoctorAppointmentsList = ({ appointments, onComplete, onCancel, updatingId }) => {
    return (
        <div className="space-y-4">
            {appointments.map((a) => (
                <DoctorAppointmentCard
                    key={a.id}
                    appointment={a}
                    onComplete={onComplete}
                    onCancel={onCancel}
                    updating={updatingId === a.id}
                />
            ))}
        </div>
    );
};

export default DoctorAppointmentsList;


