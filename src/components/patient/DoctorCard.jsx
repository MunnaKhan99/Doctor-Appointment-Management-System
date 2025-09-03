import React from 'react';
import Button from '../ui/Button';

const DoctorCard = ({ doctor, onBook }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
            {/* Top half: Large image (clickable for navigation) */}
            <button
                type="button"
                onClick={() => onBook(doctor)}
                className="relative w-full flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`Open booking for ${doctor.name}`}
            >
                <img
                    src={doctor.photo_url || '/api/placeholder/600/400'}
                    alt={doctor.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    style={{ minHeight: 160 }}
                    onError={(e) => { e.currentTarget.src = '/api/placeholder/600/400'; }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </button>

            {/* Bottom half: Details */}
            <div className="flex-1 p-4 flex flex-col">
                <button
                    type="button"
                    onClick={() => onBook(doctor)}
                    className="text-left space-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                    aria-label={`Open booking for ${doctor.name}`}
                >
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{doctor.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{doctor.specialization}</p>
                </button>

                {/* Meta: rating and experience */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-700">
                        <span aria-hidden>⭐</span>
                        <span>{doctor.rating || '4.8'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700 justify-end">
                        <span aria-hidden>🗓️</span>
                        <span>{doctor.experience_years || '5+'} yrs</span>
                    </div>
                </div>

                {/* Book button at bottom */}
                <div className="mt-4">
                    <Button
                        onClick={() => onBook(doctor)}
                        variant="primary"
                        className="w-full min-h-11 text-sm sm:text-base"
                    >
                        Book Appointment
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;


