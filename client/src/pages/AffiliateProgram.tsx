import FAQ from '@/components/common/FAQ';
import ThemeButton from '@/components/ThemeButton';
import { useTranslation } from '@/contexts/TranslationContext';
import { Dot, TrendingUp, Users } from 'lucide-react';
import { useLocation } from 'wouter';

export function AffiliateProgram() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  const iconMap: Record<number, React.ReactNode> = {
    1: <img src="/images/features/global.svg" className=" h-10 w-10" alt="price" />,
    2: <img src="/images/features/time (2).svg" className=" h-10 w-10" alt="activate" />,
    3: <img src="/images/features/no-wifi.svg" className=" h-10 w-10" alt="roaming" />,
    4: <img src="/images/features/sim-card.svg" className=" h-10 w-10" alt="esim" />,
    5: <img src="/images/features/bulb.svg" className=" h-10 w-10" alt="alert" />,
    6: <img src="/images/features/map-pin.svg" className=" h-10 w-10" alt="global" />,
  };

  const features = [
    {
      id: 1,
      title: 'Dedicated partnership manager',
      description:
        'You’ll be assigned a dedicated partnership manager, ready to answer your questions and help you get started.',
    },
    {
      id: 2,
      title: 'Fast-growing app',
      description:
        'Simfinity may be a new eSIM app but it’s growing fast. So you have a world of opportunities to promote Simfinity for years to come. ',
    },
    {
      id: 3,
      title: '200+ destinations',
      description:
        'Simfinity offers eSIM plans in over 200 destinations, ensuring a high earning potential whether you promote Simfinity to the users who only travel locally or fly halfway across the world.',
    },
    {
      id: 4,
      title: 'Highly trusted brand',
      description:
        'Simfinity was created by Nord Security, the company behind NordVPN, and is trusted by over 14 million users. Promoting brands that people already know and trust is always easier!',
    },
  ];
  const title = 'Frequently asked questions';
  const faqs = [
    {
      id: 'faq-1',
      question: 'After getting an eSIM, do I need to turn anything on?',
      answer:
        'No, your eSIM will activate automatically when you reach your destination. Just make sure your device supports eSIM and that you’ve installed the profile before traveling.',
    },
    {
      id: 'faq-2',
      question: 'Does Simfinity detect when I arrive at my destination?',
      answer:
        'Yes! Simfinity automatically detects your arrival and activates your data plan as soon as you land.',
    },
    {
      id: 'faq-3',
      question: 'Do I keep my phone number with a Simfinity eSIM?',
      answer:
        'Yes, you keep your original phone number. Simfinity eSIMs are data-only, so your physical SIM stays active for calls and SMS.',
    },
    {
      id: 'faq-4',
      question: 'What’s the best eSIM for international travel?',
      answer:
        'Simfinity offers affordable, reliable eSIM plans in 200+ destinations with instant activation and no roaming surprises.',
    },
    {
      id: 'faq-5',
      question: 'What is a tourist eSIM?',
      answer:
        'A tourist eSIM is a digital SIM designed for travelers, allowing you to get mobile data abroad without buying a physical SIM card.',
    },
    {
      id: 'faq-6',
      question: 'How long does it take to activate my eSIM?',
      answer:
        'Activation is instant. Once installed, your plan activates automatically when you arrive at your destination.',
    },
  ];

  return (
    <>
      <section className="overflow-hidden bg-white ">
        <div className="containers relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-8">
            {/* Left Side - Text Content */}
            <div className="space-y-6 text-center md:text-start">
              <h2 className="text-5xl font-medium text-black">
                Earn with Simfinity affiliate program
              </h2>

              <p className="text-base leading-relaxed text-gray-700 sm:text-xl">
                Join Simfinity’s affiliate program, promote Simfinity, and earn 15% with every new
                user.
              </p>
              <div className=" gap-5  flex items-center justify-center md:justify-start">
                <ThemeButton onClick={() => navigate('/all-destinations')} size="md">
                  Join The Program
                </ThemeButton>
                <ThemeButton
                  variant="outline"
                  onClick={() => navigate('/all-destinations')}
                  size="md"
                >
                  Log In
                  
                </ThemeButton>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[400px] w-full lg:h-[500px]">
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="/images/about/Voices_crew1.png"
                  alt="People enjoying an event together"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="containers">
          {/* Header */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-center text-3xl leading-tight font-medium text-black sm:text-4xl md:text-start lg:text-5xl xl:text-2.5">
              Why Simfinnity
            </h2>
            <p className="mb-3 text-center text-sm font-normal text-gray-600 sm:text-base md:text-start mt-8">
              Join Simfinity affiliate program, promote Simfinity, and earn 15% with every new user.
              It’s easy!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-2 lg:gap-12">
            {features.map((feature) => (
              <div key={feature.id} className="flex flex-col space-y-4">
                {/* Icon */}
                <div className="text-black">{iconMap[feature.id]}</div>

                {/* Title */}
                <h3 className="text-xl font-normal text-black sm:text-xl">{feature.title}</h3>

                {/* Description */}
                <p className="text-base leading-relaxed font-normal text-gray-600 sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="overflow-hidden bg-white ">
        <div className="containers relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Text Content */}
            <div className="space-y-6 text-center md:text-start order-2 lg:order-1">
              <h2 className="text-2.5 leading-tight font-medium text-black">
                How much can you earn?
              </h2>

              <p className="text-base leading-relaxed text-gray-700 sm:text-medium">
                Join Simfinity’s affiliate program, promote Simfinity, and earn 15% with every new
                user.
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[400px] w-full lg:h-[500px] ">
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="/images/about/Voices_crew1.png"
                  alt="People enjoying an event together"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2.5 leading-tight font-medium text-black">How to get started?</h2>

              <p className="text-base leading-relaxed text-gray-700 sm:text-medium pt-5">
                Join Simfinity’s affiliate program, promote Simfinity, and earn 15% with every new
                user.
              </p>
            </div>

            <ThemeButton onClick={() => navigate('/all-destinations')} size="md">
              Join The Program
            </ThemeButton>
          </div>

          {/* Steps */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Register',
                desc: 'Tell us a little about yourself, and wait for your application to be reviewed.',
              },
              {
                step: '2',
                title: 'Meet your dedicated partnership manager',
                desc: "They'll share tracking links and answer your questions.",
              },
              {
                step: '3',
                title: 'Start earning',
                desc: 'Create content, promote Simfinity, and start earning.',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl bg-gray-100 p-8">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                  {item.step}
                </div>

                <h3 className="text-xl font-medium text-black">{item.title}</h3>

                <p className="mt-3 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="overflow-hidden bg-white ">
        <div className="containers relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Text Content */}
            <div className="space-y-6 text-center md:text-start order-2  lg:order-1 ">
              <h2 className="text-2.5 leading-tight font-medium text-black">
                How much can you earn?
              </h2>

              <p className="text-base leading-relaxed text-gray-700 sm:text-medium">
                Join Simfinity’s affiliate program, promote Simfinity, and earn 15% with every new
                user.
              </p>
              <ul className="space-y-4 md:space-y-5">
                {[
                  'Make the integration relevant to your target group with use cases.',
                  "Make it stick — it's best to repeat CTAs several times throughout the content.",
                  'Use the right SEO keywords — it helps your content reach new audiences.',
                  'Ask for help. Whenever in doubt, contact your partnership manager.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <div className="text-primary text-sm font-bold">
                        {' '}
                        <Dot className="h-8 w-8" />{' '}
                      </div>
                    </div>
                    <span className="text-gray-700 text-base md:text-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[400px] w-full lg:h-[500px] order-1 lg:order-2">
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="/images/about/Voices_crew1.png"
                  alt="People enjoying an event together"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <FAQ title={title} faqs={faqs} />
      <section className="overflow-hidden my-10 ">
        <div className="containers relative bg-gray-100  rounded-3xl z-10">
          <div className="max-w-2xl  text-start px-16 py-16 ">
            <div className="mb-8">
              <h2 className="text-3xl md:text-2.5 font-medium text-gray-900 mb-4">
                Any more questions?
              </h2>
              <p className=" text-gray-600">
                Any questions before you get started? Don't hesitate to contact us.
              </p>
            </div>

            <ThemeButton
              onClick={() => navigate('/contact')}
              size="md"
              variant="outline"
              className="px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Contact Us
            </ThemeButton>
          </div>
        </div>
      </section>
    </>
  );
}
