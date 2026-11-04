import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// SEO Enhancement Component - Adds dynamic meta tags and structured data
const SEOEnhancement = ({ title, description, image, type = 'website', keywords }) => {
  const location = useLocation()
  const currentUrl = `https://mukprabhakar.in${location.pathname}`

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Update meta description
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', description)
      }
    }

    // Helper to update or create meta tags
    const updateOrCreateMeta = (attrName, attrValue, content) => {
      if (!content) return
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attrName, attrValue)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', currentUrl)

    // Update Open Graph tags
    updateOrCreateMeta('property', 'og:title', title)
    updateOrCreateMeta('property', 'og:description', description)
    updateOrCreateMeta('property', 'og:url', currentUrl)
    updateOrCreateMeta('property', 'og:type', type)
    if (image) {
      updateOrCreateMeta('property', 'og:image', image)
    }

    // Update Twitter tags
    updateOrCreateMeta('name', 'twitter:title', title)
    updateOrCreateMeta('name', 'twitter:description', description)
    updateOrCreateMeta('name', 'twitter:url', currentUrl)
    if (image) {
      updateOrCreateMeta('name', 'twitter:image', image)
    }

    // Update keywords if provided
    if (keywords) {
      updateOrCreateMeta('name', 'keywords', keywords)
    }

    // Add breadcrumbs schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mukprabhakar.in/"
        }
      ]
    }

    // Add page-specific breadcrumbs
    const pathParts = location.pathname.split('/').filter(Boolean)
    pathParts.forEach((part, index) => {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": part.charAt(0).toUpperCase() + part.slice(1),
        "item": `https://mukprabhakar.in/${pathParts.slice(0, index + 1).join('/')}`
      })
    })

    // Inject breadcrumb schema
    let schemaEl = document.getElementById('breadcrumb-schema')
    if (!schemaEl) {
      schemaEl = document.createElement('script')
      schemaEl.id = 'breadcrumb-schema'
      schemaEl.type = 'application/ld+json'
      document.head.appendChild(schemaEl)
    }
    schemaEl.textContent = JSON.stringify(breadcrumbSchema, null, 2)

    // Add WebPage schema
    const webpageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title || "Mukesh Pal Portfolio",
      "description": description || "Full-Stack Developer Portfolio",
      "url": currentUrl,
      "image": image || "https://res.cloudinary.com/dddmyjevn/image/upload/q_auto/f_auto/v1775281267/mukeshp_ybprrz.png",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Mukesh Pal Portfolio",
        "url": "https://mukprabhakar.in/"
      },
      "author": {
        "@type": "Person",
        "name": "Mukesh Pal",
        "url": "https://mukprabhakar.in/"
      }
    }

    let webpageSchemaEl = document.getElementById('webpage-schema')
    if (!webpageSchemaEl) {
      webpageSchemaEl = document.createElement('script')
      webpageSchemaEl.id = 'webpage-schema'
      webpageSchemaEl.type = 'application/ld+json'
      document.head.appendChild(webpageSchemaEl)
    }
    webpageSchemaEl.textContent = JSON.stringify(webpageSchema, null, 2)

  }, [title, description, image, type, keywords, location.pathname, currentUrl])

  return null // This component doesn't render anything
}

export default SEOEnhancement
