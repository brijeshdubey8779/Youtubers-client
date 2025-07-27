import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const CreatorInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        inquiry_type: '',
        search: ''
    });
    const [statusCounts, setStatusCounts] = useState({});

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Status options with colors and labels
    const statusOptions = [
        { value: '', label: 'All Inquiries', color: 'bg-gray-600' },
        { value: 'pending', label: 'Pending Review', color: 'bg-yellow-600' },
        { value: 'contacted', label: 'Contacted', color: 'bg-blue-600' },
        { value: 'in_discussion', label: 'In Discussion', color: 'bg-purple-600' },
        { value: 'accepted', label: 'Accepted', color: 'bg-green-600' },
        { value: 'declined', label: 'Declined', color: 'bg-red-600' },
        { value: 'completed', label: 'Completed', color: 'bg-gray-600' }
    ];

    const inquiryTypes = [
        { value: '', label: 'All Types' },
        { value: 'collaboration', label: 'Collaboration' },
        { value: 'sponsorship', label: 'Sponsorship' },
        { value: 'event', label: 'Event' },
        { value: 'review', label: 'Product Review' },
        { value: 'interview', label: 'Interview' },
        { value: 'other', label: 'Other' }
    ];

    // Initialize filters from URL params
    useEffect(() => {
        const status = searchParams.get('status') || '';
        const inquiry_type = searchParams.get('type') || '';
        const search = searchParams.get('search') || '';

        setFilters({ status, inquiry_type, search });
    }, [searchParams]);

    // Check if user is a creator
    useEffect(() => {
        const userType = localStorage.getItem('user_type');
        if (userType !== 'creator') {
            navigate('/dashboard');
            return;
        }
    }, [navigate]);

    useEffect(() => {
        fetchInquiries();
        fetchStatusCounts();
    }, [filters]);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('creator_token') || localStorage.getItem('access_token');

            if (!token) {
                navigate('/creator/login');
                return;
            }

            // Build query parameters
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.inquiry_type) params.append('inquiry_type', filters.inquiry_type);
            if (filters.search) params.append('search', filters.search);

            const response = await axios.get(`${API_BASE_URL}/creator/inquiries/?${params.toString()}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            setInquiries(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
            if (error.response && error.response.status === 401) {
                navigate('/creator/login');
            } else {
                setError('Failed to load inquiries. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStatusCounts = async () => {
        try {
            const token = localStorage.getItem('creator_token') || localStorage.getItem('access_token');
            const response = await axios.get(`${API_BASE_URL}/creator/dashboard/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setStatusCounts(response.data.status_counts || {});
        } catch (error) {
            console.error('Failed to fetch status counts:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Update URL parameters
        const params = new URLSearchParams();
        if (newFilters.status) params.set('status', newFilters.status);
        if (newFilters.inquiry_type) params.set('type', newFilters.inquiry_type);
        if (newFilters.search) params.set('search', newFilters.search);

        setSearchParams(params);
    };

    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(option => option.value === status);
        return statusOption ? statusOption.color : 'bg-gray-600';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityBadge = (inquiry) => {
        const daysOld = Math.floor((new Date() - new Date(inquiry.created_at)) / (1000 * 60 * 60 * 24));

        if (inquiry.status === 'pending' && daysOld > 3) {
            return <span className="px-2 py-1 text-xs bg-red-600 text-white rounded-full">Urgent</span>;
        }
        if (inquiry.status === 'pending' && daysOld > 1) {
            return <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">High</span>;
        }
        return null;
    };

    if (loading && inquiries.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-white mt-4">Loading your inquiries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gradient-to-r from-orange-600 to-red-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/creator/dashboard"
                                className="text-white hover:text-orange-200 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Dashboard</span>
                            </Link>
                            <div className="text-orange-200">•</div>
                            <h1 className="text-2xl font-bold text-white">Collaboration Inquiries</h1>
                        </div>
                        <div className="text-white">
                            <span className="text-orange-100">Total: </span>
                            <span className="font-bold">{inquiries.length}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {statusOptions.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => handleFilterChange('status', status.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${filters.status === status.value
                                    ? `${status.color} text-white`
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            <span>{status.label}</span>
                            {status.value && statusCounts[status.value] && (
                                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                                    {statusCounts[status.value]}
                                </span>
                            )}
                            {!status.value && (
                                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                                    {Object.values(statusCounts).reduce((a, b) => a + b, 0)}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Search Inquiries</label>
                        <input
                            type="text"
                            placeholder="Search by company, name, subject..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Inquiry Type</label>
                        <select
                            value={filters.inquiry_type}
                            onChange={(e) => handleFilterChange('inquiry_type', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {inquiryTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setFilters({ status: '', inquiry_type: '', search: '' });
                                setSearchParams({});
                            }}
                            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-600 border border-red-700 text-white px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Inquiries List */}
                {inquiries.length > 0 ? (
                    <div className="space-y-4">
                        {inquiries.map((inquiry) => (
                            <div
                                key={inquiry.id}
                                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {inquiry.subject || 'No Subject'}
                                            </h3>
                                            {getPriorityBadge(inquiry)}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(inquiry.status)}`}>
                                                {inquiry.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="text-gray-300 space-y-1">
                                            <p><span className="font-medium">From:</span> {inquiry.first_name} {inquiry.last_name}</p>
                                            {inquiry.company_name && (
                                                <p><span className="font-medium">Company:</span> {inquiry.company_name}</p>
                                            )}
                                            <p><span className="font-medium">Type:</span>
                                                <span className="capitalize"> {inquiry.inquiry_type}</span>
                                            </p>
                                            {inquiry.budget && (
                                                <p><span className="font-medium">Budget:</span> ${inquiry.budget}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right text-sm text-gray-400">
                                        <p>{formatDate(inquiry.created_at)}</p>
                                        <Link
                                            to={`/creator/inquiries/${inquiry.id}`}
                                            className="inline-block mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors font-medium"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>

                                {inquiry.message && (
                                    <div className="border-t border-gray-700 pt-4">
                                        <p className="text-gray-300 text-sm">
                                            <span className="font-medium">Message:</span>
                                            {inquiry.message.length > 150
                                                ? inquiry.message.substring(0, 150) + '...'
                                                : inquiry.message
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-medium text-gray-300 mb-2">
                            {filters.status || filters.inquiry_type || filters.search
                                ? 'No inquiries match your filters'
                                : 'No inquiries yet'
                            }
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {filters.status || filters.inquiry_type || filters.search
                                ? 'Try adjusting your filters to see more results.'
                                : 'When brands reach out for collaborations, their requests will appear here.'
                            }
                        </p>
                        {(filters.status || filters.inquiry_type || filters.search) && (
                            <button
                                onClick={() => {
                                    setFilters({ status: '', inquiry_type: '', search: '' });
                                    setSearchParams({});
                                }}
                                className="btn btn-primary"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {loading && inquiries.length > 0 && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatorInquiries; 