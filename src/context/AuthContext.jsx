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
            const userType = localStorage.getItem('user_type');

            console.log('🔍 AuthContext: Initial auth check');
            console.log('- Token:', token ? token.substring(0, 10) + '...' : 'None');
            console.log('- User Type:', userType);

            if (token) {
                try {
                    // Check if user is a creator first
                    if (userType === 'creator') {
                        console.log('🎬 AuthContext: Loading creator profile');
                        const creatorUser = localStorage.getItem('creator_user');
                        if (creatorUser) {
                            const user = JSON.parse(creatorUser);
                            dispatch({ type: 'SET_USER', payload: user });
                            console.log('✅ AuthContext: Creator profile loaded from localStorage');
                        } else {
                            // Try to fetch creator profile
                            const response = await fetch('http://localhost:8000/api/creator/dashboard/', {
                                headers: { 'Authorization': `Token ${token}` }
                            });
                            if (response.ok) {
                                const creatorData = await response.json();
                                if (creatorData.creator_profile && creatorData.creator_profile.user_username) {
                                    const user = {
                                        username: creatorData.creator_profile.user_username,
                                        email: creatorData.creator_profile.user_email,
                                        first_name: creatorData.creator_profile.user_first_name,
                                        last_name: creatorData.creator_profile.user_last_name
                                    };
                                    dispatch({ type: 'SET_USER', payload: user });
                                    localStorage.setItem('creator_user', JSON.stringify(user));
                                    console.log('✅ AuthContext: Creator profile fetched from API');
                                }
                            }
                        }
                    } else {
                        // Regular user
                        console.log('👤 AuthContext: Loading regular user profile');
                        const response = await authAPI.getProfile();
                        dispatch({ type: 'SET_USER', payload: response.data });
                        console.log('✅ AuthContext: Regular user profile loaded');
                    }
                } catch (error) {
                    console.error('❌ AuthContext: Auth check failed:', error);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('creator_token');
                    localStorage.removeItem('user_type');
                    localStorage.removeItem('creator_user');
                    localStorage.removeItem('creator_profile');
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
            // Check if this is direct creator authentication data (from CreatorLogin)
            if (credentials.user && credentials.token && credentials.userType) {
                console.log('🔄 AuthContext: Processing direct creator authentication');
                console.log('- User:', credentials.user);
                console.log('- User Type:', credentials.userType);

                // Store the creator authentication
                localStorage.setItem('access_token', credentials.token);
                localStorage.setItem('creator_token', credentials.token);
                localStorage.setItem('user_type', credentials.userType);
                localStorage.setItem('creator_user', JSON.stringify(credentials.user));

                dispatch({ type: 'SET_USER', payload: credentials.user });
                console.log('✅ AuthContext: Creator authentication completed');
                return { success: true };
            }

            // Regular login flow
            console.log('🔄 AuthContext: Processing regular login flow');
            const response = await authAPI.login(credentials);
            const { user, access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Check if user is a creator by trying to fetch creator dashboard
            try {
                const creatorCheckResponse = await fetch('http://localhost:8000/api/creator/dashboard/', {
                    headers: { 'Authorization': `Token ${access}` }
                });

                if (creatorCheckResponse.ok) {
                    // User is a creator
                    const creatorData = await creatorCheckResponse.json();
                    localStorage.setItem('user_type', 'creator');
                    localStorage.setItem('creator_token', access);
                    localStorage.setItem('creator_user', JSON.stringify(user));
                    if (creatorData.creator_profile) {
                        localStorage.setItem('creator_profile', JSON.stringify(creatorData.creator_profile));
                    }
                    console.log('✅ Creator detected and authenticated');
                } else {
                    // User is a regular user
                    localStorage.setItem('user_type', 'regular');
                    console.log('✅ Regular user authenticated');
                }
            } catch (creatorCheckError) {
                // If creator check fails, assume regular user
                localStorage.setItem('user_type', 'regular');
                console.log('⚠️ Creator check failed, defaulting to regular user');
            }

            dispatch({ type: 'SET_USER', payload: user });
            return { success: true };
        } catch (error) {
            console.error('❌ AuthContext login error:', error);
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
            let response;

            if (userData.user_type === 'creator') {
                // Creator registration
                const creatorData = {
                    username: userData.username,
                    email: userData.email,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    password: userData.password,
                    password_confirm: userData.password_confirm,
                    youtuber_id: parseInt(userData.youtuber_id),
                };

                response = await fetch('http://localhost:8000/api/creator/register/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(creatorData)
                });

                const data = await response.json();

                if (!response.ok) {
                    // Handle creator registration errors
                    if (typeof data === 'object') {
                        const firstError = Object.values(data)[0];
                        const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                        throw new Error(errorMessage);
                    }
                    throw new Error(data.message || 'Creator registration failed');
                }

                const { user, token } = data;

                // Store creator token
                localStorage.setItem('creator_token', token);
                localStorage.setItem('creator_user', JSON.stringify(user));
                localStorage.setItem('user_type', 'creator');

                dispatch({ type: 'SET_USER', payload: user });
                return { success: true, user_type: 'creator' };

            } else {
                // Regular user registration
                response = await authAPI.register(userData);
                const { user, access, refresh } = response.data;

                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user_type', 'regular');

                dispatch({ type: 'SET_USER', payload: user });
                return { success: true, user_type: 'regular' };
            }
        } catch (error) {
            let errorMessage = 'Registration failed';

            if (error.response?.data) {
                // Handle validation errors from axios
                const errors = error.response.data;
                if (typeof errors === 'object') {
                    const firstError = Object.values(errors)[0];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                } else {
                    errorMessage = errors.error || errors.message || errors;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            return { success: false, error: errorMessage };
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const logout = () => {
        // Clear all auth data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('creator_token');
        localStorage.removeItem('creator_user');
        localStorage.removeItem('user_type');
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