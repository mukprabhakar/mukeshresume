import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { trackEvent } from '../utils/analytics'
import { useSpotlight } from '../utils/useSpotlight'
import SectionHeading from './SectionHeading'
import { Reveal, EASE } from './motion/Reveal'

const ClientsSection = () => {
  const spotlight = useSpotlight()
  const clients = [
    {
     id: 1,
     name: 'IIMT University',
      url: 'https://iimtu.edu.in/',
      logo: 'https://iimtu.edu.in/images/logo.png',
     description: 'Leading university providing quality education',
      industry: 'Education',
     color: 'from-blue-600 to-purple-600'
    },
    {
     id: 2,
     name: 'Oye College',
      url: 'https://oyecollege.com/',
      logo: 'https://oyecollege.com/assets/images/logo2.png',
     description: 'Innovative educational platform',
      industry: 'EdTech',
     color: 'from-green-500 to-teal-500'
    },
    {
     id: 3,
     name: 'RBS Tours and Travels',
      url: 'https://rbstourandtravels.in/',
      logo: 'https://rbstourandtravels.in/assets/rbs_logo-Fp0bdru1.png',
     description: 'Premium tour and travel services',
      industry: 'Travel & Tourism',
     color: 'from-orange-500 to-red-500'
    },
    {
     id: 4,
     name: 'Dry Fruit Delight',
      url: 'https://www.dryfruitsdelight.com/',
      logo: 'https://static.wixstatic.com/media/c6b2f0_332d9aa4fb51435eae15f3c52b54e2cb~mv2.png/v1/fill/w_414,h_392,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c6b2f0_332d9aa4fb51435eae15f3c52b54e2cb~mv2.png',
     description: 'Premium e-commerce for dry fruits & nuts',
      industry: 'E-commerce',
     color: 'from-amber-500 to-orange-500'
    },
    {
     id: 5,
     name: 'Just Mewa',
      url: 'https://justmewa.com/',
      logo: 'https://justmewa.com/static/images/dry%20fruits%20logo.png',
     description: 'Organic dry fruits e-commerce platform',
      industry: 'E-commerce',
     color: 'from-emerald-500 to-green-500'
    },
    {
     id: 6,
     name: 'CCS University Meerut',
      url: 'https://www.ccsuniversity.ac.in/',
      logo: 'https://www.ccsuniversity.ac.in/assets/images/CCSU-Logo.jpg',
     description: 'Prominent public state university offering higher education',
      industry: 'Education',
     color: 'from-sky-500 to-indigo-500'
    }
  ]

  const handleClientClick = (clientName, url) => {
    trackEvent('click', 'homepage_client', `visit_${clientName.toLowerCase().replace(/\s+/g, '_')}`)
    window.open(url, '_blank')
  }

 return (
    <section id="clients" className="section section-white relative overflow-hidden">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-brand/5 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <SectionHeading
          eyebrow="Clients"
          title="Trusted by Amazing Clients"
          description="I'm proud to partner with innovative organizations and help them achieve their goals through technology"
          tone="light"
        />

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {clients.map((client, ci) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (ci % 3) * 0.1, ease: EASE }}
              className="group premium-card card-spotlight rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden"
              onMouseMove={spotlight.onMouseMove}
              onMouseLeave={spotlight.onMouseLeave}
              onClick={() => handleClientClick(client.name, client.url)}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${client.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Logo */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6 rounded-xl bg-surface border border-line flex items-center justify-center group-hover:scale-110 group-hover:border-brand/40 transition-transform duration-300 shadow-card mx-auto overflow-hidden p-4">
                  <img 
                    src={client.logo} 
                  alt={`${client.name} logo`} 
                  className="w-full h-full object-contain"
                  />
                </div>

                {/* Industry Badge */}
                <div className="flex justify-center mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-brand/[0.07] text-brand-dark border border-brand/25">
                    {client.industry}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center text-ink group-hover:text-brand transition-colors duration-300">
                  {client.name}
                </h3>

                {/* Description */}
                <p className="text-ink-muted text-sm sm:text-base mb-6 text-center">
                  {client.description}
                </p>

                {/* Visit Button */}
                <div className="flex items-center justify-center gap-2 text-brand font-semibold group-hover:text-brand-dark transition-colors duration-300">
                  <span>Visit Website</span>
                  <svg 
                   className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <Reveal delay={0.1}>
        <div className="text-center">
          <Link
            to="/clients"
           className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand-dark transform hover:scale-105 transition-all duration-300 shadow-card hover:shadow-red-glow"
            onClick={() => trackEvent('click', 'homepage_client_section', 'view_all_clients')}
          >
            <span>View All Clients & Case Studies</span>
            <svg 
             className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ClientsSection
