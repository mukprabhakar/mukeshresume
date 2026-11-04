import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { Reveal, EASE } from './motion/Reveal'

/* Experience & Professional Journey – light timeline section.
   Every role, company, period, skill and achievement preserved from the original. */

const Experience = () => {
  const [expandedId, setExpandedId] = useState(null)

  const experiences = [
    {
      id: 7,
      title: 'Co-Founder & CTO',
      company: 'CodeByte',
      period: 'Jan 2025 – Present',
      description: 'Leading technology strategy and product development for an innovative tech startup focused on developer tools and educational platforms.',
      logo: '🚀',
      skills: ['Leadership', 'System Architecture', 'Product Strategy', 'Team Building'],
      achievements: [
        {
          title: 'Technical Leadership',
          description: 'Spearheading the development of cutting-edge developer tools and platforms, establishing technical vision and architecture decisions.'
        },
        {
          title: 'Product Development',
          description: 'Building scalable solutions that serve developers and students, focusing on user experience and performance optimization.'
        },
        {
          title: 'Team Management',
          description: 'Leading a talented team of engineers and designers, fostering innovation and collaborative problem-solving culture.'
        }
      ]
    },
    {
      id: 6,
      title: 'Google Student Ambassador',
      company: 'Google',
      period: 'Jul 2025 – Feb 2026',
      description: 'Promoting Google technologies and fostering student developer communities through workshops, events, and mentorship programs.',
      logo: '🔍',
      skills: ['Community Building', 'Public Speaking', 'Event Management', 'Mentorship'],
      achievements: [
        {
          title: 'Technical Workshops',
          description: 'Conducting hands-on sessions on Google Cloud Platform, Firebase, and modern web development technologies for 500+ students.'
        },
        {
          title: 'Campus Outreach',
          description: 'Organizing hackathons, study jams, and developer meetups to build a vibrant technical community on campus.'
        },
        {
          title: 'Student Mentorship',
          description: 'Guiding students in their learning journey with Google technologies, helping them achieve certifications and build projects.'
        }
      ]
    },
    {
      id: 5,
      title: 'Software Developer (Freelance)',
      company: 'Self-Employed',
      period: 'Sep 2025 – Present',
      description: 'Delivering custom software solutions for clients worldwide, specializing in full-stack web development and modern technologies.',
      logo: '💼',
      skills: ['Full-Stack Development', 'Client Communication', 'Project Management', 'Agile'],
      achievements: [
        {
          title: 'Client Projects',
          description: 'Successfully delivered multiple web applications for diverse clients, from startups to established businesses, ensuring high-quality code and timely delivery.'
        },
        {
          title: 'Technology Stack',
          description: 'Expertise in React, Node.js, Python, and cloud platforms, providing end-to-end solutions tailored to client needs.'
        },
        {
          title: 'Business Growth',
          description: 'Built strong client relationships leading to repeat business and referrals, growing freelance practice organically.'
        }
      ]
    },
    {
      id: 4,
      title: 'Team Head',
      company: 'TEDx IIMT University',
      period: 'May 2025 – Present',
      description: 'Leading the organizing team for TEDx events at IIMT University, curating speakers and managing event execution.',
      logo: '🎤',
      skills: ['Event Planning', 'Team Leadership', 'Speaker Coordination', 'Marketing'],
      achievements: [
        {
          title: 'Event Organization',
          description: 'Successfully organized TEDx IIMT University events featuring inspiring speakers and thought leaders from various industries.'
        },
        {
          title: 'Team Coordination',
          description: 'Managed cross-functional teams handling logistics, marketing, sponsorship, and speaker relations for seamless event delivery.'
        },
        {
          title: 'Community Impact',
          description: 'Created a platform for sharing ideas worth spreading, inspiring 1000+ attendees through powerful talks and discussions.'
        }
      ]
    },
    {
      id: 1,
      title: 'Software Trainee',
      company: 'Warals Technology, G 35, Near Kalindi Kunj, Okhla, New Delhi',
      period: 'July 2025 – Feb 2026',
      description: 'Working on the Flashweb Project, enhancing quiz practice functionality to improve user engagement and learning outcomes.',
      logo: '💻',
      skills: ['React.js', 'JavaScript', 'API Integration', 'UI/UX'],
      achievements: [
        {
          title: 'Quiz History Feature',
          description: 'Designed and implemented a comprehensive History button on the Quiz Practice page, displaying all attempted quizzes with detailed analytics including question counts, accuracy metrics, timing analysis, and performance scoring to help users track their learning progress.'
        },
        {
          title: 'Pagination Implementation',
          description: 'Developed robust pagination across all application pages, significantly improving user navigation and reducing page load times by 40% while enhancing overall user experience.'
        },
        {
          title: 'Interface Optimization',
          description: 'Streamlined the user interface by removing the Practice with Spaced Repetition feature, resulting in a 25% reduction in UI complexity and improved user focus on core functionalities.'
        },
        {
          title: 'API Performance',
          description: 'Optimized the number of questions API and refactored the folder delete API, achieving a 35% improvement in response times and enhanced system reliability.'
        }
      ]
    },
    {
      id: 2,
      title: 'Spring Boot Developer Intern',
      company: 'RideBuddy (AP Mobility India Private Limited)',
      period: 'Dec 2023 – Jun 2024',
      description: 'Developed backend services for transportation management system using Spring Boot and microservices architecture, serving 1000+ daily active users.',
      logo: '🚗',
      skills: ['Spring Boot', 'Java', 'Microservices', 'REST API'],
      achievements: [
        {
          title: 'API Development',
          description: 'Built 5+ RESTful APIs that serve 1000+ daily active users, enabling core transportation management functionalities including ride booking, driver allocation, and real-time tracking.'
        },
        {
          title: 'Performance Optimization',
          description: 'Reduced API response time by 30% through database query optimization, caching strategies, and code refactoring, resulting in improved user satisfaction scores.'
        },
        {
          title: 'Security Implementation',
          description: 'Implemented JWT-based authentication with role-based access control, securing user data and preventing unauthorized access to sensitive transportation information.'
        }
      ]
    },
    {
      id: 3,
      title: 'Bachelor of Technology',
      company: 'IIMT UNIVERSITY Meerut',
      period: 'Sep 2022 – Jul 2026 (Expected)',
      description: 'CGPA: 8.52 | Specializing in software development and system design with focus on full-stack development and emerging technologies.',
      logo: '🎓',
      skills: ['Java', 'Data Structures', 'Algorithms', 'System Design'],
      achievements: [
        {
          title: 'Academic Excellence',
          description: 'Maintained consistent academic performance with a CGPA of 8.52 across 4 semesters, ranking in the top 15% of the computer science engineering program.'
        },
        {
          title: 'Leadership Role',
          description: 'Served as President of Entrepreneurship Cell, leading a team of 30+ members and organizing 12+ innovation-driven events that attracted 800+ participants.'
        },
        {
          title: 'Technology Ambassador',
          description: 'Recognized as Microsoft Learn Student Ambassador, conducting 20+ technical workshops and mentoring 300+ students in cloud technologies and software development.'
        }
      ]
    },
    {
      id: 41,
      title: 'Java Programmer Intern',
      company: 'AP Mobility India Private Limited',
      period: 'July 2023 – Nov 2023',
      description: 'Contributed to enterprise Java applications, gaining hands-on experience with database design, API development, and software development lifecycle.',
      logo: '☕',
      skills: ['Java', 'SQL', 'JDBC', 'Servlets'],
      achievements: [
        {
          title: 'Module Development',
          description: 'Developed 3 core modules for enterprise applications, including user authentication, data processing, and reporting systems, which are now used by 200+ internal users.'
        },
        {
          title: 'Database Optimization',
          description: 'Optimized complex database queries and implemented indexing strategies, improving application performance by 25% and reducing server load.'
        },
        {
          title: 'Code Collaboration',
          description: 'Participated in code reviews and collaborative development processes with senior developers, contributing to a 30% reduction in bug reports and improved code quality.'
        }
      ]
    },
    {
      id: 51,
      title: 'President Of E-Cell IIMTU',
      company: 'IIMT University',
      period: 'Dec 2022 – DEC 2025',
      description: 'Leading entrepreneurial initiatives and fostering innovation among students through events, workshops, and startup mentorship programs.',
      logo: '🚀',
      skills: ['Leadership', 'Event Management', 'Team Building', 'Public Speaking'],
      achievements: [
        {
          title: 'Event Organization',
          description: 'Organized 15+ entrepreneurship events including hackathons, startup showcases, and innovation challenges, attracting 1000+ participants and facilitating 5 startup incubations.'
        },
        {
          title: 'Team Leadership',
          description: 'Led a diverse team of 30 student entrepreneurs, implementing structured project management methodologies that improved team productivity by 40%.'
        },
        {
          title: 'Startup Incubation',
          description: 'Facilitated 8 startup incubations by connecting student entrepreneurs with industry mentors and investors, with 3 startups securing initial funding.'
        }
      ]
    },
    {
      id: 61,
      title: 'Microsoft Learn Student Ambassador',
      company: 'Microsoft',
      period: 'Dec 2022 – DEC 2025',
      description: 'Promoting Microsoft technologies and organizing tech events on campus to build a community of student developers and innovators.',
      logo: 'Ⓜ️',
      skills: ['Cloud Computing', 'Azure', 'Workshop Facilitation', 'Community Building'],
      achievements: [
        {
          title: 'Technical Workshops',
          description: 'Conducted 25+ hands-on workshops on Azure cloud services, AI/ML technologies, and modern development practices, reaching 1500+ students across multiple colleges.'
        },
        {
          title: 'Community Outreach',
          description: 'Built a thriving technical community of 500+ student developers through regular meetups, coding sessions, and mentorship programs, increasing campus engagement by 60%.'
        },
        {
          title: 'Recognition',
          description: 'Recognized as Top Ambassador in the region for outstanding contributions to student technical development, receiving the Microsoft Excellence Award for Community Impact.'
        }
      ]
    }
  ]

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const stats = [
    { value: '4+', label: 'Years Experience' },
    { value: '20+', label: 'Projects Completed' },
    { value: '6', label: 'Leadership Roles' },
    { value: '2000+', label: 'Students Impacted' },
  ]

  return (
    <section id="experience" className="section section-white" aria-labelledby="experience-heading">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 -right-24 h-[380px] w-[380px] rounded-full bg-brand/[0.05] blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          id="experience-heading"
          eyebrow="Journey"
          title="My Journey"
          description="Professional and academic milestones that shaped my career"
          tone="light"
        />

        {/* Vertical timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div aria-hidden="true" className="absolute left-8 sm:left-10 top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand via-brand/30 to-line rounded-full" />

            {experiences.map((exp, index) => {
              const isExpanded = expandedId === exp.id
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: EASE }}
                  className="relative pl-16 sm:pl-24 pb-8 sm:pb-10 last:pb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 w-16 sm:w-20 flex justify-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-card border-2 transition-all duration-300 ${
                      isExpanded ? 'bg-brand border-brand text-white shadow-red-glow' : 'bg-white border-line hover:border-brand/50'
                    }`}>
                      <span aria-hidden="true">{exp.logo}</span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`premium-card p-4 sm:p-6 transition-all duration-300 ${isExpanded ? 'border-brand/40 shadow-card-hover' : ''}`}>
                    <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                      <div>
                        <h4 className="font-display font-extrabold text-lg sm:text-xl mb-1 text-ink">{exp.title}</h4>
                        <p className="text-brand font-semibold mb-1 text-xs sm:text-sm">{exp.company}</p>
                      </div>
                      <span className="text-xs text-ink-muted bg-surface border border-line px-2.5 py-1 rounded-full whitespace-nowrap font-semibold">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-ink-muted text-xs sm:text-sm mb-3 leading-relaxed">{exp.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {exp.skills.slice(0, 4).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-brand/[0.06] border border-brand/20 text-brand-dark text-xs font-semibold px-2 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="achievements"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-line">
                            <h5 className="font-bold text-brand mb-3 flex items-center text-sm sm:text-base">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              Key Achievements
                            </h5>
                            <div className="space-y-2 sm:space-y-3">
                              {exp.achievements.map((achievement, achIndex) => (
                                <motion.div
                                  key={achIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: achIndex * 0.06 }}
                                  className="bg-surface p-3 sm:p-4 rounded-xl border-l-4 border-brand"
                                >
                                  <h6 className="font-bold text-ink mb-1 text-sm sm:text-base">{achievement.title}</h6>
                                  <p className="text-ink-muted text-xs sm:text-sm leading-relaxed">{achievement.description}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => toggleExpand(exp.id)}
                      className="mt-3 text-brand hover:text-brand-dark text-xs sm:text-sm font-bold flex items-center transition-colors"
                      aria-expanded={isExpanded}
                      aria-controls={`achievements-${exp.id}`}
                    >
                      {isExpanded ? 'Show Less' : 'Show More'}
                      <svg
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              className="premium-card p-5 sm:p-6 text-center group"
            >
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-brand group-hover:scale-110 transition-transform duration-300">{s.value}</div>
              <div className="text-ink-muted text-xs sm:text-sm mt-1.5 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
