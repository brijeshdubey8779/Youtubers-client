import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, youtubersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Apply dark theme to body
    useEffect(() => {
        document.body.classList.add('dark');
        return () => document.body.classList.remove('dark');
    }, []);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await authAPI.getDashboard();
                setDashboardData(response.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
                    <p className="text-gray-400 mb-6">Please log in to access your dashboard</p>
                    <Link to="/login" className="btn btn-primary">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-3xl font-bold">
                                    {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Welcome back, {user?.first_name || user?.username}!
                            </h1>
                            <p className="text-gray-400 text-lg mb-4">
                                {user?.email} • Member since {new Date(user?.date_joined).toLocaleDateString()}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link to="/profile" className="btn btn-outline">
                                    Edit Profile
                                </Link>
                                <Link to="/youtubers" className="btn btn-primary">
                                    Browse YouTubers
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-2">
                                {dashboardData?.featured_youtubers?.length || 0}
                            </div>
                            <div className="text-gray-400">Favorite YouTubers</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-2">
                                {dashboardData?.recent_youtubers?.length || 0}
                            </div>
                            <div className="text-gray-400">Recently Viewed</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-2">
                                {dashboardData?.total_youtubers || 0}
                            </div>
                            <div className="text-gray-400">Total YouTubers</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-2">0</div>
                            <div className="text-gray-400">Active Collaborations</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Featured YouTubers */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Featured YouTubers</h2>
                                <Link to="/youtubers" className="text-orange-400 hover:text-orange-300 text-sm">
                                    View All →
                                </Link>
                            </div>

                            {dashboardData?.featured_youtubers?.length > 0 ? (
                                <div className="space-y-4">
                                    {dashboardData.featured_youtubers.map((youtuber) => (
                                        <div key={youtuber.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                            <img
                                                src={youtuber.photo || 'https://via.placeholder.com/60x60?text=No+Image'}
                                                alt={youtuber.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-white font-medium">{youtuber.name}</h3>
                                                <p className="text-gray-400 text-sm capitalize">
                                                    {youtuber.category} • {youtuber.subs_count}
                                                </p>
                                            </div>
                                            <div className="text-orange-400 font-medium">
                                                ₹{youtuber.price}
                                            </div>
                                            <Link
                                                to={`/youtubers/${youtuber.id}`}
                                                className="btn btn-primary btn-sm"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 mb-4">No featured YouTubers available</p>
                                    <Link to="/youtubers" className="btn btn-primary btn-sm">
                                        Browse YouTubers
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent YouTubers */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Recently Added</h2>
                                <Link to="/youtubers" className="text-orange-400 hover:text-orange-300 text-sm">
                                    View All →
                                </Link>
                            </div>

                            {dashboardData?.recent_youtubers?.length > 0 ? (
                                <div className="space-y-4">
                                    {dashboardData.recent_youtubers.map((youtuber) => (
                                        <div key={youtuber.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                            <img
                                                src={youtuber.photo || 'https://via.placeholder.com/60x60?text=No+Image'}
                                                alt={youtuber.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-white font-medium">{youtuber.name}</h3>
                                                <p className="text-gray-400 text-sm capitalize">
                                                    {youtuber.category} • {youtuber.city}
                                                </p>
                                            </div>
                                            <div className="text-green-400 text-xs">
                                                New
                                            </div>
                                            <Link
                                                to={`/youtubers/${youtuber.id}`}
                                                className="btn btn-outline btn-sm"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 mb-4">No recent YouTubers available</p>
                                    <Link to="/youtubers" className="btn btn-primary btn-sm">
                                        Browse YouTubers
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="bg-gray-800 py-16">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        <span className="text-gradient-light">Quick Actions</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Browse YouTubers */}
                        <Link to="/youtubers" className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-colors group">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-700 transition-colors">
                                    <span className="text-white text-2xl">🎬</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Browse YouTubers</h3>
                                <p className="text-gray-400">Discover and connect with content creators</p>
                            </div>
                        </Link>

                        {/* Contact Support */}
                        <Link to="/contact" className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-colors group">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-700 transition-colors">
                                    <span className="text-white text-2xl">💬</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Contact Support</h3>
                                <p className="text-gray-400">Get help with your collaborations</p>
                            </div>
                        </Link>

                        {/* Profile Settings */}
                        <Link to="/profile" className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-colors group">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-700 transition-colors">
                                    <span className="text-white text-2xl">⚙️</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Profile Settings</h3>
                                <p className="text-gray-400">Update your account information</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="section-padding">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-white mb-8">Recent Activity</h2>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-4 border-l-4 border-orange-500 bg-gray-700 rounded">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-white">Welcome to YouTubers Platform!</p>
                                    <p className="text-gray-400 text-sm">
                                        Account created on {new Date(user?.date_joined).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-4">Start exploring to see your activity here</p>
                                <Link to="/youtubers" className="btn btn-primary">
                                    Start Browsing
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard; 