import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchWordPressPosts } from '../services/wordpressService'
import SEOEnhancement from './SEOEnhancement'

const BlogPosts = () => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [selectedTag, setSelectedTag] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    loadBlogPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [selectedTag, searchQuery, posts])

  const loadBlogPosts = async () => {
    try {
      console.log('📝 Loading blog posts...')
      // Import all markdown files from blog-posts directory
      const postFiles = import.meta.glob('/src/blog-posts/*.md', { as: 'raw' })
      
      const loadedPosts = []
      
      for (const path in postFiles) {
        const rawContent = await postFiles[path]()
        
        // Manual frontmatter parsing
        const frontmatterRegex = /^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
        const match = rawContent.match(frontmatterRegex)
        
        let data = {}
        let markdownContent = rawContent
        
        if (match) {
          const frontmatterStr = match[1]
          markdownContent = match[2]
          
          const extractField = (field) => {
            const regex = new RegExp(`^${field}:\\s*(.*)$`, 'm');
            const m = frontmatterStr.match(regex);
            return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
          };

          const tagsMatch = frontmatterStr.match(/^tags:\s*\[(.*?)\]/m);
          
          data = {
            title: extractField('title') || 'Untitled',
            date: extractField('date') || '2024-01-01',
            tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, '')) : [],
            category: extractField('category') || 'General',
            image: extractField('image') || '',
            excerpt: extractField('excerpt') || ''
          }
        }
        
        const slug = path.split('/').pop().replace('.md', '')
        
        loadedPosts.push({
          slug,
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          category: data.category || 'General',
          image: data.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          excerpt: data.excerpt,
          content: markdownContent
        })
      }
      
      // Also pull published posts from WordPress (if VITE_WORDPRESS_URL is set).
      // These are merged in so any post you publish on WordPress shows up here
      // automatically. Fails silently (returns []) if not configured/unreachable.
      const wordpressPosts = await fetchWordPressPosts()
      const combinedPosts = [...loadedPosts, ...wordpressPosts]
      
      // Sort by date (newest first)
      combinedPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
      
      setPosts(combinedPosts)
      
      // Extract all unique tags
      const tags = [...new Set(combinedPosts.flatMap(post => post.tags))]
      setAllTags(tags)
      
    } catch (error) {
      console.error('❌ Error loading blog posts:', error)
    }
  }

  const filterPosts = () => {
    let filtered = posts

    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredPosts(filtered)
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  const featuredPost = (!searchQuery && !selectedTag && filteredPosts.length > 0) ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  // Local markdown posts route internally; WordPress posts open the original
  // article on the WordPress site in a new tab.
  const PostLink = ({ post, className, children, ...rest }) =>
    post.external ? (
      <a href={post.url} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
        {children}
      </a>
    ) : (
      <Link to={`/blog/${post.slug}`} className={className} {...rest}>
        {children}
      </Link>
    );

  return (
    <section className="min-h-screen py-24 bg-[#0a0a0c] relative overflow-hidden text-zinc-100 font-sans">
      <SEOEnhancement
        title="Blog - Mukesh Pal | Full-Stack Developer & Tech Blogger"
        description="Read technical articles by Mukesh Pal on React.js, Java Spring Boot, AI, web development, and software engineering."
        type="website"
      />
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-xl mb-4 text-sm text-zinc-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Insights & Thoughts</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-sm">
            My <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Journal</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Exploring the frontiers of web development, engineering practices, and startup building as a passionate Full-Stack developer.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl opacity-0 group-hover:opacity-100"></div>
          <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-2 shadow-2xl transition-all duration-300 focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10">
            <div className="pl-4 pr-3 text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, tag, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 px-2 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Tags Filter - Horizontal Scrollable */}
        <div className="mb-16 relative max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            {/* Left Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('tags-container')
                container.scrollBy({ left: -200, behavior: 'smooth' })
              }}
              className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700/50 items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              aria-label="Scroll tags left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Tags Container */}
            <div 
              id="tags-container"
              className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="flex gap-3 pb-2 min-w-max">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 transform active:scale-95 flex-shrink-0 ${
                    !selectedTag
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                      : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  All Insights
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform active:scale-95 flex-shrink-0 ${
                      selectedTag === tag
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] border-none'
                        : 'bg-zinc-800/30 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800 hover:text-white hover:border-zinc-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('tags-container')
                container.scrollBy({ left: 200, behavior: 'smooth' })
              }}
              className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700/50 items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              aria-label="Scroll tags right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16 hover:-translate-y-1 transition-transform duration-500">
            <PostLink post={featuredPost} className="group block relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5 h-64 md:h-[450px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent md:hidden z-10"></div>
                  <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  {/* Ambient background matching image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 transform scale-110 transition-opacity duration-700 group-hover:opacity-60" 
                    style={{ backgroundImage: `url(${featuredPost.image})` }}
                  ></div>
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-contain relative z-10 p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 z-20">
                    <span className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center relative z-20 bg-zinc-900">
                  <div className="flex items-center text-sm text-emerald-400 font-medium mb-4 space-x-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {formatDate(featuredPost.date)}
                    </div>
                    <div className="flex items-center text-zinc-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {calculateReadTime(featuredPost.content)}
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-300">
                    {featuredPost.title}
                  </h2>
                  <p className="text-zinc-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-white font-semibold group-hover:text-emerald-400 transition-colors">
                      Read Article 
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </span>
                  </div>
                </div>
              </div>
            </PostLink>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post, index) => (
            <PostLink
              key={post.slug}
              post={post}
              className="group flex flex-col bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-emerald-500/5 hover:border-emerald-500/30 transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-56 overflow-hidden bg-zinc-800">
                {/* Ambient background matching image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 transform scale-110 transition-opacity duration-700 group-hover:opacity-60" 
                  style={{ backgroundImage: `url(${post.image})` }}
                ></div>
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-contain relative z-10 p-2 transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <span className="backdrop-blur-md bg-black/40 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {post.category}
                  </span>
                  <div className="backdrop-blur-md bg-black/40 px-2 py-1 rounded text-[10px] text-zinc-300 font-medium">
                    {calculateReadTime(post.content)}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="text-xs text-zinc-500 mb-3 font-medium flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {formatDate(post.date)}
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 leading-snug group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-zinc-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto mb-6">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 rounded-md text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-2.5 py-1 bg-zinc-800/80 text-zinc-500 rounded-md text-xs font-medium">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="border-t border-zinc-800/80 pt-4 flex items-center text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Read more
                  <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
            </PostLink>
          ))}
        </div>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-32 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-3xl mt-8">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No posts found</h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              We couldn&apos;t find any articles matching your current search or tag filters. Try adjusting them!
            </p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedTag(null);}}
              className="mt-8 px-6 py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-full font-medium transition-colors border border-emerald-500/20"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-20">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group"
          >
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogPosts

