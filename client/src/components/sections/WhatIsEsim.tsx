import { motion } from 'framer-motion';
import { useTranslation } from '@/contexts/TranslationContext';

const esimChipImg = '/images/esim-chip-illustration.png';

export function WhatIsEsim() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center"
          >
            <div className="relative bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 md:p-12 w-full max-w-md">
              <div className="absolute top-6 left-6 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 18v-6" />
                  <path d="M8 22v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
                  <rect x="2" y="2" width="20" height="12" rx="2" />
                </svg>
              </div>
              <img
                src={esimChipImg}
                alt={t('website.home.whatIsEsim.imageAlt', 'eSIM chip illustration')}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <div className="absolute bottom-6 right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-50 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M12 12h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">eSIM #1</p>
                  <p className="text-xs text-green-500 font-medium">{t('website.home.whatIsEsim.active', 'Active')}</p>
                </div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full ml-1"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col"
          >
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 dark:text-white leading-tight mb-6">
              {t('website.home.whatIsEsim.title', 'What is an eSIM?')}
            </h2>
            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
              {t(
                'website.home.whatIsEsim.description',
                'An eSIM is a digital SIM that lets you switch carriers and use multiple mobile plans without swapping cards. Most new phones support eSIMs, and setting them up takes just a few taps.'
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
