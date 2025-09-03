// src/lib/utils.js
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidUrl = (value) => {
    if (!value) return true;
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

export const classNames = (...args) => args.filter(Boolean).join(' ');


