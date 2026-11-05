import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '../utils/analytics'
import Portal from './Portal'
import { EASE } from './motion/Reveal'

/* ⌘K command palette – one keyboard-first entry point to everything on the site:
   pages, home sections, projects, blog posts, LeetCode write-ups and quick actions.
   Opens with Ctrl/Cmd+K (or `/`), navigates with ↑ ↓, runs with ↵, closes with esc. */

const RECENT_KEY = 'mukesh.palette.recent'
const RESUME_URL = '/resume'

const pages = [
  { id: 'page-home', label: 'Home', hint: '/', icon: '🏠', path: '/' },
  { id: 'page-blog', label: 'Blog Posts', hint: '/blog', icon: '✍️', path: '/blog' },
  { id: 'page-gallery', label: 'Gallery', hint: '/gallery', icon: '🖼️', path: '/gallery' },
  { id: 'page-products', label: 'Products', hint: '/products', icon: '📦', path: '/products' },
  { id: 'page-clients', label: 'Clients', hint: '/clients', icon: '🤝', path: '/clients' },
  { id: 'page-badges', label: 'Badges', hint: '/badges', icon: '🎖️', path: '/badges' },
  { id: 'page-github', label: 'GitHub Stats', hint: '/github', icon: '🐙', path: '/github' },
  { id: 'page-coding', label: 'Coding Profiles', hint: '/coding', icon: '💻', path: '/coding' },
  { id: 'page-leetcode', label: 'LeetCode Problem of the Day', hint: '/leetcode-potd', icon: '🧩', path: '/leetcode-potd' },
  { id: 'page-projects', label: 'All Projects', hint: '/all-projects', icon: '🗂️', path: '/all-projects' },
]

const sections = [
  { id: 'sec-about', label: 'About Me', icon: '👤', anchor: 'about' },
  { id: 'sec-services', label: 'Services', icon: '🛠️', anchor: 'services' },
  { id: 'sec-clients', label: 'Clients', icon: '🤝', anchor: 'clients' },
  { id: 'sec-skills', label: 'Skills', icon: '⚡', anchor: 'skills' },
  { id: 'sec-work', label: 'Case Studies', icon: '📊', anchor: 'work' },
  { id: 'sec-ai', label: 'AI Agents', icon: '🤖', anchor: 'ai-agents' },
  { id: 'sec-experience', label: 'Experience', icon: '💼', anchor: 'experience' },
  { id: 'sec-research', label: 'Research', icon: '🔬', anchor: 'research' },
  { id: 'sec-achievements', label: 'Achievements', icon: '🏆', anchor: 'achievements' },
  { id: 'sec-testimonials', label: 'Testimonials', icon: '💬', anchor: 'testimonials' },
  { id: 'sec-contact', label: 'Contact', icon: '📮', anchor: 'contact' },
]

const readRecent = () => {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.slice(0, 6) : []
  } catch {
    return []
  }
}

const writeRecent = (ids) => {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(ids))
  } catch {
    /* private mode / quota – ignore */
  }
}

const prettify = (slug) =>
  slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 72)

/* Dependency-free matcher: prefix hit > substring hit > every-term hit >
   word-prefix hit. Deliberately no fuzzy subsequence matching – it turned
   "spring" into 38 irrelevant rows. */
const score = (text, query) => {
  const t = text.toLowerCase()
  const q = query.toLowerCase().trim()
  if (!q) return 1
  if (t.startsWith(q)) return 120
  const idx = t.indexOf(q)
  if (idx >= 0) return 90 - Math.min(idx, 40)
  const terms = q.split(/\s+/)
  if (terms.length > 1 && terms.every((term) => t.includes(term))) return 55
  return t.split(/[\s,./|()-]+/).some((word) => word.startsWith(q)) ? 45 : 0
}

const Highlight = ({ text, query }) => {
  const q = query.toLowerCase().trim()
  const idx = q ? text.toLowerCase().indexOf(q) : -1
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent font-extrabold text-brand">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  )
}

const Kbd = ({ children }) => (
  <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-sans text-[10px] font-bold text-ink-muted">
    {children}
  </kbd>
)

