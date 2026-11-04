import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '../utils/analytics'
import SectionHeading from './SectionHeading'
import { Reveal, EASE } from './motion/Reveal'

/* Projects – premium white showcase section.
   All project data, filters, NDA note, modal and links preserved from the original. */

const Projects = ({ projectsData }) => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)

  const filterButtons = [
    { id: 'all', label: 'All Work' },
    { id: 'Java', label: 'Backend Solutions' },
    { id: 'Spring', label: 'Enterprise Apps' },
    { id: 'React', label: 'Web Applications' },
    { id: 'SQL', label: 'Data Solutions' },
    { id: 'WebSockets', label: 'Real-time Systems' },
    { id: 'Startup', label: 'Startup Projects' },
    { id: 'E-commerce', label: 'E-commerce Platforms' }
  ]

  const filteredProjects = activeFilter === 'all'
    ? projectsData
    : activeFilter === 'Startup'
      ? projectsData.filter(project => project.title === 'CodeOra' || project.title === 'Trigo')
      : activeFilter === 'E-commerce'
        ? projectsData.filter(project =>
            project.tags.includes('E-commerce') ||
            project.title.includes('E-commerce') ||
            project.title.includes('Dry Fruit')
          )
        : projectsData.filter(project =>
          project.tags.some(tag =>
            tag.toLowerCase().includes(activeFilter.toLowerCase())
          )
        )

  const openModal = (project) => {
    setSelectedProject(project)
    trackEvent('click', 'projects', `view_project_${project.title}`)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  return (
    <section id="work" className="section section-white" aria-labelledby="work-heading">
      {/* Subtle red glow accents */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-[360px] w-[360px] rounded-full bg-brand/5 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 -left-24 h-[360px] w-[360px] rounded-full bg-brand/[0.04] blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          id="work-heading"
          eyebrow="Work"
          title="Case Studies"
          description="Real business solutions that delivered measurable ROI and transformed operations"
          tone="light"
        />

        {/* Note about private repositories */}
        <Reveal delay={0.05}>
          <div className="mb-8 rounded-2xl border border-brand/20 bg-brand/[0.04] p-4 sm:p-5 text-center text-sm sm:text-base text-ink-soft">
            <p>
              <strong className="text-brand-dark">Note:</strong> Many client projects are under NDA and several repositories are private. For detailed case studies and project insights, I&apos;d be happy to discuss during our discovery call.
              Let&apos;s schedule a conversation to explore how I can help solve your specific business challenges.
            </p>
          </div>
        </Reveal>

        {/* Filter pills */}
        <div className="flex justify-center mb-10 sm:mb-12 flex-wrap gap-2">
          {filterButtons.map((button, i) => {
            const active = activeFilter === button.id
            return (
              <motion.button
                key={button.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
                className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-300 ${
                  active ? 'text-white' : 'text-ink-soft hover:text-brand-dark'
                }`}
                onClick={() => {
                  setActiveFilter(button.id)
                  trackEvent('click', 'projects', `filter_${button.id}`)
                }}
                aria-pressed={active}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-brand shadow-red-glow"
                    aria-hidden="true"
                  />
                )}
                {!active && (
                  <span className="absolute inset-0 rounded-full border border-line bg-white hover:border-brand/40 transition-colors" aria-hidden="true" />
                )}
                <span className="relative z-10">{button.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Project grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.slice(0, 6).map((project, index) => (
              <motion.div
                key={`${activeFilter}-${project.id}`}
                layout
                initial={{ opacity: 0, y: 26, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.97 }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
                className="premium-card group overflow-hidden p-0 cursor-pointer"
                onClick={() => openModal(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openModal(project)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${project.title}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute top-3 right-3 transform group-hover:rotate-12 transition-transform duration-300" aria-hidden="true">
                    {project.logo ? (
                      <img
                        src={project.logo}
                        alt={`${project.title} logo`}
                        className="w-11 h-11 object-contain bg-white/95 rounded-xl p-1.5 shadow-card"
                      />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-2xl shadow-card">{project.icon}</span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-red-glow transform group-hover:scale-105 transition-transform duration-300">
                      {project.impact}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h4 className="font-display font-extrabold text-lg sm:text-xl mb-2 text-ink group-hover:text-brand transition-colors">{project.title}</h4>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-surface border border-line text-ink-muted text-xs font-semibold px-2 py-0.5 rounded-full group-hover:border-brand/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="bg-surface border border-line text-ink-muted text-xs font-semibold px-2 py-0.5 rounded-full">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <p className="text-ink-muted text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-line bg-white flex items-center justify-center text-ink-soft hover:bg-brand hover:text-white hover:border-brand hover:shadow-red-glow transition-all duration-300 hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation()
                          trackEvent('click', 'projects', `github_${project.title}`)
                        }}
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-line bg-white flex items-center justify-center text-ink-soft hover:bg-ink hover:text-white hover:border-ink transition-all duration-300 hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation()
                          trackEvent('click', 'projects', `demo_${project.title}`)
                        }}
                        aria-label={`View live demo of ${project.title}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </a>
                    </div>
                    <span className="text-brand text-sm font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Projects Button */}
        {filteredProjects.length > 6 && (
          <Reveal delay={0.1} className="text-center mt-12">
            <a
              href="/all-projects"
              onClick={() => trackEvent('click', 'projects', 'view_all')}
              className="group inline-flex items-center gap-2 bg-ink hover:bg-brand text-white font-bold py-3.5 px-9 rounded-full transition-all duration-300 shadow-card hover:shadow-red-glow hover:-translate-y-0.5"
            >
              View All {projectsData.length} Projects
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
          </Reveal>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-line shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-48 sm:h-64 object-cover rounded-t-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent rounded-t-3xl" />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => {
                      closeModal()
                      trackEvent('click', 'projects', `close_modal_${selectedProject.title}`)
                    }}
                    className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-ink hover:text-brand hover:rotate-90 transition-all duration-300"
                    aria-label="Close project details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                  <div className="text-3xl sm:text-4xl mb-2">{selectedProject.icon}</div>
                  <h2 id="modal-title" className="font-display text-2xl sm:text-3xl font-extrabold text-white">{selectedProject.title}</h2>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-brand/[0.07] border border-brand/25 text-brand-dark text-sm font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-ink-soft mb-6 leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  {selectedProject.metrics.map((metric, index) => (
                    <div key={index} className="bg-surface border border-line p-5 rounded-2xl text-center hover:border-brand/40 hover:shadow-card transition-all duration-300">
                      <p className="font-display text-2xl sm:text-3xl font-extrabold text-brand">
                        {metric.value}
                      </p>
                      <p className="text-ink-muted text-sm sm:text-base mt-1">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[120px] bg-ink hover:bg-ink-soft text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                    onClick={() => {
                      trackEvent('click', 'projects', `modal_github_${selectedProject.title}`)
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub Repository
                  </a>
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[120px] bg-brand hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-red-glow"
                    onClick={() => {
                      trackEvent('click', 'projects', `modal_demo_${selectedProject.title}`)
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
