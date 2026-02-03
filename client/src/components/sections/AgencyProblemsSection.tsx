import { ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '../ui/button';
import { LinkPreview } from '../ui/link-preview';

export function AgencyProblemsSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="containers">
        {/* ============================================
            ROW 1: Yellow Line + Title + CTA Button
            ============================================ */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          {/* Left: Yellow Line + Title */}
          <div className="flex items-start gap-6 flex-1">
            {/* Yellow Line */}
            <div className="w-16 md:w-20 h-1.5 bg-primary dark:bg-primary mt-5 flex-shrink-0"></div>

            {/* Title - Updated eSIM Content */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-xl">
              Stay Connected Worldwide with Instant eSIM Activation
            </h2>
          </div>

          {/* Right: CTA Button - FIXED */}
          <div className="flex-shrink-0">
            <Link href="/destinations">
              <a className="inline-block">
                <Button
                  size="lg"
                  className="bg-primary-gradient text-white  px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl hover:shadow-primary/30 dark:hover:shadow-primary/50 transition-all duration-300 group"
                >
                  Explore Plans
                  <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </a>
            </Link>
          </div>
        </div>

        {/* ============================================
            ROW 2: Main Content Area (Flexbox)
            ============================================ */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ============================================
              LEFT SIDE: Large Image with Glow
              ============================================ */}
          <div className="w-full lg:w-[45%] flex-shrink-0">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 dark:from-primary/20 dark:via-primary/70 dark:to-primary/20 rounded-3xl opacity-70 group-hover:opacity-100 blur-xl group-hover:blur-2xl transition-all duration-700"></div>

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-border group-hover:border-primary/50 dark:group-hover:border-primary shadow-2xl transition-all duration-500">
                <img
                  src="/images/business-worldwide-coverage.png"
                  alt="Global eSIM connectivity across multiple devices"
                  className="w-full h-[400px] md:h-[500px] object-cover  transition-all duration-700"
                />
              </div>
            </div>
          </div>

          {/* ============================================
              RIGHT SIDE: Paragraph + Circle + Small Image
              ============================================ */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Paragraph Content - Updated eSIM Content */}
            <div className="w-full p-6 md:p-8 border-2 border-border rounded-2xl bg-card">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Experience seamless{' '}
                <LinkPreview url="https://help.esimmasters.net/" className="font-bold">
                  global connectivity
                </LinkPreview>{' '}
                with our instant eSIM solutions. No physical SIM cards, no waiting – just scan a QR
                code and you're connected in seconds. Travel across 190+ countries with affordable
                data plans, customer support, and the freedom to stay online wherever your journey
                takes you. Switch between plans effortlessly and enjoy reliable, high-speed internet
                without roaming charges.
              </p>
            </div>

            {/* Circle + Small Image Row */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circle Badge - Updated Content */}
              <div className="relative w-40 h-40 flex-shrink-0">
                {/* Rotating Border */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/40 animate-spin-slow"></div>

                {/* Circular Text */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <defs>
                    <path
                      id="textPath"
                      d="M 80, 80 m -65, 0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0"
                    />
                  </defs>
                  <text className="text-[9px] fill-muted-foreground uppercase tracking-widest font-medium">
                    <textPath href="#textPath">
                      INSTANT • ACTIVATION • 190+ • COUNTRIES • 24/7 • SUPPORT •
                    </textPath>
                  </text>
                </svg>

                {/* Center Button - FIXED with Link */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="/destinations">
                    <a>
                      <button className="w-24 h-24 bg-primary dark:bg-primary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-primary/60 transition-all duration-300">
                        <ArrowUpRight
                          className="w-10 h-10 text-white dark:text-primary-foreground"
                          strokeWidth={2.5}
                        />
                      </button>
                    </a>
                  </Link>
                </div>
              </div>

              {/* Small Image with Glow */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 dark:from-primary/20 dark:via-primary/70 dark:to-primary/20 rounded-2xl opacity-70 group-hover:opacity-100 blur-xl group-hover:blur-2xl transition-all duration-700"></div>

                  {/* Image Container */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-border group-hover:border-primary/50 dark:group-hover:border-primary shadow-xl transition-all duration-500">
                    <img
                      src="/images/Growth Opportunities.png"
                      alt="Mobile device showing eSIM activation process"
                      className="w-full h-[240px] object-cover  transition-all duration-700"
                    />
                  </div>
                  {/* grayscale group-hover:grayscale-0  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
