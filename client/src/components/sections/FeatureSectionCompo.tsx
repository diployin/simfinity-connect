import React from 'react';
import FeatureSection from '../FeatureSection';
import { useLocation } from 'wouter';

const FeatureSectionCompo = () => {
  const [, setLocation] = useLocation();
  return (
    <main>
      {/* First Section - Content Left, Image Right */}
      <FeatureSection
        title="Global Simfinityivity Made Simple"
        subtitle="Set up your eSIM in minutes. Choose your destination, activate instantly, and stay connected worldwide without physical SIM cards:"
        layout="right"
        imageSrc="/images/timeline/setup5.png"
        imageAlt=" Setup Interface"
        buttonText="GET STARTED"
        buttonAction={() => setLocation('/destinations')}
        showButton={true}
        features={[
          { text: 'Instant eSIM activation with QR code' },
          { text: 'High-speed data in 150+ countries' },
          { text: 'No physical SIM or roaming charges' },
        ]}
      />

      {/* Second Section - Image Left, Content Right */}
      <FeatureSection
        title="Fast and safe checkout process"
        layout="left"
        imageSrc="/images/timeline/setup3.png"
        imageAlt="Complete Secure Payment"
        buttonText="Proceed to Payment"
        buttonAction={() => setLocation('/destinations')}
        features={[
          { text: 'Pay using debit card, credit card, UPI, or wallets' },
          { text: '100% secure and encrypted transactions' },
          { text: 'Instant order confirmation after payment' },
          { text: 'No physical SIM or delivery required' },
        ]}
      />

      {/* Third Section - Another Example */}
      <FeatureSection
        title="24/7 Customer Support"
        layout="right"
        imageSrc="/images/timeline/setup1.png"
        imageAlt="Customer Support"
        buttonText="Contact Us"
        buttonAction={() => setLocation('/contact')}
        showButton={true}
        features={[
          { text: 'Round-the-clock availability' },
          { text: 'Multi-language support' },
          { text: 'Instant response time' },
        ]}
      />
    </main>
  );
};

export default FeatureSectionCompo;
