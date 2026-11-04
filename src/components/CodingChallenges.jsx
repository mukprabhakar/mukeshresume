import React, { useState, useEffect } from 'react'
import { fetchAllCodingStats } from '../services/codingStatsService'
import { trackEvent } from '../utils/analytics'
import SEOEnhancement from './SEOEnhancement'

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

  return (
    <section id="coding-challenges" className="py-12 sm:py-16 bg-zinc-900 pt-20" aria-labelledby="coding-challenges-heading">
      <SEOEnhancement
        title="Competitive Programming & Problem Solving | Mukesh Pal"
        description="Competitive programming profile and problem-solving stats of Mukesh Pal across LeetCode, GeeksforGeeks, CodeChef, and HackerRank."
        type="website"
      />
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 id="coding-challenges-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2 sm:mb-3 animate-float">
            Competitive Programming & Coding Challenges
          </h1>
          <div className="w-12 sm:w-16 md:w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 mx-auto rounded-full"></div>
          <p className="mt-2 sm:mt-3 text-zinc-400 max-w-md mx-auto text-sm sm:text-base md:text-lg">
            Problems solved on competitive programming platforms
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* LeetCode Section */}
          <div className="glass-card p-4 sm:p-5 md:p-6 rounded-xl card-3d transform transition-all duration-300 hover:shadow-lg hover-glow">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mr-3 sm:mr-4">
                <span className="text-lg sm:text-xl font-bold text-orange-500">L</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">LeetCode</h3>
                <p className="text-zinc-400 text-xs sm:text-sm">Competitive programming</p>
              </div>
            </div>

            {codingStats.leetcode.loading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-orange-500"></div>
                <p className="mt-2 sm:mt-3 text-zinc-400 text-xs sm:text-sm">Loading stats...</p>
              </div>
            ) : codingStats.leetcode.error ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-red-400 text-xs sm:text-sm">{codingStats.leetcode.error}</p>
                <p className="text-zinc-400 mt-1 text-xs sm:text-sm">Displaying sample data</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">{codingStats.leetcode.totalSolved}</p>
                    <p className="text-zinc-300 text-xs sm:text-sm">Total Solved</p>
                  </div>
                  <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400">{codingStats.leetcode.ranking}</p>
                    <p className="text-zinc-300 text-xs sm:text-sm">Global Rank</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Problems by Difficulty</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
                          Easy
                        </span>
                        <span className="font-medium text-green-400 text-xs sm:text-sm">{codingStats.leetcode.easySolved}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-green-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.leetcode.totalSolved ? (codingStats.leetcode.easySolved / codingStats.leetcode.totalSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full mr-1 sm:mr-2"></span>
                          Medium
                        </span>
                        <span className="font-medium text-yellow-400 text-xs sm:text-sm">{codingStats.leetcode.mediumSolved}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-yellow-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.leetcode.totalSolved ? (codingStats.leetcode.mediumSolved / codingStats.leetcode.totalSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-1 sm:mr-2"></span>
                          Hard
                        </span>
                        <span className="font-medium text-red-400 text-xs sm:text-sm">{codingStats.leetcode.hardSolved}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-red-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.leetcode.totalSolved ? (codingStats.leetcode.hardSolved / codingStats.leetcode.totalSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GeeksforGeeks Section */}
          <div className="glass-card p-4 sm:p-5 md:p-6 rounded-xl card-3d transform transition-all duration-300 hover:shadow-lg hover-glow">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-500/10 flex items-center justify-center mr-3 sm:mr-4">
                <span className="text-lg sm:text-xl font-bold text-green-500">G</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">GeeksforGeeks</h3>
                <p className="text-zinc-400 text-xs sm:text-sm">Computer science portal</p>
              </div>
            </div>

            {codingStats.gfg.loading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-green-500"></div>
                <p className="mt-2 sm:mt-3 text-zinc-400 text-xs sm:text-sm">Loading stats...</p>
              </div>
            ) : codingStats.gfg.error ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-red-400 text-xs sm:text-sm">{codingStats.gfg.error}</p>
                <p className="text-zinc-400 mt-1 text-xs sm:text-sm">Displaying sample data</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">{codingStats.gfg.problemsSolved}</p>
                    <p className="text-zinc-300 text-xs sm:text-sm">Problems Solved</p>
                  </div>
                  <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">95+</p>
                    <p className="text-zinc-300 text-xs sm:text-sm">Total</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Problems by Level</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-1 sm:mr-2"></span>
                          School
                        </span>
                        <span className="font-medium text-blue-400 text-xs sm:text-sm">{codingStats.gfg.schoolProblems}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-blue-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.gfg.problemsSolved ? (codingStats.gfg.schoolProblems / codingStats.gfg.problemsSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
                          Basic
                        </span>
                        <span className="font-medium text-green-400 text-xs sm:text-sm">{codingStats.gfg.basicProblems}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-green-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.gfg.problemsSolved ? (codingStats.gfg.basicProblems / codingStats.gfg.problemsSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full mr-1 sm:mr-2"></span>
                          Easy
                        </span>
                        <span className="font-medium text-yellow-400 text-xs sm:text-sm">{codingStats.gfg.easyProblems}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-yellow-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.gfg.problemsSolved ? (codingStats.gfg.easyProblems / codingStats.gfg.problemsSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full mr-1 sm:mr-2"></span>
                          Medium
                        </span>
                        <span className="font-medium text-orange-400 text-xs sm:text-sm">{codingStats.gfg.mediumProblems}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-orange-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.gfg.problemsSolved ? (codingStats.gfg.mediumProblems / codingStats.gfg.problemsSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-1 sm:mr-2"></span>
                          Hard
                        </span>
                        <span className="font-medium text-red-400 text-xs sm:text-sm">{codingStats.gfg.hardProblems}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-red-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.gfg.problemsSolved ? (codingStats.gfg.hardProblems / codingStats.gfg.problemsSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CodeChef Section */}
          <div className="glass-card p-4 sm:p-5 md:p-6 rounded-xl card-3d transform transition-all duration-300 hover:shadow-lg hover-glow">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-500/10 flex items-center justify-center mr-3 sm:mr-4">
                <span className="text-lg sm:text-xl font-bold text-red-500">CC</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">CodeChef</h3>
                <p className="text-zinc-400 text-xs sm:text-sm">Competitive platform</p>
              </div>
            </div>

            {codingStats.codeChef.loading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-red-500"></div>
                <p className="mt-2 sm:mt-3 text-zinc-400 text-xs sm:text-sm">Loading stats...</p>
              </div>
            ) : codingStats.codeChef.error ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-red-400 text-xs sm:text-sm">{codingStats.codeChef.error}</p>
                <p className="text-zinc-400 mt-1 text-xs sm:text-sm">Displaying sample data</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">{codingStats.codeChef.problemsSolved}</p>
                    <p className="text-zinc-300 text-xs sm:text-sm">Problems Solved</p>
                  </div>
                  <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-400">{codingStats.codeChef.currentRating}</p>
                    <p className="text-zinc-300 text-xs sm:text-sm">Current Rating</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Competition Stats</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-300 text-xs sm:text-sm">Global Rank</span>
                      <span className="font-medium text-red-400 text-xs sm:text-sm">{codingStats.codeChef.globalRank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-300 text-xs sm:text-sm">Country Rank</span>
                      <span className="font-medium text-red-400 text-xs sm:text-sm">{codingStats.codeChef.countryRank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-300 text-xs sm:text-sm">Highest Rating</span>
                      <span className="font-medium text-red-400 text-xs sm:text-sm">{codingStats.codeChef.highestRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-300 text-xs sm:text-sm">Fully Solved</span>
                      <span className="font-medium text-red-400 text-xs sm:text-sm">{codingStats.codeChef.fullySolved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-300 text-xs sm:text-sm">Partially Solved</span>
                      <span className="font-medium text-red-400 text-xs sm:text-sm">{codingStats.codeChef.partiallySolved}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* HackerRank Section */}
          <div className="glass-card p-4 sm:p-5 md:p-6 rounded-xl card-3d transform transition-all duration-300 hover:shadow-lg hover-glow">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3 sm:mr-4">
                <span className="text-lg sm:text-xl font-bold text-purple-500">HR</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">HackerRank</h3>
                <p className="text-zinc-400 text-xs sm:text-sm">Coding skills platform</p>
              </div>
            </div>

            {codingStats.hackerRank.loading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-purple-500"></div>
                <p className="mt-2 sm:mt-3 text-zinc-400 text-xs sm:text-sm">Loading stats...</p>
              </div>
            ) : codingStats.hackerRank.error ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-red-400 text-xs sm:text-sm">{codingStats.hackerRank.error}</p>
                <p className="text-zinc-400 mt-1 text-xs sm:text-sm">Displaying sample data</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">{codingStats.hackerRank.problemsSolved}</p>
                    <p className="text-zinc-300 text-xs sm:text-sm">Problems Solved</p>
                  </div>
                  <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400">{codingStats.hackerRank.stars}</p>
                    <p className="text-zinc-300 text-xs sm:text-sm">Stars</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Skills Breakdown</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-1 sm:mr-2"></span>
                          Algorithms
                        </span>
                        <span className="font-medium text-blue-400 text-xs sm:text-sm">{codingStats.hackerRank.algorithmsSolved}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-blue-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.hackerRank.problemsSolved ? (codingStats.hackerRank.algorithmsSolved / codingStats.hackerRank.problemsSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
                          Data Structures
                        </span>
                        <span className="font-medium text-green-400 text-xs sm:text-sm">{codingStats.hackerRank.dataStructuresSolved}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-green-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.hackerRank.problemsSolved ? (codingStats.hackerRank.dataStructuresSolved / codingStats.hackerRank.problemsSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-300 text-xs flex items-center">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full mr-1 sm:mr-2"></span>
                          Mathematics
                        </span>
                        <span className="font-medium text-yellow-400 text-xs sm:text-sm">{codingStats.hackerRank.mathematicsSolved}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-yellow-500 h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${codingStats.hackerRank.problemsSolved ? (codingStats.hackerRank.mathematicsSolved / codingStats.hackerRank.problemsSolved) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Links */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            <a 
              href="https://leetcode.com/mukprabhakar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-orange-400/30 hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm"
              onClick={() => {
                // Track LeetCode profile click
                trackEvent('click', 'coding_challenges', 'leetcode_profile')
              }}
            >
              LeetCode
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
            <a 
              href="https://auth.geeksforgeeks.org/user/mukprabhakar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-green-400/30 hover:shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm"
              onClick={() => {
                // Track GFG profile click
                trackEvent('click', 'coding_challenges', 'gfg_profile')
              }}
            >
              GFG
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
            <a 
              href="https://www.codechef.com/users/mukprabhakar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-red-400/30 hover:shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm"
              onClick={() => {
                // Track CodeChef profile click
                trackEvent('click', 'coding_challenges', 'codechef_profile')
              }}
            >
              CodeChef
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
            <a 
              href="https://www.hackerrank.com/mukprabhakar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm"
              onClick={() => {
                // Track HackerRank profile click
                trackEvent('click', 'coding_challenges', 'hackerrank_profile')
              }}
            >
              HackerRank
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CodingChallenges