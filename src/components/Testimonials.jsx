import React, { useState, useEffect } from 'react'
import TiltCard from './TiltCard'
import SectionHeading from './SectionHeading'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const testimonials = [
    {
     id: 1,
     name: 'Pankaj Kumar Singh',
      position: 'Dean, School of Engineering & Technology',
     company: 'IIMT University',
      image: 'https://media.licdn.com/dms/image/v2/C4D03AQGUL28p4SpMWQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1657521793944?e=1756339200&v=beta&t=l4vIMHZqJ3WpG6z-wFQf5_JcZb_vMIpilBFAASwwTsU',
     content: '"Mukesh Pal is a remarkable student who exemplifies dedication, innovation, and leadership within the School of Engineering & Technology. His contributions, especially in initiatives like the INNOTECH CULTURE CLUB and various tech projects, have greatly enriched our university\'s academic and practical learning environment. Mukesh\'s ability to lead, mentor peers, and develop impactful solutions has consistently impressed faculty and students alike."',
      quote: '"He embodies the values we strive to instill in our students and stands out as a true asset to IIMT University."',
      rating: 5,
     relationship: 'Academic Supervisor'
    },
    {
     id: 2,
     name: 'Archana Jain',
      position: 'HOD, Computer Science Engineering',
     company: 'IIMT University',
      image: 'https://media.licdn.com/dms/image/v2/C5103AQFxWMMyuP8h7Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1549548204982?e=1756339200&v=beta&t=gv79243dFQtlePGuMx7x4AcTGc3iupgJuLSnp96iZLE',
     content: '"Mukesh Pal exemplifies dedication and technical proficiency. As a student, he consistently demonstrates a deep commitment to his studies and extracurricular projects, especially in areas like software development and leadership within the university. His innovative approach to problem-solving and collaborative spirit make him an exceptional team member."',
      quote: '"His role as a leader in various clubs reflects his passion for innovation and his ability to inspire and guide his peers. Mukesh is not only a diligent student but also a promising leader."',
      rating: 5,
     relationship: 'Department Head'
    },
    {
     id: 3,
     name: 'Kuldeep Kumar Singh',
      position: 'HOD, 1st Year Engineering',
     company: 'IIMT University',
      image: 'https://media.licdn.com/dms/image/v2/D5603AQF0tRBoH4x3Rg/profile-displayphoto-crop_800_800/B56ZfK3LRBH8AQ-/0/1751455153064?e=1756339200&v=beta&t=7xAt9bT7KjDYY_UwektbasdQhuYBwHW2d0__IYp6P5U',
     content: '"I am pleased to recommend Mukesh Pal, a dedicated B.Tech student in Computer Science and Engineering at IIMT University. As the Head of the 1st Year Engineering Department, I have observed his strong commitment to academics and his passion for technology. His leadership as President of the E-Cell and as a Microsoft Learn Student Ambassador demonstrates exceptional organizational and communication skills."',
      quote: '"Mukesh has excelled as the President of the E-Cell and as a Microsoft Learn Student Ambassador, demonstrating leadership and dedication to skill development. He possesses excellent communication and teamwork abilities."',
      rating: 5,
     relationship: 'Academic Mentor'
    },
    {
     id: 4,
     name: 'Dr. Vaibhav Sharma',
      position: 'CEO',
     company: 'IIMT BIF',
      image: 'https://media.licdn.com/dms/image/v2/D5603AQE2EsFbeetXnw/profile-displayphoto-scale_400_400/B56ZsZSSjCI0Ag-/0/1765655785530?e=1774483200&v=beta&t=9Co4Ala8ikgrA4oUouQwDdtwT_R3f3oRIjebuG2RVsI',
     content: '"Mukesh Pal is an exceptional young professional with remarkable leadership qualities and technical expertise. His innovative thinking and entrepreneurial mindset set him apart from his peers. During his time at IIMT BIF, he demonstrated outstanding capabilities in project management and strategic planning."',
      quote: '"His ability to translate complex business requirements into effective technical solutions makes him an invaluable asset to any organization."',
      rating: 5,
     relationship: 'Industry Mentor'
    },
    {
     id: 5,
     name: 'Dr. Akshay Raj',
      position: 'Senior Manager',
     company: 'IIMT BIF',
      image: 'https://media.licdn.com/dms/image/v2/D5603AQFQv-1lsFvCEA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1721674596004?e=1774483200&v=beta&t=3p6-UKE0z3_HABYZKgkRNAZbYqUS_SINGrbihc6NYhk',
     content: '"Working with Mukesh has been a pleasure. His dedication to excellence and continuous learning is truly commendable. He consistently delivers high-quality results and shows great potential in both technical and managerial domains."',
      quote: '"Mukesh\'s proactive approach and problem-solving abilities make him a standout performer. I\'m confident he will achieve great success in his career."',
      rating: 5,
     relationship: 'Professional Reference'
    }
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    if (isHovering) return
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length, isHovering])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % testimonials.length
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex mb-1 sm:mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${i < rating ? 'text-yellow-400' : 'text-zinc-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <section id="testimonials" className="section section-dark relative overflow-hidden" aria-labelledby="testimonials-heading">
      {/* Enhanced background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Testimonials"
          title="Testimonials"
          description="What people say about working with me"
        />

        {/* Testimonial Carousel */}
        <div className="max-w-6xl mx-auto">
          <div
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            aria-roledescription="carousel"
            aria-label="Testimonial carousel"
          >
            {/* Testimonial Card */}
            <TiltCard className="glass-card rounded-2xl p-6 sm:p-8 border border-zinc-700 hover:border-emerald-400/30 transition-all duration-500 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-emerald-400/30 object-cover shadow-lg transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonials[currentIndex].name) + '&background=34d399&color=fff&size=128'
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-zinc-900">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-left flex-1">
                  <div className="flex justify-center md:justify-start mb-1 sm:mb-2">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>

                  <p className="text-zinc-300 text-base sm:text-lg italic mb-4 sm:mb-6 relative">
<span className="absolute top-0 left-0 text-6xl sm:text-8xl opacity-5 text-emerald-400 font-serif" aria-hidden="true">&quot;</span>
                    <span className="relative z-10">{testimonials[currentIndex].content}</span>
                  </p>

                  <div className="border-t border-zinc-700 pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <p className="text-emerald-400 font-bold text-base sm:text-lg mb-1">{testimonials[currentIndex].name}</p>
                    <p className="text-zinc-300 font-medium text-sm sm:text-base">{testimonials[currentIndex].position}</p>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-1">{testimonials[currentIndex].company}</p>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-2 italic">({testimonials[currentIndex].relationship})</p>
                  </div>

                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-zinc-800/50 to-zinc-800/30 rounded-xl border-l-4 border-emerald-400 backdrop-blur-sm">
<p className="text-zinc-200 italic text-sm sm:text-base font-medium">&quot;{testimonials[currentIndex].quote}&quot;</p>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 sm:-translate-x-4 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-400 hover:text-white hover:border-emerald-400 hover:bg-emerald-400/10 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-emerald-400/20"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-3 sm:translate-x-4 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-400 hover:text-white hover:border-emerald-400 hover:bg-emerald-400/10 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-emerald-400/20"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 sm:mt-10 space-x-2 sm:space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-emerald-400 w-6 sm:w-8' : 'bg-zinc-600 hover:bg-zinc-500'
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>

          {/* Enhanced Testimonial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-20 max-w-4xl mx-auto">
            <TiltCard className="glass-card rounded-xl p-5 sm:p-6 border border-zinc-700 hover:border-emerald-400/30 transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">50+</div>
              <div className="text-zinc-400 text-xs sm:text-sm">Professional Recommendations</div>
            </TiltCard>

            <TiltCard className="glass-card rounded-xl p-5 sm:p-6 border border-zinc-700 hover:border-emerald-400/30 transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">98%</div>
              <div className="text-zinc-400 text-xs sm:text-sm">Client Satisfaction Rate</div>
            </TiltCard>

            <TiltCard className="glass-card rounded-xl p-5 sm:p-6 border border-zinc-700 hover:border-emerald-400/30 transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">5.0</div>
              <div className="text-zinc-400 text-xs sm:text-sm">Average Rating</div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials