import React from 'react';
import DoctorAppointments from './DoctorAppointments';

// Demo component to test the DoctorAppointments functionality
// This can be used for testing without authentication
const DoctorAppointmentsDemo = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Doctor Appointments Demo</h1>
                    <p className="text-gray-600 mt-2">
                        This is a demo of the Doctor Appointments component.
                        Make sure you have a valid token in localStorage for API calls.
                    </p>
                </div>
                <DoctorAppointments />
            </div>
        </div>
    );
};

export default DoctorAppointmentsDemo;
