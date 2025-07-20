import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: ''
    });

    // Apply dark theme to body
    useEffect(() => {
        document.body.classList.add('dark');
        return () => document.body.classList.remove('dark');
    }, []);

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                username: user.username || ''
            });
        }
    }, [user]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
                    <p className="text-gray-400 mb-6">Please log in to access your profile</p>
                    <Link to="/login" className="btn btn-primary">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // This would be a profile update API call
            // await authAPI.updateProfile(formData);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
                <div className="container-custom">
                    <div className="flex items-center gap-4 mb-6">
                        <Link to="/dashboard" className="text-orange-400 hover:text-orange-300">
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <div className="text-center">
                        <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-3xl font-bold">
                                {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
                        <p className="text-gray-400">Manage your account information</p>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="container-custom max-w-2xl">
                    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                        {/* Status Messages */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-600 bg-opacity-20 border border-green-600 text-green-400 rounded-lg">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-600 bg-opacity-20 border border-red-600 text-red-400 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>

                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="form-label-dark">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="form-input-dark"
                                    disabled
                                    title="Username cannot be changed"
                                />
                                <p className="text-gray-500 text-xs mt-1">Username cannot be changed</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="form-label-dark">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input-dark"
                                    disabled
                                    title="Email cannot be changed"
                                />
                                <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="first_name" className="form-label-dark">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="form-input-dark"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="form-label-dark">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="form-input-dark"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-white mb-3">Account Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Member Since:</span>
                                        <span className="text-white">
                                            {new Date(user?.date_joined).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Account Status:</span>
                                        <span className="text-green-400">Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">User ID:</span>
                                        <span className="text-white">{user?.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <LoadingSpinner />
                                            <span className="ml-2">Updating...</span>
                                        </div>
                                    ) : (
                                        'Update Profile'
                                    )}
                                </button>
                                <Link to="/dashboard" className="btn btn-outline flex-1 text-center">
                                    Cancel
                                </Link>
                            </div>
                        </form>

                        {/* Danger Zone */}
                        <div className="mt-12 pt-8 border-t border-gray-700">
                            <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                            <div className="bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-white font-medium">Sign Out</h4>
                                        <p className="text-gray-400 text-sm">Sign out of your account</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile; 