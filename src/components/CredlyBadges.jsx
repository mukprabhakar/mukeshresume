import React, { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { trackEvent } from '../utils/analytics'
import SEOEnhancement from './SEOEnhancement'
import PageHero from './PageHero'
import TiltCard from './TiltCard'
import { Reveal, EASE } from './motion/Reveal'
import { SkeletonCard, HoverShine } from './motion/StatBar'
import { useSpotlight } from '../utils/useSpotlight'

// Long Credly issuer names read badly on a chip – collapse the community
// string down to the brand that actually issued the badge.
const shortIssuer = (issuer) => {
  const name = (issuer || '').trim()
  if (name.startsWith('Microsoft')) return 'Microsoft'
  return name || 'Verified'
}

const CredlyBadges = () => {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [failedImages, setFailedImages] = useState([])
  const [activeIssuer, setActiveIssuer] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const spotlight = useSpotlight()

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

  // Issuer chips + hero numbers are both derived from the loaded badge list.
  const issuers = useMemo(() => ['All', ...new Set(badges.map((badge) => shortIssuer(badge.issuer)))], [badges])

  const visibleBadges = useMemo(
    () => (activeIssuer === 'All' ? badges : badges.filter((badge) => shortIssuer(badge.issuer) === activeIssuer)),
    [badges, activeIssuer]
  )

  const heroStats = useMemo(() => {
    const years = badges.map((badge) => new Date(badge.issuedDate).getFullYear()).filter(Boolean)
    return [
      { label: 'Badges earned', value: badges.length },
      { label: 'Issuing orgs', value: new Set(badges.map((badge) => shortIssuer(badge.issuer))).size },
      { label: 'Latest', value: years.length ? Math.max(...years) : new Date().getFullYear() },
    ]
  }, [badges])

  return (
    <section id="credly-badges" className="relative py-20 sm:py-28 bg-zinc-900 overflow-hidden" aria-labelledby="badges-heading">
      <SEOEnhancement
        title="Certifications & Credly Badges | Mukesh Pal"
        description="Explore verified professional certifications and skill badges earned by Mukesh Pal on Credly from Microsoft, Google Cloud, IBM, and more."
        type="website"
      />

      {/* Ambient brand-red glows */}
      <div className="pointer-events-none absolute -top-[10%] -right-[10%] h-[45%] w-[45%] rounded-full bg-brand/10 blur-[130px] animate-pulse" aria-hidden="true"></div>
      <div className="pointer-events-none absolute -bottom-[10%] -left-[10%] h-[45%] w-[45%] rounded-full bg-brand/10 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} aria-hidden="true"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <PageHero
          titleId="badges-heading"
          eyebrow="Verified Credentials"
          title="Certifications &"
          highlight="Credly Badges"
          description="Professional certifications and achievements earned on the Credly platform — filter by the organisation that issued them."
          stats={heroStats}
        />

        {/* Issuer filter – the active chip slides between positions */}
        {!loading && badges.length > 0 && (
          <Reveal direction="fade" className="mb-12 flex flex-wrap justify-center gap-2 sm:gap-3">
            {issuers.map((issuer) => {
              const active = activeIssuer === issuer
              return (
                <button
                  key={issuer}
                  type="button"
                  onClick={() => {
                    setActiveIssuer(issuer)
                    trackEvent('click', 'badges', `filter_${issuer.toLowerCase().replace(/\s+/g, '_')}`)
                  }}
                  className={`relative rounded-full border px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-colors duration-300 ${
                    active ? 'border-transparent text-white' : 'border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="badge-issuer-pill"
                      className="absolute inset-0 rounded-full border border-brand/50 bg-brand/15"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{issuer}</span>
                </button>
              )
            })}
          </Reveal>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center text-sm text-zinc-400"
          >
            <span className="text-red-400">Error loading badges: {error}</span> — displaying sample badges instead.
          </motion.p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[0, 1, 2, 3].map((slot) => (
              <SkeletonCard key={slot} className="h-[26rem]" />
            ))}
          </div>
        ) : (
          <motion.div layout className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {visibleBadges.map((badge, index) => (
                <motion.article
                  key={badge.id}
                  layout
                  initial={{ opacity: 0, y: 26, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -14, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: EASE, delay: Math.min(index, 7) * 0.06 }}
                  className="h-full"
                >
                  <TiltCard className="h-full">
                    <div
                      className="glass-card card-spotlight-dark group relative flex h-full flex-col overflow-hidden rounded-xl transition-all duration-300 hover-glow"
                      {...spotlight}
                    >
                      <div className="relative">
                        {failedImages.includes(badge.id) ? (
                          <div className="flex h-48 w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-800 to-zinc-900">
                            <motion.span
                              className="text-4xl"
                              aria-hidden="true"
                              animate={{ y: [0, -6, 0], rotate: [0, 6, -6, 0] }}
                              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                              🎖️
                            </motion.span>
                            <span className="text-xs uppercase tracking-widest text-zinc-500">Badge image unavailable</span>
                          </div>
                        ) : (
                          <>
                            <img
                              src={badge.image}
                              alt={badge.title}
                              className="h-48 w-full bg-white object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              onError={() => setFailedImages((prev) => (prev.includes(badge.id) ? prev : [...prev, badge.id]))}
                            />
                            <HoverShine />
                          </>
                        )}
                        <div className="absolute top-2 right-2 rounded-lg bg-zinc-900/80 px-2 py-1 text-xs text-zinc-200 backdrop-blur-sm">
                          {shortIssuer(badge.issuer)}
                        </div>
                      </div>

                      <div className="flex flex-grow flex-col p-4 sm:p-6">
                        <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-white">{badge.title}</h3>

                        {/* Short summary collapses, full description slides open underneath */}
                        {expanded !== badge.id ? (
                          <p className="mb-3 line-clamp-3 text-xs text-zinc-400 sm:text-sm">{badge.description}</p>
                        ) : (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="mb-3 overflow-hidden text-xs leading-relaxed text-zinc-300 sm:text-sm"
                          >
                            {badge.description}
                          </motion.p>
                        )}

                        <div className="mt-auto pt-4">
                          <button
                            type="button"
                            onClick={() => setExpanded(expanded === badge.id ? null : badge.id)}
                            className="mb-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-brand"
                            aria-expanded={expanded === badge.id}
                          >
                            {expanded === badge.id ? 'Show less' : 'Badge details'}
                            <motion.svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              animate={{ rotate: expanded === badge.id ? 180 : 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </motion.svg>
                          </button>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-500">{new Date(badge.issuedDate).toLocaleDateString()}</span>
                            <a
                              href={badge.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/btn relative overflow-hidden rounded-lg bg-gradient-to-r from-brand-500 to-brand-700 px-3 py-1 text-xs font-bold text-white transition-transform duration-300 hover:scale-105"
                              onClick={() => {
                                // Track badge view click
                                trackEvent('click', 'badges', `view_badge_${badge.title.replace(/\s+/g, '_').toLowerCase()}`)
                              }}
                            >
                              <span className="relative z-10">View Badge</span>
                              <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover/btn:translate-x-0"></span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <Reveal direction="fade" className="mt-12 text-center">
          <a
            href="https://www.credly.com/users/mukesh-pal.031c9486/badges"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center text-brand transition-colors hover:text-brand-300"
            onClick={() => {
              // Track view all badges click
              trackEvent('click', 'badges', 'view_all_badges_on_credly')
            }}
          >
            View all badges on Credly
            <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default CredlyBadges
