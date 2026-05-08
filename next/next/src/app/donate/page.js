'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DonatePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        amount: '',
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isAmountFocused, setIsAmountFocused] = useState(false);

    // Placeholder styles
    const placeholderStyles = {
        fontFamily: 'Fustat',
        fontWeight: 400,
        fontStyle: 'Regular',
        fontSize: '14px',
        lineHeight: '24px',
        letterSpacing: '1%',
        color: '#9CA3AF' // A gray color that matches common placeholder colors
    };

    const inputStyle = {
        fontFamily: 'Inter',
        fontSize: '16px',
        color: '#111827',
        height: '50px',
        borderRadius: '8px',
        border: '1px solid #D1D5DB',
        padding: '12px 20px',
        outline: 'none',
        boxSizing: 'border-box',
        '::placeholder': placeholderStyles
    };

    const textareaStyle = {
        ...inputStyle,
        height: '80px',
        resize: 'none',
        lineHeight: '1.5'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Donation submitted:', formData);

            // Store form data in sessionStorage
            sessionStorage.setItem('donationData', JSON.stringify(formData));

            // Use window.location instead of router.push for immediate navigation
            window.location.href = '/donate/donateDetails';
        } catch (error) {
            console.error('Error submitting donation:', error);
            alert('There was an error processing your donation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow bg-gray-50 py-[128px] px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="p-8 flex flex-col lg:flex-row gap-8">
                        {/* Left Section - Text Content */}
                        <div
                            className="lg:w-1/2"
                            style={{
                                width: '420px',
                                height: '175px',
                                opacity: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}
                        >
                            <h1
                                style={{
                                    fontFamily: 'Fustat',
                                    fontWeight: 700,
                                    fontStyle: 'normal',
                                    fontSize: '40px',
                                    lineHeight: '100%',
                                    letterSpacing: '0%',
                                    margin: 0,
                                    color: '#111827'  // text-gray-900 equivalent
                                }}
                            >
                                Donate
                            </h1>
                            <p
                                className="text-gray-600 leading-relaxed"
                                style={{ margin: 0 }}
                            >
                                Your support helps us continue our mission and make a difference in the community.
                                Every contribution, no matter the size, helps us create a better future for everyone.
                            </p>
                        </div>

                        {/* Right Section - Form */}
                        <div className="lg:w-1/2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Amount */}
                                <div>

                                    <div className="mb-4">
                                        <label
                                            htmlFor="amount"
                                            className="block text-gray-700 mb-2"
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 500,
                                                fontStyle: 'medium',
                                                fontSize: '20px',
                                                lineHeight: '140%',
                                                letterSpacing: '0%'
                                            }}
                                        >
                                            Amount
                                        </label>
                                        <div style={{ position: 'relative', width: '100%' }}>
                                            <input
                                                type="text"
                                                id="amount"
                                                name="amount"
                                                required
                                                value={formData.amount}
                                                onChange={handleChange}
                                                onFocus={() => setIsAmountFocused(true)}
                                                onBlur={() => setIsAmountFocused(false)}
                                                onPaste={(e) => {
                                                    // Get pasted data
                                                    const pastedData = e.clipboardData.getData('text/plain');
                                                    // Remove any non-numeric characters except decimal point
                                                    const numericValue = pastedData.replace(/[^0-9.]/g, '');
                                                    // Update the form data
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        amount: numericValue
                                                    }));
                                                    // Prevent the default paste action
                                                    e.preventDefault();
                                                }}
                                                className="w-full"
                                                placeholder={!isAmountFocused && !formData.amount ? "Enter amount" : ""}
                                                style={{
                                                    ...inputStyle,
                                                    ...(!isAmountFocused && !formData.amount && { '::placeholder': placeholderStyles })
                                                }}
                                            />
                                             {formData.amount === '' && (
                                            <span style={{
                                                position: 'absolute',
                                                left: '123px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: '#EF4444', // red-500
                                                pointerEvents: 'none'
                                            }}>*</span>
                                        )}
                                        </div>
                                    </div>

                                </div>

                                <div className=" border-gray-200 ">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Contributor Details</h2>

                                    {/* Name */}
                                    <div className="mb-4" style={{ position: 'relative', width: '100%' }}>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full"
                                            placeholder="Name"
                                            style={{
                                                ...inputStyle,
                                                '::placeholder': placeholderStyles
                                            }}
                                        />
                                          {formData.name === '' && (
                                        <span style={{
                                            position: 'absolute',
                                            left: '65px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#EF4444',
                                            pointerEvents: 'none'
                                        }}>*</span>
                                    )}
                                    </div>
                                    {/* Email */}
                                    <div className="mb-4" style={{ position: 'relative', width: '100%' }}>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full"
                                            placeholder="Email"
                                            style={{
                                                ...inputStyle,
                                                '::placeholder': placeholderStyles
                                            }}
                                        />

                                    </div>

                                    {/* Phone */}
                                    {/* Phone */}
                                    <div className="mb-4" style={{ position: 'relative', width: '100%' }}>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full"
                                            placeholder="Phone number"
                                            style={{
                                                ...inputStyle,
                                                '::placeholder': placeholderStyles
                                            }}
                                        />
                                        {formData.phone === '' && (
                                            <span style={{
                                                position: 'absolute',
                                                left: '137px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: '#EF4444',
                                                pointerEvents: 'none'
                                            }}>*</span>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className="mb-6" style={{ width: '100%' }}>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="3"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full"
                                            placeholder="Message"
                                            style={{
                                                fontFamily: 'Inter',
                                                fontSize: '16px',
                                                color: '#111827',
                                                height: '80px',
                                                borderRadius: '8px',
                                                border: '1px solid #D1D5DB',
                                                padding: '12px 20px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                resize: 'none',
                                                lineHeight: '1.5'
                                            }}
                                        ></textarea>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition duration-200 disabled:opacity-70"
                                >
                                    {isLoading ? 'Processing...' : 'SEND'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}