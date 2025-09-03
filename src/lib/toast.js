let toastId = 0;
const listeners = new Set();

export const subscribeToToasts = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const addToast = (message, type) => {
    const id = ++toastId;
    const newToast = { id, message, type };
    listeners.forEach((listener) => listener((prev) => [...prev, newToast]));
    setTimeout(() => {
        listeners.forEach((listener) =>
            listener((prev) => prev.filter((t) => t.id !== id))
        );
    }, 5000);
};

export const toast = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    info: (message) => addToast(message, 'info'),
    warning: (message) => addToast(message, 'warning'),
};


