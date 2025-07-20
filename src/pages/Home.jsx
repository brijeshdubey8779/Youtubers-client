import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { contentAPI, youtubersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const [homeData, setHomeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchKeywords, setSearchKeywords] = useState('');
    const teamScrollRef = useRef(null);
    const sliderScrollRef = useRef(null);

    // Apply dark theme to body
    useEffect(() => {
        document.body.classList.add('dark');
        return () => document.body.classList.remove('dark');
    }, []);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await contentAPI.getHomeData();
                setHomeData(response.data);
            } catch (err) {
                console.error('Error fetching home data:', err);
                setError('Failed to load content');
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // Auto-scroll functionality for team section
    useEffect(() => {
        const interval = setInterval(() => {
            if (teamScrollRef.current) {
                const scrollContainer = teamScrollRef.current;
                const scrollWidth = scrollContainer.scrollWidth;
                const clientWidth = scrollContainer.clientWidth;
                const currentScroll = scrollContainer.scrollLeft;

                if (currentScroll + clientWidth >= scrollWidth) {
                    scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
                }
            }
        }, 3000); // Auto scroll every 3 seconds

        return () => clearInterval(interval);
    }, [homeData?.team_members]);

    // Auto-scroll functionality for sliders
    useEffect(() => {
        const interval = setInterval(() => {
            if (sliderScrollRef.current && homeData?.sliders?.length > 1) {
                const scrollContainer = sliderScrollRef.current;
                const scrollWidth = scrollContainer.scrollWidth;
                const clientWidth = scrollContainer.clientWidth;
                const currentScroll = scrollContainer.scrollLeft;

                if (currentScroll + clientWidth >= scrollWidth) {
                    scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollContainer.scrollBy({ left: clientWidth, behavior: 'smooth' });
                }
            }
        }, 5000); // Auto scroll every 5 seconds for sliders

        return () => clearInterval(interval);
    }, [homeData?.sliders]);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchKeywords);
        // Implement search functionality
    };

    const scrollTeamLeft = () => {
        if (teamScrollRef.current) {
            teamScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollTeamRight = () => {
        if (teamScrollRef.current) {
            teamScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const scrollSliderLeft = () => {
        if (sliderScrollRef.current) {
            sliderScrollRef.current.scrollBy({ left: -sliderScrollRef.current.clientWidth, behavior: 'smooth' });
        }
    };

    const scrollSliderRight = () => {
        if (sliderScrollRef.current) {
            sliderScrollRef.current.scrollBy({ left: sliderScrollRef.current.clientWidth, behavior: 'smooth' });
        }
    };

    if (loading) return <LoadingSpinner text="Loading homepage..." />;
    if (error) return <div className="container-custom section-padding text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Slider Section */}
            {homeData?.sliders?.length > 0 && (
                <section className="relative h-screen overflow-hidden">
                    {/* Slider Navigation Buttons */}
                    {homeData.sliders.length > 1 && (
                        <>
                            <button
                                onClick={scrollSliderLeft}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-colors shadow-lg"
                            >
                                ‹
                            </button>
                            <button
                                onClick={scrollSliderRight}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-colors shadow-lg"
                            >
                                ›
                            </button>
                        </>
                    )}

                    {/* Slider Container */}
                    <div
                        ref={sliderScrollRef}
                        className="flex overflow-x-auto scrollbar-hide scroll-smooth h-full"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {homeData.sliders.map((slider) => (
                            <div key={slider.id} className="min-w-full h-full relative flex-shrink-0">
                                <img
                                    src={slider.photo_url}
                                    alt={slider.headline}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white max-w-4xl px-4">
                                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                            {slider.headline}
                                        </h1>
                                        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                                            {slider.subtitle}
                                        </p>
                                        <Link
                                            to="/youtubers"
                                            className="btn btn-primary btn-lg"
                                        >
                                            {slider.button_text}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Hero Section (fallback if no sliders) */}
            {(!homeData?.sliders || homeData.sliders.length === 0) && (
                <section className="hero-dark section-padding">
                    <div className="container-custom">
                        <div className="max-w-4xl">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                Invite youtubers in your event
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                                Make your content with youtubers and collaborate with them.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/youtubers" className="btn btn-primary btn-lg">
                                    Invite Youtuber
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Search Section */}
            <section className="search-section">
                <div className="container-custom">
                    <div className="max-w-2xl mx-auto text-center">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Enter Keywords"
                                value={searchKeywords}
                                onChange={(e) => setSearchKeywords(e.target.value)}
                                className="form-input-dark flex-1"
                            />
                            <button type="submit" className="btn btn-primary px-8">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Featured YouTubers */}
            {homeData?.featured_youtubers?.length > 0 && (
                <section className="section-padding bg-gray-900">
                    <div className="container-custom">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                <span className="text-gradient-light">Featured YTubers</span>
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                YTubers that did extra ordinary last month
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {homeData.featured_youtubers.map((youtuber) => (
                                <div key={youtuber.id} className="youtuber-card">
                                    <div className="relative">
                                        <img
                                            src={youtuber.photo_url}
                                            alt={youtuber.name}
                                            className="youtuber-card-image"
                                        />
                                        <div className="youtuber-card-badge">Featured</div>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {youtuber.name}
                                        </h3>
                                        <p className="text-gray-400 text-center mb-4 capitalize">
                                            {youtuber.category}
                                        </p>

                                        <div className="youtuber-info-grid">
                                            <div className="youtuber-info-item">
                                                City:<br />{youtuber.city}
                                            </div>
                                            <div className="youtuber-info-item">
                                                Price:<br />₹{youtuber.price}
                                            </div>
                                            <div className="youtuber-info-item">
                                                Subs:<br />{youtuber.subs_count}
                                            </div>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <Link
                                                to={`/youtubers/${youtuber.id}`}
                                                className="btn btn-primary btn-sm w-full"
                                            >
                                                View Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link to="/youtubers" className="btn btn-outline btn-lg">
                                View All YouTubers
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Statistics Section */}
            {homeData?.stats && (
                <section className="bg-gray-800 py-16">
                    <div className="container-custom">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-orange-500">
                                    {homeData.stats.total_youtubers}
                                </div>
                                <div className="text-gray-300">YouTubers</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-orange-500">
                                    {homeData.stats.featured_count}
                                </div>
                                <div className="text-gray-300">Featured</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-orange-500">
                                    {homeData.stats.categories?.length || 0}
                                </div>
                                <div className="text-gray-300">Categories</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-orange-500">24/7</div>
                                <div className="text-gray-300">Support</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Team Section - Horizontal Scrollable */}
            {homeData?.team_members?.length > 0 && (
                <section className="section-padding bg-gray-900">
                    <div className="container-custom">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                <span className="text-gradient-light">Our Amazing Team</span>
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Meet the team
                            </p>
                        </div>

                        <div className="relative">
                            {/* Scroll Buttons */}
                            <button
                                onClick={scrollTeamLeft}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-colors shadow-lg"
                            >
                                ‹
                            </button>
                            <button
                                onClick={scrollTeamRight}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-colors shadow-lg"
                            >
                                ›
                            </button>

                            {/* Scrollable Container */}
                            <div
                                ref={teamScrollRef}
                                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {homeData.team_members.map((member) => (
                                    <div key={member.id} className="team-card-dark flex-shrink-0 w-80">
                                        <div className="relative">
                                            <img
                                                src={member.photo_url || '/api/placeholder/300/300'}
                                                alt={`${member.first_name} ${member.last_name}`}
                                                className="w-full h-64 object-cover"
                                            />
                                        </div>
                                        <div className="p-6 text-center">
                                            <h3 className="text-lg font-semibold text-white mb-2">
                                                {member.first_name} {member.last_name}
                                            </h3>
                                            <p className="text-gray-400 mb-4">{member.role}</p>
                                            {member.yt_link && (
                                                <a
                                                    href={member.yt_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary w-full mb-4 inline-block"
                                                >
                                                    Visit on YT
                                                </a>
                                            )}
                                            <div className="flex justify-center space-x-3">
                                                {member.fb_link && (
                                                    <a
                                                        href={member.fb_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white hover:bg-orange-700 transition-colors"
                                                        title="Facebook"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                        </svg>
                                                    </a>
                                                )}
                                                {member.linkedin_link && (
                                                    <a
                                                        href={member.linkedin_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white hover:bg-orange-700 transition-colors"
                                                        title="LinkedIn"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="bg-orange-600 text-white section-padding">
                <div className="container-custom">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                Reach out to hire YTubers
                            </h2>
                        </div>
                        <div>
                            <Link to="/contact" className="btn bg-white text-orange-600 hover:bg-gray-100 btn-lg">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home; 