import React, { useState, useMemo } from 'react'
import TiltCard from './TiltCard'
import SectionHeading from './SectionHeading'

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 4

  const blogPosts = [
    {
      id: 1,
      title: '21 Days Challenge | Change Your Life in Just 21 Days',
      excerpt: 'Introduction to the 21 Days Challenge concept and how committing to small changes can transform your habits and life in just three weeks.',
      date: 'July 11, 2024',
      tag: 'Leadership',
      image: 'https://miro.medium.com/v2/resize:fit:1100/format:webp/0*smvmN2oCc1ZXq3L3.jpeg',
      url: 'https://medium.com/@mukesh.mmp1234/21-days-challenge-transform-your-life-in-just-21-days-65e0837ed040',
      featured: true,
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'How to Become a Professional Developer in Student Life',
      excerpt: 'Practical guide for students to transition into professional developers by building skills, projects, and networking while still in college.',
      date: 'June 30, 2024',
      tag: 'Career',
      image: 'https://miro.medium.com/v2/resize:fit:1100/format:webp/0*lJcI1lPOo_0H2G6z',
      url: 'https://medium.com/@mukesh.mmp1234/how-to-become-a-professional-developer-in-student-life-4cb765d9cb97',
      featured: true,
      readTime: '8 min read'
    },
    {
      id: 3,
      title: 'How to Become a GitHub Campus Expert',
      excerpt: 'Step-by-step guide to becoming a GitHub Campus Expert, including application process, responsibilities, and benefits of the program.',
      date: 'July 28, 2024',
      tag: 'DSA',
      image: 'https://miro.medium.com/v2/resize:fit:1100/format:webp/0*R-9mV65jBRTBCcUP.png',
      url: 'https://medium.com/@mukesh.mmp1234/how-to-become-a-github-campus-expert-a-comprehensive-guide-7d9dd4cf6b0d',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'How to Become a Microsoft Learn Student Ambassador (MLSA)',
      excerpt: 'Comprehensive guide on the MLSA program, application process, and tips to strengthen your profile for this prestigious student ambassador role.',
      date: 'June 15, 2024',
      tag: 'Microsoft',
      image: 'https://miro.medium.com/v2/resize:fit:640/format:webp/0*IqCgFcKcIcbpTYiD',
      url: 'https://medium.com/@mukesh.mmp1234/how-to-become-a-microsoft-learn-student-ambassador-mlsa-a-comprehensive-guide-9b2825df378d',
      readTime: '7 min read'
    },
    {
      id: 5,
      title: 'Top 10 Highest Paying Jobs in Civil Engineering',
      excerpt: 'Exploring lucrative career paths in civil engineering, including required qualifications, salary ranges, and growth opportunities.',
      date: 'May 22, 2024',
      tag: 'Engineering',
      image: 'https://miro.medium.com/v2/resize:fit:1100/format:webp/0*oTi1o7TKWjSHaPL9.jpg',
      url: 'https://medium.com/@mukesh.mmp1234/top-10-highest-paying-jobs-in-civil-engineering-7dd700a1e44c',
      readTime: '9 min read'
    },
    {
      id: 6,
      title: 'History of Civil Engineering',
      excerpt: 'Comprehensive journey through civil engineering\'s evolution from ancient wonders to modern infrastructure marvels and technological advancements.',
      date: 'April 18, 2024',
      tag: 'Engineering',
      image: 'https://miro.medium.com/v2/resize:fit:1100/format:webp/0*ptScP132Af0RvB4R.png',
      url: 'https://medium.com/@mukesh.mmp1234/history-of-civil-engineering-d36d66733578',
      readTime: '12 min read'
    }
  ]

  // Get unique tags
  const allTags = ['All', ...new Set(blogPosts.map(post => post.tag))]

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = selectedTag === 'All' || post.tag === selectedTag
      return matchesSearch && matchesTag
    })
  }, [searchTerm, selectedTag])

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage)

  // Featured posts
  const featuredPosts = blogPosts.filter(post => post.featured)

  const getTagClass = (tag) => {
    const tagClasses = {
      'Leadership': 'bg-purple-400/10 text-purple-400',
      'Career': 'bg-emerald-400/10 text-emerald-400',
      'DSA': 'bg-blue-400/10 text-blue-400',
      'Microsoft': 'bg-cyan-400/10 text-cyan-400',
      'Engineering': 'bg-amber-400/10 text-amber-400'
    }
    return tagClasses[tag] || 'bg-brand/10 text-brand-dark'
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section id="blog" className="section section-gray relative overflow-hidden" aria-labelledby="blog-heading">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          id="blog-heading"
          eyebrow="Blog"
          title="My Blog"
          description="Sharing knowledge and insights about technology and leadership"
          tone="light"
        />

        {/* Featured Posts Section */}
        {currentPage === 1 && (
          <div className="mb-12 sm:mb-16">
            <h4 className="text-xl sm:text-2xl font-bold text-ink mb-4 sm:mb-6 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              Featured Articles
            </h4>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <TiltCard
                  key={post.id}
                  className="premium-card rounded-xl overflow-hidden hover:shadow-card-hover"
                >
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                    aria-label={`Read featured article: ${post.title}`}
                  >
                    <div className="md:flex">
                      <div className="md:flex-shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-40 sm:h-48 w-full md:w-40 md:h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://placehold.co/600x400/18181b/34d399?text=Blog+Image'
                          }}
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                          <span className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full ${getTagClass(post.tag)}`}>
                            {post.tag}
                          </span>
                          <span className="text-ink-muted text-xs sm:text-sm">{post.date}</span>
                        </div>
                        <h5 className="font-bold text-base sm:text-xl text-ink mb-2">{post.title}</h5>
                        <p className="text-ink-muted text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <div className="text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-semibold transition flex items-center">
                            Read More <span className="ml-1">→</span>
                          </div>
                          <span className="text-zinc-500 text-xs">{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </TiltCard>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <label htmlFor="blog-search" className="sr-only">Search articles</label>
                <input
                  type="text"
                  id="blog-search"
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 pl-12 rounded-xl bg-white border border-line text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-transparent text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search blog articles"
                />
                <svg className="w-5 h-5 text-ink-muted absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag)
                    setCurrentPage(1)
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border ${selectedTag === tag
                      ? 'bg-brand text-white border-brand shadow-red-glow'
                      : 'bg-white text-ink-soft border-line hover:border-brand/50 hover:text-brand-dark'
                    }`}
                  aria-pressed={selectedTag === tag}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {paginatedPosts.map((post) => (
                <TiltCard
                  key={post.id}
                  className="premium-card rounded-xl overflow-hidden hover:shadow-card-hover"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-40 sm:h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://placehold.co/600x400/18181b/34d399?text=Blog+Image'
                    }}
                  />
                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <span className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full ${getTagClass(post.tag)}`}>
                        {post.tag}
                      </span>
                      <span className="text-ink-muted text-xs sm:text-sm">{post.date}</span>
                    </div>
                    <h4 className="font-bold text-base sm:text-xl text-ink mb-2 sm:mb-3">{post.title}</h4>
                    <p className="text-ink-muted text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-3">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-semibold transition"
                        aria-label={`Read article: ${post.title}`}
                      >
                        Read More
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </a>
                      <span className="text-zinc-500 text-xs">{post.readTime}</span>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 sm:mt-12">
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm border ${currentPage === 1
                        ? 'bg-surface text-ink-muted border-line cursor-not-allowed'
                        : 'bg-white text-ink-soft border-line hover:border-brand/50 hover:text-brand'
                      }`}
                    aria-label="Previous page"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm border ${currentPage === page
                            ? 'bg-brand text-white font-bold border-brand shadow-red-glow'
                            : 'bg-white text-ink-soft border-line hover:border-brand/50 hover:text-brand'
                          }`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        aria-label={`Page ${page}`}
                      >
                        {page}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm border ${currentPage === totalPages
                        ? 'bg-surface text-ink-muted border-line cursor-not-allowed'
                        : 'bg-white text-ink-soft border-line hover:border-brand/50 hover:text-brand'
                      }`}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 sm:py-12">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-ink-muted mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h4 className="text-lg sm:text-xl font-bold text-ink mb-2">No articles found</h4>
            <p className="text-ink-muted mb-5 sm:mb-6 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedTag('All')
                setCurrentPage(1)
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-brand text-white font-bold rounded-full hover:bg-brand-dark hover:shadow-red-glow transition text-sm sm:text-base"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12 sm:mt-16">
          <a
            href="https://medium.com/@mukprabhakar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border-2 border-brand text-brand-dark font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-brand hover:text-white transition-all transform hover:scale-105 text-sm sm:text-base"
            aria-label="View all articles on Medium"
          >
            View All Articles on Medium
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Blog