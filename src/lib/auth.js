// src/lib/auth.js
export const AUTH_ROLES = {
    PATIENT: 'PATIENT',
    DOCTOR: 'DOCTOR'
};

export const ROUTES_BY_ROLE = {
    PATIENT: '/patient/dashboard',
    DOCTOR: '/doctor/dashboard'
};

export const isRoleValid = (role) => {
    return role === AUTH_ROLES.PATIENT || role === AUTH_ROLES.DOCTOR;
};

export const getPostLoginRedirect = (role) => {
    return ROUTES_BY_ROLE[role] || '/login';
};

export const saveToken = (token) => {
    try {
        if (token) localStorage.setItem('token', token);
    } catch {
        // ignore storage errors
    }
};

export const clearToken = () => {
    try {
        localStorage.removeItem('token');
    } catch {
        // ignore storage errors
    }
};


