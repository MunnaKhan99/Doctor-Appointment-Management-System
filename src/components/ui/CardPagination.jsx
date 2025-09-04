import React from 'react';
import Button from './Button';

const CardPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems = 0,
    itemsPerPage = 4,
    className = ''
}) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={`bg-white border-t border-gray-200 shadow-lg ${className}`}>
            {/* Page Info */}
            <div className="flex items-center justify-center py-3 px-4">
                <span className="text-sm text-gray-600">
                    Showing {startItem}-{endItem} of {totalItems} doctors
                </span>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between px-4 pb-4">
                {/* Previous Button */}
                <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="flex items-center gap-2 min-h-11 px-3 sm:px-4"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* Page Indicator */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>

                {/* Next Button */}
                <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="flex items-center gap-2 min-h-11 px-3 sm:px-4"
                >
                    <span className="hidden sm:inline">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </Button>
            </div>

            {/* Page Dots (Mobile) */}
            <div className="flex justify-center gap-1 px-4 pb-3 sm:hidden">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const dotIndex = Math.floor((currentPage / totalPages) * 5);
                    return (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${i === dotIndex ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CardPagination;
