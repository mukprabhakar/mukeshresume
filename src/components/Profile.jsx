import React from 'react'

const Profile = () => {
  const profiles = [
    {
      name: 'LeetCode',
      url: 'https://leetcode.com/u/mukprabhakar/',
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.102 17.93l-2.697 2.697c-.47.47-1.11.735-1.79.735s-1.32-.265-1.79-.735l-.91-.91L12 16.14l3.05 3.05c.47.47 1.11.735 1.79.735s1.32-.265 1.79-.735l.91-.91-3.55-3.55v-2.18l-3.01-3.01V6.02L7.3 2.31 2.31 7.3l3.44 3.44c.47.47.735 1.11.735 1.79s-.265 1.32-.735 1.79l-.91.91L2.31 18.62l4.99 4.99 3.44-3.44c.47-.47 1.11-.735 1.79-.735s1.32.265 1.79.735l.91.91 3.55-3.55h-2.18z"/>
        </svg>
      ),
      color: 'from-yellow-500 to-orange-500',
      description: '169+ DSA problems solved | Competitive programming practice'
    },
    {
      name: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/user/mukprabhakar//',
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      description: 'Problem-solving expertise | Technical articles'
    },
    {
      name: 'CodeChef',
      url: 'https://www.codechef.com/users/mukprabhakar',
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z"/>
        </svg>
      ),
      color: 'from-blue-500 to-indigo-500',
      description: 'Competitive programming | Algorithm mastery'
    },
    {
      name: 'HackerRank',
      url: 'https://www.hackerrank.com/profile/mukesh_mmp1234',
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: 'from-green-600 to-emerald-600',
      description: '4-star in MySQL | 2-star in Problem Solving'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/mukprabhakar',
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.218.682-.485 0-.236-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      ),
      color: 'from-gray-700 to-black',
      description: 'Projects & contributions | Open source work'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/mukprabhakar/',
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-7 6.67h-2.5v7.66h2.5v-7.66zM9.25 8.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm4.08 2.17c-1.1 0-1.84.51-2.17 1.25h-.03v-1.09h-2.1v7.66h2.19v-3.78c0-.99.2-1.94 1.41-1.94s1.21.94 1.21 2.02v3.7h2.19v-4.5c0-2.5-1.33-3.63-3.1-3.63z"/>
        </svg>
      ),
      color: 'from-blue-600 to-blue-800',
      description: 'Professional network | Career updates'
    }
  ]

  return (
    <section id="profile" className="py-16 sm:py-20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden" aria-labelledby="profile-heading">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/5 rounded-full blur-3xl" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/5 rounded-full blur-3xl" aria-hidden="true"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h3 id="profile-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 sm:mb-4">Coding Profiles</h3>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 mx-auto mb-4 sm:mb-6" aria-hidden="true"></div>
          <p className="mt-3 sm:mt-4 text-zinc-400 max-w-md sm:max-w-2xl mx-auto text-base sm:text-lg">
            Check out my coding profiles and professional networks
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6" role="list">
          {profiles.map((profile, index) => (
            <a
              key={index}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-xl p-4 sm:p-6 border border-zinc-700 hover:border-emerald-400/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group"
              role="listitem"
            >
              <div className={`flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${profile.color} mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                <div className="text-white" aria-label={profile.name}>
                  {profile.icon}
                </div>
              </div>
              <h4 className="text-center font-semibold text-white text-xs sm:text-sm group-hover:text-emerald-400 transition-colors">
                {profile.name}
              </h4>
              <p className="text-center text-zinc-400 text-xs mt-2 hidden sm:block">{profile.description}</p>
            </a>
          ))}
        </div>
        
        {/* Mobile view descriptions */}
        <div className="mt-6 sm:hidden">
          <p className="text-zinc-400 text-center text-sm">
            Tap on any profile to view my coding activities and professional presence
          </p>
        </div>
      </div>
    </section>
  )
}

export default Profile