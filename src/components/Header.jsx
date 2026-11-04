import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '../utils/analytics'
import { EASE } from './motion/Reveal'

/* Premium sticky navbar:
   - transparent over the dark hero (white text) → solid white with black text on scroll
   - red active-section indicator with animated underline
   - hamburger drawer on mobile with all section + route links */

const sectionItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
]

const routeItems = [
  { id: 'blog', label: 'Blog' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'products', label: 'Products' },
  { id: 'badges', label: 'Badges' },
  { id: 'github', label: 'GitHub' },
  { id: 'coding', label: 'Coding' },
  { id: 'clients', label: 'Clients' },
  { id: 'all-projects', label: 'All Projects' },
]

const RESUME_URL = '/resume'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const onHome = location.pathname === '/'

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    trackEvent('click', 'navigation', `mobile_menu_${isMobileMenuOpen ? 'close' : 'open'}`)
  }

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Track scroll to switch transparent → solid and update active section
  useEffect(() => {
    const sections = sectionItems.map((i) => i.id)
    let ticking = false

    const update = () => {
      const scrollPosition = window.scrollY + 140
      setScrolled(window.scrollY > 24)
      if (onHome) {
        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const offsetTop = element.offsetTop
            const height = element.offsetHeight
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
              setActiveSection((prev) => (prev !== section ? section : prev))
              break
            }
          }
        }
      }
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onHome])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({ top: element.offsetTop - 72, behavior: 'smooth' })
      trackEvent('click', 'navigation', `scroll_to_${sectionId}`)
    }
  }

  const handleInternalLink = (e, sectionId) => {
    e.preventDefault()
    if (!onHome) {
      navigate('/')
      trackEvent('click', 'navigation', 'navigate_to_home')
      setTimeout(() => scrollToSection(sectionId), 120)
    } else {
      scrollToSection(sectionId)
    }
    setIsMobileMenuOpen(false)
  }

  // Colors flip with the navbar surface
  const solid = scrolled || !onHome || isMobileMenuOpen
  const baseText = solid ? 'text-ink' : 'text-white'
  const idleText = solid ? 'text-ink/70 hover:text-brand' : 'text-white/75 hover:text-white'

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      role="banner"
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid
          ? 'bg-white/95 backdrop-blur-xl border-b border-line shadow-[0_4px_24px_rgba(10,10,10,0.08)]'
          : 'bg-ink/90 backdrop-blur-xl border-b border-white/10'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo / Name */}
        <Link
          to="/"
          className="flex items-center space-x-2.5 group"
          aria-label="Mukesh Pal - Home"
          onClick={() => trackEvent('click', 'navigation', 'logo_click')}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden ring-2 ring-brand/70 shadow-red-glow/0 transition-all group-hover:ring-brand group-hover:shadow-red-glow">
            <img
              src="https://res.cloudinary.com/dddmyjevn/image/upload/q_auto/f_auto/v1775281267/mukeshp_ybprrz.png"
              alt="Mukesh Pal"
              width="40"
              height="40"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <span className={`font-display text-lg sm:text-xl font-extrabold tracking-tight ${baseText} transition-colors duration-300`}>
            Mukesh<span className="text-brand">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {onHome ? (
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {sectionItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  handleInternalLink(e, item.id)
                  trackEvent('click', 'navigation', `internal_link_${item.id}`)
                }}
                className={`relative px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${idleText} ${
                  activeSection === item.id ? (solid ? 'text-brand' : 'text-white') : ''
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
                {/* Red active indicator */}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute left-3 right-3 -bottom-0.5 h-[3px] rounded-full bg-brand"
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-semibold ${idleText} transition-colors duration-300`}
            >
              Home
            </Link>
            {routeItems.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                to={`/${item.id}`}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${
                  location.pathname === `/${item.id}` ? 'text-brand' : idleText
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Download Resume (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('click', 'navigation', 'download_resume_nav')}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-brand-dark hover:shadow-red-glow hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
            </svg>
            Download Resume
          </a>
          {/* Mobile menu button (small screens) */}
          <button
            id="mobile-menu-button"
            className={`lg:hidden p-2 rounded-md transition-all ${solid ? 'text-ink hover:bg-surface' : 'text-white hover:bg-white/10'}`}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile: resume button + hamburger (compact row) */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { trackEvent('click', 'navigation', 'download_resume_mobile'); setIsMobileMenuOpen(false) }}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${solid ? 'bg-brand text-white' : 'bg-brand text-white'}`}
            aria-label="Download Resume"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
            </svg>
          </a>
          <button
            className={`p-2 rounded-md transition-all ${solid ? 'text-ink hover:bg-surface' : 'text-white hover:bg-white/10'} ${isMobileMenuOpen ? 'text-brand' : ''}`}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="lg:hidden bg-white border-t border-line overflow-hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col">
              {sectionItems.map((item, idx) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleInternalLink(e, item.id)}
                  style={{ animationDelay: `${idx * 0.03}s` }}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold animate-fade-up transition-colors ${
                    activeSection === item.id && onHome ? 'text-brand bg-brand-soft' : 'text-ink/80 hover:text-brand hover:bg-surface'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="my-3 border-t border-line" aria-hidden="true" />
              <p className="px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">More</p>
              <div className="grid grid-cols-2 gap-1 px-1 py-2">
                {routeItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/${item.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold text-ink/70 hover:text-brand hover:bg-surface transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
