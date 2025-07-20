import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const About = () => {
    const [homeData, setHomeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/home-data/');
                setHomeData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 py-20">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative container-custom">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            About <span className="text-orange-500">YouTubers</span> Platform
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            Connecting brands with authentic creators to build meaningful partnerships
                            and create engaging content that resonates with audiences worldwide.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/youtubers"
                                className="btn-primary px-8 py-4 text-lg font-semibold"
                            >
                                Explore Creators
                            </Link>
                            <Link
                                to="/contact"
                                className="btn-secondary px-8 py-4 text-lg font-semibold"
                            >
                                Partner With Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 bg-gray-800">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6 text-orange-500">Our Mission</h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                We believe in the power of authentic storytelling. Our mission is to bridge
                                the gap between talented content creators and brands seeking genuine connections
                                with their target audiences.
                            </p>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                By providing a seamless platform for collaboration, we empower YouTubers to
                                monetize their creativity while helping brands reach engaged communities through
                                trusted voices.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-8 text-center">
                                <h3 className="text-2xl font-bold mb-4">Platform Statistics</h3>
                                {homeData?.stats && (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-3xl font-bold">{homeData.stats.total_youtubers}+</div>
                                            <div className="text-sm opacity-90">Active Creators</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold">{homeData.stats.total_brands}+</div>
                                            <div className="text-sm opacity-90">Partner Brands</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold">{homeData.stats.total_collaborations}+</div>
                                            <div className="text-sm opacity-90">Collaborations</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold">{homeData.stats.total_revenue}+</div>
                                            <div className="text-sm opacity-90">Revenue Generated</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-900">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-6">How It Works</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Our platform makes it easy for creators and brands to find each other and build successful partnerships
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors">
                                <span className="text-2xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Discover Creators</h3>
                            <p className="text-gray-400">
                                Browse our curated selection of talented YouTubers across various categories.
                                Filter by niche, audience size, and engagement rates.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors">
                                <span className="text-2xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Connect & Collaborate</h3>
                            <p className="text-gray-400">
                                Reach out to creators directly through our platform. Discuss collaboration
                                ideas, negotiate terms, and plan your content strategy together.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors">
                                <span className="text-2xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Create & Grow</h3>
                            <p className="text-gray-400">
                                Launch successful campaigns, track performance metrics, and build
                                long-term relationships that benefit both creators and brands.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-800">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-6">Why Choose Our Platform</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            We provide everything you need for successful creator-brand partnerships
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
                            <div className="text-orange-500 text-3xl mb-4">🎯</div>
                            <h3 className="text-xl font-bold mb-3">Targeted Matching</h3>
                            <p className="text-gray-300">
                                Our algorithm matches brands with creators based on audience demographics,
                                interests, and engagement patterns.
                            </p>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
                            <div className="text-orange-500 text-3xl mb-4">📊</div>
                            <h3 className="text-xl font-bold mb-3">Analytics Dashboard</h3>
                            <p className="text-gray-300">
                                Track campaign performance with detailed analytics including reach,
                                engagement, and conversion metrics.
                            </p>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
                            <div className="text-orange-500 text-3xl mb-4">🔒</div>
                            <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
                            <p className="text-gray-300">
                                Built-in escrow system ensures secure payments and protects both
                                creators and brands throughout the collaboration.
                            </p>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
                            <div className="text-orange-500 text-3xl mb-4">📱</div>
                            <h3 className="text-xl font-bold mb-3">Mobile Optimized</h3>
                            <p className="text-gray-300">
                                Manage your partnerships on the go with our fully responsive
                                platform that works seamlessly on all devices.
                            </p>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
                            <div className="text-orange-500 text-3xl mb-4">🤝</div>
                            <h3 className="text-xl font-bold mb-3">Relationship Building</h3>
                            <p className="text-gray-300">
                                Foster long-term partnerships with built-in communication tools
                                and relationship management features.
                            </p>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
                            <div className="text-orange-500 text-3xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold mb-3">Fast Turnaround</h3>
                            <p className="text-gray-300">
                                Streamlined workflow ensures quick project initiation and
                                faster time-to-market for your campaigns.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            {homeData?.team_members && homeData.team_members.length > 0 && (
                <section className="py-20 bg-gray-900">
                    <div className="container-custom">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                The passionate individuals behind the platform, working to revolutionize creator-brand collaborations
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {homeData.team_members.map((member) => (
                                <div key={member.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group">
                                    <div className="relative">
                                        <img
                                            src={member.photo || 'https://via.placeholder.com/400x400?text=Team+Member'}
                                            alt={`${member.first_name} ${member.last_name}`}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">
                                            {member.first_name} {member.last_name}
                                        </h3>
                                        <p className="text-orange-500 font-medium mb-4">{member.role}</p>
                                        <div className="flex space-x-4">
                                            {member.linkedin_link && (
                                                <a
                                                    href={member.linkedin_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                                    title="LinkedIn"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {member.yt_link && (
                                                <a
                                                    href={member.yt_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="YouTube"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {member.fb_link && (
                                                <a
                                                    href={member.fb_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Facebook"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action Section */}
            <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-800">
                <div className="container-custom text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                        Join thousands of creators and brands who are already building successful partnerships on our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
                        >
                            Join as Creator
                        </Link>
                        <Link
                            to="/contact"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors inline-block"
                        >
                            Partner as Brand
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About; 