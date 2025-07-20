import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { youtubersAPI, staticAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const YouTubers = () => {
    const [youtubers, setYouTubers] = useState([]);
    const [filteredYoutubers, setFilteredYoutubers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Available options
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);

    // Apply dark theme to body
    useEffect(() => {
        document.body.classList.add('dark');
        return () => document.body.classList.remove('dark');
    }, []);

    // Fetch YouTubers and categories on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch YouTubers
                const youtubersResponse = await youtubersAPI.getList();
                console.log('API Response:', youtubersResponse.data);

                // Handle both paginated and non-paginated responses
                let youtubersData;
                if (youtubersResponse.data.results) {
                    // Paginated response
                    youtubersData = youtubersResponse.data.results;
                } else if (Array.isArray(youtubersResponse.data)) {
                    // Direct array response
                    youtubersData = youtubersResponse.data;
                } else {
                    // Fallback - treat as empty array
                    youtubersData = [];
                }

                console.log('Processed YouTubers Data:', youtubersData);

                setYouTubers(youtubersData);
                setFilteredYoutubers(youtubersData);

                // Extract unique categories and cities from YouTubers data
                const uniqueCategories = [...new Set(youtubersData.map(yt => yt.category).filter(Boolean))];
                const uniqueCities = [...new Set(youtubersData.map(yt => yt.city).filter(Boolean))];

                setCategories(uniqueCategories);
                setCities(uniqueCities);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load YouTubers data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter and sort YouTubers whenever filters change
    useEffect(() => {
        let filtered = [...youtubers];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(yt =>
                yt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                yt.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                yt.city?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter(yt => yt.category === selectedCategory);
        }

        // Apply city filter
        if (selectedCity) {
            filtered = filtered.filter(yt => yt.city === selectedCity);
        }

        // Apply price range filter
        if (priceRange.min || priceRange.max) {
            filtered = filtered.filter(yt => {
                const price = yt.price || 0;
                const min = priceRange.min ? parseInt(priceRange.min) : 0;
                const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
                return price >= min && price <= max;
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = a.price || 0;
                    bValue = b.price || 0;
                    break;
                case 'subs_count':
                    // Convert subs count string to number for sorting
                    aValue = parseSubscriberCount(a.subs_count);
                    bValue = parseSubscriberCount(b.subs_count);
                    break;
                case 'created_date':
                    aValue = new Date(a.created_date);
                    bValue = new Date(b.created_date);
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredYoutubers(filtered);
    }, [youtubers, searchTerm, selectedCategory, selectedCity, priceRange, sortBy, sortOrder]);

    // Helper function to parse subscriber count (e.g., "5.4M" -> 5400000)
    const parseSubscriberCount = (subsCount) => {
        if (!subsCount) return 0;
        const num = parseFloat(subsCount);
        if (subsCount.includes('M')) return num * 1000000;
        if (subsCount.includes('K')) return num * 1000;
        return num;
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedCity('');
        setPriceRange({ min: '', max: '' });
        setSortBy('name');
        setSortOrder('asc');
    };

    if (loading) return <LoadingSpinner text="Loading YouTubers..." />;
    if (error) return <div className="container-custom section-padding text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="container-custom section-padding">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <span className="text-gradient-light">YouTubers Directory</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover and connect with talented content creators from across the country
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <div>
                            <label className="form-label-dark">Search</label>
                            <input
                                type="text"
                                placeholder="Search by name, category, city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input-dark"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="form-label-dark">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="form-input-dark"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* City Filter */}
                        <div>
                            <label className="form-label-dark">City</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="form-input-dark"
                            >
                                <option value="">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="form-label-dark">Sort By</label>
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-input-dark flex-1"
                                >
                                    <option value="name">Name</option>
                                    <option value="price">Price</option>
                                    <option value="subs_count">Subscribers</option>
                                    <option value="created_date">Latest</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="btn btn-secondary px-3"
                                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="form-label-dark">Min Price (₹)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                className="form-input-dark"
                            />
                        </div>
                        <div>
                            <label className="form-label-dark">Max Price (₹)</label>
                            <input
                                type="number"
                                placeholder="No limit"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                className="form-input-dark"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="btn btn-outline w-full"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-gray-400 text-sm">
                        Showing {filteredYoutubers.length} of {youtubers.length} YouTubers
                    </div>
                </div>

                {/* YouTubers Grid */}
                {filteredYoutubers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-xl mb-4">No YouTubers found</div>
                        <p className="text-gray-500">Try adjusting your search criteria or clear filters</p>
                        <button
                            onClick={clearFilters}
                            className="btn btn-primary mt-4"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredYoutubers.map((youtuber) => (
                            <div key={youtuber.id} className="youtuber-card group">
                                <div className="relative">
                                    <img
                                        src={youtuber.photo || 'https://via.placeholder.com/300x300?text=No+Image'}
                                        alt={youtuber.name}
                                        className="youtuber-card-image group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {youtuber.is_featured && (
                                        <div className="youtuber-card-badge">Featured</div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                                </div>

                                <div className="card-body">
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                        {youtuber.name}
                                    </h3>

                                    <p className="text-gray-400 text-center mb-4 capitalize">
                                        {youtuber.category || 'Content Creator'}
                                    </p>

                                    <div className="youtuber-info-grid">
                                        <div className="youtuber-info-item">
                                            <div className="text-xs">City</div>
                                            <div className="font-medium">{youtuber.city || 'N/A'}</div>
                                        </div>
                                        <div className="youtuber-info-item">
                                            <div className="text-xs">Price</div>
                                            <div className="font-medium">
                                                {youtuber.price ? `₹${youtuber.price}` : 'Contact'}
                                            </div>
                                        </div>
                                        <div className="youtuber-info-item">
                                            <div className="text-xs">Subscribers</div>
                                            <div className="font-medium">{youtuber.subs_count || 'N/A'}</div>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-2">
                                        <Link
                                            to={`/youtubers/${youtuber.id}`}
                                            className="btn btn-primary w-full group-hover:bg-orange-700 transition-colors"
                                        >
                                            View Profile
                                        </Link>
                                        <button className="btn btn-outline w-full">
                                            Contact Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More Button (if pagination is needed) */}
                {filteredYoutubers.length > 0 && (
                    <div className="text-center mt-12">
                        <Link to="/contact" className="btn btn-primary btn-lg">
                            Contact Us for More YouTubers
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YouTubers; 