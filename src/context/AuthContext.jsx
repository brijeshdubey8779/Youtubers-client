import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload, isAuthenticated: !!action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false, error: null };
        default:
            return state;
    }
};

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check if user is already logged in on app start
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await authAPI.getProfile();
                    dispatch({ type: 'SET_USER', payload: response.data });
                } catch (error) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
            }
            dispatch({ type: 'SET_LOADING', payload: false });
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });

        try {
            const response = await authAPI.login(credentials);
            const { user, access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            dispatch({ type: 'SET_USER', payload: user });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            return { success: false, error: errorMessage };
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });

        try {
            const response = await authAPI.register(userData);
            const { user, access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            dispatch({ type: 'SET_USER', payload: user });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Registration failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            return { success: false, error: errorMessage };
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        dispatch({ type: 'LOGOUT' });
    };

    const value = {
        ...state,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 