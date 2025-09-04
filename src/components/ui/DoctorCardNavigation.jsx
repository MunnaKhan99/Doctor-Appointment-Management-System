// import React from 'react';
// import Button from './Button';

// const DoctorCardNavigation = ({
//     currentIndex,
//     totalDoctors,
//     onPrevious,
//     onNext,
//     onBook,
//     selectedDoctor,
//     isVisible = true
// }) => {
//     if (!isVisible || totalDoctors === 0) return null;

//     const canGoPrevious = currentIndex > 0;
//     const canGoNext = currentIndex < totalDoctors - 1;

//     return (
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
//             {/* Main Navigation Row */}
//             <div className="flex items-center justify-between px-4 py-3">
//                 {/* Previous Button */}
//                 <Button
//                     onClick={onPrevious}
//                     disabled={!canGoPrevious}
//                     variant="outline"
//                     className="flex items-center gap-2 min-h-11 px-3"
//                     aria-label="Previous doctor"
//                 >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                     </svg>
//                     <span className="hidden sm:inline">Prev</span>
//                 </Button>

//                 {/* Doctor Counter */}
//                 <div className="flex-1 text-center px-4">
//                     <div className="text-sm font-medium text-gray-900">
//                         {currentIndex + 1} of {totalDoctors}
//                     </div>
//                     {selectedDoctor && (
//                         <div className="text-xs text-gray-500 truncate max-w-32 mx-auto">
//                             {selectedDoctor.name}
//                         </div>
//                     )}
//                 </div>

//                 {/* Next Button */}
//                 <Button
//                     onClick={onNext}
//                     disabled={!canGoNext}
//                     variant="outline"
//                     className="flex items-center gap-2 min-h-11 px-3"
//                     aria-label="Next doctor"
//                 >
//                     <span className="hidden sm:inline">Next</span>
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                     </svg>
//                 </Button>
//             </div>

//             {/* Quick Actions Row */}
//             <div className="flex items-center justify-center gap-2 px-4 pb-3">
//                 <Button
//                     onClick={() => onBook(selectedDoctor)}
//                     variant="primary"
//                     className="flex-1 min-h-11 text-sm font-medium"
//                     disabled={!selectedDoctor}
//                 >
//                     Book Appointment
//                 </Button>
//             </div>

//             {/* Navigation Dots (Mobile) */}
//             <div className="flex justify-center gap-1 px-4 pb-2 sm:hidden">
//                 {Array.from({ length: Math.min(totalDoctors, 5) }, (_, i) => {
//                     const dotIndex = Math.floor((currentIndex / totalDoctors) * 5);
//                     return (
//                         <div
//                             key={i}
//                             className={`w-2 h-2 rounded-full transition-colors ${i === dotIndex ? 'bg-blue-500' : 'bg-gray-300'
//                                 }`}
//                         />
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default DoctorCardNavigation;
