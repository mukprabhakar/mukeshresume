import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchAllCodingStats } from '../services/codingStatsService'
import { trackEvent } from '../utils/analytics'
import SEOEnhancement from './SEOEnhancement'
import PageHero from './PageHero'
import CountUp from './CountUp'
import { StaggerGroup, StaggerItem, EASE } from './motion/Reveal'
import { StatBar, HoverShine } from './motion/StatBar'
import { useSpotlight } from '../utils/useSpotlight'

const pct = (value, total) => (total ? (value / total) * 100 : 0)

/* ------------------------------------------------------------------ */
/* Reusable animated building blocks (one definition, four cards)       */
/* ------------------------------------------------------------------ */

const StatTile = ({ value, label, valueClass = 'gradient-text', prefix = '', suffix = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, ease: EASE, delay }}
    className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg"
  >
    <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${valueClass}`}>
      <CountUp value={value} prefix={prefix} suffix={suffix} />
    </p>
    <p className="text-zinc-300 text-xs sm:text-sm">{label}</p>
  </motion.div>
)

const LevelRow = ({ label, count, total, dotClass, barClass, textClass, delay = 0 }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-zinc-300 text-xs flex items-center">
        <span className={`w-2 h-2 sm:w-3 sm:h-3 ${dotClass} rounded-full mr-1 sm:mr-2`}></span>
        {label}
      </span>
      <span className={`font-medium ${textClass} text-xs sm:text-sm`}>{count}</span>
    </div>
    <StatBar pct={pct(count, total)} fillClass={barClass} trackClass="bg-zinc-800" delay={delay} />
  </div>
)

const KeyValueRow = ({ label, value, valueClass, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.4, ease: EASE, delay }}
    className="flex justify-between"
  >
    <span className="text-zinc-300 text-xs sm:text-sm">{label}</span>
    <span className={`font-medium ${valueClass} text-xs sm:text-sm`}>{value}</span>
  </motion.div>
)

/* Pulsing placeholder so the card never collapses while the API answers */
const CardSkeleton = () => (
  <div className="animate-pulse space-y-4 py-2" aria-hidden="true">
    <div className="grid grid-cols-2 gap-3">
      <div className="h-[4.5rem] rounded-lg bg-zinc-800/70"></div>
      <div className="h-[4.5rem] rounded-lg bg-zinc-800/50"></div>
    </div>
    <div className="space-y-3">
      {[0, 1, 2].map((row) => (
        <div key={row} className="space-y-1.5">
          <div className="h-2 w-1/3 rounded bg-zinc-800"></div>
          <div className="h-2 rounded-full bg-zinc-800/70"></div>
        </div>
      ))}
    </div>
  </div>
)

const PlatformCard = ({ initials, name, tagline, iconClass, isLoading, error, spotlight, children }) => (
  <StaggerItem className="h-full">
    <div
      className="glass-card card-3d card-spotlight-dark relative h-full p-4 sm:p-5 md:p-6 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover-glow"
      {...spotlight}
    >
      <HoverShine />
      <div className="relative z-10 flex items-center mb-4 sm:mb-5">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${iconClass} flex items-center justify-center mr-3 sm:mr-4`}>
          <span className="text-lg sm:text-xl font-bold">{initials}</span>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">{name}</h3>
          <p className="text-zinc-400 text-xs sm:text-sm">{tagline}</p>
        </div>
      </div>

      {isLoading ? (
        <CardSkeleton />
      ) : error ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-red-400 text-xs sm:text-sm">{error}</p>
          <p className="text-zinc-400 mt-1 text-xs sm:text-sm">Displaying sample data</p>
        </div>
      ) : (
        children
      )}
    </div>
  </StaggerItem>
)

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const CodingChallenges = () => {
  const [codingStats, setCodingStats] = useState({
    leetcode: {
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      ranking: 0,
      loading: true,
      error: null
    },
    gfg: {
      problemsSolved: 0,
      schoolProblems: 0,
      basicProblems: 0,
      easyProblems: 0,
      mediumProblems: 0,
      hardProblems: 0,
      loading: true,
      error: null
    },
    codeChef: {
      currentRating: 0,
      highestRating: 0,
      globalRank: 0,
      countryRank: 0,
      problemsSolved: 0,
      fullySolved: 0,
      partiallySolved: 0,
      loading: true,
      error: null
    },
    hackerRank: {
      stars: 0,
      problemsSolved: 0,
      algorithmsSolved: 0,
      dataStructuresSolved: 0,
      mathematicsSolved: 0,
      loading: true,
      error: null
    }
  })
  const spotlight = useSpotlight()

  useEffect(() => {
    const fetchCodingStats = async () => {
      try {
        const data = await fetchAllCodingStats('mukprabhakar', 'mukprabhakar', 'mukprabhakar', 'mukprabhakar')
        
        // Update LeetCode stats
        setCodingStats(prev => ({
          ...prev,
          leetcode: {
            ...prev.leetcode,
            totalSolved: data.leetCode?.totalSolved || 0,
            easySolved: data.leetCode?.easySolved || 0,
            mediumSolved: data.leetCode?.mediumSolved || 0,
            hardSolved: data.leetCode?.hardSolved || 0,
            ranking: data.leetCode?.ranking || 0,
            loading: false
          },
          gfg: {
            ...prev.gfg,
            problemsSolved: data.gfg?.problemsSolved || 0,
            schoolProblems: data.gfg?.schoolProblems || 0,
            basicProblems: data.gfg?.basicProblems || 0,
            easyProblems: data.gfg?.easyProblems || 0,
            mediumProblems: data.gfg?.mediumProblems || 0,
            hardProblems: data.gfg?.hardProblems || 0,
            loading: false
          },
          codeChef: {
            ...prev.codeChef,
            currentRating: data.codeChef?.currentRating || 0,
            highestRating: data.codeChef?.highestRating || 0,
            globalRank: data.codeChef?.globalRank || 0,
            countryRank: data.codeChef?.countryRank || 0,
            problemsSolved: data.codeChef?.problemsSolved || 0,
            fullySolved: data.codeChef?.fullySolved || 0,
            partiallySolved: data.codeChef?.partiallySolved || 0,
            loading: false
          },
          hackerRank: {
            ...prev.hackerRank,
            stars: data.hackerRank?.stars || 0,
            problemsSolved: data.hackerRank?.problemsSolved || 0,
            algorithmsSolved: data.hackerRank?.algorithmsSolved || 0,
            dataStructuresSolved: data.hackerRank?.dataStructuresSolved || 0,
            mathematicsSolved: data.hackerRank?.mathematicsSolved || 0,
            loading: false
          }
        }))
      } catch (error) {
        console.error('Error fetching coding stats:', error)
        setCodingStats(prev => ({
          ...prev,
          leetcode: {
            ...prev.leetcode,
            loading: false,
            error: 'Failed to load LeetCode stats'
          },
          gfg: {
            ...prev.gfg,
            loading: false,
            error: 'Failed to load GeeksforGeeks stats'
          },
          codeChef: {
            ...prev.codeChef,
            loading: false,
            error: 'Failed to load CodeChef stats'
          },
          hackerRank: {
            ...prev.hackerRank,
            loading: false,
            error: 'Failed to load HackerRank stats'
          }
        }))
      }
    }

    fetchCodingStats()
  }, [])

  const { leetcode, gfg, codeChef, hackerRank } = codingStats

  // Aggregate numbers for the animated hero strip.
  const heroStats = [
    {
      label: 'Problems solved',
      value: leetcode.totalSolved + gfg.problemsSolved + codeChef.problemsSolved + hackerRank.problemsSolved,
    },
    { label: 'Platforms tracked', value: 4 },
    { label: 'LeetCode ranking', value: leetcode.ranking },
    { label: 'CodeChef rating', value: codeChef.currentRating },
  ]

  const profiles = [
    { name: 'LeetCode', href: 'https://leetcode.com/mukprabhakar', event: 'leetcode_profile', text: 'text-orange-400 hover:text-orange-300', border: 'border-orange-400/30 hover:shadow-orange-500/20' },
    { name: 'GFG', href: 'https://auth.geeksforgeeks.org/user/mukprabhakar', event: 'gfg_profile', text: 'text-green-400 hover:text-green-300', border: 'border-green-400/30 hover:shadow-green-500/20' },
    { name: 'CodeChef', href: 'https://www.codechef.com/users/mukprabhakar', event: 'codechef_profile', text: 'text-red-400 hover:text-red-300', border: 'border-red-400/30 hover:shadow-red-500/20' },
    { name: 'HackerRank', href: 'https://www.hackerrank.com/mukprabhakar', event: 'hackerrank_profile', text: 'text-purple-400 hover:text-purple-300', border: 'border-purple-400/30 hover:shadow-purple-500/20' },
  ]

  return (
    <section id="coding-challenges" className="relative py-20 sm:py-28 bg-zinc-900 overflow-hidden" aria-labelledby="coding-challenges-heading">
      <SEOEnhancement
        title="Competitive Programming & Problem Solving | Mukesh Pal"
        description="Competitive programming profile and problem-solving stats of Mukesh Pal across LeetCode, GeeksforGeeks, CodeChef, and HackerRank."
        type="website"
      />

      {/* Ambient brand-red glows */}
      <div className="pointer-events-none absolute -top-[10%] -left-[10%] h-[45%] w-[45%] rounded-full bg-brand/10 blur-[130px] animate-pulse" aria-hidden="true"></div>
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[45%] w-[45%] rounded-full bg-brand/10 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} aria-hidden="true"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <PageHero
          titleId="coding-challenges-heading"
          eyebrow="Problem Solving"
          title="Competitive"
          highlight="Programming"
          description="Daily problem solving across LeetCode, GeeksforGeeks, CodeChef and HackerRank — live counts, difficulty mix and ratings straight from each platform."
          stats={heroStats}
        />

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" stagger={0.1} delay={0.08}>
          {/* LeetCode */}
          <PlatformCard
            initials="L"
            name="LeetCode"
            tagline="Competitive programming"
            iconClass="bg-orange-500/10 text-orange-500"
            isLoading={leetcode.loading}
            error={leetcode.error}
            spotlight={spotlight}
          >
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatTile value={leetcode.totalSolved} label="Total Solved" delay={0.05} />
                <StatTile value={leetcode.ranking} label="Global Rank" valueClass="text-orange-400" delay={0.12} />
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Problems by Difficulty</h4>
                <div className="space-y-2 sm:space-y-3">
                  <LevelRow label="Easy" count={leetcode.easySolved} total={leetcode.totalSolved} dotClass="bg-green-500" barClass="bg-green-500" textClass="text-green-400" delay={0} />
                  <LevelRow label="Medium" count={leetcode.mediumSolved} total={leetcode.totalSolved} dotClass="bg-yellow-500" barClass="bg-yellow-500" textClass="text-yellow-400" delay={0.1} />
                  <LevelRow label="Hard" count={leetcode.hardSolved} total={leetcode.totalSolved} dotClass="bg-red-500" barClass="bg-red-500" textClass="text-red-400" delay={0.2} />
                </div>
              </div>
            </div>
          </PlatformCard>

          {/* GeeksforGeeks */}
          <PlatformCard
            initials="G"
            name="GeeksforGeeks"
            tagline="Computer science portal"
            iconClass="bg-green-500/10 text-green-500"
            isLoading={gfg.loading}
            error={gfg.error}
            spotlight={spotlight}
          >
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatTile value={gfg.problemsSolved} label="Problems Solved" delay={0.05} />
                <StatTile value={95} suffix="+" label="Total" valueClass="text-green-400" delay={0.12} />
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Problems by Level</h4>
                <div className="space-y-2 sm:space-y-3">
                  <LevelRow label="School" count={gfg.schoolProblems} total={gfg.problemsSolved} dotClass="bg-blue-500" barClass="bg-blue-500" textClass="text-blue-400" delay={0} />
                  <LevelRow label="Basic" count={gfg.basicProblems} total={gfg.problemsSolved} dotClass="bg-green-500" barClass="bg-green-500" textClass="text-green-400" delay={0.08} />
                  <LevelRow label="Easy" count={gfg.easyProblems} total={gfg.problemsSolved} dotClass="bg-yellow-500" barClass="bg-yellow-500" textClass="text-yellow-400" delay={0.16} />
                  <LevelRow label="Medium" count={gfg.mediumProblems} total={gfg.problemsSolved} dotClass="bg-orange-500" barClass="bg-orange-500" textClass="text-orange-400" delay={0.24} />
                  <LevelRow label="Hard" count={gfg.hardProblems} total={gfg.problemsSolved} dotClass="bg-red-500" barClass="bg-red-500" textClass="text-red-400" delay={0.32} />
                </div>
              </div>
            </div>
          </PlatformCard>

          {/* CodeChef */}
          <PlatformCard
            initials="CC"
            name="CodeChef"
            tagline="Competitive platform"
            iconClass="bg-red-500/10 text-red-500"
            isLoading={codeChef.loading}
            error={codeChef.error}
            spotlight={spotlight}
          >
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatTile value={codeChef.problemsSolved} label="Problems Solved" delay={0.05} />
                <StatTile value={codeChef.currentRating} label="Current Rating" valueClass="text-red-400" delay={0.12} />
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Competition Stats</h4>
                <div className="space-y-2 sm:space-y-3">
                  <KeyValueRow label="Global Rank" value={codeChef.globalRank} valueClass="text-red-400" delay={0} />
                  <KeyValueRow label="Country Rank" value={codeChef.countryRank} valueClass="text-red-400" delay={0.06} />
                  <KeyValueRow label="Highest Rating" value={codeChef.highestRating} valueClass="text-red-400" delay={0.12} />
                  <KeyValueRow label="Fully Solved" value={codeChef.fullySolved} valueClass="text-red-400" delay={0.18} />
                  <KeyValueRow label="Partially Solved" value={codeChef.partiallySolved} valueClass="text-red-400" delay={0.24} />
                </div>
              </div>
            </div>
          </PlatformCard>

          {/* HackerRank */}
          <PlatformCard
            initials="HR"
            name="HackerRank"
            tagline="Coding skills platform"
            iconClass="bg-purple-500/10 text-purple-500"
            isLoading={hackerRank.loading}
            error={hackerRank.error}
            spotlight={spotlight}
          >
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatTile value={hackerRank.problemsSolved} label="Problems Solved" delay={0.05} />
                <StatTile value={hackerRank.stars} label="Stars" valueClass="text-purple-400" delay={0.12} />
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Skills Breakdown</h4>
                <div className="space-y-2 sm:space-y-3">
                  <LevelRow label="Algorithms" count={hackerRank.algorithmsSolved} total={hackerRank.problemsSolved} dotClass="bg-blue-500" barClass="bg-blue-500" textClass="text-blue-400" delay={0} />
                  <LevelRow label="Data Structures" count={hackerRank.dataStructuresSolved} total={hackerRank.problemsSolved} dotClass="bg-green-500" barClass="bg-green-500" textClass="text-green-400" delay={0.1} />
                  <LevelRow label="Mathematics" count={hackerRank.mathematicsSolved} total={hackerRank.problemsSolved} dotClass="bg-yellow-500" barClass="bg-yellow-500" textClass="text-yellow-400" delay={0.2} />
                </div>
              </div>
            </div>
          </PlatformCard>
        </StaggerGroup>

        {/* Profile Links */}
        <StaggerGroup className="mt-10 sm:mt-12 md:mt-14 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4" stagger={0.08} delay={0.1}>
          {profiles.map((profile) => (
            <StaggerItem key={profile.name} className="flex-shrink-0">
              <a
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 rounded-full bg-zinc-800 hover:bg-zinc-700 border hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm ${profile.text} ${profile.border}`}
                onClick={() => trackEvent('click', 'coding_challenges', profile.event)}
              >
                {profile.name}
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* LeetCode Problem of the Day shortcut */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mt-12 text-center"
        >
          <Link
            to="/leetcode-potd"
            onClick={() => trackEvent('click', 'coding_challenges', 'leetcode_potd_page')}
            className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:border-brand hover:bg-brand/20 hover:shadow-red-glow"
          >
            See my Problem of the Day solutions
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CodingChallenges
