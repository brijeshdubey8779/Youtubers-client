import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const { login, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect destination after login
    const from = location.state?.from?.pathname || '/dashboard';

    // Apply dark theme to body
    useEffect(() => {
        document.body.classList.add('dark');
        return () => document.body.classList.remove('dark');
    }, []);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field-specific error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await login(formData);

        if (result.success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Or{' '}
                        <Link
                            to="/register"
                            className="font-medium text-orange-500 hover:text-orange-400 transition-colors"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Global Error */}
                        {error && (
                            <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="form-label-dark">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className={`form-input-dark ${formErrors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="Enter your username"
                            />
                            {formErrors.username && (
                                <p className="form-error text-red-400">{formErrors.username}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="form-label-dark">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-input-dark pr-10 ${formErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="text-gray-400 hover:text-gray-300">
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </span>
                                </button>
                            </div>
                            {formErrors.password && (
                                <p className="form-error text-red-400">{formErrors.password}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 bg-gray-700 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link
                                    to="/forgot-password"
                                    className="font-medium text-orange-500 hover:text-orange-400 transition-colors"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <LoadingSpinner />
                                        <span className="ml-2">Signing in...</span>
                                    </div>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Demo Credentials:</h4>
                            <div className="text-xs text-gray-400 space-y-1">
                                <p><strong>Username:</strong> demo</p>
                                <p><strong>Password:</strong> demo123</p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Links */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login; 