const CommandPalette = ({ open, setOpen, projectsData = [] }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [posts, setPosts] = useState(null)
  const [potd, setPotd] = useState(null)
  const [recentIds, setRecentIds] = useState(readRecent)
  const [flash, setFlash] = useState('')
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const isMac = useMemo(
    () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || ''),
    []
  )

  const scrollToSection = useCallback((anchor) => {
    const el = document.getElementById(anchor)
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
  }, [])

  const goToSection = useCallback((anchor) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollToSection(anchor), 180)
    } else {
      scrollToSection(anchor)
    }
  }, [location.pathname, navigate, scrollToSection])

  const remember = useCallback((id) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 6)
      writeRecent(next)
      return next
    })
  }, [])

  const copyText = useCallback(async (value, message) => {
    try {
      await navigator.clipboard.writeText(value)
      setFlash(message)
      setTimeout(() => setFlash(''), 2200)
    } catch {
      setFlash('Copy blocked by the browser')
      setTimeout(() => setFlash(''), 2200)
    }
  }, [])

  /* lazy-load the markdown library once, the first time the palette opens */
  useEffect(() => {
    if (!open || posts) return
    let cancelled = false
    const load = async () => {
      const modules = import.meta.glob('/src/blog-posts/*.md', { query: '?raw', import: 'default' })
      const list = []
      for (const path of Object.keys(modules)) {
        const raw = await modules[path]()
        const title = (raw.match(/^title:\s*(.*)$/m) || [])[1]
        list.push({
          slug: path.split('/').pop().replace('.md', ''),
          title: (title || '').replace(/^["']|["']$/g, '') || prettify(path.split('/').pop().replace('.md', '')),
        })
      }
      if (!cancelled) setPosts(list.sort((a, b) => a.title.localeCompare(b.title)))
    }
    load().catch(() => !cancelled && setPosts([]))
    return () => { cancelled = true }
  }, [open, posts])

  useEffect(() => {
    if (!open || potd) return
    let cancelled = false
    const load = async () => {
      const modules = import.meta.glob('/src/leetcode-potd/*.md', { query: '?raw', import: 'default' })
      const list = []
      for (const path of Object.keys(modules)) {
        const slug = path.split('/').pop().replace('.md', '')
        const raw = await modules[path]()
        const title = (raw.match(/^title:\s*(.*)$/m) || [])[1]
        list.push({ slug, title: (title || '').replace(/^["']|["']$/g, '') || prettify(slug) })
      }
      if (!cancelled) setPotd(list.sort((a, b) => a.title.localeCompare(b.title)))
    }
    load().catch(() => !cancelled && setPotd([]))
    return () => { cancelled = true }
  }, [open, potd])

  // Keyboard entry points: Ctrl/Cmd+K toggles, `/` opens, esc closes
  useEffect(() => {
    const onKey = (event) => {
      const mod = event.metaKey || event.ctrlKey
      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
        return
      }
      if (event.key === 'Escape' && open) {
        setOpen(false)
        return
      }
      if (event.key === '/' && !open) {
        const tag = (event.target && event.target.tagName) || ''
        if (/INPUT|TEXTAREA|SELECT/.test(tag) || (event.target && event.target.isContentEditable)) return
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  /* lock background scroll + focus the field while open, reset on close */
  useEffect(() => {
    if (!open) {
      setQuery('')
      setActive(0)
      return undefined
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const id = setTimeout(() => inputRef.current && inputRef.current.focus(), 40)
    return () => {
      document.body.style.overflow = previous
      clearTimeout(id)
    }
  }, [open])

  const commands = useMemo(() => {
    const close = () => setOpen(false)

    const pageItems = pages.map((p) => ({
      ...p,
      group: 'Pages',
      text: `${p.label} ${p.hint}`,
      run: () => { navigate(p.path); close(); trackEvent('click', 'command_palette', `page_${p.id}`) },
    }))

    const sectionItems = sections.map((s) => ({
      ...s,
      group: 'Jump to section',
      text: `${s.label} section`,
      run: () => { goToSection(s.anchor); close(); trackEvent('click', 'command_palette', s.id) },
    }))

    const projectItems = projectsData.map((project) => ({
      id: `project-${project.id}`,
      label: project.title,
      hint: (project.impact || project.tags?.[0] || 'Case study').slice(0, 42),
      icon: project.logo ? '🧩' : project.icon || '📁',
      group: 'Projects',
      text: `${project.title} ${project.tags.join(' ')} ${project.impact}`,
      run: () => {
        navigate(`/all-projects?project=${project.id}`)
        close()
        trackEvent('click', 'command_palette', `project_${project.id}`)
      },
    }))

    const postItems = (posts || []).map((post) => ({
      id: `post-${post.slug}`,
      label: post.title,
      hint: '/blog',
      icon: '✍️',
      group: 'Blog posts',
      text: `${post.title} blog ${post.slug.replace(/-/g, ' ')}`,
      run: () => { navigate(`/blog/${post.slug}`); close(); trackEvent('click', 'command_palette', `post_${post.slug}`) },
    }))

    const potdItems = (potd || []).map((problem) => ({
      id: `potd-${problem.slug}`,
      label: problem.title,
      hint: '/leetcode-potd',
      icon: '🧩',
      group: 'LeetCode solutions',
      text: `${problem.title} leetcode ${problem.slug.replace(/-/g, ' ')}`,
      run: () => { navigate(`/leetcode-potd/${problem.slug}`); close(); trackEvent('click', 'command_palette', `potd_${problem.slug}`) },
    }))

    const actionItems = [
      {
        id: 'act-resume', label: 'Download Resume', hint: 'New tab', icon: '📄', group: 'Actions',
        text: 'download resume cv pdf',
        run: () => { window.open(RESUME_URL, '_blank', 'noopener'); close(); trackEvent('click', 'command_palette', 'resume') },
      },
      {
        id: 'act-email', label: 'Email Mukesh', hint: 'mailto', icon: '📮', group: 'Actions',
        text: 'email mail contact reach out',
        run: () => { window.location.href = 'mailto:contact@mukprabhakar.in'; close(); trackEvent('click', 'command_palette', 'email') },
      },
      {
        id: 'act-copy', label: 'Copy portfolio link', hint: 'Clipboard', icon: '🔗', group: 'Actions',
        text: 'copy link share url clipboard',
        run: () => { copyText(window.location.origin, 'Portfolio link copied'); trackEvent('click', 'command_palette', 'copy_link') },
      },
      {
        id: 'act-github', label: 'Open GitHub profile', hint: 'mukprabhakar', icon: '🐙', group: 'Actions',
        text: 'github repository code open source',
        run: () => { window.open('https://github.com/mukprabhakar', '_blank', 'noopener'); close(); trackEvent('click', 'command_palette', 'github') },
      },
      {
        id: 'act-top', label: 'Back to top', hint: 'Scroll', icon: '⬆️', group: 'Actions',
        text: 'scroll to top up beginning',
        run: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); close() },
      },
      {
        id: 'act-secret', label: 'Enter the Konami secret', hint: '🥚 easter egg', icon: '🕹️', group: 'Actions',
        text: 'konami secret easter egg hidden surprise game',
        run: () => { close(); window.dispatchEvent(new CustomEvent('mukesh:secret')) },
      },
    ]

    return [...pageItems, ...sectionItems, ...actionItems, ...projectItems, ...postItems, ...potdItems]
  }, [projectsData, posts, potd, navigate, goToSection, setOpen, copyText])

  const byId = useMemo(() => Object.fromEntries(commands.map((c) => [c.id, c])), [commands])

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) {
      const recents = recentIds.map((id) => byId[id]).filter(Boolean)
      const defaults = commands.filter((c) => c.group === 'Pages' || c.group === 'Jump to section' || c.group === 'Actions')
      const seen = new Set(recents.map((r) => r.id))
      return [...recents, ...defaults.filter((d) => !seen.has(d.id))]
    }
    return commands
      .map((c) => ({ c, s: score(c.text || c.label, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 40)
      .map((x) => x.c)
  }, [query, commands, byId, recentIds])

  /* keep the highlighted row in view */
  useEffect(() => {
    if (!open || !listRef.current) return
    const node = listRef.current.querySelector(`[data-idx="${active}"]`)
    if (node) node.scrollIntoView({ block: 'nearest' })
  }, [active, open, results])

  useEffect(() => { setActive(0) }, [query])

  const onKeyDown = (event) => {
    if (results.length === 0) return
    if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
      event.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = results[active]
      if (item) { remember(item.id); item.run() }
    }
  }

  let lastGroup = null

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/60 px-4 pt-[12vh] backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.26, ease: EASE }}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={onKeyDown}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_80px_rgba(10,10,10,0.28)]"
            >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <svg className="h-5 w-5 shrink-0 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, projects, posts, actions…"
                aria-label="Search the portfolio"
                aria-controls="palette-results"
                autoComplete="off"
                spellCheck="false"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-muted"
              />
              {flash && <span className="text-xs font-bold text-brand">{flash}</span>}
              <Kbd>{isMac ? 'esc' : 'Esc'}</Kbd>
            </div>

            <ul
              id="palette-results"
              ref={listRef}
              role="listbox"
              aria-label="Commands"
              className="max-h-[52vh] overflow-y-auto py-2"
            >
              {results.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-ink-muted">
                  Nothing matches “{query}”. Try “react”, “blog”, “resume”…
                </li>
              )}
              {results.map((item, index) => {
                const showGroup = item.group !== lastGroup
                lastGroup = item.group
                const isActive = index === active
                return (
                  <React.Fragment key={item.id}>
                    {showGroup && (
                      <li className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                        {item.group}
                      </li>
                    )}
                    <li
                      role="option"
                      aria-selected={isActive}
                      data-idx={index}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => { remember(item.id); item.run() }}
                      className={`mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                        isActive ? 'bg-brand-soft text-brand-dark' : 'text-ink hover:bg-surface'
                      }`}
                    >
                      <span className="w-6 shrink-0 text-center text-base" aria-hidden="true">{item.icon}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                        <Highlight text={item.label} query={query} />
                      </span>
                      {item.hint && (
                        <span className={`hidden shrink-0 truncate text-xs sm:block ${isActive ? 'text-brand-dark/70' : 'text-ink-muted'}`}>
                          {item.hint}
                        </span>
                      )}
                      {isActive && <Kbd>↵</Kbd>}
                    </li>
                  </React.Fragment>
                )
              })}
            </ul>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line bg-surface px-4 py-2.5 text-[11px] font-semibold text-ink-muted">
              <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
              <span className="flex items-center gap-1.5"><Kbd>↵</Kbd> open</span>
              <span className="flex items-center gap-1.5"><Kbd>esc</Kbd> close</span>
              <span className="ml-auto flex items-center gap-1.5">
                <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd><Kbd>K</Kbd> anytime
              </span>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}

export default CommandPalette
