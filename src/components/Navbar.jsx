import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const closeMenus = () => {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    return (
        <>
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
                                <div className="text-xs">
                                    Welcome, {user?.first_name || user?.username}!
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
                                        className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
                                    >
                                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm">{user?.first_name || user?.username}</span>
                                        <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                                            <Link
                                                to="/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                onClick={closeMenus}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                onClick={closeMenus}
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                to="/favorites"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                onClick={closeMenus}
                                            >
                                                Favorites
                                            </Link>
                                            <hr className="my-2 border-gray-700" />
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
                            >
                                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                                    {isMenuOpen ? (
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                                    ) : (
                                        <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-gray-800 border-t border-gray-700">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link
                                    to="/"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')
                                            ? 'text-white bg-gray-700'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        } transition-colors`}
                                    onClick={closeMenus}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/youtubers"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/youtubers')
                                            ? 'text-white bg-gray-700'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        } transition-colors`}
                                    onClick={closeMenus}
                                >
                                    YouTubers
                                </Link>
                                <Link
                                    to="/about"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about')
                                            ? 'text-white bg-gray-700'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        } transition-colors`}
                                    onClick={closeMenus}
                                >
                                    About
                                </Link>
                                <Link
                                    to="/contact"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact')
                                            ? 'text-white bg-gray-700'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        } transition-colors`}
                                    onClick={closeMenus}
                                >
                                    Contact
                                </Link>

                                {/* Mobile Auth Section */}
                                <div className="pt-4 border-t border-gray-700">
                                    {!isAuthenticated ? (
                                        <div className="space-y-2">
                                            <Link
                                                to="/login"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                                                onClick={closeMenus}
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="block px-3 py-2 rounded-md text-base font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                                                onClick={closeMenus}
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="px-3 py-2 text-sm text-gray-400">
                                                Signed in as {user?.first_name || user?.username}
                                            </div>
                                            <Link
                                                to="/dashboard"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                                                onClick={closeMenus}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/profile"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                                                onClick={closeMenus}
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Click outside to close menus */}
            {(isMenuOpen || isUserMenuOpen) && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={closeMenus}
                ></div>
            )}
        </>
    );
};

export default Navbar; 