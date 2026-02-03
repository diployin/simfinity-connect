'use client';

import React, { useState } from 'react';

// ============================================
// TypeScript Interfaces
// ============================================

interface Step {
  number: string;
  stepTitle: string;
  description: string;
  image?: string;
}

interface TabData {
  label: string;
  title: string;
  steps: Step[];
  instructions?: {
    heading: string;
    steps: string[];
  };
}

interface EsimSetupTabProps {
  // Header Props (Optional)
  mainHeading?: string;
  mainDescription?: string;

  // Tab Data (Required)
  tabs: TabData[];

  // Styling Props (Optional)
  backgroundColor?: string;
  defaultTab?: number;
}

// ============================================
// Main Component
// ============================================

const EsimSetupTabCommon: React.FC<EsimSetupTabProps> = ({
  mainHeading = 'How to set up an eSIM',
  mainDescription = 'Follow these steps to start using an eSIM on your iPhone or Android.',
  tabs,
  backgroundColor = 'bg-white',
  defaultTab = 0,
}) => {
  const [activeTab, setActiveTab] = useState<number>(defaultTab);

  return (
    <section className={`w-full ${backgroundColor} `}>
      <div className="containers">
        {/* Header Section */}
        <div className="py-4 text-center md:text-start">
          <h2 className="lg:text-4.5xl text-3xl leading-tight font-medium text-gray-900 sm:text-4xl">
            {mainHeading}
          </h2>

          <p className="py-4 text-base leading-relaxed text-gray-600 sm:text-base">
            {mainDescription}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mb-8 flex w-fit flex-wrap justify-center gap-3 rounded-3xl border p-1 sm:justify-start">
          {tabs.map((tab: TabData, index: number) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`rounded-full px-4 py-1 text-base font-medium transition-all duration-200 ${
                activeTab === index ? 'bg-black text-white' : 'bg-white text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="animate-fadeIn">
          {/* Tab Title */}
          <h2 className="text-2.5xl lg:text-3.5xl mb-8 text-center leading-tight font-medium text-black sm:mb-12 sm:text-3xl md:text-start xl:text-3xl">
            {tabs[activeTab].title}
          </h2>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {tabs[activeTab].steps.map((step: Step, index: number) => (
              <div
                key={index}
                className={`flex flex-col overflow-hidden rounded-3xl bg-gray-100 ${
                  !step.image ? 'p-8 sm:p-6' : ''
                }`}
              >
                {/* Text Section */}
                <div className={`${step.image ? 'p-8 sm:p-6' : ''} flex-1 space-y-4`}>
                  {/* Step Number */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base font-medium text-black shadow-md">
                    {step.number}
                  </div>

                  {/* Step Title */}
                  <h3 className="text-xl leading-tight font-medium text-black sm:text-xl">
                    {step.stepTitle}
                  </h3>

                  {/* Step Description */}
                  <p className="text-base leading-relaxed text-gray-600">{step.description}</p>
                </div>

                {/* Conditional Image Section */}
                {step.image && (
                  <div className="relative flex h-[250px] items-center justify-center sm:h-[300px]">
                    <div className="relative mt-12 h-full w-full">
                      <img
                        src={step.image}
                        alt={step.stepTitle}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Optional Instructions Section */}
          {tabs[activeTab].instructions && (
            <div className="mt-16 sm:mt-20">
              <h3 className="sm:text-2.5xl mb-6 text-2xl leading-tight font-medium text-black lg:text-3xl">
                {tabs[activeTab].instructions.heading}
              </h3>

              <ol className="list-inside list-decimal space-y-3 text-base text-black marker:font-medium marker:text-gray-900 sm:text-base">
                {tabs[activeTab].instructions.steps.map((instruction: string, index: number) => (
                  <li key={index} className="leading-relaxed">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EsimSetupTabCommon;
