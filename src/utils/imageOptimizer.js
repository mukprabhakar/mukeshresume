/**
 * Image Optimization Utility
 * Optimizes images using Cloudinary transformations for better performance
 * Supports responsive images, lazy loading, and automatic format conversion
 */

/**
 * Optimize image URL with Cloudinary transformations
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export const optimizeImage = (url, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto'
  } = options

  // If it's already a Cloudinary URL, add transformations
  if (url.includes('res.cloudinary.com')) {
    const parts = url.split('/upload/')
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},h_${height},q_${quality},f_${format},c_${crop},g_${gravity}/${parts[1]}`
    }
  }

  // For external URLs, use Cloudinary fetch
  const encodedUrl = encodeURIComponent(url)
  return `https://res.cloudinary.com/dddmyjevn/image/fetch/w_${width},h_${height},q_${quality},f_${format},c_${crop}/${encodedUrl}`
}

/**
 * Generate responsive image srcset for different screen sizes
 * @param {string} baseUrl - Base image URL
 * @param {Array} widths - Array of widths for srcset
 * @returns {string} Srcset string
 */
export const generateSrcset = (baseUrl, widths = [400, 800, 1200, 1600]) => {
  return widths
    .map(width => {
      const optimizedUrl = optimizeImage(baseUrl, { width })
      return `${optimizedUrl} ${width}w`
    })
    .join(', ')
}

/**
 * Get image sizes attribute for responsive images
 * @param {string} breakpoint - Mobile, tablet, or desktop
 * @returns {string} Sizes attribute value
 */
export const getImageSizes = (breakpoint = 'default') => {
  const sizes = {
    hero: '(max-width: 768px) 100vw, 50vw',
    project: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    blog: '(max-width: 768px) 100vw, 80vw',
    default: '(max-width: 768px) 100vw, 80vw'
  }
  return sizes[breakpoint] || sizes.default
}

/**
 * Optimized Image Component Props Generator
 * Returns all necessary props for an optimized img tag
 * @param {string} src - Image source URL
 * @param {Object} options - Optimization options
 * @returns {Object} Props for img element
 */
export const getOptimizedImageProps = (src, options = {}) => {
  const {
    width = 800,
    height = 600,
    alt = '',
    loading = 'lazy',
    breakpoint = 'default',
    className = ''
  } = options

  return {
    src: optimizeImage(src, { width, height }),
    srcSet: generateSrcset(src, [400, 800, 1200]),
    sizes: getImageSizes(breakpoint),
    alt,
    loading,
    width,
    height,
    className
  }
}

/**
 * Preload critical images
 * @param {Array} images - Array of image URLs to preload
 */
export const preloadImages = (images) => {
  if (typeof window === 'undefined') return
  
  images.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = optimizeImage(src, { width: 1200 })
    document.head.appendChild(link)
  })
}
