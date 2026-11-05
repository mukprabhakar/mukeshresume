import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '../utils/analytics'
import { EASE } from './motion/Reveal'

/* Premium sticky navbar — identical on every route:
   - same dark translucent surface (white text) at the top of every page,
     switching to solid white with black text once the page is scrolled
   - same inline links everywhere, plus a "More" menu for the remaining
     pages and the home section jumps (which work from any route)
   - red active-route indicator with animated underline
   - ⌘K command palette trigger
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
  { id: 'coding', label: 'Coding' },
  { id: 'badges', label: 'Badges' },
  { id: 'github', label: 'GitHub' },
  { id: 'products', label: 'Products' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'clients', label: 'Clients' },
  { id: 'all-projects', label: 'All Projects' },
]

// The five pages that always sit next to Home in the bar; the rest of the
// routes move into the "More" menu so the navbar never shrinks or reshapes.
const PRIMARY_ROUTE_IDS = ['blog', 'coding', 'badges', 'github', 'products']

const labelFor = (id) => (routeItems.find((item) => item.id === id) || {}).label || id

const primaryLinks = [
  { path: '/', label: 'Home' },
  ...PRIMARY_ROUTE_IDS.map((id) => ({ path: `/${id}`, label: labelFor(id) })),
]

const moreLinks = routeItems
  .filter((item) => !PRIMARY_ROUTE_IDS.includes(item.id))
  .map((item) => ({ path: `/${item.id}`, label: item.label }))

const sectionLinks = sectionItems.filter((item) => item.id !== 'hero')

const slug = (path) => (path === '/' ? 'home' : path.slice(1).replace(/-/g, '_'))

const RESUME_URL = '/resume'

const Header = ({ onOpenPalette }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const onHome = location.pathname === '/'

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    trackEvent('click', 'navigation', `mobile_menu_${isMobileMenuOpen ? 'close' : 'open'}`)
  }

  // Close mobile menu when resizing to desktop, and close the More menu when the
  // bar drops back to the hamburger layout.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
      if (window.innerWidth < 1024) setMoreOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // The More menu is a transient overlay: it must never survive a navigation.
  useEffect(() => {
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!moreOpen) return undefined
    const handlePointerDown = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [moreOpen])

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

  // Section anchors only exist once the home route has mounted, so poll for the
  // target when jumping in from another page instead of firing once and missing.
  const scrollToSectionWhenReady = (sectionId, attempt = 0) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({ top: element.offsetTop - 72, behavior: 'smooth' })
      return
    }
    if (attempt < 20) window.setTimeout(() => scrollToSectionWhenReady(sectionId, attempt + 1), 100)
  }

  const handleInternalLink = (e, sectionId) => {
    e.preventDefault()
    if (!onHome) {
      navigate('/')
      trackEvent('click', 'navigation', 'navigate_to_home')
      scrollToSectionWhenReady(sectionId)
    } else {
      scrollToSection(sectionId)
    }
    setIsMobileMenuOpen(false)
    setMoreOpen(false)
  }

  // Colors follow the scroll position only – never the current page – so the bar
  // looks the same at the same scroll depth wherever you are on the site.
  const solid = scrolled || isMobileMenuOpen
  const baseText = solid ? 'text-ink' : 'text-white'
  const idleText = solid ? 'text-ink/70 hover:text-brand' : 'text-white/75 hover:text-white'
  const activeText = solid ? 'text-brand' : 'text-white'

  // Also light up the parent route while reading a detail page (/blog/<slug>).
  const isActivePath = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`)

  const moreActive = moreLinks.some((item) => isActivePath(item.path))

  const paletteKey = useMemo(
    () => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || '') ? '⌘K' : 'Ctrl K'),
    []
  )

  const paletteTrigger = onOpenPalette ? (
    <button
      type="button"
      onClick={onOpenPalette}
      aria-label="Open command palette"
      title="Search everything"
      className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-300 lg:inline-flex ${
        solid
          ? 'border-line bg-white text-ink-soft hover:border-brand/50 hover:text-brand'
          : 'border-white/20 bg-white/5 text-white/80 hover:border-brand hover:text-white'
      }`}
    >
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
      <span className="hidden xl:inline">Search</span>
      <kbd
        className={`rounded border px-1.5 py-0.5 text-[10px] font-extrabold ${
          solid ? 'border-line bg-surface text-ink-muted' : 'border-white/20 bg-white/10 text-white/80'
        }`}
      >
        {paletteKey}
      </kbd>
    </button>
  ) : null

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

        {/* Desktop Navigation – rendered from the same list on every route */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" role="navigation" aria-label="Main navigation">
          {primaryLinks.map((item) => {
            const active = isActivePath(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => trackEvent('click', 'navigation', `nav_${slug(item.path)}`)}
                className={`relative px-2.5 py-2 rounded-md text-sm font-semibold transition-colors duration-300 xl:px-3.5 ${
                  active ? activeText : idleText
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
                {/* Red active indicator – slides between items across pages */}
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute left-2.5 right-2.5 -bottom-0.5 h-[3px] rounded-full bg-brand"
                    aria-hidden="true"
                  />
                )}
              </Link>
            )
          })}

          {/* Remaining pages + home section jumps, available from any route */}
          <div ref={moreRef} className="relative ml-1">
            <button
              type="button"
              onClick={() => {
                setMoreOpen(!moreOpen)
                trackEvent('click', 'navigation', moreOpen ? 'nav_more_close' : 'nav_more_open')
              }}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              aria-controls="navbar-more-menu"
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-semibold transition-colors duration-300 xl:px-3.5 ${
                moreActive ? activeText : idleText
              }`}
            >
              More
              <motion.svg
                animate={{ rotate: moreOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="h-3 w-3 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  id="navbar-more-menu"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="absolute right-0 top-full mt-3 w-[19rem] rounded-2xl border border-line bg-white p-2.5 text-ink shadow-card-hover"
                  role="menu"
                  aria-label="More navigation"
                >
                  <p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                    Pages
                  </p>
                  {moreLinks.map((item) => {
                    const active = isActivePath(item.path)
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        role="menuitem"
                        onClick={() => trackEvent('click', 'navigation', `nav_more_${slug(item.path)}`)}
                        className={`mb-0.5 flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                          active ? 'bg-brand-soft text-brand' : 'text-ink/80 hover:bg-surface hover:text-brand'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}

                  <div className="my-2 border-t border-line" aria-hidden="true" />

                  <p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                    Jump to section
                  </p>
                  {sectionLinks.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      role="menuitem"
                      onClick={(e) => handleInternalLink(e, item.id)}
                      className={`mb-0.5 flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                        onHome && activeSection === item.id
                          ? 'bg-brand-soft text-brand'
                          : 'text-ink/80 hover:bg-surface hover:text-brand'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Download Resume (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {paletteTrigger}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('click', 'navigation', 'download_resume_nav')}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-brand-dark hover:shadow-red-glow hover:-translate-y-0.5 xl:px-5"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
            </svg>
            <span className="hidden xl:inline">Download Resume</span>
            <span className="xl:hidden">Resume</span>
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
          {onOpenPalette && (
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command palette"
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                solid ? 'bg-surface text-ink-soft hover:text-brand' : 'bg-white/10 text-white'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </button>
          )}
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
              {/* Same grouping as the desktop bar: pages first, then sections */}
              <p className="px-4 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">Pages</p>
              <div className="grid grid-cols-2 gap-1 px-1">
                {[{ path: '/', label: 'Home' }, ...routeItems.map((item) => ({ path: `/${item.id}`, label: item.label }))].map(
                  (item, idx) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ animationDelay: `${idx * 0.03}s` }}
                      className={`animate-fade-up px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isActivePath(item.path)
                          ? 'text-brand bg-brand-soft'
                          : 'text-ink/70 hover:text-brand hover:bg-surface'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
              <div className="my-3 border-t border-line" aria-hidden="true" />
              <p className="px-4 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Jump to section
              </p>
              <div className="grid grid-cols-2 gap-1 px-1">
                {sectionLinks.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleInternalLink(e, item.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      onHome && activeSection === item.id
                        ? 'text-brand bg-brand-soft'
                        : 'text-ink/70 hover:text-brand hover:bg-surface'
                    }`}
                  >
                    {item.label}
                  </a>
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
