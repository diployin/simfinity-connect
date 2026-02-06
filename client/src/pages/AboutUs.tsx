'use client';

import { motion } from 'framer-motion';
import {
  Star,
  ArrowRight,
  Globe2,
  Shield,
  Zap,
  Users,
  Heart,
  Smartphone,
  CheckCircle2,
  DollarSign,
  Target,
  Clock,
  Signal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { useSettingByKey } from '@/hooks/useSettings';

import { useLocation } from 'wouter';

export function AboutUs() {
  const siteName = useSettingByKey('platform_name');
  const stats = [
    {
      value: '190+',
      label: 'Countries',
      icon: Globe2,
    },
    {
      value: '50M+',
      label: 'Happy Users',
      icon: Users,
    },
    {
      value: '99.9%',
      label: 'Uptime',
      icon: Signal,
    },
    {
      value: '24/7',
      label: 'Support',
      icon: Heart,
    },
  ];

  const [, navigate] = useLocation();

  const features = [
    {
      icon: Clock,
      title: 'Instant Activation',
      description: 'Get connected in seconds. No waiting, no hassle. Just scan and go.',
    },
    {
      icon: DollarSign,
      title: 'Save Up to 90%',
      description: 'Say goodbye to expensive roaming charges. Pay only for what you need.',
    },
    {
      icon: Smartphone,
      title: 'Keep Your Number',
      description: 'Use WhatsApp, iMessage, and all your apps with your original number.',
    },
    {
      icon: Globe2,
      title: 'Global Coverage',
      description: 'One eSIM for multiple countries. Perfect for regional or world travel.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guaranteed worldwide.',
    },
    {
      icon: Zap,
      title: 'Easy to Use',
      description: "Download, scan QR code, and you're connected. No technical skills needed.",
    },
  ];

  const timeline = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Started with a simple idea: eliminate expensive roaming fees for travelers.',
    },
    {
      year: '2021',
      title: 'First 10 Countries',
      description:
        'Launched in 10 popular destinations. Helped our first 10,000 travelers save money.',
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Reached 150+ countries. Partnered with major telecom operators worldwide.',
    },
    {
      year: '2025',
      title: 'Industry Leader',
      description:
        '190+ countries covered. Over 50 million data plans delivered to happy travelers.',
    },
  ];

  const values = [
    {
      icon: Users,
      title: 'Customer First',
      description: 'Every decision starts with one question: How does this benefit our travelers?',
    },
    {
      icon: Target,
      title: 'Transparency',
      description: 'No hidden fees. No surprises. What you see is exactly what you pay.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description:
        'We constantly improve our service to give you the best connectivity experience.',
    },
    {
      icon: Heart,
      title: 'Reliability',
      description: "99.9% uptime and 24/7 support. We're here when you need us most.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col">
      <Helmet>
        <title>{`About Us - ${siteName} | Your Travel Connectivity Partner`}</title>
        <meta
          name="description"
          content={`Learn how ${siteName} is revolutionizing travel connectivity. Instant eSIM activation in 190+ countries. No roaming fees, no hassle.`}
        />
      </Helmet>

      {/* <SiteHeader /> */}

      {/* Hero Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-white dark:bg-background relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:via-transparent dark:to-primary/5"></div>

        <div className="containers relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 dark:text-muted-foreground ml-2 font-medium">
                  4.9/5 from 50,000+ travelers
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-foreground">
                Travel the World,
                <br />
                <span
                  className="
    bg-gradient-to-r from-primary to-primary-dark
    bg-clip-text
    text-transparent
    transition-all
    duration-300
    hover:brightness-110
  "
                >
                  Stay Connected
                </span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-muted-foreground mb-8 leading-relaxed">
                We're on a mission to eliminate expensive roaming fees and make international
                connectivity simple, affordable, and instant for every traveler.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => {
                    navigate('/destinations');
                  }}
                  size="lg"
                  className="bg-primary-gradient text-white px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Browse eSIM Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => {
                    navigate('/what-is-esim');
                  }}
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 dark:border-border hover:bg-gray-50 dark:hover:bg-muted px-8 rounded-lg"
                >
                  How it Works
                </Button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200 dark:ring-primary/20">
                <img
                  src="/images/Growth Opportunities.png"
                  alt="Travel"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent dark:from-black/50 dark:to-transparent"></div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card rounded-2xl shadow-xl dark:shadow-primary/20 p-4 border border-gray-200 dark:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-foreground">
                      50M+ Users
                    </p>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Worldwide</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-background relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          ></div>
        </div>

        <div className="containers relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
              Trusted by Millions Worldwide
            </h2>
            <p className="text-gray-600 dark:text-muted-foreground text-lg">
              Join travelers who've made the switch to smarter connectivity
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="relative bg-white dark:bg-card rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-primary/30 shadow-lg hover:shadow-2xl dark:hover:shadow-primary/20 transition-all duration-300">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 dark:bg-primary/20 mb-6 group-hover:bg-primary/15 dark:group-hover:bg-primary/30 transition-colors shadow-md"
                    >
                      <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </motion.div>

                    {/* Value */}
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-foreground mb-2 group-hover:text-primary transition-colors">
                      {stat.value}
                    </h3>

                    {/* Label */}
                    <p className="text-sm md:text-base text-gray-600 dark:text-muted-foreground font-semibold">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 dark:text-muted-foreground"
          >
            <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm dark:shadow-primary/10 border border-gray-200 dark:border-primary/30">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm dark:shadow-primary/10 border border-gray-200 dark:border-primary/30">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Instant Activation</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm dark:shadow-primary/10 border border-gray-200 dark:border-primary/30">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="  bg-white dark:bg-background">
        <div className="containers">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-muted-foreground leading-relaxed">
                In 2020, our founder landed in Paris and paid €50 in roaming charges before leaving
                the airport. Then came the hassle of finding a local SIM card, waiting in lines, and
                dealing with activation delays.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-red-50 dark:bg-card rounded-2xl p-8 border-2 border-red-200 dark:border-red-500/30"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">
                  The Problem
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-700 dark:text-muted-foreground">
                    <span className="text-red-500 text-xl mt-0.5">✗</span>
                    <span>Expensive roaming charges ($50-100/day)</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700 dark:text-muted-foreground">
                    <span className="text-red-500 text-xl mt-0.5">✗</span>
                    <span>Long airport queues for local SIM cards</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700 dark:text-muted-foreground">
                    <span className="text-red-500 text-xl mt-0.5">✗</span>
                    <span>Complicated activation processes</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700 dark:text-muted-foreground">
                    <span className="text-red-500 text-xl mt-0.5">✗</span>
                    <span>Losing your original phone number</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 border-2 border-primary/30 shadow-lg dark:shadow-primary/20"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">
                  Our Solution
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-700 dark:text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Save up to 90% compared to roaming</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700 dark:text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Instant activation in 5 seconds</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700 dark:text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>No SIM cards, no waiting, no hassle</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700 dark:text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Keep your original number active</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/20 dark:to-primary/10 rounded-2xl p-8 border border-primary/20 dark:border-primary/30"
            >
              <p className="text-lg text-gray-700 dark:text-muted-foreground leading-relaxed">
                Today, we've helped over{' '}
                <span className="font-bold text-primary">50 million travelers</span> stay connected
                in <span className="font-bold text-primary">190+ countries</span>. No roaming fees.
                No waiting. Just instant connectivity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-background">
        <div className="containers">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-foreground mb-6">
              Why Choose {siteName}?
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              We've built the most reliable and affordable eSIM service for international travelers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-card rounded-2xl p-8 border border-gray-200 dark:border-primary/30 hover:border-primary/50 hover:shadow-xl dark:hover:shadow-primary/20 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm dark:shadow-primary/10">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-white dark:bg-background">
        <div className="containers">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark mb-6">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              From a simple idea to helping millions of travelers worldwide
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 md:gap-8"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg dark:shadow-primary/30">
                      {index + 1}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-primary/50 to-primary/20 dark:from-primary/50 dark:to-primary/30 mt-4"></div>
                    )}
                  </div>
                  <div className="pb-12 bg-white dark:bg-card rounded-2xl p-6 md:p-8 flex-1 border border-gray-200 dark:border-primary/30 shadow-sm dark:shadow-primary/10">
                    <p className="text-sm font-bold text-primary mb-2 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full inline-block">
                      {item.year}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-background">
        <div className="containers">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white dark:bg-card rounded-2xl p-8 border border-gray-200 dark:border-primary/30 shadow-sm dark:shadow-primary/10 hover:shadow-lg dark:hover:shadow-primary/20 transition-all">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 mb-6 group-hover:scale-110 transition-transform shadow-sm dark:shadow-primary/10">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="containers relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6  ">
              Ready to Travel Smarter?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join 50 million travelers who stay connected worldwide with {siteName}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => {
                  navigate('/destinations');
                }}
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 rounded-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Browse eSIM Plans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => {
                  navigate('/contect_us');
                }}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm px-8 rounded-lg"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
