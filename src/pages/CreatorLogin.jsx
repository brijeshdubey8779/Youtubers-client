import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const CreatorLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    // Apply dark theme
    useEffect(() => {
        document.body.classList.add('dark');
        return () => document.body.classList.remove('dark');
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('🎬 CREATOR LOGIN DEBUG - Starting login process');
        console.log('- Form Data:', formData);
        console.log('- API URL:', `${API_BASE_URL}/creator/login/`);

        try {
            const response = await axios.post(`${API_BASE_URL}/creator/login/`, formData);

            console.log('✅ Creator Login API Response:', response.data);
            console.log('- Token:', response.data.token ? response.data.token.substring(0, 10) + '...' : 'None');
            console.log('- User:', response.data.user);
            console.log('- Creator Profile:', response.data.creator_profile);

            // Store authentication data
            localStorage.setItem('creator_token', response.data.token);
            localStorage.setItem('access_token', response.data.token); // For unified API calls
            localStorage.setItem('user_type', 'creator'); // CRITICAL: Mark as creator
            localStorage.setItem('creator_user', JSON.stringify(response.data.user));
            localStorage.setItem('creator_profile', JSON.stringify(response.data.creator_profile));

            console.log('💾 Local Storage Updated:');
            console.log('- creator_token:', localStorage.getItem('creator_token') ? 'Set' : 'Not Set');
            console.log('- access_token:', localStorage.getItem('access_token') ? 'Set' : 'Not Set');
            console.log('- user_type:', localStorage.getItem('user_type'));

            // Update AuthContext with creator user data
            if (login) {
                console.log('🔄 Updating AuthContext with creator data...');
                await login({
                    user: response.data.user,
                    token: response.data.token,
                    userType: 'creator'
                });
            }

            console.log('🎯 Redirecting to creator dashboard...');
            // Redirect to creator dashboard
            navigate('/creator/dashboard');

        } catch (error) {
            console.error('❌ Creator Login Error:', error);
            console.error('- Error Response:', error.response?.data);
            console.error('- Error Status:', error.response?.status);

            if (error.response && error.response.data) {
                if (error.response.data.non_field_errors) {
                    setError(error.response.data.non_field_errors[0]);
                } else if (error.response.data.username) {
                    setError(error.response.data.username[0]);
                } else if (error.response.data.password) {
                    setError(error.response.data.password[0]);
                } else {
                    setError('Login failed. Please check your credentials.');
                }
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Creator Dashboard Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Access your creator dashboard to manage collaboration requests
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="card-dark py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-600 border border-red-700 text-white px-4 py-3 rounded relative">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input-dark"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-dark pr-10"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign In to Dashboard'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800 text-gray-400">New to creator dashboard?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/creator/register"
                                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                            >
                                Create Creator Account
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Back to main site?{' '}
                            <Link to="/" className="text-orange-400 hover:text-orange-300 transition-colors">
                                Go to Home
                            </Link>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-200 mb-2">Demo Creator Account:</h3>
                        <div className="text-xs text-gray-400 space-y-1">
                            <p><span className="font-medium">Username:</span> creator1</p>
                            <p><span className="font-medium">Password:</span> creatorpass123</p>
                            <p className="text-orange-400">* This account is linked to YouTuber "Akash Gupta"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorLogin; 