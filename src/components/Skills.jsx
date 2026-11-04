import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { Reveal, EASE } from './motion/Reveal'
import { Bar, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Filler, Tooltip, Legend)

/* Skills – #F5F5F5 section. Organized premium category cards with
   technology chips, subtle red hover glow + proficiency charts.
   Every original skill (with % and level) is preserved. */

const RED = '#e31e24'
const RED_DARK = '#9c151a'

const categories = [
  {
    title: 'Programming Languages',
    icon: '⌨️',
    skills: [
      { name: 'Java', percent: 90, level: 'Expert' },
      { name: 'SQL', percent: 85, level: 'Advanced' },
      { name: 'JavaScript', percent: 80, level: 'Advanced' },
      { name: 'Python', percent: 75, level: 'Intermediate' },
      { name: 'TypeScript', percent: 70, level: 'Intermediate' },
      { name: 'Dart', percent: 65, level: 'Intermediate' },
    ],
  },
  {
    title: 'Frontend Development',
    icon: '🎨',
    skills: [
      { name: 'HTML', percent: 95, level: 'Expert' },
      { name: 'CSS', percent: 90, level: 'Expert' },
      { name: 'React.js', percent: 75, level: 'Intermediate' },
      { name: 'Next.js', percent: 65, level: 'Intermediate' },
      { name: 'Tailwind CSS', percent: 85, level: 'Advanced' },
      { name: 'Bootstrap', percent: 80, level: 'Advanced' },
      { name: 'Flutter', percent: 70, level: 'Intermediate' },
      { name: 'React Native', percent: 65, level: 'Intermediate' },
    ],
  },
  {
    title: 'Backend Development',
    icon: '🛠️',
    skills: [
      { name: 'Spring Boot', percent: 85, level: 'Advanced' },
      { name: 'Node.js', percent: 75, level: 'Intermediate' },
      { name: 'Express.js', percent: 70, level: 'Intermediate' },
      { name: 'Microservices', percent: 75, level: 'Intermediate' },
      { name: 'REST APIs', percent: 88, level: 'Advanced' },
      { name: 'WebSockets', percent: 78, level: 'Advanced' },
    ],
  },
  {
    title: 'Databases',
    icon: '🗄️',
    skills: [
      { name: 'MySQL', percent: 80, level: 'Advanced' },
      { name: 'MongoDB', percent: 75, level: 'Intermediate' },
      { name: 'PostgreSQL', percent: 70, level: 'Intermediate' },
      { name: 'Firebase', percent: 75, level: 'Intermediate' },
    ],
  },
  {
    title: 'AI & Machine Learning',
    icon: '🤖',
    skills: [
      { name: 'AI/ML', percent: 78, level: 'Advanced' },
      { name: 'AI Agent Development', percent: 82, level: 'Advanced' },
      { name: 'LLM Integration', percent: 80, level: 'Advanced' },
      { name: 'Computer Vision', percent: 75, level: 'Intermediate' },
      { name: 'Image Processing', percent: 76, level: 'Intermediate' },
      { name: 'n8n Workflow Automation', percent: 70, level: 'Intermediate' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    icon: '☁️',
    skills: [
      { name: 'AWS', percent: 70, level: 'Intermediate' },
      { name: 'Docker', percent: 65, level: 'Intermediate' },
      { name: 'GitHub Actions', percent: 70, level: 'Intermediate' },
      { name: 'Netlify', percent: 80, level: 'Advanced' },
      { name: 'Vercel', percent: 75, level: 'Intermediate' },
    ],
  },
  {
    title: 'Tools & Technologies',
    icon: '🧰',
    skills: [
      { name: 'Git', percent: 85, level: 'Advanced' },
      { name: 'VS Code', percent: 90, level: 'Expert' },
      { name: 'IntelliJ IDEA', percent: 85, level: 'Advanced' },
      { name: 'Postman', percent: 80, level: 'Advanced' },
      { name: 'Figma', percent: 70, level: 'Intermediate' },
      { name: 'Chrome DevTools', percent: 85, level: 'Advanced' },
    ],
  },
  {
    title: 'Soft Skills & Leadership',
    icon: '👑',
    skills: [
      { name: 'Leadership', percent: 95, level: 'Expert' },
      { name: 'Quick Learner', percent: 95, level: 'Expert' },
      { name: 'Problem-Solving', percent: 90, level: 'Expert' },
      { name: 'Team Player', percent: 90, level: 'Expert' },
      { name: 'Team Building', percent: 90, level: 'Expert' },
      { name: 'Event Management', percent: 90, level: 'Expert' },
      { name: 'Communication', percent: 85, level: 'Advanced' },
      { name: 'Product Strategy', percent: 85, level: 'Advanced' },
      { name: 'Public Speaking', percent: 85, level: 'Advanced' },
      { name: 'Time Management', percent: 80, level: 'Advanced' },
    ],
  },
]

const certifications = [
  { name: 'AWS Certified Developer', issuer: 'Amazon', date: '2023' },
  { name: 'Spring Professional Certification', issuer: 'VMware', date: '2022' },
  { name: 'Oracle Certified Java Programmer', issuer: 'Oracle', date: '2021' },
]

const levelChip = {
  Expert: 'bg-brand text-white',
  Advanced: 'bg-brand-soft text-brand-dark',
  Intermediate: 'bg-surface text-ink/70',
}

const Skills = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return categories
    const q = searchTerm.toLowerCase()
    return categories
      .map((c) => ({ ...c, skills: c.skills.filter((s) => s.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)) }))
      .filter((c) => c.skills.length > 0)
  }, [searchTerm])

  const radarData = {
    labels: ['Java', 'Spring Boot', 'SQL', 'React.js', 'JavaScript', 'HTML/CSS', 'MySQL', 'Problem Solving', 'Communication', 'Leadership', 'Team Player', 'AI/ML'],
    datasets: [{
      label: 'Technical Skills',
      data: [90, 85, 85, 75, 80, 95, 80, 90, 85, 95, 90, 78],
      backgroundColor: 'rgba(227, 30, 36, 0.15)',
      borderColor: RED,
      borderWidth: 2,
      pointBackgroundColor: RED,
      pointBorderColor: '#fff',
      pointHoverRadius: 5,
      pointBorderWidth: 2,
    }],
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(10,10,10,0.08)' },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { backdropColor: 'transparent', color: '#6b6b70', stepSize: 20, font: { size: 10 } },
        pointLabels: { color: '#0a0a0a', font: { size: 11, weight: '600' } },
        grid: { color: 'rgba(10,10,10,0.08)' },
      },
    },
    plugins: {
      legend: { labels: { color: '#0a0a0a', font: { size: 12 } } },
      tooltip: { backgroundColor: 'rgba(10,10,10,0.92)', titleColor: '#f7afb6', bodyColor: '#f5f5f5', borderColor: 'rgba(227,30,36,0.5)', borderWidth: 1, padding: 12 },
    },
  }

  const barData = {
    labels: ['Java', 'Spring Boot', 'SQL', 'React.js', 'JavaScript', 'HTML/CSS'],
    datasets: [{
      label: 'Proficiency %',
      data: [90, 85, 85, 75, 80, 95],
      backgroundColor: 'rgba(227, 30, 36, 0.75)',
      borderColor: RED_DARK,
      borderWidth: 1,
      borderRadius: 8,
    }],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { color: '#6b6b70', stepSize: 20 }, grid: { color: 'rgba(10,10,10,0.06)' } },
      x: { ticks: { color: '#0a0a0a', font: { weight: '600' } }, grid: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: 'rgba(10,10,10,0.92)', titleColor: '#f7afb6', bodyColor: '#f5f5f5', borderColor: 'rgba(227,30,36,0.5)', borderWidth: 1, padding: 12 },
    },
  }

  return (
    <section id="skills" className="section section-gray" aria-labelledby="skills-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 erp-grid-light opacity-60" style={{ maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)' }} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading
          id="skills-heading"
          eyebrow="Skills"
          tone="light"
          title={<>Technical <span className="text-brand">Arsenal</span></>}
          description="A comprehensive overview of my technical expertise — from languages and frameworks to AI, cloud and the tools I use daily."
        />

        {/* Search */}
        <Reveal direction="fade" className="max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="relative">
            <input
              id="skill-search"
              type="text"
              placeholder="Search skills — try 'Java', 'AI', 'Cloud'..."
              className="w-full px-5 py-4 pl-12 bg-white border border-line rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-brand text-ink placeholder-zinc-400 transition shadow-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search skills"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </Reveal>

        {/* Category cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-14 sm:mb-16 max-w-6xl mx-auto">
          {filtered.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: (ci % 3) * 0.12, ease: EASE }}
              className="premium-card p-6 group"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-2xl transition-all duration-300 group-hover:bg-brand group-hover:shadow-red-glow group-hover:scale-105" aria-hidden="true">
                  {cat.icon}
                </div>
                <h3 className="font-display font-extrabold text-ink text-lg leading-tight">{cat.title}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <li
                    key={s.name}
                    title={`${s.level} · ${s.percent}%`}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all duration-300 hover:-translate-y-0.5 cursor-default ${levelChip[s.level] || 'bg-surface text-ink/70'} ${s.name.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm ? 'ring-2 ring-brand/50' : 'border-line'}`}
                  >
                    {s.name}
                    <span className={`text-[10px] font-bold ${s.level === 'Expert' ? 'text-white/80' : 'text-brand'}`}>{s.percent}%</span>
                  </li>
                ))}
              </ul>
              {/* Animated proficiency line */}
              <div className="mt-5 h-1.5 rounded-full bg-line overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.round(cat.skills.reduce((a, s) => a + s.percent, 0) / cat.skills.length)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                  className="h-full rounded-full bg-gradient-to-r from-brand to-brand-dark"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-14 sm:mb-16 max-w-6xl mx-auto">
          <Reveal direction="left">
            <div className="premium-card p-6 sm:p-8 h-full">
              <h4 className="font-display font-extrabold text-xl text-ink mb-6 text-center">Skill Proficiency Radar</h4>
              <div className="h-64 sm:h-80">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
          </Reveal>
          <Reveal direction="right">
            <div className="premium-card p-6 sm:p-8 h-full">
              <h4 className="font-display font-extrabold text-xl text-ink mb-6 text-center">Key Technologies</h4>
              <div className="h-64 sm:h-80">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Certifications */}
        <Reveal>
          <div className="max-w-6xl mx-auto">
            <h4 className="font-display font-extrabold text-xl sm:text-2xl text-ink mb-8 text-center">Certifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: EASE }}
                  className="premium-card p-6 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center mr-4 shrink-0">
                      <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-ink text-sm sm:text-base">{cert.name}</h5>
                      <p className="text-ink-muted text-xs sm:text-sm">{cert.issuer}</p>
                    </div>
                  </div>
                  <span className="inline-block px-2.5 py-1 bg-surface border border-line text-ink/70 text-xs rounded-full font-bold">{cert.date}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Skills
