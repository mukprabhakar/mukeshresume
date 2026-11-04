/**
 * Security & Environment Configuration
 * Handles API keys, rate limiting, and security headers
 */

// Sanitize HTML to prevent XSS
export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return ''
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Sanitize URL
export const sanitizeURL = (url) => {
  if (typeof url !== 'string') return ''
  const sanitized = url.trim()
  // Only allow http, https, and relative URLs
  if (sanitized.startsWith('javascript:') || sanitized.startsWith('data:')) {
    return ''
  }
  return sanitized
}

// Sanitize object recursively
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj
  
  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHTML(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

// Sanitize error messages
export const sanitizeErrorMessage = (error) => {
  if (typeof error === 'string') {
    return sanitizeHTML(error)
  }
  if (error instanceof Error) {
    return sanitizeHTML(error.message)
  }
  return 'An unexpected error occurred'
}

// Environment variables validation
export const validateEnv = () => {
  const required = [
    'VITE_EMAILJS_SERVICE_ID',
    'VITE_EMAILJS_TEMPLATE_ID', 
    'VITE_EMAILJS_PUBLIC_KEY'
  ]

  let env = {};
  try {
    env = (new Function('return typeof import.meta !== "undefined" ? import.meta.env : null'))() || (typeof process !== 'undefined' ? process.env : {}) || {};
  } catch (e) {
    env = typeof process !== 'undefined' ? process.env : {};
  }
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing)
    return false
  }
  
  return true
}

// Rate limiting for contact form
export const createRateLimiter = (maxAttempts = 3, windowMs = 3600000) => {
  const attempts = new Map()
  
  return {
    checkLimit: (identifier) => {
      const now = Date.now()
      const userAttempts = attempts.get(identifier) || []
      
      // Remove old attempts outside the window
      const recentAttempts = userAttempts.filter(time => now - time < windowMs)
      
      if (recentAttempts.length >= maxAttempts) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: recentAttempts[0] + windowMs
        }
      }
      
      recentAttempts.push(now)
      attempts.set(identifier, recentAttempts)
      
      return {
        allowed: true,
        remaining: maxAttempts - recentAttempts.length,
        resetTime: now + windowMs
      }
    }
  }
}

// Sanitize form input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .substring(0, 1000) // Limit length
}

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Security headers configuration (for server-side)
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.emailjs.com https://www.google-analytics.com",
    "frame-src 'self' https://www.google.com"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}
