import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'
import TiltCard from './TiltCard'
import Portal from './Portal'
import SEOEnhancement from './SEOEnhancement'

const AllProjects = ({ projectsData }) => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // Deep links from the ⌘K palette: /all-projects?project=<id> opens the case study
  useEffect(() => {
    const projectId = Number(searchParams.get('project'))
    if (!projectId) return
    const match = projectsData.find((project) => project.id === projectId)
    if (match) setSelectedProject(match)
  }, [searchParams, projectsData])

  const openModal = (project) => {
    setSelectedProject(project)
    // Track project modal open
    trackEvent('click', 'all_projects', `view_project_${project.title}`)
  }

  const closeModal = useCallback(() => {
    setSelectedProject(null)
    if (searchParams.get('project')) setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  // esc closes the case-study modal
  useEffect(() => {
    if (!selectedProject) return undefined
    const onKey = (event) => { if (event.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedProject, closeModal])

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-zinc-900 to-zinc-800">
      <SEOEnhancement
        title="All Projects - Mukesh Pal | Full-Stack Developer Portfolio"
        description="Comprehensive portfolio of full-stack applications, SaaS platforms, GIS systems, and AI tools built by Mukesh Pal using React, Spring Boot, and Python."
        type="website"
      />
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-4 sm:mb-6">
            All Projects
          </h1>
          <div className="w-20 sm:w-32 h-1.5 bg-gradient-to-r from-emerald-400 to-blue-500 mx-auto mb-4 sm:mb-6 rounded-full"></div>
          <p className="mt-3 sm:mt-4 text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg">
            A comprehensive collection of my work, showcasing expertise across multiple technologies and domains
          </p>
        </div>

        {/* Project count badge */}
        <div className="text-center mb-8">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 font-semibold px-4 py-2 rounded-full border border-emerald-500/30">
            {projectsData.length} Projects Total
          </span>
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projectsData.map((project, index) => (
            <TiltCard
              key={project.id}
              className="bg-zinc-800/50 p-4 sm:p-6 rounded-xl shadow-xl card-3d cursor-pointer border border-zinc-700 hover:border-emerald-400/50 glass-card group animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                onClick={() => openModal(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openModal(project)
                  }
                }}
                tabIndex="0"
                role="button"
                aria-label={`View details for ${project.title}`}
              >
                <div className="relative overflow-hidden rounded-lg mb-3 sm:mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-36 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 transform group-hover:rotate-12 transition-transform duration-300" aria-hidden="true">
                    {project.logo ? (
                      <img 
                        src={project.logo} 
                        alt={`${project.title} logo`} 
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain bg-white/90 rounded-lg p-1 shadow-lg"
                      />
                    ) : (
                      <span className="text-2xl sm:text-3xl">{project.icon}</span>
                    )}
                  </div>
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                    <span className="bg-emerald-500/80 text-white text-xs font-bold px-2 py-1 rounded transform group-hover:scale-105 transition-transform duration-300">
                      {project.impact}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white group-hover:text-emerald-400 transition-colors">{project.title}</h4>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-zinc-700 text-zinc-300 text-xs font-semibold px-2 py-1 rounded-full transform group-hover:scale-105 transition-transform duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="bg-zinc-700 text-zinc-300 text-xs font-semibold px-2 py-1 rounded-full">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-700 flex items-center justify-center hover:bg-emerald-500 transition-colors transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation()
                        trackEvent('click', 'all_projects', `github_${project.title}`)
                      }}
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-700 flex items-center justify-center hover:bg-emerald-500 transition-colors transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation()
                        trackEvent('click', 'all_projects', `demo_${project.title}`)
                      }}
                      aria-label={`View live demo of ${project.title}`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                  <span className="text-emerald-400 text-sm font-medium group-hover:text-emerald-300 transition-colors">View Details</span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Back to home button */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Back to Home
          </a>
        </div>
      </div>

      {/* Project Modal */}
      <Portal>
      {selectedProject && (
        <div
          className="fixed inset-0 bg-zinc-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="glass-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-48 sm:h-64 object-cover rounded-t-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent rounded-t-2xl"></div>
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                <button
                  onClick={() => {
                    closeModal()
                    // Track modal close
                    trackEvent('click', 'all_projects', `close_modal_${selectedProject.title}`)
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors transform hover:rotate-90"
                  aria-label="Close project details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                <div className="text-3xl sm:text-4xl mb-2 transform hover:scale-110 transition-transform duration-300">{selectedProject.icon}</div>
                <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-white">{selectedProject.title}</h2>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-400 text-sm font-semibold px-3 py-1 rounded-full transform hover:scale-105 transition-transform duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-zinc-300 mb-6 leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {selectedProject.metrics.map((metric, index) => (
                  <div key={index} className="glass-card p-4 rounded-xl border border-zinc-700 text-center transform hover:-translate-y-2 transition-transform duration-300">
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                      {metric.value}
                    </p>
                    <p className="text-zinc-400 text-sm sm:text-base mt-1">{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors transform hover:scale-105"
                  onClick={() => {
                    // Track GitHub link click in modal
                    trackEvent('click', 'all_projects', `modal_github_${selectedProject.title}`)
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
                <a
                  href={selectedProject.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                  onClick={() => {
                    // Track demo link click in modal
                    trackEvent('click', 'all_projects', `modal_demo_${selectedProject.title}`)
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      </Portal>
    </div>
  )
}

export default AllProjects
