import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ isOpen, title = 'Confirm', description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, loading = false }) => {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={title} size="md">
            <div className="space-y-6">
                {description && <p className="text-sm text-gray-700">{description}</p>}
                <div className="flex space-x-3 justify-end">
                    <Button variant="secondary" onClick={onCancel}> {cancelText} </Button>
                    <Button variant="danger" onClick={onConfirm} loading={loading}> {confirmText} </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;


