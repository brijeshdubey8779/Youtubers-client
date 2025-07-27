import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const CollaborationInquiryForm = ({ youtuber, onClose, onSuccess }) => {
    const { user, isAuthenticated } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Basic Information
        company_name: '',
        first_name: '',
        last_name: '',
        email: user?.email || '',
        phone: '',
        website: '',
        industry: '',

        // Step 2: Project Details
        project_title: '',
        project_description: '',
        campaign_objective: '',
        target_age_groups: [],
        target_gender: '',
        target_location: '',

        // Step 3: Budget & Timeline
        budget_range: '',
        custom_budget: '',
        timeline: '',
        deadline_date: '',

        // Step 4: Content Requirements
        content_types: [],
        video_length: '',
        key_messages: '',
        call_to_action: '',
        content_guidelines: '',

        // Step 5: Additional Preferences
        deliverables: [],
        exclusivity: '',
        long_term_interest: '',
        additional_requirements: '',

        // System fields
        youtuber_id: youtuber?.id,
        inquiry_type: 'collaboration'
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoSaveTimer, setAutoSaveTimer] = useState(null);

    const formSteps = [
        'Basic Information',
        'Project Details',
        'Budget & Timeline',
        'Content Requirements',
        'Additional Preferences',
        'Review & Submit'
    ];

    const industries = [
        'Technology', 'Fashion', 'Food & Beverage', 'Gaming', 'Education',
        'Health & Fitness', 'Beauty & Cosmetics', 'Travel', 'Finance',
        'Automotive', 'Entertainment', 'Real Estate', 'Other'
    ];

    const campaignObjectives = [
        'Brand Awareness', 'Product Launch', 'Lead Generation',
        'Sales Conversion', 'Event Promotion', 'Other'
    ];

    const ageGroups = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'];

    const budgetRanges = [
        { value: '500-1000', label: 'Under $1,000' },
        { value: '1000-5000', label: '$1,000 - $5,000' },
        { value: '5000-10000', label: '$5,000 - $10,000' },
        { value: '10000-25000', label: '$10,000 - $25,000' },
        { value: '25000-50000', label: '$25,000 - $50,000' },
        { value: '50000+', label: '$50,000+' },
        { value: 'negotiable', label: 'Budget Negotiable' },
        { value: 'custom', label: 'Custom Amount' }
    ];

    const timelineOptions = [
        'ASAP (within 1 week)', '2-4 weeks', '1-2 months',
        '2-3 months', 'Flexible'
    ];

    const contentTypes = [
        'Dedicated Video Review', 'Product Integration/Placement',
        'Sponsored Segment', 'Full Sponsored Video', 'YouTube Shorts',
        'Live Stream Mention', 'Story Posts', 'Custom Content'
    ];

    const videoLengths = [
        '30 seconds - 1 minute', '1-3 minutes', '3-5 minutes',
        '5-10 minutes', '10+ minutes', "Creator's discretion"
    ];

    const deliverableOptions = [
        'Raw footage', 'Final edited video', 'Analytics report',
        'Social media cross-promotion', 'Usage rights for repurposing',
        'Behind-the-scenes content'
    ];

    const exclusivityOptions = [
        'Exclusive partnership (no competitors)',
        'Category exclusivity',
        'No exclusivity needed'
    ];

    // Auto-save functionality
    useEffect(() => {
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }

        const timer = setTimeout(() => {
            saveAsDraft();
        }, 30000); // Auto-save every 30 seconds

        setAutoSaveTimer(timer);

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [formData]);

    // Load draft if exists and set youtuber_id
    useEffect(() => {
        if (!youtuber?.id) return;

        // Always set the youtuber_id first
        setFormData(prev => {
            if (prev.youtuber_id !== youtuber.id) {
                return { ...prev, youtuber_id: youtuber.id };
            }
            return prev;
        });

        // Then try to load draft
        const savedDraft = localStorage.getItem(`inquiry_draft_${youtuber.id}`);
        if (savedDraft) {
            try {
                const draftData = JSON.parse(savedDraft);
                setFormData(prev => ({
                    ...prev,
                    ...draftData,
                    youtuber_id: youtuber.id // Ensure youtuber_id is always set correctly
                }));
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, [youtuber?.id]); // Only depend on youtuber.id

    const saveAsDraft = () => {
        localStorage.setItem(`inquiry_draft_${youtuber?.id}`, JSON.stringify(formData));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleMultiSelectChange = (field, value, checked) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
        }));
    };

    const validateStep = (step) => {
        const errors = {};

        switch (step) {
            case 1:
                if (!formData.company_name.trim()) errors.company_name = 'Company/Individual name is required';
                if (!formData.first_name.trim()) errors.first_name = 'First name is required';
                if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
                if (!formData.email.trim()) errors.email = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    errors.email = 'Please enter a valid email address';
                }
                break;
            case 2:
                if (!formData.project_title.trim()) errors.project_title = 'Project title is required';
                if (!formData.project_description.trim()) errors.project_description = 'Project description is required';
                else if (formData.project_description.length < 50) {
                    errors.project_description = 'Description must be at least 50 characters';
                }
                if (!formData.campaign_objective) errors.campaign_objective = 'Campaign objective is required';
                break;
            case 3:
                if (!formData.budget_range) errors.budget_range = 'Budget range is required';
                if (formData.budget_range === 'custom' && !formData.custom_budget) {
                    errors.custom_budget = 'Custom budget amount is required';
                }
                if (!formData.timeline) errors.timeline = 'Timeline is required';
                break;
            case 4:
                if (formData.content_types.length === 0) {
                    errors.content_types = 'Please select at least one content type';
                }
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 6));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const submitForm = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('access_token');

            // Map frontend budget ranges to backend expected values
            const mapBudgetRange = (frontendBudget, customBudget) => {
                if (frontendBudget === 'custom') {
                    const amount = parseInt(customBudget);
                    if (amount < 1000) return 'under_1k';
                    if (amount < 5000) return '1k_5k';
                    if (amount < 10000) return '5k_10k';
                    if (amount < 25000) return '10k_25k';
                    if (amount < 50000) return '25k_50k';
                    return 'over_50k';
                }

                const budgetMap = {
                    '500-1000': 'under_1k',
                    '1000-5000': '1k_5k',
                    '5000-10000': '5k_10k',
                    '10000-25000': '10k_25k',
                    '25000-50000': '25k_50k',
                    '50000+': 'over_50k',
                    'negotiable': 'negotiable'
                };

                return budgetMap[frontendBudget] || 'negotiable';
            };

            // Consolidate target audience information
            const consolidateTargetAudience = () => {
                const parts = [];

                if (formData.target_age_groups.length > 0) {
                    parts.push(`Age Groups: ${formData.target_age_groups.join(', ')}`);
                }
                if (formData.target_gender) {
                    parts.push(`Gender: ${formData.target_gender}`);
                }
                if (formData.target_location) {
                    parts.push(`Location: ${formData.target_location}`);
                }
                if (formData.campaign_objective) {
                    parts.push(`Campaign Objective: ${formData.campaign_objective}`);
                }

                return parts.join('\n');
            };

            // Consolidate deliverables and additional information
            const consolidateDeliverables = () => {
                const parts = [];

                if (formData.content_types.length > 0) {
                    parts.push(`Content Types: ${formData.content_types.join(', ')}`);
                }
                if (formData.video_length) {
                    parts.push(`Video Length: ${formData.video_length}`);
                }
                if (formData.deliverables.length > 0) {
                    parts.push(`Expected Deliverables: ${formData.deliverables.join(', ')}`);
                }
                if (formData.key_messages) {
                    parts.push(`Key Messages: ${formData.key_messages}`);
                }
                if (formData.call_to_action) {
                    parts.push(`Call to Action: ${formData.call_to_action}`);
                }
                if (formData.content_guidelines) {
                    parts.push(`Content Guidelines: ${formData.content_guidelines}`);
                }
                if (formData.exclusivity) {
                    parts.push(`Exclusivity: ${formData.exclusivity}`);
                }
                if (formData.long_term_interest) {
                    parts.push(`Long-term Partnership Interest: ${formData.long_term_interest}`);
                }
                if (formData.additional_requirements) {
                    parts.push(`Additional Requirements: ${formData.additional_requirements}`);
                }

                return parts.join('\n\n');
            };

            // Create comprehensive project description
            const createDetailedMessage = () => {
                const sections = [];

                sections.push(`PROJECT OVERVIEW:\n${formData.project_description}`);

                if (formData.industry) {
                    sections.push(`INDUSTRY: ${formData.industry}`);
                }

                const targetAudience = consolidateTargetAudience();
                if (targetAudience) {
                    sections.push(`TARGET AUDIENCE:\n${targetAudience}`);
                }

                const deliverables = consolidateDeliverables();
                if (deliverables) {
                    sections.push(`PROJECT DETAILS:\n${deliverables}`);
                }

                if (formData.deadline_date) {
                    sections.push(`SPECIFIC DEADLINE: ${formData.deadline_date}`);
                }

                return sections.join('\n\n---\n\n');
            };

            // Map the form data to backend expected format
            const submissionData = {
                // Required fields mapping
                youtuber: formData.youtuber_id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone || '',
                company_name: formData.company_name,
                website: formData.website || '',

                // Map inquiry details
                inquiry_type: formData.inquiry_type === 'collaboration' ? 'collaboration' : 'general',
                budget_range: mapBudgetRange(formData.budget_range, formData.custom_budget),
                project_timeline: formData.timeline,
                subject: formData.project_title,
                message: createDetailedMessage(),

                // Consolidate complex data into text fields
                target_audience: consolidateTargetAudience(),
                deliverables: consolidateDeliverables()
            };

            console.log('📤 Submitting mapped data:', submissionData);

            const response = await axios.post(
                `${API_BASE_URL}/youtubers/inquiry/`,
                submissionData,
                {
                    headers: {
                        'Authorization': token ? `Token ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Inquiry submitted successfully:', response.data);

            // Clear draft
            localStorage.removeItem(`inquiry_draft_${youtuber?.id}`);

            if (onSuccess) onSuccess(response.data);
        } catch (error) {
            console.error('❌ Error submitting inquiry:', error);
            console.error('❌ Error response:', error.response?.data);

            if (error.response?.data) {
                // Handle field-specific errors
                const backendErrors = error.response.data;
                const errorMessages = [];

                Object.keys(backendErrors).forEach(field => {
                    if (Array.isArray(backendErrors[field])) {
                        errorMessages.push(`${field}: ${backendErrors[field].join(', ')}`);
                    } else {
                        errorMessages.push(`${field}: ${backendErrors[field]}`);
                    }
                });

                setValidationErrors({
                    submit: errorMessages.length > 0
                        ? errorMessages.join('\n')
                        : 'Failed to submit inquiry. Please check your information and try again.'
                });
            } else {
                setValidationErrors({
                    submit: 'Network error. Please check your connection and try again.'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Company/Individual Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Your company or personal name"
                                />
                                {validationErrors.company_name && (
                                    <p className="text-red-400 text-sm mt-1">{validationErrors.company_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Industry/Niche
                                </label>
                                <select
                                    value={formData.industry}
                                    onChange={(e) => handleInputChange('industry', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select Industry</option>
                                    {industries.map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Your first name"
                                />
                                {validationErrors.first_name && (
                                    <p className="text-red-400 text-sm mt-1">{validationErrors.first_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Your last name"
                                />
                                {validationErrors.last_name && (
                                    <p className="text-red-400 text-sm mt-1">{validationErrors.last_name}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="your@email.com"
                                />
                                {validationErrors.email && (
                                    <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Website/Social Media
                            </label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Project Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Project Title *
                            </label>
                            <input
                                type="text"
                                value={formData.project_title}
                                onChange={(e) => handleInputChange('project_title', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="e.g., Product Launch Campaign for New Smartphone"
                            />
                            {validationErrors.project_title && (
                                <p className="text-red-400 text-sm mt-1">{validationErrors.project_title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Project Description * (minimum 50 characters)
                            </label>
                            <textarea
                                value={formData.project_description}
                                onChange={(e) => handleInputChange('project_description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Describe your project, what you're launching, and what you hope to achieve..."
                            />
                            <div className="flex justify-between items-center mt-1">
                                <span className={`text-sm ${formData.project_description.length < 50 ? 'text-red-400' : 'text-green-400'}`}>
                                    {formData.project_description.length}/50 characters minimum
                                </span>
                            </div>
                            {validationErrors.project_description && (
                                <p className="text-red-400 text-sm mt-1">{validationErrors.project_description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Campaign Objective *
                            </label>
                            <select
                                value={formData.campaign_objective}
                                onChange={(e) => handleInputChange('campaign_objective', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select Objective</option>
                                {campaignObjectives.map(objective => (
                                    <option key={objective} value={objective}>{objective}</option>
                                ))}
                            </select>
                            {validationErrors.campaign_objective && (
                                <p className="text-red-400 text-sm mt-1">{validationErrors.campaign_objective}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Target Age Groups (select all that apply)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {ageGroups.map(age => (
                                    <label key={age} className="flex items-center space-x-2 text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={formData.target_age_groups.includes(age)}
                                            onChange={(e) => handleMultiSelectChange('target_age_groups', age, e.target.checked)}
                                            className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                                        />
                                        <span>{age}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Target Gender
                                </label>
                                <select
                                    value={formData.target_gender}
                                    onChange={(e) => handleInputChange('target_gender', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="all">All</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Geographic Location
                                </label>
                                <select
                                    value={formData.target_location}
                                    onChange={(e) => handleInputChange('target_location', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select Location</option>
                                    <option value="local">Local</option>
                                    <option value="national">National</option>
                                    <option value="international">International</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Budget & Timeline</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Budget Range *
                            </label>
                            <div className="space-y-2">
                                {budgetRanges.map(budget => (
                                    <label key={budget.value} className="flex items-center space-x-3 text-gray-300 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            name="budget_range"
                                            value={budget.value}
                                            checked={formData.budget_range === budget.value}
                                            onChange={(e) => handleInputChange('budget_range', e.target.value)}
                                            className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 focus:ring-orange-500"
                                        />
                                        <span className="font-medium">{budget.label}</span>
                                    </label>
                                ))}
                            </div>
                            {validationErrors.budget_range && (
                                <p className="text-red-400 text-sm mt-1">{validationErrors.budget_range}</p>
                            )}
                        </div>

                        {formData.budget_range === 'custom' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Custom Budget Amount *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        value={formData.custom_budget}
                                        onChange={(e) => handleInputChange('custom_budget', e.target.value)}
                                        className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="5000"
                                        min="0"
                                    />
                                </div>
                                {validationErrors.custom_budget && (
                                    <p className="text-red-400 text-sm mt-1">{validationErrors.custom_budget}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Timeline *
                            </label>
                            <div className="space-y-2">
                                {timelineOptions.map(timeline => (
                                    <label key={timeline} className="flex items-center space-x-3 text-gray-300 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            name="timeline"
                                            value={timeline}
                                            checked={formData.timeline === timeline}
                                            onChange={(e) => handleInputChange('timeline', e.target.value)}
                                            className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 focus:ring-orange-500"
                                        />
                                        <span>{timeline}</span>
                                    </label>
                                ))}
                            </div>
                            {validationErrors.timeline && (
                                <p className="text-red-400 text-sm mt-1">{validationErrors.timeline}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Specific Deadline (optional)
                            </label>
                            <input
                                type="date"
                                value={formData.deadline_date}
                                onChange={(e) => handleInputChange('deadline_date', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Content Requirements</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Content Type * (select all that apply)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {contentTypes.map(type => (
                                    <label key={type} className="flex items-center space-x-2 text-gray-300 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.content_types.includes(type)}
                                            onChange={(e) => handleMultiSelectChange('content_types', type, e.target.checked)}
                                            className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm">{type}</span>
                                    </label>
                                ))}
                            </div>
                            {validationErrors.content_types && (
                                <p className="text-red-400 text-sm mt-1">{validationErrors.content_types}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Video Length Preference
                            </label>
                            <select
                                value={formData.video_length}
                                onChange={(e) => handleInputChange('video_length', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select Video Length</option>
                                {videoLengths.map(length => (
                                    <option key={length} value={length}>{length}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Key Messages (What specific points should be covered?)
                            </label>
                            <textarea
                                value={formData.key_messages}
                                onChange={(e) => handleInputChange('key_messages', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Key features to highlight, benefits to mention, specific talking points..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Call-to-Action Requirements
                            </label>
                            <input
                                type="text"
                                value={formData.call_to_action}
                                onChange={(e) => handleInputChange('call_to_action', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="e.g., Use discount code YOUTUBE20, Visit our website, Download our app"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Content Guidelines (Brand dos/don'ts)
                            </label>
                            <textarea
                                value={formData.content_guidelines}
                                onChange={(e) => handleInputChange('content_guidelines', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Brand guidelines, things to avoid, tone of voice, visual requirements..."
                            />
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Additional Preferences</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Deliverables Expected (select all that apply)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {deliverableOptions.map(deliverable => (
                                    <label key={deliverable} className="flex items-center space-x-2 text-gray-300 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.deliverables.includes(deliverable)}
                                            onChange={(e) => handleMultiSelectChange('deliverables', deliverable, e.target.checked)}
                                            className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm">{deliverable}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Exclusivity Requirements
                            </label>
                            <div className="space-y-2">
                                {exclusivityOptions.map(option => (
                                    <label key={option} className="flex items-center space-x-3 text-gray-300 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            name="exclusivity"
                                            value={option}
                                            checked={formData.exclusivity === option}
                                            onChange={(e) => handleInputChange('exclusivity', e.target.value)}
                                            className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 focus:ring-orange-500"
                                        />
                                        <span className="text-sm">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-3">
                                Long-term Partnership Interest
                            </label>
                            <div className="flex space-x-4">
                                {['Yes', 'No', 'Maybe'].map(option => (
                                    <label key={option} className="flex items-center space-x-2 text-gray-300">
                                        <input
                                            type="radio"
                                            name="long_term_interest"
                                            value={option}
                                            checked={formData.long_term_interest === option}
                                            onChange={(e) => handleInputChange('long_term_interest', e.target.value)}
                                            className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 focus:ring-orange-500"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Additional Requirements or Special Requests
                            </label>
                            <textarea
                                value={formData.additional_requirements}
                                onChange={(e) => handleInputChange('additional_requirements', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Any special requests, unique requirements, or additional information you'd like to share..."
                            />
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Review & Submit</h3>

                        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                            <div className="border-b border-gray-700 pb-4">
                                <h4 className="font-semibold text-white mb-2">Project Overview</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Company:</span>
                                        <span className="text-white ml-2">{formData.company_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Contact:</span>
                                        <span className="text-white ml-2">{formData.first_name} {formData.last_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Email:</span>
                                        <span className="text-white ml-2">{formData.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Industry:</span>
                                        <span className="text-white ml-2">{formData.industry || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-700 pb-4">
                                <h4 className="font-semibold text-white mb-2">Project Details</h4>
                                <div className="text-sm space-y-2">
                                    <div>
                                        <span className="text-gray-400">Title:</span>
                                        <span className="text-white ml-2">{formData.project_title}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Objective:</span>
                                        <span className="text-white ml-2">{formData.campaign_objective}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Description:</span>
                                        <div className="text-white mt-1 p-2 bg-gray-900 rounded text-xs">
                                            {formData.project_description}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-700 pb-4">
                                <h4 className="font-semibold text-white mb-2">Budget & Timeline</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Budget:</span>
                                        <span className="text-white ml-2">
                                            {formData.budget_range === 'custom'
                                                ? `$${formData.custom_budget}`
                                                : budgetRanges.find(b => b.value === formData.budget_range)?.label}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Timeline:</span>
                                        <span className="text-white ml-2">{formData.timeline}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Content Requirements</h4>
                                <div className="text-sm">
                                    <div className="mb-2">
                                        <span className="text-gray-400">Content Types:</span>
                                        <div className="text-white mt-1">
                                            {formData.content_types.length > 0
                                                ? formData.content_types.join(', ')
                                                : 'Not specified'
                                            }
                                        </div>
                                    </div>
                                    {formData.video_length && (
                                        <div>
                                            <span className="text-gray-400">Video Length:</span>
                                            <span className="text-white ml-2">{formData.video_length}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h5 className="text-yellow-200 font-medium">Important Notice</h5>
                                    <p className="text-yellow-100 text-sm mt-1">
                                        By submitting this inquiry, you agree that the creator may take up to 48 hours to respond.
                                        Please ensure all information is accurate as this will be used to evaluate your collaboration request.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {validationErrors.submit && (
                            <div className="bg-red-600 border border-red-700 text-white px-4 py-3 rounded">
                                {validationErrors.submit}
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Collaboration Inquiry</h2>
                        <p className="text-orange-100 text-sm">Partner with {youtuber?.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-orange-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">
                            Step {currentStep} of {formSteps.length}
                        </span>
                        <span className="text-sm text-gray-300">
                            {Math.round((currentStep / formSteps.length) * 100)}% Complete
                        </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / formSteps.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between mt-3">
                        {formSteps.map((step, index) => (
                            <div
                                key={index}
                                className={`text-xs text-center ${index + 1 <= currentStep ? 'text-orange-400' : 'text-gray-500'
                                    }`}
                                style={{ width: `${100 / formSteps.length}%` }}
                            >
                                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${index + 1 <= currentStep ? 'bg-orange-500' : 'bg-gray-600'
                                    }`}></div>
                                <span className="hidden sm:block">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
                    {renderStepContent()}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="px-4 py-2 text-gray-300 hover:text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>

                    <div className="flex space-x-3">
                        <button
                            onClick={saveAsDraft}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm"
                        >
                            Save Draft
                        </button>

                        {currentStep < 6 ? (
                            <button
                                onClick={nextStep}
                                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={submitForm}
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <span>Submit Inquiry</span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollaborationInquiryForm; 