'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/contexts/LanguageContext';

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
    companySize: string;
    description: string;
    agreeToTerms: boolean;
}

const ContactFormSection = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        companySize: '',
        description: '',
        agreeToTerms: false
    });

    const { t } = useTranslation();

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'This field is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'This field is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.companySize) {
            newErrors.companySize = 'This field is required';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitSuccess(false);

        try {
            const response = await fetch('/api/contact-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            const data = await response.json();

            setSubmitSuccess(true);

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                companyName: '',
                companySize: '',
                description: '',
                agreeToTerms: false
            });

            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Form submission error:', error);
            setErrors({ submit: 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className='bg-white py-8 md:py-12 lg:py-20'>
            <div className='containers mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 items-stretch gap-6 overflow-hidden rounded-3xl bg-gray-50 lg:grid-cols-2 lg:gap-0'>
                    {/* Left Side - Text Top, Image Bottom */}
                    <div className='flex min-h-[400px] flex-col overflow-hidden bg-black sm:min-h-[500px] lg:min-h-[700px] lg:rounded-l-3xl'>
                        {/* Text Content - Top */}
                        <div className='z-10 bg-black p-6 sm:p-8 lg:p-10'>
                            <h2 className='mb-3 text-2xl leading-tight font-medium text-white sm:text-3xl lg:mb-4 lg:text-4xl'>
                                {t('NewSimfinDes.esim_for_business.BusinessSection.contactSecTitle.title')}
                            </h2>
                            <p className='text-sm text-white/90 sm:text-base lg:text-lg'>
                                {t('NewSimfinDes.esim_for_business.BusinessSection.contactSecTitle.des')}
                            </p>
                        </div>

                        {/* Image Section - Bottom */}
                        <div className='relative flex-1'>
                            <Image
                                src='/images/esim-business/business-form.png'
                                alt='Contact us'
                                fill
                                className='object-cover'
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className='bg-gray-50 p-6 sm:p-8 lg:p-10'>
                        {submitSuccess && (
                            <div className='mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-800'>
                                <p className='font-medium'>Form submitted successfully!</p>
                                <p className='mt-1'>We&apos;ll get back to you soon.</p>
                            </div>
                        )}

                        {errors.submit && (
                            <div className='mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-800'>{errors.submit}</div>
                        )}

                        <form onSubmit={handleSubmit} className='space-y-5 lg:space-y-6'>
                            {/* Full Name */}
                            <div>
                                <label htmlFor='fullName' className='mb-2 block text-sm font-medium text-black'>
                                    Full name
                                </label>
                                <input
                                    type='text'
                                    id='fullName'
                                    name='fullName'
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder='Name Surname'
                                    className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-black/10 focus:outline-none sm:text-base ${
                                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.fullName && (
                                    <p className='mt-2 flex items-center gap-1 text-sm text-red-600'>
                                        <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                                            <path
                                                fillRule='evenodd'
                                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>

                            {/* Business Email */}
                            <div>
                                <label htmlFor='email' className='mb-2 block text-sm font-medium text-black'>
                                    Business email
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder='name@businessemail.com'
                                    className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-black/10 focus:outline-none sm:text-base ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.email && (
                                    <p className='mt-2 flex items-center gap-1 text-sm text-red-600'>
                                        <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                                            <path
                                                fillRule='evenodd'
                                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone (Optional) */}
                            <div>
                                <label htmlFor='phone' className='mb-2 block text-sm font-medium text-black'>
                                    Phone (optional)
                                </label>
                                <input
                                    type='tel'
                                    id='phone'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder='+00 00000 0000'
                                    className='w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-black/10 focus:outline-none sm:text-base'
                                />
                            </div>

                            {/* Company Name */}
                            <div>
                                <label htmlFor='companyName' className='mb-2 block text-sm font-medium text-black'>
                                    Company name
                                </label>
                                <input
                                    type='text'
                                    id='companyName'
                                    name='companyName'
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder='Name'
                                    className='w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-black/10 focus:outline-none sm:text-base'
                                />
                            </div>

                            {/* Company Size */}
                            <div>
                                <label htmlFor='companySize' className='mb-2 block text-sm font-medium text-black'>
                                    Company size
                                </label>
                                <select
                                    id='companySize'
                                    name='companySize'
                                    value={formData.companySize}
                                    onChange={handleChange}
                                    className={`w-full cursor-pointer appearance-none rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-black/10 focus:outline-none sm:text-base ${
                                        errors.companySize ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}>
                                    <option value=''>Select</option>
                                    <option value='1-10'>1-10 employees</option>
                                    <option value='11-50'>11-50 employees</option>
                                    <option value='51-200'>51-200 employees</option>
                                    <option value='201-500'>201-500 employees</option>
                                    <option value='500+'>500+ employees</option>
                                </select>
                                {errors.companySize && (
                                    <p className='mt-2 flex items-center gap-1 text-sm text-red-600'>
                                        <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                                            <path
                                                fillRule='evenodd'
                                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                        {errors.companySize}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor='description' className='mb-2 block text-sm font-medium text-black'>
                                    Description
                                </label>
                                <textarea
                                    id='description'
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder='Tell us more about your company and needs.'
                                    className='w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-black/10 focus:outline-none sm:text-base'
                                />
                            </div>

                            {/* Terms Checkbox */}
                            <div>
                                <div className='flex items-start gap-3'>
                                    <input
                                        type='checkbox'
                                        id='agreeToTerms'
                                        name='agreeToTerms'
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className='mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-black focus:ring-2 focus:ring-black/10'
                                    />
                                    <label htmlFor='agreeToTerms' className='text-xs text-gray-600 sm:text-sm'>
                                        By filling out this form, you are agreeing to{' '}
                                        <Link href='/terms' className='text-black underline'>
                                            Business Terms of Service
                                        </Link>
                                        . Your personal data will be processed in accordance with our{' '}
                                        <Link href='/privacy' className='text-black underline'>
                                            Privacy Policy
                                        </Link>
                                        .
                                    </label>
                                </div>
                                {errors.agreeToTerms && (
                                    <p className='mt-2 flex items-center gap-1 text-sm text-red-600'>
                                        <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                                            <path
                                                fillRule='evenodd'
                                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                        {errors.agreeToTerms}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full rounded-full bg-black py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:py-4 sm:text-base'>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactFormSection;
