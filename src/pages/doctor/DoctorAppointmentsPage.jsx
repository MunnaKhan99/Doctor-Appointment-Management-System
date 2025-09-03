import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DoctorAppointments from '../../components/doctor/DoctorAppointments';

const DoctorAppointmentsPage = () => {
    return (
        <DashboardLayout
            title="Appointment Management"
            subtitle="View and manage your patient appointments"
        >
            <DoctorAppointments />
        </DashboardLayout>
    );
};

export default DoctorAppointmentsPage;
