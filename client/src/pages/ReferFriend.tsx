import ThemeButton from '@/components/ThemeButton';
import { Dot, Star } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'wouter';
import { FaStar } from 'react-icons/fa';

const ReferFriend = () => {
  const [, navigate] = useLocation();
  return (
    <>
      <section className="overflow-hidden bg-white ">
        <div className="containers relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Text Content */}
            <div className="space-y-6 text-center md:text-start">
              <h2 className="text-5xl leading-tight font-medium text-black">
                Refer a friend, and you’ll both get US$5!
              </h2>

              <p className="text-base leading-relaxed text-gray-700 ">
                Each referral earns you US$5 in Saily credits while your pals get a US$5 discount on
                their first plan. Use your credits to get data for less – or even free! With Saily,
                sharing pays off – literally.
              </p>
              <div className=" gap-5  flex items-center justify-start">
                <div className="flex flex-wrap gap-3">
                  <Link href="#">
                    <img src="/images/app-store.svg" className="h-12" />
                  </Link>
                  <Link href="#">
                    <img src="/images/google-play.svg" className="h-12" />
                  </Link>
                </div>
              </div>
              <div className="inline-flex items-center  gap-2 text-sm font-medium">
                {' '}
                <FaStar className="  text-black h-4 w-4" /> 4.7 (97,400+ reviews)
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
      <section className="overflow-hidden bg-white  py-10 md:py-24 lg:py-32 ">
        <div className="containers relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Text Content */}
            <div className="space-y-6 text-center md:text-start order-1  lg:order-2 ">
              <h2 className="text-2.5 leading-tight font-medium text-black">Why Saily?</h2>

              <p className="text-base leading-relaxed text-gray-700 sm:text-medium">
                Saily is a global eSIM service from Nord Security, one of the most trusted companies
                in the world. A user-friendly app, innovative features, and affordable eSIM prices
                in 200+ destinations — everything the modern traveler enjoys.
              </p>
              <p className="text-base leading-relaxed text-gray-700 sm:text-medium">
                Now you and your friends can earn Saily credits — simply join our referral program.
                It’s easy!
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[400px] w-full lg:h-[500px] order-2 lg:order-1">
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
              <h2 className="text-2.5 leading-tight font-medium text-black">
                Refer a friend and earn Saily credit
              </h2>

              <p className="text-base leading-relaxed text-gray-700 sm:text-medium pt-5">
                Here’s how Saily’s referral program works:
              </p>
            </div>

            {/* <ThemeButton onClick={() => navigate('/all-destinations')} size="md">
              Join The Program
            </ThemeButton> */}
          </div>

          {/* Steps */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Find your referral code',
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
    </>
  );
};

export default ReferFriend;
