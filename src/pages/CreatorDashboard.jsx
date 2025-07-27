import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const CreatorDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Check if user is a creator
    useEffect(() => {
        const userType = localStorage.getItem('user_type');
        const creatorToken = localStorage.getItem('creator_token');
        const accessToken = localStorage.getItem('access_token');
        const creatorUser = localStorage.getItem('creator_user');
        const creatorProfile = localStorage.getItem('creator_profile');

        console.log('🔍 Creator Dashboard - Authentication Debug:');
        console.log('- User Type:', userType);
        console.log('- Creator Token:', creatorToken ? creatorToken.substring(0, 10) + '...' : 'None');
        console.log('- Access Token:', accessToken ? accessToken.substring(0, 10) + '...' : 'None');
        console.log('- Creator User:', creatorUser ? 'Set' : 'None');
        console.log('- Creator Profile:', creatorProfile ? 'Set' : 'None');
        console.log('- AuthContext User:', user);

        // Show all localStorage keys for debugging
        console.log('📦 All localStorage keys:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            if (key.includes('user') || key.includes('token') || key.includes('creator') || key.includes('auth')) {
                console.log(`  - ${key}:`, value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'null');
            }
        }

        if (userType !== 'creator') {
            console.log('❌ Redirecting to regular dashboard - user_type is not "creator"');
            console.log('  Expected: "creator", Got:', userType);
            console.log('  This indicates the user was not properly marked as creator during login');
            navigate('/dashboard'); // Redirect non-creators to regular dashboard
            return;
        }

        console.log('✅ User is confirmed creator, loading creator dashboard...');
    }, [navigate, user]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Try creator_token first, then fallback to access_token
            let token = localStorage.getItem('creator_token') || localStorage.getItem('access_token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/creator/dashboard/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setDashboardData(response.data);
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            if (error.response && error.response.status === 401) {
                // Clear auth data and redirect to login
                localStorage.removeItem('creator_token');
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_type');
                navigate('/login');
            } else {
                setError('Failed to load dashboard data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            logout(); // Use unified logout
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear data and redirect even if logout API fails
            logout();
            navigate('/');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-600 text-yellow-100';
            case 'contacted': return 'bg-blue-600 text-blue-100';
            case 'in_discussion': return 'bg-purple-600 text-purple-100';
            case 'accepted': return 'bg-green-600 text-green-100';
            case 'declined': return 'bg-red-600 text-red-100';
            case 'completed': return 'bg-gray-600 text-gray-100';
            default: return 'bg-gray-600 text-gray-100';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-white mt-4">Loading your creator dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Dashboard Unavailable</h1>
                    <p className="text-red-400 text-lg mb-6">{error}</p>
                    <div className="space-x-4">
                        <button
                            onClick={fetchDashboardData}
                            className="btn btn-primary"
                        >
                            Retry
                        </button>
                        <Link to="/" className="btn btn-outline">
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Show fallback if no dashboard data but user is authenticated
    const creatorProfile = dashboardData?.creator_profile || {
        name: user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username || 'Creator',
        category: 'Content Creator'
    };

    const stats = dashboardData?.dashboard_stats || {
        total_inquiries: 0,
        pending_inquiries: 0,
        success_rate: 0
    };

    const statusCounts = dashboardData?.status_counts || {};
    const recentInquiries = dashboardData?.recent_inquiries || [];

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Creator Header */}
            <header className="bg-gradient-to-r from-orange-600 to-red-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl font-bold">🎬</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
                                <p className="text-orange-100">Manage your collaborations</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="text-white hover:text-orange-200 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Site</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {creatorProfile.name}! 👋
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Manage your collaboration requests and track your performance
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-colors">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-600 bg-opacity-20">
                                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6m-8 0H4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Total Inquiries</p>
                                <p className="text-3xl font-bold text-white">{stats.total_inquiries}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-600 bg-opacity-20">
                                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Pending Review</p>
                                <p className="text-3xl font-bold text-white">{stats.pending_inquiries}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-600 bg-opacity-20">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Success Rate</p>
                                <p className="text-3xl font-bold text-white">{stats.success_rate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-600 bg-opacity-20">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Category</p>
                                <p className="text-lg font-semibold text-white capitalize">{creatorProfile.category}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                            <span className="mr-2">⚡</span>
                            Quick Actions
                        </h3>
                        <div className="space-y-4">
                            <Link
                                to="/creator/inquiries"
                                className="flex items-center justify-between w-full p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors group"
                            >
                                <div className="flex items-center">
                                    <span className="text-xl mr-3">📧</span>
                                    <span className="font-medium">View All Inquiries</span>
                                </div>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>

                            <Link
                                to="/creator/inquiries?status=pending"
                                className="flex items-center justify-between w-full p-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors group"
                            >
                                <div className="flex items-center">
                                    <span className="text-xl mr-3">⏰</span>
                                    <span className="font-medium">Review Pending ({stats.pending_inquiries})</span>
                                </div>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>

                            <Link
                                to="/creator/profile"
                                className="flex items-center justify-between w-full p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors group"
                            >
                                <div className="flex items-center">
                                    <span className="text-xl mr-3">👤</span>
                                    <span className="font-medium">Update Profile</span>
                                </div>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                            <span className="mr-2">📊</span>
                            Inquiry Status Breakdown
                        </h3>
                        {Object.keys(statusCounts).length > 0 ? (
                            <div className="space-y-4">
                                {Object.entries(statusCounts).map(([status, count]) => (
                                    <div key={status} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                                {status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-white font-semibold text-lg">{count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400">No inquiries yet</p>
                                <p className="text-gray-500 text-sm mt-2">Your inquiry statuses will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Inquiries */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-white flex items-center">
                            <span className="mr-2">📋</span>
                            Recent Inquiries
                        </h3>
                        <Link
                            to="/creator/inquiries"
                            className="text-orange-400 hover:text-orange-300 transition-colors flex items-center space-x-1"
                        >
                            <span>View All</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {recentInquiries.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">From</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {recentInquiries.map((inquiry) => (
                                        <tr key={inquiry.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white font-medium">{inquiry.first_name} {inquiry.last_name}</div>
                                                <div className="text-sm text-gray-400">{inquiry.company_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-white max-w-xs truncate">{inquiry.subject}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-300 capitalize">{inquiry.inquiry_type}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                                                    {inquiry.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {formatDate(inquiry.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    to={`/creator/inquiries/${inquiry.id}`}
                                                    className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
                                                >
                                                    View Details →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-lg font-medium text-gray-300 mb-2">No inquiries yet</h3>
                            <p className="text-gray-400 mb-6">
                                When brands reach out to you, their collaboration requests will appear here.
                            </p>
                            <Link to="/" className="btn btn-primary">
                                View Your Public Profile
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard; 