import React, { useState, useEffect } from 'react';
import { contentAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Contact = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        city: '',
        state: ''
    });
    const [contactInfo, setContactInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Apply dark theme to body
    useEffect(() => {
        document.body.classList.add('dark');
        return () => document.body.classList.remove('dark');
    }, []);

    // Fetch contact info
    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                setLoading(true);
                const response = await contentAPI.getContactInfo();
                if (response.data && response.data.length > 0) {
                    setContactInfo(response.data[0]); // Get first contact info
                }
            } catch (error) {
                console.error('Error fetching contact info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, []);

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

        if (!formData.first_name.trim()) {
            errors.first_name = 'First name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.subject.trim()) {
            errors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            errors.message = 'Message must be at least 10 characters long';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitLoading(true);
            await contentAPI.submitContactPage(formData);

            setSubmitStatus({
                type: 'success',
                message: 'Thank you for your message! We\'ll get back to you soon.'
            });

            // Reset form
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                city: '',
                state: ''
            });

        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Failed to send message. Please try again.'
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
                <div className="container-custom">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            <span className="text-gradient-light">Contact Us</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Get in touch with our team. We're here to help you connect with the perfect YouTubers for your projects.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

                                {submitStatus && (
                                    <div className={`mb-6 p-4 rounded-lg border ${submitStatus.type === 'success'
                                        ? 'bg-green-600 bg-opacity-20 border-green-600 text-green-400'
                                        : 'bg-red-600 bg-opacity-20 border-red-600 text-red-400'
                                        }`}>
                                        {submitStatus.message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
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
                                                className={`form-input-dark ${formErrors.first_name ? 'border-red-500' : ''}`}
                                                placeholder="Your first name"
                                                required
                                            />
                                            {formErrors.first_name && (
                                                <p className="form-error text-red-400">{formErrors.first_name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="last_name" className="form-label-dark">
                                                Last Name <span className="text-gray-500">(Optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className="form-input-dark"
                                                placeholder="Your last name"
                                            />
                                        </div>
                                    </div>

                                    {/* Email and Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                className={`form-input-dark ${formErrors.email ? 'border-red-500' : ''}`}
                                                placeholder="your@email.com"
                                                required
                                            />
                                            {formErrors.email && (
                                                <p className="form-error text-red-400">{formErrors.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="form-label-dark">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-input-dark"
                                                placeholder="+1 (555) 123-4567"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Location Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="city" className="form-label-dark">
                                                City <span className="text-gray-500">(Optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="form-input-dark"
                                                placeholder="Your city"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="form-label-dark">
                                                State <span className="text-gray-500">(Optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="form-input-dark"
                                                placeholder="Your state"
                                            />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label htmlFor="subject" className="form-label-dark">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={`form-input-dark ${formErrors.subject ? 'border-red-500' : ''}`}
                                            placeholder="What's this about?"
                                            required
                                        />
                                        {formErrors.subject && (
                                            <p className="form-error text-red-400">{formErrors.subject}</p>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="form-label-dark">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={`form-input-dark ${formErrors.message ? 'border-red-500' : ''}`}
                                            placeholder="Tell us more about your inquiry..."
                                        ></textarea>
                                        {formErrors.message && (
                                            <p className="form-error text-red-400">{formErrors.message}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={submitLoading}
                                            className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <LoadingSpinner />
                                                    <span className="ml-2">Sending Message...</span>
                                                </div>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <div className="space-y-8">
                                {/* Contact Details */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <h3 className="text-xl font-bold text-white mb-4">Get in Touch</h3>

                                    {loading ? (
                                        <div className="flex justify-center">
                                            <LoadingSpinner />
                                        </div>
                                    ) : contactInfo ? (
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center flex-shrink-0 mt-1">
                                                    <span className="text-white text-sm">📧</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white">Email</h4>
                                                    <p className="text-gray-400">{contactInfo.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center flex-shrink-0 mt-1">
                                                    <span className="text-white text-sm">📞</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white">Phone</h4>
                                                    <p className="text-gray-400">{contactInfo.phone}</p>
                                                </div>
                                            </div>

                                            {(contactInfo.description_1 || contactInfo.description_2) && (
                                                <div className="pt-4 border-t border-gray-700">
                                                    {contactInfo.description_1 && (
                                                        <p className="text-gray-400 text-sm mb-2">{contactInfo.description_1}</p>
                                                    )}
                                                    {contactInfo.description_2 && (
                                                        <p className="text-gray-400 text-sm">{contactInfo.description_2}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center flex-shrink-0 mt-1">
                                                    <span className="text-white text-sm">📧</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white">Email</h4>
                                                    <p className="text-gray-400">info@youtubers.com</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center flex-shrink-0 mt-1">
                                                    <span className="text-white text-sm">📞</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white">Phone</h4>
                                                    <p className="text-gray-400">+1 (555) 123-4567</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Social Media Links */}
                                {contactInfo && (
                                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                        <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
                                        <div className="flex space-x-4">
                                            {contactInfo.fb_handle && (
                                                <a
                                                    href={`https://facebook.com/${contactInfo.fb_handle}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white hover:bg-orange-700 transition-colors"
                                                >
                                                    <span className="text-sm">📘</span>
                                                </a>
                                            )}
                                            {contactInfo.insta_handle && (
                                                <a
                                                    href={`https://instagram.com/${contactInfo.insta_handle}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white hover:bg-orange-700 transition-colors"
                                                >
                                                    <span className="text-sm">📷</span>
                                                </a>
                                            )}
                                            {contactInfo.youtube_handle && (
                                                <a
                                                    href={`https://youtube.com/${contactInfo.youtube_handle}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white hover:bg-orange-700 transition-colors"
                                                >
                                                    <span className="text-sm">🎬</span>
                                                </a>
                                            )}
                                            {contactInfo.twitter_handle && (
                                                <a
                                                    href={`https://twitter.com/${contactInfo.twitter_handle}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white hover:bg-orange-700 transition-colors"
                                                >
                                                    <span className="text-sm">🐦</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Business Hours */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <h3 className="text-xl font-bold text-white mb-4">Business Hours</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Monday - Friday:</span>
                                            <span className="text-white">9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Saturday:</span>
                                            <span className="text-white">10:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Sunday:</span>
                                            <span className="text-white">Closed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-800 py-16">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        <span className="text-gradient-light">Frequently Asked Questions</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-2">How do I book a YouTuber?</h3>
                            <p className="text-gray-400 text-sm">Browse our directory, select a YouTuber, and use the contact form to discuss your requirements and pricing.</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-2">What's the typical response time?</h3>
                            <p className="text-gray-400 text-sm">We typically respond within 24 hours. Most YouTubers respond within 48 hours of initial contact.</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-2">Can I negotiate pricing?</h3>
                            <p className="text-gray-400 text-sm">Yes! Pricing can often be negotiated based on project scope, duration, and specific requirements.</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-2">Do you offer custom packages?</h3>
                            <p className="text-gray-400 text-sm">Absolutely! We can create custom collaboration packages tailored to your specific needs and budget.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact; 