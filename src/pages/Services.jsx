import React from 'react';

const Services = () => {
    return (
        <div className="container-custom section-padding">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Our Services
                </h1>
                <p className="text-xl text-gray-600 mb-12">
                    Discover how we help brands and creators connect.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card card-body text-center">
                        <h3 className="text-xl font-semibold mb-4">Creator Discovery</h3>
                        <p className="text-gray-600">Find the perfect YouTubers for your brand</p>
                    </div>
                    <div className="card card-body text-center">
                        <h3 className="text-xl font-semibold mb-4">Campaign Management</h3>
                        <p className="text-gray-600">Manage your influencer campaigns with ease</p>
                    </div>
                    <div className="card card-body text-center">
                        <h3 className="text-xl font-semibold mb-4">Analytics & Reporting</h3>
                        <p className="text-gray-600">Track performance and measure ROI</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services; 