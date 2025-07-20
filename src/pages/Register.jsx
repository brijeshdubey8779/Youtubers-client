import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirm: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);

    const { register, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Apply dark theme to body
    useEffect(() => {
        document.body.classList.add('dark');
        return () => document.body.classList.remove('dark');
    }, []);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

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

        // Username validation
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            errors.username = 'Username can only contain letters, numbers, and underscores';
        }

        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // First name validation
        if (!formData.first_name.trim()) {
            errors.first_name = 'First name is required';
        }

        // Last name validation
        if (!formData.last_name.trim()) {
            errors.last_name = 'Last name is required';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        // Confirm password validation
        if (!formData.password_confirm) {
            errors.password_confirm = 'Please confirm your password';
        } else if (formData.password !== formData.password_confirm) {
            errors.password_confirm = 'Passwords do not match';
        }

        // Terms acceptance
        if (!acceptTerms) {
            errors.terms = 'You must accept the terms and conditions';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await register(formData);

        if (result.success) {
            navigate('/dashboard', { replace: true });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Or{' '}
                        <Link
                            to="/login"
                            className="font-medium text-orange-500 hover:text-orange-400 transition-colors"
                        >
                            sign in to existing account
                        </Link>
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Global Error */}
                        {error && (
                            <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Username */}
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
                                className={`form-input-dark ${formErrors.username ? 'border-red-500' : ''}`}
                                placeholder="Choose a username"
                            />
                            {formErrors.username && (
                                <p className="form-error text-red-400">{formErrors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="form-label-dark">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-input-dark ${formErrors.email ? 'border-red-500' : ''}`}
                                placeholder="Enter your email"
                            />
                            {formErrors.email && (
                                <p className="form-error text-red-400">{formErrors.email}</p>
                            )}
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="form-label-dark">
                                    First Name
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    autoComplete="given-name"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className={`form-input-dark ${formErrors.first_name ? 'border-red-500' : ''}`}
                                    placeholder="First name"
                                />
                                {formErrors.first_name && (
                                    <p className="form-error text-red-400">{formErrors.first_name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="last_name" className="form-label-dark">
                                    Last Name
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    autoComplete="family-name"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className={`form-input-dark ${formErrors.last_name ? 'border-red-500' : ''}`}
                                    placeholder="Last name"
                                />
                                {formErrors.last_name && (
                                    <p className="form-error text-red-400">{formErrors.last_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="form-label-dark">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-input-dark pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
                                    placeholder="Create a password"
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

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="password_confirm" className="form-label-dark">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirm"
                                    name="password_confirm"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password_confirm}
                                    onChange={handleChange}
                                    className={`form-input-dark pr-10 ${formErrors.password_confirm ? 'border-red-500' : ''}`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <span className="text-gray-400 hover:text-gray-300">
                                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                    </span>
                                </button>
                            </div>
                            {formErrors.password_confirm && (
                                <p className="form-error text-red-400">{formErrors.password_confirm}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div>
                            <div className="flex items-center">
                                <input
                                    id="accept-terms"
                                    name="accept-terms"
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 bg-gray-700 rounded"
                                />
                                <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-400">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-orange-500 hover:text-orange-400">
                                        Terms and Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-orange-500 hover:text-orange-400">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                            {formErrors.terms && (
                                <p className="form-error text-red-400">{formErrors.terms}</p>
                            )}
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
                                        <span className="ml-2">Creating account...</span>
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
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

export default Register; 