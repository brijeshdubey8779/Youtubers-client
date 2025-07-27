import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { youtubersAPI } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirm: '',
        user_type: 'regular', // New field for user type
        youtuber_id: '', // For creators
    });

    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [youtubers, setYoutubers] = useState([]);
    const [loadingYoutubers, setLoadingYoutubers] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    // Fetch YouTubers list when user selects creator type
    useEffect(() => {
        if (formData.user_type === 'creator') {
            const fetchYoutubers = async () => {
                setLoadingYoutubers(true);
                try {
                    const response = await youtubersAPI.getList();
                    const youtubersData = response.data.results || response.data || [];
                    setYoutubers(youtubersData);
                } catch (error) {
                    console.error('Error fetching YouTubers:', error);
                    setYoutubers([]);
                } finally {
                    setLoadingYoutubers(false);
                }
            };
            fetchYoutubers();
        }
    }, [formData.user_type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
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
        }

        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email format is invalid';
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
            errors.password = 'Password must contain uppercase, lowercase, and number';
        }

        // Confirm password validation
        if (!formData.password_confirm) {
            errors.password_confirm = 'Password confirmation is required';
        } else if (formData.password !== formData.password_confirm) {
            errors.password_confirm = 'Passwords do not match';
        }

        // Creator-specific validation
        if (formData.user_type === 'creator') {
            if (!formData.youtuber_id) {
                errors.youtuber_id = 'Please select your YouTuber profile';
            }
        }

        // Terms validation
        if (!acceptTerms) {
            errors.terms = 'You must accept the terms and conditions';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const result = await register(formData);
            if (result.success) {
                // Redirect based on user type
                if (formData.user_type === 'creator') {
                    navigate('/creator/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Join YouTubers Modern and discover amazing content creators
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

                        {/* User Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Account Type
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                <label className="relative">
                                    <input
                                        type="radio"
                                        name="user_type"
                                        value="regular"
                                        checked={formData.user_type === 'regular'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.user_type === 'regular'
                                            ? 'border-orange-500 bg-orange-600/10'
                                            : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                        }`}>
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.user_type === 'regular'
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-gray-400'
                                                }`}>
                                                {formData.user_type === 'regular' && (
                                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">Regular User</div>
                                                <div className="text-gray-400 text-sm">Browse and contact YouTubers for collaborations</div>
                                            </div>
                                        </div>
                                    </div>
                                </label>

                                <label className="relative">
                                    <input
                                        type="radio"
                                        name="user_type"
                                        value="creator"
                                        checked={formData.user_type === 'creator'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.user_type === 'creator'
                                            ? 'border-orange-500 bg-orange-600/10'
                                            : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                        }`}>
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.user_type === 'creator'
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-gray-400'
                                                }`}>
                                                {formData.user_type === 'creator' && (
                                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">Creator/YouTuber</div>
                                                <div className="text-gray-400 text-sm">Manage your profile and collaboration requests</div>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* YouTuber Selection (only for creators) */}
                        {formData.user_type === 'creator' && (
                            <div>
                                <label htmlFor="youtuber_id" className="block text-sm font-medium text-gray-200">
                                    Select Your YouTuber Profile
                                </label>
                                <div className="mt-1">
                                    {loadingYoutubers ? (
                                        <div className="input-dark flex items-center">
                                            <svg className="animate-spin h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading YouTubers...
                                        </div>
                                    ) : (
                                        <select
                                            id="youtuber_id"
                                            name="youtuber_id"
                                            value={formData.youtuber_id}
                                            onChange={handleChange}
                                            className="input-dark"
                                        >
                                            <option value="">Select your YouTuber profile</option>
                                            {youtubers.map((youtuber) => (
                                                <option key={youtuber.id} value={youtuber.id}>
                                                    {youtuber.name} - {youtuber.category} ({youtuber.subs_count})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                {formErrors.youtuber_id && (
                                    <p className="mt-1 text-sm text-red-400">{formErrors.youtuber_id}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-400">
                                    Don't see your profile? Contact support to get it added.
                                </p>
                            </div>
                        )}

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input-dark"
                                    placeholder="Choose a username"
                                />
                            </div>
                            {formErrors.username && (
                                <p className="mt-1 text-sm text-red-400">{formErrors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-dark"
                                    placeholder="Enter your email"
                                />
                            </div>
                            {formErrors.email && (
                                <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                            )}
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-200">
                                    First Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        autoComplete="given-name"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="input-dark"
                                        placeholder="First name"
                                    />
                                </div>
                                {formErrors.first_name && (
                                    <p className="mt-1 text-sm text-red-400">{formErrors.first_name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-200">
                                    Last Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        autoComplete="family-name"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="input-dark"
                                        placeholder="Last name"
                                    />
                                </div>
                                {formErrors.last_name && (
                                    <p className="mt-1 text-sm text-red-400">{formErrors.last_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-dark pr-10"
                                    placeholder="Create a password"
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
                            {formErrors.password && (
                                <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-200">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password_confirm"
                                    name="password_confirm"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password_confirm}
                                    onChange={handleChange}
                                    className="input-dark pr-10"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
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
                            {formErrors.password_confirm && (
                                <p className="mt-1 text-sm text-red-400">{formErrors.password_confirm}</p>
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
                                    <Link to="/terms" className="text-orange-400 hover:text-orange-300 transition-colors">
                                        Terms and Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                            {formErrors.terms && (
                                <p className="mt-1 text-sm text-red-400">{formErrors.terms}</p>
                            )}
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
                                        Creating account...
                                    </div>
                                ) : (
                                    `Create ${formData.user_type === 'creator' ? 'Creator' : 'User'} Account`
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
                                <span className="px-2 bg-gray-800 text-gray-400">Already have an account?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors duration-200"
                            >
                                Sign In to Existing Account
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

                    {/* Account Type Benefits */}
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-200 mb-2">
                            {formData.user_type === 'creator' ? 'Creator Benefits:' : 'User Benefits:'}
                        </h3>
                        <div className="text-xs text-gray-400 space-y-1">
                            {formData.user_type === 'creator' ? (
                                <>
                                    <p>• Manage your YouTuber profile</p>
                                    <p>• Receive collaboration requests</p>
                                    <p>• Track inquiry status</p>
                                    <p className="text-orange-400">• Dedicated creator dashboard</p>
                                </>
                            ) : (
                                <>
                                    <p>• Browse all YouTubers</p>
                                    <p>• Send collaboration requests</p>
                                    <p>• Save favorite creators</p>
                                    <p className="text-orange-400">• Personalized recommendations</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register; 