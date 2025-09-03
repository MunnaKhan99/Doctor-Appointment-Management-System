# Doctor Appointments Component

A comprehensive React component for managing doctor appointments with full CRUD operations and filtering capabilities.

## Features

### 📋 **Appointment Management**
- View paginated list of appointments
- Filter by status (Pending, Completed, Cancelled)
- Filter by date
- Update appointment status with confirmation dialogs

### 🔍 **Filtering & Search**
- Status filter dropdown
- Date picker for specific date filtering
- Clear filters functionality
- Real-time filter application

### 📄 **Pagination**
- Previous/Next navigation
- Page number buttons
- Configurable items per page (default: 10)
- Total count display

### 🎯 **Status Updates**
- Mark appointments as "Completed"
- Cancel appointments
- Confirmation dialogs before actions
- Real-time UI updates after status changes

### 📱 **Responsive Design**
- Mobile-first approach
- Responsive cards and layouts
- Touch-friendly buttons and interactions
- Optimized for all screen sizes

### 🔄 **State Management**
- Loading states with skeleton loaders
- Error handling with retry functionality
- Empty states with helpful messages
- Optimistic UI updates

## API Integration

### Endpoints Used
- `GET /appointments/doctor` - Fetch paginated appointments
- `PATCH /appointments/update-status` - Update appointment status

### Authentication
- Uses Bearer token from localStorage
- Automatic token inclusion in requests

## Usage

```jsx
import DoctorAppointments from './components/doctor/DoctorAppointments';

function DoctorDashboard() {
  return (
    <div>
      <DoctorAppointments />
    </div>
  );
}
```

## Props

The component doesn't require any props - it's self-contained and manages its own state.

## Dependencies

- React (hooks: useState, useEffect)
- Axios for API calls
- Custom UI components (Button, Card, Modal, etc.)
- Toast notifications for user feedback

## Error Handling

- Network errors with retry functionality
- API error messages display
- Graceful fallbacks for missing data
- Loading states during API calls

## Mobile Responsiveness

- Responsive grid layouts
- Mobile-optimized buttons and inputs
- Touch-friendly interactions
- Adaptive text sizes and spacing

## Testing

Use the `DoctorAppointmentsDemo` component for testing without authentication:

```jsx
import DoctorAppointmentsDemo from './components/doctor/DoctorAppointmentsDemo';
```
