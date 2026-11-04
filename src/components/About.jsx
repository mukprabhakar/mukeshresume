import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { Reveal, EASE } from './motion/Reveal'

/* About – white section with split layout: story + strengths on the
   left, animated visual panel (tabs) on the right. All original
   biography, skills, education and certification content preserved. */

const tabs = [
  { id: 'bio', label: 'Biography' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
]

const features = [
  {
    icon: '🚀',
    title: 'Entrepreneurship & Leadership',
    description: 'Co-Founder & CTO at CodeByte, leading technology strategy and product development',
  },
  {
    icon: '🌟',
    title: 'Community Building',
    description: 'Google Student Ambassador & TEDx Team Head, impacting 2000+ students through workshops and events',
  },
  {
    icon: '💼',
    title: 'Freelance Development',
    description: 'Delivering custom software solutions for clients worldwide with modern technologies',
  },
  {
    icon: '🔬',
    title: 'Research & AI',
    description: 'ISRO NRSC climate-research collaboration, LLM comparative study, and 14+ AI agents & automation solutions',
  },
]

const skillBars = [
  { label: 'Backend Development (Java/Spring)', value: 90, aria: 'Java & Spring Boot proficiency' },
  { label: 'Frontend Development (React/JS)', value: 80, aria: 'React.js & JavaScript proficiency' },
  { label: 'Database & Architecture', value: 85, aria: 'Database Design proficiency' },
]

const certifications = [
  { name: 'AWS Certified Developer', issuer: 'Amazon', date: '2023' },
  { name: 'Spring Professional Certification', issuer: 'VMware', date: '2022' },
  { name: 'Oracle Certified Java Programmer', issuer: 'Oracle', date: '2021' },
]

const timeline = [
  { year: '2025', title: 'Entrepreneurship & Leadership', description: 'Co-Founder & CTO at CodeByte, Google Student Ambassador, and Team Head at TEDx IIMT University' },
  { year: '2024', title: 'Professional Growth', description: 'Spring Boot Developer Intern at RideBuddy, building backend services for transportation management' },
  { year: '2023', title: 'Leadership Beginnings', description: 'Started as Microsoft Learn Student Ambassador and President of E-Cell IIMTU' },
  { year: '2022', title: 'Started Programming Journey', description: 'Began learning Java and web development fundamentals at IIMT University' },
]

const tabPanel = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

const About = () => {
  const [activeTab, setActiveTab] = useState('bio')

  return (
    <section id="about" className="section section-white" aria-labelledby="about-heading">
      {/* Subtle decorative accents */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full erp-red-glow opacity-[0.06] blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-full w-px bg-line hidden lg:block" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          id="about-heading"
          eyebrow="About"
          tone="light"
          title={<>Know the <span className="text-brand">person</span> behind the code</>}
          description="My journey as a software developer, founder, researcher and community leader — from first line of Java to AI-powered products."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* Left: story + strengths */}
          <Reveal direction="left">
            <h3 className="font-display text-2xl font-extrabold text-ink mb-5">My Story</h3>
            <div className="space-y-4 text-ink/70 leading-relaxed">
              <p>
                I&apos;m a freelance full-stack developer specializing in building scalable web
                applications and SaaS products that drive real business results. With 3+ years of
                experience, I help startups and growing businesses transform their ideas into
                high-performing digital solutions.
              </p>
              <p>
                My expertise spans the entire development lifecycle — from technical discovery and
                architecture to implementation and deployment. I focus on delivering solutions that
                not only work perfectly but also provide measurable business value and ROI, and
                I&apos;m passionate about building <strong className="text-ink">scalable applications and AI-powered
                solutions</strong> — including 14+ AI agents and automation systems.
              </p>
              <p>
                I believe in transparent communication, collaborative development, and building
                long-term partnerships with clients who are serious about leveraging technology to
                grow their business.
              </p>
              <p>
                Around IIMT University, Meerut, many students know me as{' '}
                <strong className="text-brand">Mukesh Bhaiya</strong> or the{' '}
                <strong className="text-brand">IIMT wale Bhaiya</strong> — a mentor at the campus
                incubation center who guides aspiring developers and startup founders. Whether you
                call me Mukesh, Mukesh Pal, or bhaiya, I&apos;m always happy to help fellow students
                turn their ideas into real products.
              </p>
            </div>

            {/* Strength cards */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                  className="premium-card p-5"
                >
                  <div className="text-3xl mb-3" aria-hidden="true">{f.icon}</div>
                  <h4 className="font-bold text-ink mb-1.5">{f.title}</h4>
                  <p className="text-sm text-ink-muted leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Right: tabbed visual panel */}
          <Reveal direction="right" delay={0.1}>
            <div className="rounded-2xl border border-line bg-surface/60 p-6 sm:p-8 shadow-card">
              {/* Tabs */}
              <div role="tablist" aria-label="About sections" className="flex gap-2 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'text-white shadow-red-glow'
                        : 'text-ink/60 hover:text-brand bg-white border border-line'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.span
                        layoutId="about-tab-bg"
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                        className="absolute inset-0 rounded-xl bg-brand"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">{tab.label}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'bio' && (
                  <motion.div key="bio" variants={tabPanel} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {[
                        { v: '3+', l: 'Years Experience' },
                        { v: '20+', l: 'Projects' },
                        { v: '14+', l: 'AI Agents' },
                      ].map((s) => (
                        <div key={s.l} className="rounded-xl bg-white border border-line p-4">
                          <div className="font-display text-2xl font-extrabold text-brand">{s.v}</div>
                          <div className="text-xs text-ink-muted mt-1 font-semibold">{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-ink/70">
                      From campus incubation mentor to startup CTO — my path runs through
                      freelancing, technical leadership, research at <strong>ISRO NRSC</strong>, and
                      building production-grade platforms like <strong>CodeOra</strong> and{' '}
                      <strong>Trigo</strong>.
                    </p>
                    <blockquote className="border-l-4 border-brand bg-white rounded-r-xl p-4 text-sm italic text-ink/80">
                      &quot;The best way to predict the future is to create it. I believe in building
                      solutions that make a difference.&quot;
                      <footer className="mt-2 not-italic font-bold text-brand">— Mukesh Pal</footer>
                    </blockquote>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div key="skills" variants={tabPanel} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                    <h4 className="font-bold text-ink">Technical Expertise</h4>
                    {skillBars.map((bar, i) => (
                      <div key={bar.label}>
                        <div className="flex justify-between items-center mb-2 text-sm">
                          <span className="font-semibold text-ink/80">{bar.label}</span>
                          <span className="text-ink-muted">{bar.value}%</span>
                        </div>
                        <div
                          className="h-3 rounded-full bg-white border border-line overflow-hidden"
                          role="progressbar"
                          aria-valuenow={bar.value}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label={bar.aria}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${bar.value}%` }}
                            viewport={{ once: false, margin: '-20px' }}
                            transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: EASE }}
                            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-dark"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="rounded-xl bg-white border border-line p-5">
                      <h5 className="font-bold text-ink mb-3">Certifications</h5>
                      <ul className="space-y-3">
                        {certifications.map((cert) => (
                          <li key={cert.name} className="flex items-start gap-3">
                            <span className="mt-1.5 h-1.5 w-6 rounded-full bg-brand shrink-0" aria-hidden="true" />
                            <div>
                              <p className="font-semibold text-ink/85 text-sm">{cert.name}</p>
                              <p className="text-xs text-ink-muted">{cert.issuer}, {cert.date}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'education' && (
                  <motion.div key="education" variants={tabPanel} initial="hidden" animate="visible" exit="exit">
                    <h4 className="font-bold text-ink mb-5">Educational Journey</h4>
                    <div className="relative">
                      <div className="absolute left-[18px] top-0 h-full w-0.5 bg-gradient-to-b from-brand via-brand/40 to-line" aria-hidden="true" />
                      <div className="space-y-6 pl-0">
                        {timeline.map((item, i) => (
                          <motion.div
                            key={item.year}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.12, ease: EASE }}
                            className="relative pl-14"
                          >
                            <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-brand text-white text-[10px] font-extrabold flex items-center justify-center shadow-red-glow ring-4 ring-surface">
                              {item.year}
                            </div>
                            <div className="rounded-xl bg-white border border-line p-4 hover:border-brand/40 transition-colors">
                              <h5 className="font-bold text-ink text-sm mb-1">{item.title}</h5>
                              <p className="text-xs text-ink-muted leading-relaxed">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default About
