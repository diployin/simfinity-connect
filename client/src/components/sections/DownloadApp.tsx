import { Star } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSettingByKey } from '@/hooks/useSettings';

export function DownloadApp() {
  const { t } = useTranslation();
  const siteName = useSettingByKey('platform_name') || 'Simfinity';
  const androidLink = useSettingByKey('social_android') || '#';
  const iosLink = useSettingByKey('social_ios') || '#';

  return (
    <section id="download" className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            {/* <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-[#2c7338] dark:text-[#3d9a4d]">Excellent</span>
              <span className="text-sm text-muted-foreground">4.7 out of 5</span>
              <Star className="h-4 w-4 fill-[#00b67a] text-[#00b67a]" />
              <span className="text-sm font-semibold text-foreground">Trustpilot</span>
            </div> */}

            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-foreground leading-tight mb-4">
              {t('website.home.downloadApp.title', `Download the ${siteName} eSIM app`)}
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              {t('website.home.downloadApp.description', `You can get ${siteName} on Google Play and the App Store or by scanning the QR code.`)}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <a href={iosLink} className="inline-block" aria-label="Download on App Store">
                <div className="bg-black text-white rounded-lg px-4 py-2.5 flex items-center gap-2 hover:bg-gray-800 transition-colors">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <div className="text-[10px] leading-none">Download on the</div>
                    <div className="text-sm font-semibold leading-tight">App Store</div>
                  </div>
                </div>
              </a>
              <a href={androidLink} className="inline-block" aria-label="Get it on Google Play">
                <div className="bg-black text-white rounded-lg px-4 py-2.5 flex items-center gap-2 hover:bg-gray-800 transition-colors">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.196 12l2.502-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z" />
                  </svg>
                  <div>
                    <div className="text-[10px] leading-none">GET IT ON</div>
                    <div className="text-sm font-semibold leading-tight">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
            {/* 
            <div className="flex gap-8">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-foreground">4.7 rating</span>
                <span className="text-xs text-muted-foreground">(35,487+) reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-foreground">4.7 rating</span>
                <span className="text-xs text-muted-foreground">(61,942+) reviews</span>
              </div>
            </div> */}
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="/images/download-app-phone.png"
                  alt="Download app"
                  className="w-full h-auto object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
