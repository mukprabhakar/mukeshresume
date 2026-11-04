import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import GoogleAdSense from './GoogleAdSense'

// Register only the languages we actually use so the syntax highlighter
// ships a small bundle instead of the full Prism build (hundreds of langs).
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('ts', typescript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('sh', bash)
SyntaxHighlighter.registerLanguage('shell', bash)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('html', markup)
SyntaxHighlighter.registerLanguage('xml', markup)
SyntaxHighlighter.registerLanguage('markup', markup)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('py', python)

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])

  // SEO: Update document title and meta tags when post loads
  useEffect(() => {
    if (post) {
      // Update page title
      document.title = `${post.title} | Mukesh Pal - Full-Stack Developer Portfolio`
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt || post.title)
      } else {
        metaDescription = document.createElement('meta')
        metaDescription.name = 'description'
        metaDescription.content = post.excerpt || post.title
        document.head.appendChild(metaDescription)
      }
      
      // Update Open Graph tags
      const updateOrCreateMeta = (name, content, isProperty = false) => {
        const attribute = isProperty ? 'property' : 'name'
        let meta = document.querySelector(`meta[${attribute}="${name}"]`)
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute(attribute, name)
          document.head.appendChild(meta)
        }
        meta.content = content
      }
      
      updateOrCreateMeta('og:title', post.title, true)
      updateOrCreateMeta('og:description', post.excerpt, true)
      updateOrCreateMeta('og:type', 'article', true)
      updateOrCreateMeta('og:url', `https://mukprabhakar.in/blog/${slug}`, true)
      if (post.image) {
        updateOrCreateMeta('og:image', post.image, true)
      }
      
      updateOrCreateMeta('twitter:title', post.title)
      updateOrCreateMeta('twitter:description', post.excerpt)
      updateOrCreateMeta('twitter:card', 'summary_large_image')
      if (post.image) {
        updateOrCreateMeta('twitter:image', post.image)
      }
      
      // Add canonical URL
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = `https://mukprabhakar.in/blog/${slug}`
      
      // Add schema.org structured data
      let schemaScript = document.getElementById('blog-schema')
      if (!schemaScript) {
        schemaScript = document.createElement('script')
        schemaScript.id = 'blog-schema'
        schemaScript.type = 'application/ld+json'
        document.head.appendChild(schemaScript)
      }
      
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image || 'https://res.cloudinary.com/dddmyjevn/image/upload/q_auto/f_auto/v1775281267/mukeshp_ybprrz.png',
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
          "@type": "Person",
          "name": "Mukesh Pal",
          "url": "https://mukprabhakar.in"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Mukesh Pal Portfolio",
          "logo": {
            "@type": "ImageObject",
            "url": "https://res.cloudinary.com/dddmyjevn/image/upload/q_auto/f_auto/v1775281267/mukeshp_ybprrz.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://mukprabhakar.in/blog/${slug}`
        },
        "keywords": post.tags.join(', ')
      }
      
      schemaScript.textContent = JSON.stringify(schemaData, null, 2)
    }
  }, [post, slug])

  useEffect(() => {
    loadPost()
    window.scrollTo(0, 0)
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      console.log('📝 Loading post:', slug)
      
      // Import the specific markdown file
      const postFiles = import.meta.glob('/src/blog-posts/*.md', { as: 'raw' })
      const filePath = `/src/blog-posts/${slug}.md`
      
      console.log('🔍 Looking for:', filePath)
      console.log('📁 Available files:', Object.keys(postFiles))
      
      if (postFiles[filePath]) {
        const rawContent = await postFiles[filePath]()
        
        // Manual frontmatter parsing (no gray-matter)
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
        
        const postData = {
          slug,
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          category: data.category || 'General',
          image: data.image,
          excerpt: data.excerpt,
          content: markdownContent
        }
        
        console.log('✅ Post loaded:', postData.title)
        setPost(postData)
        loadRelatedPosts(postData)
      } else {
        console.error('❌ Post not found:', filePath)
      }
    } catch (error) {
      console.error('❌ Error loading blog post:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedPosts = async (currentPost) => {
    try {
      const postFiles = import.meta.glob('/src/blog-posts/*.md', { as: 'raw' })
      const allPosts = []
      
      for (const path in postFiles) {
        const rawContent = await postFiles[path]()
        const frontmatterRegex = /^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
        const match = rawContent.match(frontmatterRegex)
        
        let data = {}
        if (match) {
          const frontmatterStr = match[1]
          const extractField = (field) => {
            const regex = new RegExp(`^${field}:\\s*(.*)$`, 'm');
            const m = frontmatterStr.match(regex);
            return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
          };
          const tagsMatch = frontmatterStr.match(/^tags:\s*\[(.*?)\]/m);
          
          data = {
            title: extractField('title') || 'Untitled',
            tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, '')) : [],
            excerpt: extractField('excerpt') || ''
          }
        }
        
        const postSlug = path.split('/').pop().replace('.md', '')
        
        if (postSlug !== currentPost.slug) {
          allPosts.push({
            slug: postSlug,
            title: data.title,
            tags: data.tags || [],
            excerpt: data.excerpt
          })
        }
      }
      
      // Find posts with matching tags
      const related = allPosts.filter(post =>
        post.tags.some(tag => currentPost.tags.includes(tag))
      ).slice(0, 3)
      
      setRelatedPosts(related)
    } catch (error) {
      console.error('Error loading related posts:', error)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Post Not Found</h2>
          <Link to="/blog" className="text-emerald-400 hover:text-emerald-300">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-zinc-950 relative overflow-hidden pb-20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="w-full relative min-h-[60vh] flex items-end pb-16 pt-32 lg:pt-40">
          {post.image ? (
            <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950 flex items-center justify-center">
              {/* Ambient blurred background behind */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110" 
                style={{ backgroundImage: `url(${post.image})` }}
              ></div>
              {/* Actual image shown completely uncropped */}
              <img src={post.image} alt={post.title} className="w-full h-full object-contain relative z-10 p-4 md:p-8" />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent pointer-events-none"></div>
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900/40 to-blue-900/40">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
            </div>
          )}

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-[95vw] md:w-[90vw] max-w-[1400px] relative z-10">
            {/* Breadcrumb Navigation for SEO */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                <li><span className="mx-2">/</span></li>
                <li><Link to="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
                <li><span className="mx-2">/</span></li>
                <li><span className="text-emerald-400" aria-current="page">{post.title}</span></li>
              </ol>
            </nav>

            {/* Back Button */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium mb-8 transition-colors backdrop-blur-sm bg-zinc-950/30 px-5 py-2.5 rounded-full border border-emerald-500/20 w-fit hover:bg-emerald-500/10"
              aria-label="Back to all blog posts"
            >
              <span>← Back to Blog</span>
            </Link>

            {/* Post Header */}
            <header className="max-w-4xl">
              {/* Author Info for SEO */}
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="https://res.cloudinary.com/dddmyjevn/image/upload/q_auto/f_auto/v1775281267/mukeshp_ybprrz.png" 
                  alt="Mukesh Pal - Full-Stack Developer" 
                  className="w-12 h-12 rounded-full border-2 border-emerald-500/50"
                  loading="lazy"
                />
                <div>
                  <p className="text-white font-semibold">Mukesh Pal</p>
                  <p className="text-zinc-400 text-sm">Full-Stack Developer & CodeByte Co-Founder</p>
                </div>
              </div>

              {/* Category */}
              <span className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm rounded-full font-bold tracking-wider uppercase mb-6 backdrop-blur-md shadow-lg shadow-emerald-500/10">
                {post.category}
              </span>

              {/* Title - H1 for SEO */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight drop-shadow-2xl">
                {post.title}
              </h1>

              {/* Excerpt for SEO */}
              {post.excerpt && (
                <p className="text-xl text-zinc-300 mb-8 leading-relaxed font-light">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-zinc-300 text-sm font-medium">
                <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span>Published: {formatDate(post.date)}</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{calculateReadTime(post.content)}</span>
                </div>
              </div>

              {/* Tags - Internal linking for SEO */}
              <div className="flex flex-wrap gap-3 mt-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${tag}`}
                    className="px-4 py-1.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 text-zinc-300 rounded-full text-sm hover:border-emerald-500/50 hover:text-emerald-400 transition-all shadow-lg"
                    title={`View all posts tagged with ${tag}`}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </header>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-[95vw] md:w-[90vw] max-w-[1400px] relative z-20 -mt-12">
          {/* Post Content */}
          <div className="glass-card shadow-2xl p-6 sm:p-10 md:p-14 rounded-3xl border border-zinc-800/80 backdrop-blur-xl bg-zinc-950/80 mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            
            {/* Ad Placement 1: Top of content - Fluid ad with layout key */}
            {import.meta.env.VITE_ADSENSE_PUBLISHER_ID && (
              <GoogleAdSense 
                adSlot={import.meta.env.VITE_ADSENSE_SLOT_TOP} 
                adFormat="fluid"
                adLayoutKey="-gw-3+1f-3d+2z"
              />
            )}

            <div className="prose prose-lg md:prose-xl prose-invert max-w-none prose-img:rounded-2xl prose-img:border prose-img:border-zinc-800 prose-img:shadow-2xl prose-headings:text-white prose-p:text-zinc-300 prose-a:text-emerald-400 hover:prose-a:text-emerald-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Code blocks with syntax highlighting
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <div className="relative group my-8">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="relative rounded-xl border border-zinc-800 shadow-2xl !bg-[#1E1E1E]"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-zinc-800/80 border border-zinc-700 px-2 py-1 rounded-md text-emerald-400 text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                  img: ({ node, ...props }) => (
                    <span className="block md:inline-block md:float-right md:w-[45%] md:ml-10 md:mb-6 md:mt-2 clear-right">
                      <img 
                        className="w-full object-contain rounded-2xl border border-zinc-800 shadow-2xl my-6 md:my-0" 
                        {...props} 
                        alt={props.alt || ''}
                      />
                    </span>
                  ),
                  h1: ({ children }) => <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-16 mb-8 tracking-tight">{children}</h2>,
                  h2: ({ children }) => <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-14 mb-6 tracking-tight relative pb-4"><span className="absolute bottom-0 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-zinc-100 mt-10 mb-4 tracking-tight">{children}</h3>,
                  p: ({ children }) => <p className="text-zinc-300 leading-relaxed md:leading-loose mb-8 text-lg">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-outside ml-6 text-zinc-300 mb-8 space-y-3 text-lg marker:text-emerald-500">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside ml-6 text-zinc-300 mb-8 space-y-3 text-lg marker:text-emerald-500">{children}</ol>,
                  a: ({ href, children }) => <a href={href} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-400 transition-all font-medium" target="_blank" rel="noopener noreferrer">{children}</a>,
                  blockquote: ({ children }) => (
                    <blockquote className="relative my-10 pl-8 pr-4 py-4 border-l-4 border-emerald-500 bg-emerald-500/5 rounded-r-xl text-zinc-300 italic text-xl md:text-2xl font-light leading-relaxed">
                      <div className="absolute top-2 left-3 text-emerald-500/20 text-6xl font-serif">&ldquo;</div>
                      <div className="relative z-10">{children}</div>
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="my-8 overflow-x-auto rounded-xl border border-zinc-800 shadow-2xl">
                      <table className="w-full text-left border-collapse">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-b border-zinc-700">
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-zinc-800/50 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-6 py-4 text-white font-bold text-sm uppercase tracking-wider border-r border-zinc-700 last:border-r-0">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-6 py-4 text-zinc-300 text-sm border-r border-zinc-800 last:border-r-0">
                      {children}
                    </td>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Ad Placement 2: Bottom of content - In-article ad */}
            {import.meta.env.VITE_ADSENSE_PUBLISHER_ID && (
              <GoogleAdSense 
                adSlot={import.meta.env.VITE_ADSENSE_SLOT_MIDDLE} 
                adFormat="fluid"
                adLayout="in-article"
              />
            )}
          </div>

          {/* Ad Placement 3: After content - Autorelaxed ad */}
          {import.meta.env.VITE_ADSENSE_PUBLISHER_ID && (
            <GoogleAdSense 
              adSlot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM} 
              adFormat="autorelaxed"
            />
          )}

          {/* Share Section */}
          <div className="glass-card p-8 rounded-3xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 mb-16 shadow-xl">
            <h3 className="text-2xl font-bold text-white m-0">Spread the word</h3>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-full transition-all border border-[#1DA1F2]/20 hover:scale-110"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] rounded-full transition-all border border-[#0A66C2]/20 hover:scale-110"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.475-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">Read Next</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    to={`/blog/${relatedPost.slug}`}
                    className="glass-card p-6 border-b-4 border-b-transparent hover:border-b-emerald-400 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/80 transition-all duration-300 flex flex-col h-full shadow-lg"
                  >
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-emerald-400 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-3 mb-4 flex-grow">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-zinc-800">
                      {relatedPost.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="relative overflow-hidden glass-card p-10 md:p-14 rounded-3xl border border-emerald-500/30 text-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Have a project in mind?</h3>
              <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">Let&apos;s connect and discuss how we can bring your amazing ideas to life through high-quality code and beautiful design.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/blog"
                  className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-all font-semibold shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  More Articles
                </Link>
                <a
                  href="/#contact"
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-full transition-all font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 w-full sm:w-auto transform hover:-translate-y-1"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogPost
