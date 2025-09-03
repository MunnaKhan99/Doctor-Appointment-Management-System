import React, { useState } from 'react';
import ConfirmDialog from '../ui/ConfirmDialog';

const AppointmentStatusManager = ({ onConfirm, loading }) => {
    const [pending, setPending] = useState(null); // { action, appointment }

    const request = (action, appointment) => setPending({ action, appointment });
    const close = () => setPending(null);
    const confirm = () => {
        if (!pending) return;
        onConfirm(pending.action, pending.appointment);
        setPending(null);
    };

    return {
        request,
        dialog: (
            <ConfirmDialog
                isOpen={!!pending}
                title={pending?.action === 'COMPLETE' ? 'Mark as Completed' : 'Cancel Appointment'}
                description={`Are you sure you want to ${pending?.action === 'COMPLETE' ? 'mark this appointment as completed' : 'cancel this appointment'}?`}
                confirmText={pending?.action === 'COMPLETE' ? 'Mark Completed' : 'Cancel Appointment'}
                onConfirm={confirm}
                onCancel={close}
                loading={loading}
            />
        )
    };
};

export default AppointmentStatusManager;


