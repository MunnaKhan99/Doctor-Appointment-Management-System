import React from 'react';
import { DoctorCard as UIDoctorCard } from '../ui/Card';

const DoctorCard = ({ doctor, onBook }) => {
    return <UIDoctorCard doctor={doctor} onBookAppointment={onBook} />;
};

export default DoctorCard;


