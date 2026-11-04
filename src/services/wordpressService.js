// WordPress REST API service
// Pulls published posts from a WordPress site and normalizes them into the
// same shape the portfolio blog list uses, so WordPress posts appear
// automatically alongside the local markdown posts.
//
// Configure the site in your .env file:
//   VITE_WORDPRESS_URL=https://your-site.com
// (No auth needed — the public REST API only exposes published content.)

const WP_BASE = (import.meta.env.VITE_WORDPRESS_URL || '').replace(/\/+$/, '')

// Remove HTML tags and decode a few common entities for plain-text excerpts.
const stripHtml = (html = '') =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&hellip;/g, '…')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

// Normalize a single WordPress REST post into the portfolio post shape.
const normalizePost = (wp) => {
  const embedded = wp._embedded || {}
  const media = embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0]
  const terms = embedded['wp:term'] || []

  // wp:term is an array of arrays: [categories], [tags]
  const categories = (terms[0] || []).map((t) => t.name)
  const tags = (terms[1] || []).map((t) => t.name)

  return {
    slug: wp.slug,
    title: stripHtml(wp.title && wp.title.rendered),
    date: wp.date,
    tags: tags.length ? tags : categories,
    category: categories[0] || 'WordPress',
    image:
      (media && (media.source_url || (media.media_details && media.media_details.sizes && media.media_details.sizes.full && media.media_details.sizes.full.source_url))) ||
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    excerpt: stripHtml(wp.excerpt && wp.excerpt.rendered),
    content: (wp.content && wp.content.rendered) || '',
    // These flags let the blog list render WordPress posts as external links
    // that open the original article on the WordPress site.
    external: true,
    url: wp.link,
  }
}

/**
 * Fetch published posts from the configured WordPress site.
 * Returns [] when not configured or on any network/parse error, so the
 * portfolio never breaks if WordPress is down or the URL is missing.
 *
 * @param {number} perPage number of posts to request (default 12)
 * @returns {Promise<Array>} normalized posts
 */
export const fetchWordPressPosts = async (perPage = 12) => {
  if (!WP_BASE) return []

  try {
    const endpoint = `${WP_BASE}/wp-json/wp/v2/posts?_embed&per_page=${perPage}&orderby=date&order=desc`
    const res = await fetch(endpoint, { headers: { Accept: 'application/json' } })

    if (!res.ok) {
      console.warn(`WordPress fetch failed: ${res.status} ${res.statusText}`)
      return []
    }

    const data = await res.json()
    if (!Array.isArray(data)) return []

    return data.map(normalizePost)
  } catch (error) {
    console.warn('WordPress fetch error:', error)
    return []
  }
}

export const isWordPressConfigured = () => Boolean(WP_BASE)

export default fetchWordPressPosts
