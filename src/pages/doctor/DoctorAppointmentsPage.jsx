import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DoctorAppointments from '../../components/doctor/DoctorAppointments';

const DoctorAppointmentsPage = () => {
    return (
        <DashboardLayout>
            <DoctorAppointments />
        </DashboardLayout>
    );
};

export default DoctorAppointmentsPage;
