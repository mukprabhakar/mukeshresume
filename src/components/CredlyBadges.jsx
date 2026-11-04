import React, { useState, useEffect } from 'react'
import { trackEvent } from '../utils/analytics'
import SEOEnhancement from './SEOEnhancement'

const CredlyBadges = () => {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [failedImages, setFailedImages] = useState([])

  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true)
      try {
        // For now, we'll use mock data based on what's visible on your profile
        // In a production environment, you would implement a proper API integration
        const mockBadges = [
          {
            id: 1,
            title: 'Explore AI Level 1',
            issuer: 'Microsoft MVP and Student Ambassadors Communities',
            issuedDate: '2025-05-29',
            image: 'https://images.credly.com/size/680x680/images/2d7c3d05-9554-42b9-9778-30e1c2fc90c6/blob',
            url: 'https://www.credly.com/badges/484d07c4-8a54-4029-93d8-9434b524abcd',
            description: 'Student Ambassadors who earned the Explore AI Level 1 badge skilled their friends and followers about the capabilities of generative AI using Microsoft Copilot. They helped them bring their personal creativity and passion to dream up a novel destination and create the content to tell its story.'
          },
          {
            id: 2,
            title: 'Microsoft Learn Student Ambassadors Cloud Skills Challenge Event Host',
            issuer: 'Microsoft MVP and Student Ambassadors Communities',
            issuedDate: '2024-07-25',
            image: 'https://images.credly.com/size/680x680/images/4d840102-6ff9-4528-9371-ceedc393057d/image.png',
            url: 'https://www.credly.com/badges/f668a1d8-1e78-4f72-bfa6-a0d3eedd6049',
            description: 'The Microsoft Learn Student Ambassadors Cloud Skills Challenge Event Host badge is issued to Student Ambassadors who host a Microsoft Learn Cloud Skills Challenge to skill participants on Microsoft products and technologies via a gamified experience utilizing Microsoft Learn content. Student Ambassadors who host a Cloud Skills Challenge demonstrate a desire help their local and online communities build skills that open doors and spark possibility.'
          },
          {
            id: 3,
            title: 'Google Cloud Computing Foundations Certificate',
            issuer: 'Google Cloud',
            issuedDate: '2024-07-24',
            image: 'https://images.credly.com/size/680x680/images/4dda8ae4-99ee-476c-bca3-6f0adbab42fe/image.png',
            url: 'https://www.credly.com/badges/3e21bf43-fa65-42bc-8617-0bc49bee4327',
            description: 'This certificate program helps learners develop technical proficiency in cloud computing. This certificate is an ideal foundation for diverse career paths including those in IT infrastructure, cloud engineering, and cloud-native application development.'
          },
          {
            id: 4,
            title: 'Data Science Foundations - Level 1',
            issuer: ' IBM',
            issuedDate: '2023-06-10',
            image: 'https://images.credly.com/size/680x680/images/5950e6bd-1d0b-40f0-9313-4b2fa36622ce/blob',
            url: 'https://www.credly.com/badges/b50ae2a8-4fca-4df4-845b-6a11569b44b2',
            description: 'This badge earner has an understanding of the possibilities and opportunities that data science, analytics and big data bring to new applications in any industry.'
          },
          {
            id: 5,
            title: 'Get Started with Cloud Storage Skill Badge',
            issuer: 'Google Cloud',
            issuedDate: '2024-08-13',
            image: 'https://images.credly.com/size/680x680/images/88e2d83e-e9ab-4615-a98b-c8536869e4e6/linkedin_thumb_blob',
            url: 'https://www.credly.com/badges/cb0dc42e-390f-483f-a8e0-579a6e17c531',
            description: 'Complete the Get Started with Cloud Storage skill badge to demonstrate skills in the following: how to create a Cloud Storage bucket, how to use the Cloud Storage command line, and how to use Bucket Lock to protect objects in a bucket.'
          },
          {
            id: 6,
            title: 'Build a Website on Google Cloud Skill Badge',
            issuer: ' Google Cloud',
            issuedDate: '2024-07-23',
            image: 'https://images.credly.com/size/680x680/images/cfcacbf1-1f76-40ad-be09-a5b057e31ebf/image.png',
            url: 'https://www.credly.com/badges/8f0ecf87-4ea6-46d3-a282-a47631c026b0',
            description: 'Complete the introductory Build a Website on Google Cloud skill badge to demonstrate skills in the following: deploy a website on Cloud Run, Host a web app on Compute Engine, Create, deploy, and scale your website on Google Kubernetes Engine, Migrate from a monolithic application to a microservices architecture.'
          }
        ]
        
        setBadges(mockBadges)
      } catch (err) {
        setError(err.message)
        // Fallback to a minimal set of badges
        const fallbackBadges = [
          {
            id: 1,
            title: 'Microsoft Certified: Azure Fundamentals',
            issuer: 'Microsoft',
            issuedDate: '2023-05-15',
            image: 'https://images.credly.com/size/680x680/images/39703994-095b-4218-950e-0f6647204c5c/image.png',
            url: 'https://www.credly.com/org/microsoft-certification/badge/azure-fundamentals',
            description: 'Earners of the Azure Fundamentals credential have demonstrated foundational knowledge of cloud services and how those services are provided with Microsoft Azure.'
          }
        ]
        setBadges(fallbackBadges)
      } finally {
        setLoading(false)
      }
    }

    fetchBadges()
  }, [])

  return (
    <section id="credly-badges" className="py-16 sm:py-20 bg-zinc-900 pt-20" aria-labelledby="badges-heading">
      <SEOEnhancement
        title="Certifications & Credly Badges | Mukesh Pal"
        description="Explore verified professional certifications and skill badges earned by Mukesh Pal on Credly from Microsoft, Google Cloud, IBM, and more."
        type="website"
      />
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h1 id="badges-heading" className="text-3xl sm:text-4xl font-bold gradient-text mb-3 sm:mb-4">Certifications & Credly Badges</h1>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-zinc-400 max-w-md sm:max-w-2xl mx-auto text-base sm:text-lg">
            Professional certifications and achievements earned through Credly platform.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
            <p className="mt-4 text-zinc-400">Loading badges...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">Error loading badges: {error}</p>
            <p className="text-zinc-400 mt-2">Displaying sample badges instead.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className="glass-card rounded-xl card-3d overflow-hidden transition-all hover:scale-105"
            >
              <div className="relative">
                {failedImages.includes(badge.id) ? (
                  <div className="w-full h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl" aria-hidden="true">🎖️</span>
                    <span className="text-xs uppercase tracking-widest text-zinc-500">Badge image unavailable</span>
                  </div>
                ) : (
                  <img 
                    src={badge.image} 
                    alt={badge.title}
                    className="w-full h-48 object-contain bg-white p-4"
                    loading="lazy"
                    onError={() => setFailedImages(prev => prev.includes(badge.id) ? prev : [...prev, badge.id])}
                  />
                )}
                <div className="absolute top-2 right-2 bg-zinc-900/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-zinc-200">
                  {badge.issuer.trim()}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">{badge.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mb-3 line-clamp-3">{badge.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-zinc-500">{new Date(badge.issuedDate).toLocaleDateString()}</span>
                  <a 
                    href={badge.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity"
                    onClick={() => {
                      // Track badge view click
                      trackEvent('click', 'badges', `view_badge_${badge.title.replace(/\s+/g, '_').toLowerCase()}`)
                    }}
                  >
                    View Badge
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="https://www.credly.com/users/mukesh-pal.031c9486/badges" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
            onClick={() => {
              // Track view all badges click
              trackEvent('click', 'badges', 'view_all_badges_on_credly')
            }}
          >
            View all badges on Credly
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default CredlyBadges