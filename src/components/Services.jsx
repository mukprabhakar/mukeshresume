import React from 'react'
import { motion } from 'framer-motion'
import { trackEvent } from '../utils/analytics'
import SectionHeading from './SectionHeading'
import { Reveal, EASE } from './motion/Reveal'

/* Services & Packages – light gray section.
   All packages, prices, features, process steps and CTA banner preserved. */

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'MVP Development',
      price: 'Starting at $1,500',
      description: 'Turn your startup idea into a launched product in 4 weeks.',
      features: [
        'React/Next.js Frontend',
        'Secure Authentication',
        'Database Integration',
        'Payment Gateway Setup',
        'Deployment & Hosting'
      ],
      icon: '🚀',
      popular: true
    },
    {
      id: 2,
      title: 'Custom Web Application',
      price: 'Custom Quote',
      description: 'Scalable, high-performance solutions for established businesses.',
      features: [
        'Complex Business Logic',
        'Third-party API Integrations',
        'Admin Dashboards',
        'Real-time Features',
        'SEO & Performance Optimization'
      ],
      icon: '💻',
      popular: false
    },
    {
      id: 3,
      title: 'Technical Consultation',
      price: '$100/Hour',
      description: 'Expert advice on architecture, code quality, and tech stack.',
      features: [
        'Codebase Audit',
        'Performance Analysis',
        'Security Review',
        'Refactoring Strategy',
        'Mentorship & Guidance'
      ],
      icon: '💡',
      popular: false
    }
  ]

  const processSteps = [
    {
      id: 1,
      title: 'Discovery',
      description: 'We discuss your goals, requirements, and business vision to align on the perfect solution.',
      icon: '🔍'
    },
    {
      id: 2,
      title: 'Strategy & Design',
      description: 'I create a technical roadmap and wireframes to ensure we build exactly what you need.',
      icon: '📝'
    },
    {
      id: 3,
      title: 'Development',
      description: 'I build your application using modern, scalable technologies with regular updates.',
      icon: '⚡'
    },
    {
      id: 4,
      title: 'Launch & Support',
      description: 'We deploy your product to production and I provide support to ensure smooth operation.',
      icon: '🚀'
    }
  ]

  return (
    <section id="services" className="section section-gray" aria-labelledby="services-heading">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          id="services-heading"
          eyebrow="Services"
          title="Services & Packages"
          description="Clear packages designed to solve your specific business challenges. No hidden fees, just measurable results."
          tone="light"
        />

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
              className={`premium-card relative rounded-3xl p-7 sm:p-8 flex flex-col ${service.popular ? 'border-brand/40 shadow-red-glow md:scale-105 z-10' : ''}`}
            >
              {service.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-red-glow">
                  MOST POPULAR
                </div>
              )}

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/[0.08] border border-brand/25 text-3xl mb-5">{service.icon}</div>
              <h4 className="font-display text-xl sm:text-2xl font-extrabold text-ink mb-1.5">{service.title}</h4>
              <p className="text-2xl sm:text-3xl font-extrabold text-brand mb-4 font-display">{service.price}</p>
              <p className="text-ink-muted mb-7 flex-grow">{service.description}</p>

              <ul className="space-y-3.5 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-ink-soft text-sm">
                    <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full py-3.5 px-6 rounded-full text-center font-bold transition-all duration-300 ${
                  service.popular
                    ? 'bg-brand text-white hover:bg-brand-dark hover:shadow-red-glow hover:-translate-y-1'
                    : 'bg-ink text-white hover:bg-ink-soft hover:-translate-y-1'
                }`}
                onClick={() => trackEvent('click', 'services', `select_package_${service.title}`)}
              >
                Start Project
              </a>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <div className="mt-16 sm:mt-24">
          <Reveal>
            <h4 className="font-display text-2xl sm:text-3xl font-extrabold text-center text-ink mb-14 sm:mb-16">How We Work Together</h4>
          </Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative">
            {/* Connecting Line (Desktop) */}
            <div aria-hidden="true" className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-brand/40 via-brand/20 to-line -z-0"></div>

            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: EASE }}
                className="relative group text-center"
              >
                <div className="w-24 h-24 mx-auto bg-white rounded-full border-2 border-line shadow-card flex items-center justify-center text-3xl mb-5 group-hover:border-brand group-hover:shadow-red-glow transition-all duration-300 z-10 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shadow-red-glow">
                    {step.id}
                  </div>
                </div>
                <div className="px-4">
                  <h5 className="font-display text-xl font-extrabold text-ink mb-2.5 group-hover:text-brand transition-colors">{step.title}</h5>
                  <p className="text-ink-muted text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <Reveal delay={0.1}>
          <div className="mt-16 sm:mt-24 text-center">
            <div className="relative rounded-3xl bg-ink p-8 sm:p-12 overflow-hidden border border-white/10">
              <div aria-hidden="true" className="absolute -top-20 -right-20 h-64 w-64 rounded-full erp-red-glow opacity-25 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full erp-red-glow opacity-15 blur-3xl" />
              <div className="relative z-10">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-5">Ready to Start Your Project?</h3>
                <p className="text-zinc-300 mb-8 max-w-2xl mx-auto text-lg">
                  Let&apos;s discuss how I can help you achieve your business goals.
                  Book a free 15-minute discovery call today.
                </p>
                <a
                  href="#contact"
                  className="inline-block bg-brand text-white font-bold py-4 px-10 rounded-full hover:bg-brand-dark transition-all duration-300 hover:scale-105 hover:shadow-red-glow shadow-lg"
                  onClick={() => trackEvent('click', 'services', 'cta_banner_book_call')}
                >
                  Schedule Free Consultation
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Services
