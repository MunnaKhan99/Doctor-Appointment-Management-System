// import React, { useState, useRef, useEffect } from 'react';
// import DoctorCard from '../patient/DoctorCard';
// import DoctorCardNavigation from './DoctorCardNavigation';

// const SwipeableDoctorCards = ({
//     doctors,
//     onBook,
//     currentPage,
//     onPageChange,
//     className = ""
// }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [startX, setStartX] = useState(0);
//     const [isDragging, setIsDragging] = useState(false);
//     const containerRef = useRef(null);

//     // Reset current index when page changes
//     useEffect(() => {
//         setCurrentIndex(0);
//     }, [currentPage]);

//     const handleTouchStart = (e) => {
//         setStartX(e.touches[0].clientX);
//         setIsDragging(true);
//     };

//     const handleTouchMove = (e) => {
//         if (!isDragging) return;
//         e.preventDefault();
//     };

//     const handleTouchEnd = (e) => {
//         if (!isDragging) return;

//         const endX = e.changedTouches[0].clientX;
//         const diffX = startX - endX;
//         const threshold = 50;

//         if (Math.abs(diffX) > threshold) {
//             if (diffX > 0 && currentIndex < doctors.length - 1) {
//                 // Swipe left - next doctor
//                 setCurrentIndex(prev => prev + 1);
//             } else if (diffX < 0 && currentIndex > 0) {
//                 // Swipe right - previous doctor
//                 setCurrentIndex(prev => prev - 1);
//             }
//         }

//         setIsDragging(false);
//     };

//     const handlePrevious = () => {
//         if (currentIndex > 0) {
//             setCurrentIndex(prev => prev - 1);
//         }
//     };

//     const handleNext = () => {
//         if (currentIndex < doctors.length - 1) {
//             setCurrentIndex(prev => prev + 1);
//         } else if (currentPage < Math.ceil(doctors.length / 6)) {
//             // Load next page if available
//             onPageChange(currentPage + 1);
//         }
//     };

//     const currentDoctor = doctors[currentIndex];

//     return (
//         <div className={`relative ${className}`}>
//             {/* Swipeable Container */}
//             <div
//                 ref={containerRef}
//                 className="overflow-hidden"
//                 onTouchStart={handleTouchStart}
//                 onTouchMove={handleTouchMove}
//                 onTouchEnd={handleTouchEnd}
//             >
//                 {/* Current Doctor Card */}
//                 <div className="transition-transform duration-300 ease-in-out">
//                     {currentDoctor && (
//                         <DoctorCard
//                             doctor={currentDoctor}
//                             onBook={onBook}
//                             className="mx-auto max-w-sm"
//                         />
//                     )}
//                 </div>
//             </div>

//             {/* Bottom Navigation */}
//             <DoctorCardNavigation
//                 currentIndex={currentIndex}
//                 totalDoctors={doctors.length}
//                 onPrevious={handlePrevious}
//                 onNext={handleNext}
//                 onBook={onBook}
//                 selectedDoctor={currentDoctor}
//                 isVisible={doctors.length > 0}
//             />
//         </div>
//     );
// };

// export default SwipeableDoctorCards;
