import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';

const connectImg = '/images/connect-instantly-travel.png';
const avoidWaitingImg = '/images/avoid-waiting-traveler.png';
const stayProtectedImg = '/images/stay-protected-phone.png';

export function InstantConnection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {t('website.home.instant.title', 'Instant connection and safer browsing')}
            <br className="hidden sm:block" />
            {' '}{t('website.home.instant.titleSuffix', 'with eSIMConnect')}
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            {t(
              'website.home.instant.subtitle',
              'Do you travel often, live abroad, or simply need reliable mobile data on the go? eSIMConnect makes it simple to stay connected, wherever life takes you.'
            )}
          </p>
          <Link href="/destinations">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full transition-colors text-sm">
              {t('website.home.instant.viewAll', 'View All Destinations')}
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 flex flex-col justify-between min-h-[420px] overflow-hidden relative"
          >
            <div className="relative z-10">
              <h3 className="text-2xl md:text-[1.7rem] font-bold text-gray-900 dark:text-white mb-3">
                {t('website.home.instant.connect.title', 'Connect instantly')}
              </h3>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mb-6">
                {t(
                  'website.home.instant.connect.description',
                  'eSIMConnect is a hassle-free solution — just choose your data plan and get ready to travel! When you arrive at your destination, you can go online right away.'
                )}
              </p>
              <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm px-4 py-3">
                <div className="w-8 h-8 bg-teal-50 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M12 12h.01" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">eSIM #1</span>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
                  {t('website.home.instant.connect.installed', 'Installed')}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <img
                src={connectImg}
                alt={t('website.home.instant.connect.imageAlt', 'Travel destinations')}
                className="w-full max-w-xs h-auto object-contain rounded-2xl"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-blue-50 dark:bg-blue-950/30 rounded-3xl p-8 flex flex-col justify-between min-h-[420px] overflow-hidden relative"
          >
            <div className="relative z-10">
              <h3 className="text-2xl md:text-[1.7rem] font-bold text-gray-900 dark:text-white mb-3">
                {t('website.home.instant.avoid.title', 'Avoid waiting in line')}
              </h3>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mb-6">
                {t(
                  'website.home.instant.avoid.description',
                  'Getting a local SIM at the airport or train station can be a hassle. With an eSIM, you won\'t have to wait in line or deal with sketchy sellers offering SIM cards that might not even work.'
                )}
              </p>
              <div className="flex flex-col gap-2.5">
                {['5 GB', '3 GB', '1 GB'].map((plan, i) => (
                  <div
                    key={plan}
                    className={`inline-flex items-center justify-between px-4 py-2.5 rounded-xl max-w-[200px] ${
                      i === 0
                        ? 'bg-white dark:bg-gray-800 shadow-sm'
                        : 'bg-white/60 dark:bg-gray-800/40'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{plan}</span>
                      <span className="text-xs text-gray-400 ml-2">30 days</span>
                    </div>
                    {i === 0 && (
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                    {i !== 0 && (
                      <div className="w-6 h-6 border-2 border-gray-200 dark:border-gray-600 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <img
                src={avoidWaitingImg}
                alt={t('website.home.instant.avoid.imageAlt', 'Traveler using phone')}
                className="w-full max-w-[280px] h-auto object-contain rounded-2xl"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 md:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-[1.7rem] font-bold text-gray-900 dark:text-white mb-3">
                {t('website.home.instant.protected.title', 'Stay protected online')}
              </h3>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-md">
                {t(
                  'website.home.instant.protected.description',
                  'When abroad, sometimes your only internet option is a slow Wi-Fi network in a shady coffee shop. With an eSIM data plan, you\'ll always have a secure and reliable connection.'
                )}
              </p>
              <Link href="/resources/what-is-esim">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-full transition-colors text-sm">
                  {t('website.home.instant.protected.learnMore', 'Learn More')}
                </button>
              </Link>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <img
                  src={stayProtectedImg}
                  alt={t('website.home.instant.protected.imageAlt', 'Phone with security features')}
                  className="w-full max-w-sm h-auto object-contain rounded-2xl"
                  loading="lazy"
                />
                <div className="absolute top-4 right-0 translate-x-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t('website.home.instant.protected.adBlocker', 'Ad blocker')}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </div>
                <div className="absolute bottom-16 right-0 translate-x-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-lg">🇺🇸🇫🇷</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t('website.home.instant.protected.virtualLocation', 'Virtual location')}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="absolute bottom-4 right-0 translate-x-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-2 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t('website.home.instant.protected.webProtection', 'Web protection')}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
