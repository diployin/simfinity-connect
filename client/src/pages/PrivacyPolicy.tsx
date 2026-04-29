import { Helmet } from 'react-helmet-async';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { useTranslation } from '@/contexts/TranslationContext';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{t('privacy.pageTitle', 'Privacy Policy - Simfinity')}</title>
        <meta
          name="description"
          content={t('privacy.pageMeta', 'Read Simfinity\'s privacy policy to understand how we collect, use, and protect your personal information.')}
        />
      </Helmet>

      {/* <SiteHeader /> */}

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">{t('privacy.title', 'Privacy Policy')}</h1>
            <p className="text-muted-foreground mb-8">{t('privacy.lastUpdated', 'Last updated: December 2024')}</p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('privacy.sec1Title', '1. Information We Collect')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('privacy.sec1Desc', 'We collect information you provide directly to us, including:')}
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>{t('privacy.sec1Item1', 'Account information (email address, name)')}</li>
                  <li>{t('privacy.sec1Item2', 'Payment information (processed securely through our payment providers)')}</li>
                  <li>{t('privacy.sec1Item3', 'Device information for eSIM compatibility verification')}</li>
                  <li>{t('privacy.sec1Item4', 'Communication preferences')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('privacy.sec2Title', '2. How We Use Your Information')}</h2>
                <p className="text-muted-foreground mb-4">{t('privacy.sec2Desc', 'We use the information we collect to:')}</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>{t('privacy.sec2Item1', 'Process and fulfill your eSIM orders')}</li>
                  <li>{t('privacy.sec2Item2', 'Send you order confirmations and eSIM installation instructions')}</li>
                  <li>{t('privacy.sec2Item3', 'Provide customer support')}</li>
                  <li>{t('privacy.sec2Item4', 'Send promotional communications (with your consent)')}</li>
                  <li>{t('privacy.sec2Item5', 'Improve our services and develop new features')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('privacy.sec3Title', '3. Information Sharing')}</h2>
                <p className="text-muted-foreground">
                  {t('privacy.sec3Desc', 'We do not sell your personal information. We may share your information with:')}
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                  <li>{t('privacy.sec3Item1', 'eSIM providers to fulfill your orders')}</li>
                  <li>{t('privacy.sec3Item2', 'Payment processors to handle transactions')}</li>
                  <li>{t('privacy.sec3Item3', 'Service providers who assist our operations')}</li>
                  <li>{t('privacy.sec3Item4', 'Legal authorities when required by law')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('privacy.sec4Title', '4. Data Security')}</h2>
                <p className="text-muted-foreground">
                  {t('privacy.sec4Desc', 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('privacy.sec5Title', '5. Your Rights')}</h2>
                <p className="text-muted-foreground mb-4">{t('privacy.sec5Desc', 'You have the right to:')}</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>{t('privacy.sec5Item1', 'Access your personal information')}</li>
                  <li>{t('privacy.sec5Item2', 'Correct inaccurate data')}</li>
                  <li>{t('privacy.sec5Item3', 'Request deletion of your data')}</li>
                  <li>{t('privacy.sec5Item4', 'Opt out of marketing communications')}</li>
                  <li>{t('privacy.sec5Item5', 'Export your data')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('privacy.sec6Title', '6. Contact Us')}</h2>
                <p className="text-muted-foreground">
                  {t('privacy.sec6Desc', 'If you have questions about this Privacy Policy, please contact us at:')}
                  <br />
                  <a href="mailto:privacy@esim.com" className="text-primary hover:underline">
                    privacy@esim.com
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
