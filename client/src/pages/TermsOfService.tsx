import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/contexts/TranslationContext';

export default function TermsOfService() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{t('terms.pageTitle', 'Terms of Service - Simfinity')}</title>
        <meta
          name="description"
          content={t('terms.pageMeta', 'Read Simfinity\'s terms of service to understand the rules and conditions for using our eSIM marketplace platform.')}
        />
      </Helmet>

      {/* <SiteHeader /> */}

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 ">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">{t('terms.title', 'Terms of Service')}</h1>
            <p className="text-muted-foreground mb-8">{t('terms.lastUpdated', 'Last updated: December 2024')}</p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('terms.sec1Title', '1. Acceptance of Terms')}</h2>
                <p className="text-muted-foreground">
                  {t('terms.sec1Desc', 'By accessing and using Simfinity, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('terms.sec2Title', '2. Services Description')}</h2>
                <p className="text-muted-foreground">
                  {t('terms.sec2Desc', 'Simfinity provides digital eSIM data plans for international travel. Our service allows you to purchase, activate, and manage eSIM profiles directly from your compatible device.')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('terms.sec3Title', '3. Account Registration')}</h2>
                <p className="text-muted-foreground mb-4">{t('terms.sec3Desc', 'To use our services, you must:')}</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>{t('terms.sec3Item1', 'Be at least 18 years old or have parental consent')}</li>
                  <li>{t('terms.sec3Item2', 'Provide accurate and complete registration information')}</li>
                  <li>{t('terms.sec3Item3', 'Maintain the security of your account credentials')}</li>
                  <li>{t('terms.sec3Item4', 'Notify us immediately of any unauthorized access')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('terms.sec4Title', '4. Purchases and Payments')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('terms.sec4Desc', 'All purchases are final once the eSIM QR code has been delivered. Prices are displayed in various currencies and include applicable taxes. We accept major credit cards and other payment methods as displayed at checkout.')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('terms.sec5Title', '5. eSIM Activation')}</h2>
                <p className="text-muted-foreground">
                  {t('terms.sec5Desc', 'eSIM activation requires a compatible device. It is your responsibility to verify device compatibility before purchase. Once activated, eSIM profiles cannot be transferred to another device.')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('terms.sec6Title', '6. Usage Policies')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('terms.sec6Desc', 'You agree to use our services only for lawful purposes. Prohibited activities include:')}
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>{t('terms.sec6Item1', 'Reselling eSIM products without authorization')}</li>
                  <li>{t('terms.sec6Item2', 'Using services for illegal activities')}</li>
                  <li>{t('terms.sec6Item3', 'Attempting to circumvent security measures')}</li>
                  <li>{t('terms.sec6Item4', 'Interfering with other users\' access to services')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('terms.sec7Title', '7. Limitation of Liability')}</h2>
                <p className="text-muted-foreground">
                  {t('terms.sec7Desc', 'Simfinity shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Network coverage and speeds are subject to carrier availability and local conditions.')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('terms.sec8Title', '8. Changes to Terms')}</h2>
                <p className="text-muted-foreground">
                  {t('terms.sec8Desc', 'We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('terms.sec9Title', '9. Contact Information')}</h2>
                <p className="text-muted-foreground">
                  {t('terms.sec9Desc', 'For questions about these Terms of Service, please contact us at:')}
                  <br />
                  <a href="mailto:legal@esim.com" className="text-primary hover:underline">
                    legal@esim.com
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
