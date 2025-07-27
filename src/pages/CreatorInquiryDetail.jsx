import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const CreatorInquiryDetail = () => {
    const [inquiry, setInquiry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    const statusOptions = [
        { value: 'pending', label: 'Pending Review', color: 'bg-yellow-600', description: 'Initial inquiry received, awaiting review' },
        { value: 'contacted', label: 'Contacted', color: 'bg-blue-600', description: 'You have responded to the inquiry' },
        { value: 'in_discussion', label: 'In Discussion', color: 'bg-purple-600', description: 'Actively discussing terms and details' },
        { value: 'accepted', label: 'Accepted', color: 'bg-green-600', description: 'Collaboration accepted, moving forward' },
        { value: 'declined', label: 'Declined', color: 'bg-red-600', description: 'Collaboration declined' },
        { value: 'completed', label: 'Completed', color: 'bg-gray-600', description: 'Collaboration successfully completed' }
    ];

    // Check if user is a creator
    useEffect(() => {
        const userType = localStorage.getItem('user_type');
        if (userType !== 'creator') {
            navigate('/dashboard');
            return;
        }
    }, [navigate]);

    useEffect(() => {
        fetchInquiry();
    }, [id]);

    const fetchInquiry = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('creator_token') || localStorage.getItem('access_token');

            if (!token) {
                navigate('/creator/login');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/creator/inquiries/${id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            setInquiry(response.data);
        } catch (error) {
            console.error('Failed to fetch inquiry:', error);
            if (error.response && error.response.status === 401) {
                navigate('/creator/login');
            } else if (error.response && error.response.status === 404) {
                setError('Inquiry not found.');
            } else {
                setError('Failed to load inquiry details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateInquiryStatus = async (newStatus) => {
        try {
            setUpdating(true);
            setError('');
            setSuccessMessage('');

            const token = localStorage.getItem('creator_token') || localStorage.getItem('access_token');

            const response = await axios.patch(`${API_BASE_URL}/creator/inquiries/${id}/status/`, {
                status: newStatus
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setInquiry(response.data);
            setSuccessMessage('Status updated successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update status:', error);
            setError('Failed to update status. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(option => option.value === status);
        return statusOption ? statusOption.color : 'bg-gray-600';
    };

    const getCurrentStatusOption = () => {
        return statusOptions.find(option => option.value === inquiry?.status);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-white mt-4">Loading inquiry details...</p>
                </div>
            </div>
        );
    }

    if (error && !inquiry) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Error Loading Inquiry</h1>
                    <p className="text-red-400 text-lg mb-6">{error}</p>
                    <Link to="/creator/inquiries" className="btn btn-primary">
                        Back to Inquiries
                    </Link>
                </div>
            </div>
        );
    }

    if (!inquiry) return null;

    const currentStatus = getCurrentStatusOption();

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gradient-to-r from-orange-600 to-red-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/creator/inquiries"
                                className="text-white hover:text-orange-200 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>All Inquiries</span>
                            </Link>
                            <div className="text-orange-200">•</div>
                            <h1 className="text-2xl font-bold text-white">Inquiry Details</h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(inquiry.status)}`}>
                                {inquiry.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {successMessage && (
                    <div className="bg-green-600 border border-green-700 text-white px-4 py-3 rounded mb-6">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="bg-red-600 border border-red-700 text-white px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Inquiry Overview */}
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Inquiry Overview</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-2">
                                        {inquiry.subject || 'No Subject Provided'}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">From:</span>
                                            <span className="text-white ml-2 font-medium">
                                                {inquiry.first_name} {inquiry.last_name}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Email:</span>
                                            <span className="text-white ml-2">{inquiry.email}</span>
                                        </div>
                                        {inquiry.phone && (
                                            <div>
                                                <span className="text-gray-400">Phone:</span>
                                                <span className="text-white ml-2">{inquiry.phone}</span>
                                            </div>
                                        )}
                                        {inquiry.company_name && (
                                            <div>
                                                <span className="text-gray-400">Company:</span>
                                                <span className="text-white ml-2">{inquiry.company_name}</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-gray-400">Type:</span>
                                            <span className="text-white ml-2 capitalize">{inquiry.inquiry_type}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Received:</span>
                                            <span className="text-white ml-2">{formatDate(inquiry.created_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Collaboration Details */}
                                {(inquiry.budget || inquiry.timeline || inquiry.deliverables) && (
                                    <div className="border-t border-gray-700 pt-4">
                                        <h4 className="text-md font-medium text-white mb-3">Collaboration Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            {inquiry.budget && (
                                                <div>
                                                    <span className="text-gray-400">Budget:</span>
                                                    <span className="text-white ml-2 font-medium">${inquiry.budget}</span>
                                                </div>
                                            )}
                                            {inquiry.timeline && (
                                                <div>
                                                    <span className="text-gray-400">Timeline:</span>
                                                    <span className="text-white ml-2">{inquiry.timeline}</span>
                                                </div>
                                            )}
                                            {inquiry.deliverables && (
                                                <div>
                                                    <span className="text-gray-400">Deliverables:</span>
                                                    <span className="text-white ml-2">{inquiry.deliverables}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Message */}
                                {inquiry.message && (
                                    <div className="border-t border-gray-700 pt-4">
                                        <h4 className="text-md font-medium text-white mb-3">Message</h4>
                                        <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                                            <p className="text-gray-300 whitespace-pre-wrap">{inquiry.message}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href={`mailto:${inquiry.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                                        {inquiry.email}
                                    </a>
                                </div>
                                {inquiry.phone && (
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <a href={`tel:${inquiry.phone}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                                            {inquiry.phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Current Status */}
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Current Status</h3>
                            <div className="space-y-3">
                                <div className={`p-3 rounded-lg ${currentStatus?.color} text-white`}>
                                    <div className="font-medium">{currentStatus?.label}</div>
                                    <div className="text-sm opacity-90">{currentStatus?.description}</div>
                                </div>
                            </div>
                        </div>

                        {/* Status Management */}
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
                            <div className="space-y-2">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => updateInquiryStatus(status.value)}
                                        disabled={updating || inquiry.status === status.value}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${inquiry.status === status.value
                                                ? `${status.color} text-white`
                                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <div className="font-medium">{status.label}</div>
                                        <div className="text-xs opacity-75">{status.description}</div>
                                    </button>
                                ))}
                            </div>

                            {updating && (
                                <div className="mt-4 text-center">
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                    <span className="ml-2 text-gray-400 text-sm">Updating...</span>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <a
                                    href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject || 'Your Collaboration Inquiry'}`}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Send Email
                                </a>

                                {inquiry.phone && (
                                    <a
                                        href={`tel:${inquiry.phone}`}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Call Now
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorInquiryDetail; 