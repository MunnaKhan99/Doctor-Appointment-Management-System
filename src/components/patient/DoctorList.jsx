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
            <Grid cols={3} gap={6}>
                {Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)}
            </Grid>
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
        <Grid cols={3} gap={6}>
            {doctors.map((doctor, index) => (
                <DoctorCard key={doctor.id || `doctor-${index}`} doctor={doctor} onBook={onBook} />
            ))}
        </Grid>
    );
};

export default DoctorList;


