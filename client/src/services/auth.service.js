// Auth API service
// TODO: signup, login, getMe, updateProfile, changePassword

import api from './api';


// ================= SIGNUP =================
export const signup = async (userData) => {

    const response = await api.post(
        '/auth/signup',
        userData
    );

    return response.data;
};


// ================= LOGIN =================
export const login = async (userData) => {

    const response = await api.post(
        '/auth/login',
        userData
    );

    return response.data;
};


// ================= GET LOGGED-IN USER =================
export const getMe = async () => {

    const response = await api.get(
        '/auth/me'
    );

    return response.data;
};


// ================= UPDATE PROFILE =================
export const updateProfile = async (userData) => {

    const response = await api.put(
        '/auth/profile',
        userData
    );

    return response.data;
};


// ================= CHANGE PASSWORD =================
export const changePassword = async (passwordData) => {

    const response = await api.put(
        '/auth/change-password',
        passwordData
    );

    return response.data;
};