import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { fetchAllCodingStats } from '../services/codingStatsService'
import SectionHeading from './SectionHeading'
import { Reveal, EASE } from './motion/Reveal'

/* Achievements & Certifications – light gray section with premium cards.
   Live LeetCode / GFG stats, certifications, leadership and project trackers preserved. */

function CountUp({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => Math.round(v) + suffix)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (inView && value > 0) {
      const controls = animate(mv, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1] })
      return controls.stop
    }
  }, [inView, value, mv])

  useEffect(() => rounded.on('change', (v) => setDisplay(v)), [rounded])

  return <span ref={ref}>{display}</span>
}

const Achievements = () => {
  const [counts, setCounts] = useState({
    leetcode: 0,
    gfg: 0,
    coding: 0,
    entrepreneurship: 0,
    loading: true,
    error: null
  })

  // Fetch data from LeetCode and GeeksforGeeks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllCodingStats('mukprabhakar', 'mukprabhakar')

        const leetcodeCount = data.leetCode?.totalSolved || 0;
        const gfgCount = data.gfg?.problemsSolved || 0;

        setCounts(prev => ({
          ...prev,
          leetcode: leetcodeCount,
          gfg: gfgCount,
          coding: 25,
          entrepreneurship: 5,
          loading: false
        }));
      } catch (error) {
        console.error('Error fetching data:', error)
        setCounts(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load problem-solving data'
        }))
      }
    }

    fetchData()
  }, [])

  const stats = [
    { value: counts.loading ? 0 : counts.leetcode, suffix: counts.loading ? '' : '+', label: 'LeetCode Problems', sub: 'Solved', error: counts.error },
    { value: counts.loading ? 0 : counts.gfg, suffix: counts.loading ? '' : '+', label: 'GFG Problems', sub: 'Solved' },
    { value: counts.loading ? 0 : counts.coding, suffix: counts.loading ? '' : '%', label: 'Coding Environment Growth', sub: 'As Coding Club Lead' },
    { value: counts.loading ? 0 : counts.entrepreneurship, suffix: counts.loading ? '' : 'x', label: 'Entrepreneurial Mindset Boost', sub: 'As E-Cell President' },
  ]

  const achievements = [
    {
      title: 'Certifications & Credentials',
      icon: '🎖️',
      items: [
        {
          icon: '✓',
          heading: 'NPTEL Elite + Silver Badge',
          description: 'Achieved Elite certification with Silver Badge in Introduction to Internet of Things from IIT Kharagpur, demonstrating expertise in IoT fundamentals and applications.'
        },
        {
          icon: '✓',
          heading: 'NPTEL Cloud Computing Certification',
          description: 'Earned certification in Cloud Computing from IIT Kharagpur through NPTEL, mastering cloud architecture, services, deployment models, and hands-on implementation of scalable cloud solutions.'
        },
        {
          icon: '✓',
          heading: 'HackerRank Certifications',
          description: 'Earned 4-star proficiency in MySQL and 2-star recognition in Problem Solving (Java), validating advanced database and algorithmic skills.'
        },
        {
          icon: '✓',
          heading: 'Microsoft Learn Modules',
          description: 'Completed comprehensive learning paths on Azure cloud services and modern development practices, gaining hands-on experience with enterprise technologies.'
        }
      ]
    },
    {
      title: 'Leadership & Recognition',
      icon: '🏅',
      items: [
        {
          icon: '★',
          heading: 'Co-Founder & CTO at CodeByte',
          description: 'Leading technology strategy and product development for an innovative tech startup focused on developer tools and educational platforms.'
        },
        {
          icon: '★',
          heading: 'Google Student Ambassador',
          description: 'Promoting Google technologies through workshops, events, and mentorship programs, impacting 500+ students with cloud skills training.'
        },
        {
          icon: '★',
          heading: 'Team Head at TEDx IIMT University',
          description: 'Organizing TEDx events featuring inspiring speakers, managing cross-functional teams, and inspiring 1000+ attendees.'
        },
        {
          icon: '★',
          heading: 'President of E-Cell',
          description: 'Led entrepreneurial initiatives at IIMT University, organizing 15+ innovation events and mentoring student startups that secured initial funding.'
        }
      ]
    }
  ]

  const completedProjects = [
    {
      icon: '🛸',
      heading: 'Swarm Drone Project',
      description: 'Engineered swarm drone technology for the Indian Military under Garwal Battalion at Meerut Cantt, focusing on coordinated multi-drone operations and tactical applications.',
      status: 'completed'
    },
    {
      icon: '🌍',
      heading: 'ISRO Research Collaboration',
      description: 'Conducted field research at ISRO NRSC Hyderabad on climate change monitoring, working directly with Scientist Dr. Alok Taori to develop satellite data analysis methodologies.',
      status: 'completed'
    },
    {
      icon: '💡',
      heading: 'Smart Street Light System',
      description: 'Developed intelligent street lighting solutions for Meerut Nagar Nigam to optimize energy consumption and enhance urban infrastructure with IoT-enabled controls.',
      status: 'completed'
    },
    {
      icon: '💊',
      heading: 'Trigo',
      description: 'A medical startup that helps users order medicine from local vendors with instant delivery, bridging the gap between patients and pharmacies.',
      status: 'completed'
    }
  ]

  const currentProjects = [
    {
      icon: '🚀',
      heading: 'NPF CRM',
      description: 'Building a comprehensive Customer Relationship Management system to streamline client interactions, automate workflows, and enhance business productivity.',
      status: 'in-progress'
    },
    {
      icon: '⚙️',
      heading: 'Custom ERP',
      description: 'Developing an Enterprise Resource Planning solution tailored for specific business needs, integrating finance, HR, inventory, and operations management.',
      status: 'in-progress'
    },
    {
      icon: '🎯',
      heading: 'Mission Person Find',
      description: 'Creating an advanced search and tracking platform to help locate missing persons using AI-powered image recognition and data analytics.',
      status: 'in-progress'
    }
  ]

  return (
    <section id="achievements" className="section section-gray" aria-labelledby="achievements-heading">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          id="achievements-heading"
          eyebrow="Achievements"
          title="Achievements"
          description="Milestones that demonstrate my capabilities and impact."
          tone="light"
        />

        {/* Live counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center mb-12 sm:mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className="premium-card p-6 sm:p-8 group"
            >
              <p className="font-display text-4xl sm:text-5xl font-extrabold text-brand mb-1.5 group-hover:scale-105 transition-transform duration-300">
                {counts.loading ? '...' : <CountUp value={s.value} suffix={s.suffix} />}
              </p>
              <p className="text-base sm:text-lg font-bold text-ink">{s.label}</p>
              <p className="text-xs sm:text-sm text-ink-muted mt-1">{s.sub}</p>
              {s.error && <p className="text-xs text-brand mt-1">{s.error}</p>}
            </motion.div>
          ))}
        </div>

        {/* Certification & leadership cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
              className="premium-card p-5 sm:p-7"
            >
              <h4 className="font-display font-extrabold text-lg sm:text-xl mb-4 sm:mb-5 text-ink flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 border border-brand/25 text-lg" aria-hidden="true">
                  {achievement.icon}
                </span>
                {achievement.title}
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                {achievement.items.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: itemIndex * 0.07, ease: EASE }}
                    className="flex items-start"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white text-xs font-bold mr-3 mt-0.5" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div>
                      <h5 className="font-semibold text-ink text-sm sm:text-base">{item.heading}</h5>
                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{item.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Completed Projects Section */}
        <Reveal delay={0.05}>
          <div className="premium-card p-5 sm:p-7 mt-8 sm:mt-12">
            <h4 className="font-display font-extrabold text-lg sm:text-xl mb-4 text-ink flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white text-base" aria-hidden="true">✓</span>
              Completed Projects
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {completedProjects.map((project, index) => (
                <motion.div
                  key={project.heading}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
                  className="p-4 rounded-2xl bg-surface border border-line hover:border-brand/40 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2.5" aria-hidden="true">{project.icon}</span>
                    <h5 className="font-bold text-ink text-sm sm:text-base">{project.heading}</h5>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{project.description}</p>
                  <div className="mt-3">
                    <span className="inline-block px-2.5 py-1 bg-brand/[0.08] border border-brand/25 text-brand-dark text-xs rounded-full font-bold">Completed</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Current Projects Section */}
        <Reveal delay={0.05}>
          <div className="premium-card p-5 sm:p-7 mt-6 sm:mt-8">
            <h4 className="font-display font-extrabold text-lg sm:text-xl mb-4 text-ink flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
              Current Projects
            </h4>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {currentProjects.map((project, index) => (
                <motion.div
                  key={project.heading}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
                  className="p-4 rounded-2xl bg-ink text-white border border-ink hover:border-brand/50 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2.5" aria-hidden="true">{project.icon}</span>
                    <h5 className="font-bold text-white text-sm sm:text-base">{project.heading}</h5>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{project.description}</p>
                  <div className="mt-3">
                    <span className="inline-block px-2.5 py-1 bg-brand/20 border border-brand/40 text-brand-300 text-xs rounded-full font-bold animate-pulse">In Progress</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Achievements
