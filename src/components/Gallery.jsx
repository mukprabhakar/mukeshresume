import React, { useState } from 'react'
import { trackEvent } from '../utils/analytics'
import SEOEnhancement from './SEOEnhancement'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)

  // Professional gallery images - Update these with your actual images
  const galleryImages = [
    {
      id: 1,
      title: 'TEDx IIMT Organization Team',
      description: 'Proud member of the TEDx IIMT University organization team, bringing inspiring talks to our community',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018046/1762925094340_qxegbw.jpg',
      category: 'Events'
    },
    {
      id: 2,
      title: 'With ISRO Scientist Dr. Alok Taori',
      description: 'Meeting with ISRO scientist Dr. Alok Taori during research collaboration at NRSC Hyderabad',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018218/1746639744569_aojopr.jpg',
      category: 'Research'
    },
    {
      id: 3,
      title: 'ISRO Visit - NRSC Center Hyderabad',
      description: 'Educational visit to NRSC Center, Hyderabad',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018218/1746639762506_lmlter.jpg',
      category: 'Education'
    },
    {
      id: 4,
      title: 'Award from Coding Ninjas Co-founder',
      description: 'Receiving recognition from Anshul Skula, Co-founder of Coding Ninjas, for excellence in technology',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018215/1693138336430_bnzi06.jpg',
      category: 'Achievements'
    },
    {
      id: 5,
      title: 'With Entrepreneur Punit Mongoliya',
      description: 'Networking session with successful entrepreneur Punit Mongoliya',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018217/1726985209533_bp0bah.jpg',
      category: 'Entrepreneurship'
    },
    {
      id: 6,
      title: 'Russian Embassy Visit - Delhi',
      description: 'Official visit to Russian Embassy in New Delhi for international collaboration',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775017930/mukesh_russan_ambassi_mmnusg.jpg',
      category: 'Events'
    },
    {
      id: 7,
      title: 'Project Presentation at Hackathon',
      description: 'Explaining innovative project solution during competitive hackathon event',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018219/1759082135749_ljckdi.jpg',
      category: 'Events'
    },
    {
      id: 8,
      title: 'With Piyush Sharma (Trick Man)',
      description: 'Meeting with Piyush Sharma, content creator, YouTuber and founder of Trick Man',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018217/1742820041087_g8dtla.jpg',
      category: 'Networking'
    },
    {
      id: 9,
      title: 'Startup India 2023',
      description: 'Attending Startup India summit to explore emerging trends and innovations',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018222/84_jarzee.jpg',
      category: 'Entrepreneurship'
    },
    {
      id: 10,
      title: 'Startup India 2025',
      description: 'Participating in Startup India 2025, connecting with innovators and investors',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018218/1758994269460_udck3b.jpg',
      category: 'Entrepreneurship'
    },
    {
      id: 11,
      title: 'Startup India 2025 Culture',
      description: 'Experiencing the vibrant culture and networking at Startup India 2025',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018219/1758994271094_xkoak4.jpg',
      category: 'Entrepreneurship'
    },
    {
      id: 12,
      title: 'With Sarthak Jain',
      description: 'Meeting with Sarthak Jain, exchanging ideas on technology and innovation',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018122/1760043374156_vtcijf.jpg',
      category: 'Networking'
    },
    {
      id: 13,
      title: 'Animal Fair IIMT University',
      description: 'With Radha Rani at the Animal Fair organized at IIMT University',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018085/1761568264988_e2rp0p.jpg',
      category: 'Events'
    },
    {
      id: 14,
      title: 'With Harshvardhan Bajoria',
      description: 'Networking session with Harshvardhan Bajoria, discussing business strategies',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018218/1747246123354_vgwzmg.jpg',
      category: 'Networking'
    },
    {
      id: 15,
      title: 'AI Impact Summit Delhi',
      description: 'Attending AI Impact Summit in Delhi to explore latest advancements in artificial intelligence',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018220/81_jpgowa.jpg',
      category: 'Events'
    },
    {
      id: 16,
      title: 'Visit to Charminar',
      description: 'Exploring the historic Charminar monument in Hyderabad',
      image: 'https://res.cloudinary.com/dddmyjevn/image/upload/v1775018220/82_ynuqcv.jpg',
      category: 'Personal'
    }
  ]

  const categories = ['All', ...new Set(galleryImages.map(img => img.category))]
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory)

  const openModal = (image) => {
    setSelectedImage(image)
    trackEvent('click', 'gallery', `view_image_${image.title}`)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  // Download image function
  const downloadImage = async (imageUrl, imageTitle) => {
    try {
      trackEvent('click', 'gallery', `download_${imageTitle}`)
      
      // Fetch the image as a blob
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // Create a temporary URL
      const blobUrl = window.URL.createObjectURL(blob)
      
      // Create temporary link element
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `${imageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`
      
      // Append to body, click and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the URL
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
      // Fallback: open in new tab
      window.open(imageUrl, '_blank')
    }
  }

  // Share image function
  const shareImage = async (image) => {
    try {
      trackEvent('click', 'gallery', `share_${image.title}`)
      
      // Check if Web Share API is supported
      if (navigator.share) {
        // Fetch image as blob for sharing
        const response = await fetch(image.image)
        const blob = await response.blob()
        const file = new File([blob], `${image.title}.jpg`, { type: 'image/jpeg' })
        
        await navigator.share({
          title: image.title,
          text: image.description,
          files: [file]
        })
      } else {
        // Fallback: Copy image URL to clipboard
        await navigator.clipboard.writeText(image.image)
        
        // Show success message
        alert('Image URL copied to clipboard! You can now share it.')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing image:', error)
        // Fallback: Copy URL to clipboard
        try {
          await navigator.clipboard.writeText(image.image)
          alert('Image URL copied to clipboard!')
        } catch (clipboardError) {
          console.error('Error copying to clipboard:', clipboardError)
          // Last resort: Open image in new tab
          window.open(image.image, '_blank')
        }
      }
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#09090b] text-zinc-100 relative overflow-hidden">
      <SEOEnhancement
        title="Moments in Tech & Gallery | Mukesh Pal"
        description="Visual portfolio and tech journey of Mukesh Pal featuring moments at ISRO NRSC, TEDx, hackathons, and technology conferences."
        type="website"
      />
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-500/10 via-blue-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-150px] right-[-100px] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-150px] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-8 relative z-10 max-w-[1400px]">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-24 animate-fade-in flex flex-col items-center">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Visual Portfolio
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
              Moments in
            </span>{" "}
            <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              Tech
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed">
            A curated collection of my professional journey, highlighting key events, innovation labs, and milestones that shape my career.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex justify-center mb-16 flex-wrap gap-3 sm:gap-4 animate-slide-in-up">
          {categories.map((category) => (
            <button
              key={category}
              className={`relative px-6 py-3 rounded-full text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 ease-out overflow-hidden group ${
                activeCategory === category
                  ? 'text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105'
                  : 'text-zinc-400 hover:text-white bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-700/50 hover:border-zinc-500 hover:scale-105'
              }`}
              onClick={() => {
                setActiveCategory(category)
                trackEvent('click', 'gallery', `filter_${category}`)
              }}
              aria-pressed={activeCategory === category}
            >
              {activeCategory === category && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 opacity-100 transition-opacity"></div>
              )}
              <span className="relative z-10 block">{category}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid (Masonry effect using Tailwind columns) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 sm:gap-8 space-y-6 sm:space-y-8">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group break-inside-avoid relative overflow-hidden rounded-3xl cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-500 ease-out hover:shadow-[0_10px_40px_rgba(239,68,68,0.2)] hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => openModal(image)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openModal(image)
                }
              }}
              tabIndex="0"
              role="button"
              aria-label={`View ${image.title}`}
            >
              {/* Decorative corner glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>

              {/* Image Container with Dynamic Aspect Ratios to create masonry heights */}
              <div 
                className="relative overflow-hidden w-full z-10 bg-zinc-900" 
                style={{ aspectRatio: image.id % 3 === 0 ? '4/5' : image.id % 2 === 0 ? '3/4' : '4/3' }}
              >
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Advanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950/90 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Info Overlay */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-20">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col items-start">
                  
                  <span className="inline-block bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {image.category}
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {image.title}
                  </h3>
                  
                  {/* Expandable description wrapper */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                    <div className="overflow-hidden">
                      <p className="text-zinc-300 text-sm mt-2 line-clamp-2">
                        {image.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Action Icon */}
              <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform rotate-[-45deg] group-hover:rotate-0 transition-all duration-500 delay-75 shadow-lg z-20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if no images match */}
        {filteredImages.length === 0 && (
           <div className="text-center py-32 bg-zinc-900/50 rounded-3xl border border-zinc-800">
              <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No moments captured</h3>
              <p className="text-zinc-500 text-lg">There are no images in the selected category.</p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"
              >
                Clear Filter
              </button>
           </div>
        )}

        {/* Back to home button */}
        <div className="text-center mt-24 relative z-20 pb-10">
           {/* Decorative line */}
           <div className="w-px h-24 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent mx-auto mb-8"></div>
          <a
            href="/"
            className="group inline-flex items-center justify-center gap-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 px-10 rounded-full border border-zinc-700/80 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:-translate-y-1 backdrop-blur-xl"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </div>
            <span>Return Home</span>
          </a>
        </div>
      </div>

      {/* Enhanced Modal (Glassmorphism & Cinematic View) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12"
          role="dialog"
          aria-modal="true"
        >
          {/* Cinema Backdrop */}
          <div 
            className="absolute inset-0 bg-zinc-950/95 backdrop-blur-2xl transition-opacity animate-fade-in"
            onClick={closeModal}
          ></div>
          
          <div className="relative w-full max-w-[1400px] max-h-[90vh] mx-auto flex flex-col lg:flex-row bg-zinc-900/60 border border-zinc-800/80 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 animate-scale-in backdrop-blur-3xl">
            
            {/* Elegant Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 lg:top-6 lg:right-6 z-30 w-14 h-14 flex items-center justify-center rounded-full bg-black/40 hover:bg-red-500 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-xl group border border-white/10 hover:border-red-400/50"
              aria-label="Close image preview"
            >
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            {/* Modal Image Area */}
            <div className="w-full lg:w-[65%] xl:w-[70%] bg-black/60 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden group/img">
              {/* Subtle pulsing background glow behind image */}
              <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full scale-150 animate-pulse"></div>
              
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-auto h-auto max-h-[40vh] lg:max-h-[85vh] max-w-full rounded-xl shadow-2xl relative z-10 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>

            {/* Modal Info Sidebar */}
            <div className="w-full lg:w-[35%] xl:w-[30%] p-8 lg:p-12 flex flex-col justify-center bg-zinc-900/80 border-t lg:border-t-0 lg:border-l border-zinc-800/80 overflow-y-auto">
               <div className="space-y-6">
                 <div>
                   <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                     {selectedImage.category}
                   </span>
                 </div>
                 
                 <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                   {selectedImage.title}
                 </h3>
                 
                 <div className="w-16 h-1.5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"></div>
                 
                 <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                   {selectedImage.description}
                 </p>
               </div>
               
               {/* Metadata or extra flair  */}
               <div className="mt-12 pt-8 border-t border-zinc-800/80 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">Capture Date</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">2026 Portfolio</div>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="mt-8 flex gap-4">
                  <button 
                    onClick={() => downloadImage(selectedImage.image, selectedImage.title)}
                    className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(239,68,68,0.3)] flex items-center justify-center gap-3"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                     Save Image
                  </button>
                  <button 
                    onClick={() => shareImage(selectedImage)}
                    className="w-[60px] flex items-center justify-center rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white transition-all transform hover:-translate-y-1 hover:shadow-lg border border-zinc-700" 
                    aria-label="Share"
                  >
                     <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
