import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EASE } from './motion/Reveal'

const Footer = () => {
  const navigate = useNavigate()

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/mukprabhakar/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-7 6.67h-2.5v7.66h2.5v-7.66zM9.25 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm4.08 2.17c-1.1 0-1.84.51-2.17 1.25h-.03v-1.09h-2.1v7.66h2.19v-3.78c0-.99.2-1.94 1.41-1.94s1.21.94 1.21 2.02v3.7h2.19v-4.5c0-2.5-1.33-3.63-3.1-3.63z" />
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/mukprabhakar',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.25-.26-4.6-1.13-4.6-5.01 0-1.11.39-2.01 1.03-2.72-.1-.26-.45-1.28.1-2.68 0 0 .85-.27 2.79 1.03A9.58 9.58 0 0 1 12 6.84c.85.004 1.7.114 2.5.33 1.94-1.3 2.79-1.03 2.79-1.03.55 1.4.2 2.42.1 2.68.64.71 1.03 1.61 1.03 2.72 0 3.89-2.35 4.75-4.61 5.01.36.31.68.92.68 1.85v2.73c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://x.com/mukprabhakar',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/mukprabhakar/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.668.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    }
  ]

  const quickLinks = [
    { name: 'Home', href: '/', type: 'route' },
    { name: 'About', href: '#about', type: 'internal' },
    { name: 'Skills', href: '#skills', type: 'internal' },
    { name: 'Projects', href: '#work', type: 'internal' },
    { name: 'AI Agents', href: '#ai-agents', type: 'internal' },
    { name: 'Experience', href: '#experience', type: 'internal' },
    { name: 'Achievements', href: '#achievements', type: 'internal' },
    { name: 'Research', href: '#research', type: 'internal' },
    { name: 'Testimonials', href: '#testimonials', type: 'internal' },
    { name: 'Blog', href: '/blog', type: 'route' },
    { name: 'Products', href: '/products', type: 'route' },
    { name: 'Badges', href: '/badges', type: 'route' },
    { name: 'GitHub', href: '/github', type: 'route' },
    { name: 'Coding', href: '/coding', type: 'route' },
    { name: 'LeetCode POTD', href: '/leetcode-potd', type: 'route' },
    { name: 'Contact', href: '#contact', type: 'internal' }
  ]

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      })
    }
  }

  const handleInternalLink = (e, sectionId) => {
    e.preventDefault()
    // If we're on a different route page, navigate to home first, then scroll
    if (window.location.pathname !== '/') {
      navigate('/')
      // Wait a bit for navigation to complete, then scroll
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 100)
    } else {
      // If we're already on the home page, just scroll
      scrollToSection(sectionId)
    }
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE }}
      className="bg-ink text-zinc-400 py-12 border-t border-white/10 relative overflow-hidden"
      role="contentinfo"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full erp-red-glow opacity-[0.07]" aria-hidden="true"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand and Description */}
          <div className="md:col-span-1">
            <h2 className="font-display text-2xl font-extrabold text-white mb-4">Mukesh <span className="text-brand">Pal</span></h2>
            <p className="text-sm mb-6 max-w-xs">From blank screens to bold solutions. Crafting digital experiences with passion and precision.</p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-brand hover:bg-brand/15 hover:shadow-red-glow transition-all transform hover:scale-110"
                  aria-label={`Follow me on ${link.name}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                link.type === 'route' ? (
                  <Link 
                    key={index}
                    to={link.href}
                    className="text-zinc-400 hover:text-brand-300 transition flex items-center py-1 group"
                  >
                    <span className="mr-2 text-brand opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </Link>
                ) : (
                  <a 
                    key={index}
                    href={link.href}
                    onClick={(e) => handleInternalLink(e, link.href.substring(1))}
                    className="text-zinc-400 hover:text-brand-300 transition flex items-center py-1 group"
                  >
                    <span className="mr-2 text-brand opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </a>
                )
              ))}
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Get In Touch</h3>
            <div className="space-y-3">
              <p className="text-zinc-400 text-sm">
                <span className="block">Email:</span>
                <a href="mailto:mukesh.mmp1234@gmail.com" className="text-brand hover:text-brand-300 transition">
                  mukesh.mmp1234@gmail.com
                </a>
              </p>
              <p className="text-zinc-400 text-sm">
                <span className="block">Location:</span>
                <span>Meerut, UP, India</span>
              </p>
              <p className="text-zinc-400 text-sm">
                <span className="block">Response Time:</span>
                <span>Within 24 hours</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-zinc-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">&copy; {new Date().getFullYear()} Mukesh Pal. All rights reserved.</p>
            </div>
            
            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center text-sm text-zinc-400 hover:text-brand-300 transition group"
              aria-label="Back to top"
            >
              Back to top
              <svg className="w-4 h-4 ml-2 group-hover:translate-y-[-2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer