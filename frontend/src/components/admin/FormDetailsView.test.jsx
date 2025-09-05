import React from 'react';
import FormDetailsView from './FormDetailsView';

// Sample form data for testing the enhanced human-readable features
const sampleFormData = {
    form_name: 'BrandKit Form',
    user_fullname: 'John Doe',
    user_email: 'john.doe@example.com',
    contact_number: '+1234567890',
    primary_location: 'New York, NY',
    created_at: '2025-01-15T10:30:00Z',
    business_name: 'Acme Corporation',
    industry: ['Technology', 'SaaS'],
    year_started: 2020,
    building_type: 'business',
    brand_description: 'A leading technology company focused on innovative solutions for modern businesses.',
    mission_statement: 'To empower businesses with cutting-edge technology solutions that drive growth and efficiency.',
    long_term_vision: 'To become the global leader in business technology solutions, helping companies transform their digital presence.',
    core_values: ['Innovation', 'Quality', 'Customer Focus', 'Integrity'],
    tagline: 'Empowering Your Success',
    primary_customers: ['Small Business', 'Enterprise'],
    target_professions: ['Managers', 'Entrepreneurs', 'IT Professionals'],
    age_groups: ['25-34', '35-44', '45-54'],
    desired_emotion: 'Confident',
    target_interests: ['Technology', 'Business Growth', 'Innovation'],
    preferred_colors: ['Blue', 'Green', 'White'],
    colors_to_avoid: ['Red', 'Orange', 'Pink'],
    font_styles: ['Modern', 'Clean', 'Professional'],
    design_style: ['Minimalist', 'Professional', 'Contemporary'],
    imagery_style: ['Corporate', 'Clean', 'Modern'],
    primary_goal: 'Increase market share by 50% within the next 18 months through strategic partnerships and innovative product development.',
    short_term_goals: 'Launch new product line, expand to 3 new markets, achieve 25% revenue growth',
    timeline: '3-6 months',
    success_metrics: ['Revenue Growth', 'Customer Satisfaction', 'Market Share'],
    has_social_media: 'yes',
    social_media_platforms: ['LinkedIn', 'Twitter', 'Facebook'],
    has_website: 'yes',
    website_url: 'https://acme.com',
    want_website: 'improve'
};

const TestFormDetailsView = () => {
    const [showModal, setShowModal] = React.useState(false);

    const handleExport = (form, format) => {
        console.log(`Exporting ${form.form_name} as ${format}`);
        alert(`Exporting ${form.form_name} as ${format}`);
    };

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    FormDetailsView Component Test
                </h1>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Enhanced Human-Readable Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-blue-900 mb-2">✅ Improved Field Labels</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• "Client Name" instead of "user_fullname"</li>
                                <li>• "Phone Number" instead of "contact_number"</li>
                                <li>• "Form Submitted" instead of "created_at"</li>
                                <li>• "Year Established" instead of "year_started"</li>
                                <li>• "Vision Statement" instead of "long_term_vision"</li>
                            </ul>
                        </div>

                        <div className="bg-green-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-green-900 mb-2">✅ Field Descriptions</h3>
                            <ul className="text-sm text-green-800 space-y-1">
                                <li>• Each field has helpful descriptions</li>
                                <li>• Explains what the field represents</li>
                                <li>• Provides context for non-technical users</li>
                                <li>• Makes data interpretation easier</li>
                            </ul>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-purple-900 mb-2">✅ Better Data Formatting</h3>
                            <ul className="text-sm text-purple-800 space-y-1">
                                <li>• Arrays converted to readable lists</li>
                                <li>• Yes/No values properly capitalized</li>
                                <li>• Dates formatted as "January 15, 2025"</li>
                                <li>• Business types humanized</li>
                            </ul>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-orange-900 mb-2">✅ Enhanced Layout</h3>
                            <ul className="text-sm text-orange-800 space-y-1">
                                <li>• Larger modal for better content display</li>
                                <li>• Improved responsive grid layout</li>
                                <li>• Hover effects on cards</li>
                                <li>• Better spacing and typography</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold"
                    >
                        🧪 Test Enhanced FormDetailsView
                    </button>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Sample Data Being Tested
                    </h3>
                    <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Client:</strong> {sampleFormData.user_fullname}</p>
                        <p><strong>Business:</strong> {sampleFormData.business_name}</p>
                        <p><strong>Industry:</strong> {sampleFormData.industry.join(', ')}</p>
                        <p><strong>Year Started:</strong> {sampleFormData.year_started}</p>
                        <p><strong>Has Social Media:</strong> {sampleFormData.has_social_media}</p>
                        <p><strong>Website Plans:</strong> {sampleFormData.want_website}</p>
                    </div>
                </div>
            </div>

            {/* Test the enhanced FormDetailsView component */}
            {showModal && (
                <FormDetailsView
                    form={sampleFormData}
                    onClose={() => setShowModal(false)}
                    onExport={handleExport}
                    exporting={false}
                />
            )}
        </div>
    );
};

export default TestFormDetailsView;
