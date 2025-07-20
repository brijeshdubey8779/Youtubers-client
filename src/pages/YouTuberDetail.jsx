import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { youtubersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const YouTuberDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [youtuber, setYoutuber] = useState(null);
    const [relatedYoutubers, setRelatedYoutubers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showContactForm, setShowContactForm] = useState(false);

    // Apply dark theme to body
    useEffect(() => {
        document.body.classList.add('dark');
        return () => document.body.classList.remove('dark');
    }, []);

    useEffect(() => {
        const fetchYouTuberDetail = async () => {
            try {
                setLoading(true);

                // Fetch YouTuber detail
                const response = await youtubersAPI.getDetail(id);
                setYoutuber(response.data);

                // Fetch related YouTubers (same category)
                try {
                    const relatedResponse = await youtubersAPI.getList({
                        category: response.data.category,
                        limit: 3
                    });
                    setRelatedYoutubers(
                        relatedResponse.data.filter(yt => yt.id !== parseInt(id))
                    );
                } catch (relatedError) {
                    console.log('Could not fetch related YouTubers');
                }

            } catch (err) {
                console.error('Error fetching YouTuber detail:', err);
                if (err.response?.status === 404) {
                    setError('YouTuber not found');
                } else {
                    setError('Failed to load YouTuber details');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchYouTuberDetail();
        }
    }, [id]);

    const handleContactClick = () => {
        setShowContactForm(true);
    };

    const handleCloseContact = () => {
        setShowContactForm(false);
    };

    if (loading) return <LoadingSpinner text="Loading YouTuber profile..." />;

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/youtubers')}
                        className="btn btn-primary"
                    >
                        Back to YouTubers
                    </button>
                </div>
            </div>
        );
    }

    if (!youtuber) return null;

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* YouTuber Image */}
                        <div className="text-center lg:text-left">
                            <div className="relative inline-block">
                                <img
                                    src={youtuber.photo || 'https://via.placeholder.com/400x400?text=No+Image'}
                                    alt={youtuber.name}
                                    className="w-80 h-80 object-cover rounded-lg shadow-2xl mx-auto lg:mx-0"
                                />
                                {youtuber.is_featured && (
                                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Featured
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* YouTuber Info */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                {youtuber.name}
                            </h1>

                            <div className="flex items-center justify-center lg:justify-start mb-6">
                                <span className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium capitalize">
                                    {youtuber.category || 'Content Creator'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-800 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-orange-500">
                                        {youtuber.subs_count || 'N/A'}
                                    </div>
                                    <div className="text-gray-400 text-sm">Subscribers</div>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-orange-500">
                                        {youtuber.price ? `₹${youtuber.price}` : 'Contact'}
                                    </div>
                                    <div className="text-gray-400 text-sm">Starting Price</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={handleContactClick}
                                    className="btn btn-primary btn-lg"
                                >
                                    Contact Now
                                </button>
                                <Link
                                    to="/youtubers"
                                    className="btn btn-outline btn-lg"
                                >
                                    Browse More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Details */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                                <h2 className="text-2xl font-bold text-white mb-6">About {youtuber.name}</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-orange-400 mb-3">Basic Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-gray-400">Location:</span>
                                                <span className="text-white ml-2">{youtuber.city || 'Not specified'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Category:</span>
                                                <span className="text-white ml-2 capitalize">{youtuber.category || 'Content Creator'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Joined:</span>
                                                <span className="text-white ml-2">
                                                    {new Date(youtuber.created_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-orange-400 mb-3">Channel Stats</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-gray-400">Subscribers:</span>
                                                <span className="text-white ml-2">{youtuber.subs_count || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Featured:</span>
                                                <span className="text-white ml-2">
                                                    {youtuber.is_featured ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Starting Price:</span>
                                                <span className="text-white ml-2">
                                                    {youtuber.price ? `₹${youtuber.price}` : 'Contact for pricing'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div>
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-6">
                                <h3 className="text-xl font-bold text-white mb-4">Get in Touch</h3>
                                <p className="text-gray-400 mb-6">
                                    Ready to collaborate with {youtuber.name}? Let's discuss your project!
                                </p>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleContactClick}
                                        className="btn btn-primary w-full"
                                    >
                                        Send Message
                                    </button>
                                    <Link
                                        to="/contact"
                                        className="btn btn-outline w-full"
                                    >
                                        General Inquiry
                                    </Link>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                                        Quick Info
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Response Time:</span>
                                            <span className="text-white">24 hours</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Booking:</span>
                                            <span className="text-white">Available</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related YouTubers */}
            {relatedYoutubers.length > 0 && (
                <section className="section-padding bg-gray-800">
                    <div className="container-custom">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">
                            <span className="text-gradient-light">Similar YouTubers</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedYoutubers.map((relatedYoutuber) => (
                                <div key={relatedYoutuber.id} className="youtuber-card">
                                    <div className="relative">
                                        <img
                                            src={relatedYoutuber.photo || 'https://via.placeholder.com/300x300?text=No+Image'}
                                            alt={relatedYoutuber.name}
                                            className="youtuber-card-image"
                                        />
                                        {relatedYoutuber.is_featured && (
                                            <div className="youtuber-card-badge">Featured</div>
                                        )}
                                    </div>

                                    <div className="card-body">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {relatedYoutuber.name}
                                        </h3>

                                        <p className="text-gray-400 text-center mb-4 capitalize">
                                            {relatedYoutuber.category || 'Content Creator'}
                                        </p>

                                        <div className="youtuber-info-grid">
                                            <div className="youtuber-info-item">
                                                <div className="text-xs">City</div>
                                                <div className="font-medium">{relatedYoutuber.city || 'N/A'}</div>
                                            </div>
                                            <div className="youtuber-info-item">
                                                <div className="text-xs">Price</div>
                                                <div className="font-medium">
                                                    {relatedYoutuber.price ? `₹${relatedYoutuber.price}` : 'Contact'}
                                                </div>
                                            </div>
                                            <div className="youtuber-info-item">
                                                <div className="text-xs">Subscribers</div>
                                                <div className="font-medium">{relatedYoutuber.subs_count || 'N/A'}</div>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <Link
                                                to={`/youtubers/${relatedYoutuber.id}`}
                                                className="btn btn-primary btn-sm w-full"
                                            >
                                                View Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Modal */}
            {showContactForm && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Contact {youtuber.name}</h3>
                            <button
                                onClick={handleCloseContact}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label className="form-label-dark">Your Name</label>
                                <input type="text" className="form-input-dark" placeholder="Enter your name" />
                            </div>
                            <div>
                                <label className="form-label-dark">Email</label>
                                <input type="email" className="form-input-dark" placeholder="Enter your email" />
                            </div>
                            <div>
                                <label className="form-label-dark">Project Details</label>
                                <textarea
                                    className="form-input-dark h-24"
                                    placeholder="Tell us about your collaboration idea..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="form-label-dark">Budget Range</label>
                                <select className="form-input-dark">
                                    <option value="">Select budget range</option>
                                    <option value="5000-10000">₹5,000 - ₹10,000</option>
                                    <option value="10000-25000">₹10,000 - ₹25,000</option>
                                    <option value="25000-50000">₹25,000 - ₹50,000</option>
                                    <option value="50000+">₹50,000+</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn btn-primary flex-1">
                                    Send Message
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseContact}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YouTuberDetail; 