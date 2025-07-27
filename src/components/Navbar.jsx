import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();

    // Get user type from localStorage
    const userType = localStorage.getItem('user_type');

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsUserMenuOpen(false);
    };

    const toggleUserMenu = (event) => {
        event.stopPropagation(); // Prevent event bubbling
        setIsUserMenuOpen(!isUserMenuOpen);
        setIsMobileMenuOpen(false);
    };

    const closeMenus = () => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        closeMenus();
    };

    // Close mobile menu on route change
    useEffect(() => {
        closeMenus();
    }, [location]);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Don't close if clicking on dropdown or its children
            const dropdown = event.target.closest('.user-dropdown');
            const dropdownButton = event.target.closest('.user-dropdown-button');

            if (!dropdown && !dropdownButton) {
                closeMenus();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header className="bg-gray-900 shadow-lg relative z-50">
            {/* Header Bar */}
            <div className="header-bar">
                <div className="container-custom">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-xs">
                            <span>📧 info@youtubers.com</span>
                            <span>📞 +1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-xs hover:text-orange-400 transition-colors"
                                        onClick={closeMenus}
                                    >
                                        Sign In
                                    </Link>
                                    <span className="text-gray-400">|</span>
                                    <Link
                                        to="/register"
                                        className="text-xs hover:text-orange-400 transition-colors"
                                        onClick={closeMenus}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <div className="text-xs flex items-center space-x-2">
                                    <span>Welcome, {user?.first_name || user?.username}!</span>
                                    {userType === 'creator' && (
                                        <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
                                            Creator
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="navbar-dark sticky top-0 z-40">
                <div className="container-custom">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2" onClick={closeMenus}>
                            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">YT</span>
                            </div>
                            <span className="text-white font-bold text-xl">YouTubers</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                to="/"
                                className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
                                onClick={closeMenus}
                            >
                                Home
                            </Link>
                            <Link
                                to="/youtubers"
                                className={`nav-link ${isActive('/youtubers') ? 'nav-link-active' : ''}`}
                                onClick={closeMenus}
                            >
                                YouTubers
                            </Link>
                            <Link
                                to="/about"
                                className={`nav-link ${isActive('/about') ? 'nav-link-active' : ''}`}
                                onClick={closeMenus}
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className={`nav-link ${isActive('/contact') ? 'nav-link-active' : ''}`}
                                onClick={closeMenus}
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Desktop Auth Section */}
                        <div className="hidden md:flex items-center space-x-4">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="btn btn-outline btn-sm"
                                        onClick={closeMenus}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn btn-primary btn-sm"
                                        onClick={closeMenus}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={toggleUserMenu}
                                        className="user-dropdown-button flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
                                    >
                                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm">{user?.first_name || user?.username}</span>
                                            {userType === 'creator' && (
                                                <span className="text-xs text-orange-400">Creator</span>
                                            )}
                                        </div>
                                        <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div
                                            className="user-dropdown absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* User Type Indicator */}
                                            <div className="px-4 py-2 border-b border-gray-700 mb-2">
                                                <div className="text-sm text-white font-medium">
                                                    {user?.first_name || user?.username}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {userType === 'creator' ? 'Creator Account' : 'Regular User'}
                                                </div>
                                            </div>

                                            {/* Dashboard Link */}
                                            <Link
                                                to={userType === 'creator' ? '/creator/dashboard' : '/dashboard'}
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                onClick={closeMenus}
                                            >
                                                {userType === 'creator' ? '🎬 Creator Dashboard' : '📊 Dashboard'}
                                            </Link>

                                            {/* Profile Link */}
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                onClick={closeMenus}
                                            >
                                                👤 Profile
                                            </Link>

                                            {/* Creator-specific links */}
                                            {userType === 'creator' ? (
                                                <Link
                                                    to="/creator/inquiries"
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                    onClick={closeMenus}
                                                >
                                                    📧 Inquiries
                                                </Link>
                                            ) : (
                                                <Link
                                                    to="/favorites"
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                    onClick={closeMenus}
                                                >
                                                    ❤️ Favorites
                                                </Link>
                                            )}

                                            <hr className="my-2 border-gray-700" />
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                            >
                                                🚪 Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="text-gray-300 hover:text-white focus:outline-none"
                                aria-label="Toggle mobile menu"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMobileMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden bg-gray-800 border-t border-gray-700">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link
                                    to="/"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        }`}
                                    onClick={closeMenus}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/youtubers"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/youtubers') ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        }`}
                                    onClick={closeMenus}
                                >
                                    YouTubers
                                </Link>
                                <Link
                                    to="/about"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about') ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        }`}
                                    onClick={closeMenus}
                                >
                                    About
                                </Link>
                                <Link
                                    to="/contact"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        }`}
                                    onClick={closeMenus}
                                >
                                    Contact
                                </Link>

                                {/* Mobile Auth Section */}
                                {!isAuthenticated ? (
                                    <div className="pt-4 border-t border-gray-700">
                                        <Link
                                            to="/login"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                                            onClick={closeMenus}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                                            onClick={closeMenus}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-gray-700">
                                        <div className="px-3 py-2 text-gray-400 text-sm">
                                            Signed in as: <span className="text-white">{user?.username}</span>
                                            {userType === 'creator' && (
                                                <span className="ml-2 bg-orange-600 text-white px-2 py-1 rounded text-xs">Creator</span>
                                            )}
                                        </div>
                                        <Link
                                            to={userType === 'creator' ? '/creator/dashboard' : '/dashboard'}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                                            onClick={closeMenus}
                                        >
                                            {userType === 'creator' ? 'Creator Dashboard' : 'Dashboard'}
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                                            onClick={closeMenus}
                                        >
                                            Profile
                                        </Link>
                                        {userType === 'creator' ? (
                                            <Link
                                                to="/creator/inquiries"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                                                onClick={closeMenus}
                                            >
                                                Inquiries
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/favorites"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                                                onClick={closeMenus}
                                            >
                                                Favorites
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar; 