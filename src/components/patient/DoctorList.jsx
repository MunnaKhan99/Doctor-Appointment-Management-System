import React from 'react';
import DoctorCard from './DoctorCard';
import { Grid } from '../layout/Grid';
import { LoadingCard } from '../ui/Loading';
import { EmptyState } from '../layout/EmptyState';
import Button from '../ui/Button';
import { useDoctorsStore } from '../../store/doctorsStore';

const DoctorList = ({ isLoading, error, onRetry, onBook }) => {
    const { doctors } = useDoctorsStore();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 mb-4">Failed to load doctors. Please try again.</p>
                <Button variant="primary" onClick={onRetry}>Retry</Button>
            </div>
        );
    }

    if (!doctors.length) {
        return (
            <EmptyState
                icon="👨‍⚕️"
                title="No doctors found"
                description="Try adjusting your search criteria or filters"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {doctors.map((doctor, index) => (
                <DoctorCard key={doctor.id || `doctor-${index}`} doctor={doctor} onBook={onBook} />
            ))}
        </div>
    );
};

export default DoctorList;


