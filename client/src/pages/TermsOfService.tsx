import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/contexts/TranslationContext';

export default function TermsOfService() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <Helmet>
        <title>Terms of Service - Voltey</title>
        <meta
          name="description"
          content="Read Voltey's terms of service to understand the rules and conditions for using our eSIM marketplace platform."
        />
      </Helmet>

      {/* <SiteHeader /> */}

      <main className="flex-1 py-16 md:py-24 pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.title', 'Terms of Service')}</h1>
            <p className="text-muted-foreground dark:text-gray-400 mb-10">{t('terms.lastUpdated', 'Last updated: December 2024')}</p>

            <div className="prose prose-lg dark:prose-invert max-w-none legal-text-block">
              <section className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.sec1Title', '1. Acceptance of Terms')}</h2>
                <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                  By accessing and using Voltey, you agree to be bound by these Terms of
                  Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.sec2Title', '2. Services Description')}</h2>
                <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                  Voltey provides digital eSIM data plans for international travel. Our
                  service allows you to purchase, activate, and manage eSIM profiles directly from
                  your compatible device.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.sec3Title', '3. Account Registration')}</h2>
                <p className="text-muted-foreground dark:text-gray-400 mb-4">{t('terms.sec3Desc', 'To use our services, you must:')}</p>
                <ul className="list-disc pl-6 text-muted-foreground dark:text-gray-400 space-y-3">
                  <li>{t('terms.sec3Item1', 'Be at least 18 years old or have parental consent')}</li>
                  <li>{t('terms.sec3Item2', 'Provide accurate and complete registration information')}</li>
                  <li>{t('terms.sec3Item3', 'Maintain the security of your account credentials')}</li>
                  <li>{t('terms.sec3Item4', 'Notify us immediately of any unauthorized access')}</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.sec4Title', '4. Purchases and Payments')}</h2>
                <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                  All purchases are final once the eSIM QR code has been delivered. Prices are
                  displayed in various currencies and include applicable taxes. We accept major
                  credit cards and other payment methods as displayed at checkout.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.sec5Title', '5. eSIM Activation')}</h2>
                <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                  eSIM activation requires a compatible device. It is your responsibility to verify
                  device compatibility before purchase. Once activated, eSIM profiles cannot be
                  transferred to another device.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.sec6Title', '6. Usage Policies')}</h2>
                <p className="text-muted-foreground dark:text-gray-400 mb-4">
                  You agree to use our services only for lawful purposes. Prohibited activities
                  include:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground dark:text-gray-400 space-y-3">
                  <li>{t('terms.sec6Item1', 'Reselling eSIM products without authorization')}</li>
                  <li>{t('terms.sec6Item2', 'Using services for illegal activities')}</li>
                  <li>{t('terms.sec6Item3', 'Attempting to circumvent security measures')}</li>
                  <li>Interfering with other users' access to services</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.sec7Title', '7. Limitation of Liability')}</h2>
                <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                  Voltey shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages arising from your use of our services. Network
                  coverage and speeds are subject to carrier availability and local conditions.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.sec8Title', '8. Changes to Terms')}</h2>
                <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                  We reserve the right to modify these terms at any time. Continued use of our
                  services after changes constitutes acceptance of the modified terms.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('terms.sec9Title', '9. Contact Information')}</h2>
                <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">{t('terms.sec9Desc', 'For questions about these Terms of Service, please contact us at:')}<br />
                  <a href="mailto:support@simfinity.tel" className="text-primary hover:underline font-semibold mt-2 inline-block">
                    support@simfinity.tel
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* <SiteFooter /> */}
    </div>
  );
}
