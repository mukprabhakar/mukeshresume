import React, { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import SEOEnhancement from './components/SEOEnhancement'
import Loader from './components/Loader'
import CookieConsent from './components/CookieConsent'
import Reveal from './components/motion/Reveal'

// Lazy load route components for performance optimization
const Hero = lazy(() => import('./components/Hero'))
const About = lazy(() => import('./components/About'))
const Services = lazy(() => import('./components/Services'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const AIAgents = lazy(() => import('./components/AIAgents'))
const Research = lazy(() => import('./components/Research'))
const AllProjects = lazy(() => import('./components/AllProjects'))
const Gallery = lazy(() => import('./components/Gallery'))
const Experience = lazy(() => import('./components/Experience'))
const Achievements = lazy(() => import('./components/Achievements'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const Blog = lazy(() => import('./components/Blog'))
const BlogPosts = lazy(() => import('./components/BlogPosts'))
const BlogPost = lazy(() => import('./components/BlogPost'))
const Profile = lazy(() => import('./components/Profile'))
const Contact = lazy(() => import('./components/Contact'))
const CredlyBadges = lazy(() => import('./components/CredlyBadges'))
const GitHubStats = lazy(() => import('./components/GitHubStats'))
const CodingChallenges = lazy(() => import('./components/CodingChallenges'))
const Clients = lazy(() => import('./components/Clients'))
const ClientsSection = lazy(() => import('./components/ClientsSection'))
const Products = lazy(() => import('./components/Products'))
const LeetCodePOTD = lazy(() => import('./components/LeetCodePOTD'))

// Loading fallback component for lazy-loaded routes
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white" role="status" aria-label="Loading content">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-ink-muted">Loading...</p>
    </div>
  </div>
)

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  // Shared projects data - defined once and passed to both components
  const [projectsData] = useState([
    {
      id: 1,
      title: 'CodeOra',
      tags: ['React.js', 'Java', 'Spring Boot', 'SQL', 'AI/ML'],
      description: 'A SaaS-based ed-tech startup platform where students can access AI-generated projects, adaptive quizzes, recruiter portal, and college/club dashboards in a single integrated environment. As a founder, led the development of the full-stack platform using React.js and Spring Boot with MySQL, implementing features for tech-stack-based interview questions, AI-guided full-stack project generation with documentation, and curated interview podcasts. Designed a subscription model with Free and Pro tiers, integrated a secure payment gateway, and enhanced data handling efficiency by 6% through optimized backend APIs. Improved student engagement by 8% with an intuitive, responsive UI and role-based access control.',
      icon: '🏨',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      github: 'https://github.com/mukprabhakar/codeora-launchpad',
      demo: 'https://demo.hotelmanagement.com',
      impact: 'Ed-tech startup with 500+ users',
      metrics: [
        { label: 'Users', value: '500+' },
        { label: 'Subscription', value: '10+' },
        { label: 'Student Engagement', value: '+8%' }
      ]
    },
    {
      id: 2,
      title: 'Trigo',
      tags: ['React.js', 'Java', 'Spring Boot', 'SQL'],
      description: 'A medical startup that helps users order medicine from local vendors with instant delivery, bridging the gap between patients and pharmacies. As a founder, developed the full-stack platform with real-time inventory management, location-based vendor discovery, and instant order processing. Implemented secure payment integration, user authentication, and vendor management dashboard. The platform reduces medicine delivery time by 70% compared to traditional methods and connects 50+ local pharmacies in the pilot region.',
      icon: '💊',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      github: 'https://github.com/mukprabhakar/trigo-medical',
      demo: 'https://demo.trigo-medical.com',
      impact: 'Medical startup with instant delivery',
      metrics: [
        { label: 'Pharmacies', value: '50+' },
        { label: 'Delivery Time', value: '-70%' },
        { label: 'User Satisfaction', value: '4.8/5' }
      ]
    },
    {
      id: 3,
      title: 'Crypto Trading Platform',
      tags: ['React.js', 'Java', 'Spring Boot', 'WebSockets'],
      description: 'Designed a crypto trading platform with functionalities for buying, selling, and tracking cryptocurrency prices. Executed secure authentication and real-time data updates using WebSockets. Leveraged historical data analysis for informed trading decisions within seconds.',
      icon: '📈',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      github: 'https://github.com/mukprabhakar/Trading',
      demo: 'https://demo.cryptotrading.com',
      impact: 'Real-time trading with sub-second updates',
      metrics: [
        { label: 'Currencies', value: '50+' },
        { label: 'Latency', value: '<1s' },
        { label: 'Users', value: '200+' }
      ]
    },
    {
      id: 4,
      title: 'Automated Bus Scheduling System',
      tags: ['Java', 'Spring Boot', 'SQL', 'GIS'],
      description: 'Devised a bus scheduling system for Delhi Transport Corporation (DTC) to optimize routes and schedules within seconds according to the requirement. Integrated Spring Boot with GIS mapping for real-time route management and tracking, ensuring the best real-time monitoring suitable for passengers, passenger families, and the government. Orchestrated automated duty scheduling to reduce delays by 45%.',
      icon: '🚌',
      image: 'https://images.unsplash.com/photo-1446185250204-f94591f7d702?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      github: 'https://github.com/mukprabhakar/Automated-Bus-Scheduling-and-Route-Management-System-for-Delhi-Transport-Corporation',
      demo: 'https://demo.busscheduling.com',
      impact: 'Reduced delays by 45%',
      metrics: [
        { label: 'Routes', value: '100+' },
        { label: 'Buses', value: '500+' },
        { label: 'Efficiency', value: '+45%' }
      ]
    },
    {
      id: 5,
      title: 'E-commerce Backend Service',
      tags: ['Java', 'Spring Boot', 'SQL', 'Microservices'],
      description: 'Developed a scalable backend for an e-commerce platform, handling product catalog, user authentication, and order processing. Focused on microservices architecture for high availability and performance.',
      icon: '🛒',
      image: 'https://images.unsplash.com/photo-1661956607397-985a13b9585e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      github: 'https://github.com/mukprabhakar/React-Frontend',
      demo: 'https://demo.ecommerce.com',
      impact: 'Scalable microservices architecture',
      metrics: [
        { label: 'Orders', value: '10K+' },
        { label: 'Products', value: '5K+' },
        { label: 'Uptime', value: '99.9%' }
      ]
    },
    {
      id: 6,
      title: 'Django-web-application-For-Drive',
      tags: ['HTML', 'JavaScript', 'CSS', 'Python', 'Django'],
      description: 'Developed a Django-based web application that allows users to upload and view images directly on Google Drive, integrating Google Drive API for secure storage and seamless access.',
      icon: '💬',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      github: 'https://github.com/mukprabhakar/Django-web-application-For-Drive',
      demo: 'https://demo.chatapp.com',
      impact: 'Real-time messaging with instant delivery',
      metrics: [
        { label: 'Messages', value: '1M+' },
        { label: 'Users', value: '1K+' },
        { label: 'Latency', value: '<50ms' }
      ]
    },
    {
      id: 8,
      title: 'Dry Fruit Delight - E-commerce Platform',
      tags: ['E-commerce', 'React.js', 'Node.js', 'MongoDB', 'Payment Gateway', 'Wix'],
      description: 'A comprehensive e-commerce platform for premium dry fruits, nuts, seeds, and spices. Built on Wix with custom integrations for inventory management, secure payment processing, and order tracking. The platform features product categorization (Dates, Dry Fruits, Seeds, Spices, Chocolates), shopping cart functionality, customer reviews, and a mobile-responsive design. Implemented SEO optimization resulting in 40% increase in organic traffic and integrated analytics for conversion tracking. The platform serves customers across India with real-time inventory updates and automated order notifications.',
      logo: 'https://static.wixstatic.com/media/c6b2f0_332d9aa4fb51435eae15f3c52b54e2cb~mv2.png/v1/fill/w_414,h_392,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c6b2f0_332d9aa4fb51435eae15f3c52b54e2cb~mv2.png',
      image: 'https://images.unsplash.com/photo-1596450523090-9f7a0403563b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      github: 'https://www.dryfruitsdelight.com/',
      demo: 'https://www.dryfruitsdelight.com/',
      impact: 'Premium e-commerce platform for dry fruits with nationwide delivery',
      metrics: [
        { label: 'Products', value: '100+' },
        { label: 'Organic Traffic', value: '+40%' },
        { label: 'Customer Base', value: 'Pan-India' }
      ]
    },
    {
      id: 9,
      title: 'Just Mewa - Premium Dry Fruits E-commerce',
      tags: ['E-commerce', 'React.js', 'Next.js', 'Stripe', 'CMS', 'SEO'],
      description: 'A modern e-commerce platform specializing in organic, hand-picked dry fruits and nuts from around the world. Features include advanced product categorization (Dried Fruits, Gift Boxes, Organic Collection, Premium Nuts, Seeds & Berries), dynamic pricing with discounts, quantity selectors, shopping cart, customer testimonials, quality certifications display (FSSAI, Organic, ISO 22000), blog integration for content marketing, and email capture for lead generation. Implemented conversion optimization strategies including urgency elements, trust badges, and exit-intent popups. The platform achieves 3-5% conversion rate through strategic UX design and social proof integration.',
      logo: 'https://justmewa.com/static/images/dry%20fruits%20logo.png',
      image: 'https://justmewa.com/static/images/dry%20fruits%20logo.png',
      github: 'https://justmewa.com/',
      demo: 'https://justmewa.com/',
      impact: 'High-converting e-commerce platform with 3-5% conversion rate',
      metrics: [
        { label: 'Conversion Rate', value: '3-5%' },
        { label: 'Product Categories', value: '7' },
        { label: 'Customer Reviews', value: '1000+' }
      ]
    },
    {
      id: 7,
      title: 'CRM-App-with-RBAC-System',
      tags: ['HTML', 'JavaScript', 'CSS', 'Python', 'Django'],
      description: 'Created a web-based CRM system with role-based access control allowing users to manage customer information, track interactions, and generate reports. Secure data storage and user authentication implemented.',
      icon: '💰',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      github: 'https://github.com/mukprabhakar/CRM-App-with-RBAC-System-',
      demo: 'https://demo.financetracker.com',
      impact: 'Helped users save 15% on average',
      metrics: [
        { label: 'Users', value: '5K+' },
        { label: 'Transactions', value: '100K+' },
        { label: 'Savings', value: '15%' }
      ]
    },
    {
      id: 10,
      title: 'Student Details with Image - IIMT University',
      tags: ['Image Processing', 'Computer Vision', 'Security', 'Surveillance', 'AI/ML'],
      description: 'Developed an advanced campus security system for IIMT University that leverages CCTV footage and image processing to identify students involved in inappropriate activities or altercations. The system allows security personnel to upload images captured from CCTV cameras and instantly retrieve student details, enabling quick identification and action. Features include real-time student tracking through live CCTV camera integration, automated image recognition, and a comprehensive database linkage. Currently deployed for campus security monitoring, with future enhancements planned for automated gate entry systems and attendance tracking using facial recognition technology. This solution has significantly improved campus safety and reduced response time to security incidents by 60%.',
      icon: '🎓',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      github: 'https://github.com/mukprabhakar',
      demo: 'https://iimt.edu.in/',
      impact: 'Enhanced campus security with 60% faster incident response',
      metrics: [
        { label: 'Students Tracked', value: '3000+' },
        { label: 'Response Time', value: '-60%' },
        { label: 'Campus Safety', value: '+85%' }
      ]
    }
  ])

  if (isAppLoading) {
    return <Loader onLoadingComplete={() => setIsAppLoading(false)} />
  }

  return (
    <Router>
      <div className="antialiased bg-white text-ink min-h-screen animate-fade-in">
        <CustomCursor />
        <ScrollProgress />
        <Header />
        <main role="main" id="main-content">
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={
                <>
                  <SEOEnhancement 
                    title="Mukesh Pal - Hire Full-Stack Developer India | React & Spring Boot Expert"
                    description="Freelance full-stack developer in Meerut, India. Expert in React.js, Java Spring Boot, MERN stack. 20+ projects delivered. Hire for custom web development."
                    type="website"
                  />
                  <Hero />
                  <Reveal as="div"><About /></Reveal>
                  <Reveal as="div"><Services /></Reveal>
                  <Reveal as="div"><ClientsSection /></Reveal>
                  <Reveal as="div"><Skills /></Reveal>
                  <Reveal as="div"><Projects projectsData={projectsData} /></Reveal>
                  <Reveal as="div"><AIAgents /></Reveal>
                  <Reveal as="div"><Experience /></Reveal>
                  <Reveal as="div"><Research /></Reveal>
                  <Reveal as="div"><Achievements /></Reveal>
                  <Reveal as="div"><Testimonials /></Reveal>
                  <Reveal as="div"><Blog /></Reveal>
                  <Reveal as="div"><Profile /></Reveal>
                  <Reveal as="div"><Contact /></Reveal>
                </>
              } />
              <Route path="/all-projects" element={<Reveal as="div"><AllProjects projectsData={projectsData} /></Reveal>} />
              <Route path="/gallery" element={<Reveal as="div"><Gallery /></Reveal>} />
              <Route path="/clients" element={<Reveal as="div"><Clients /></Reveal>} />
              <Route path="/products" element={<Reveal as="div"><Products /></Reveal>} />
              <Route path="/badges" element={<Reveal as="div"><CredlyBadges /></Reveal>} />
              <Route path="/github" element={<Reveal as="div"><GitHubStats /></Reveal>} />
              <Route path="/coding" element={<Reveal as="div"><CodingChallenges /></Reveal>} />
              <Route path="/blog" element={<Reveal as="div"><BlogPosts /></Reveal>} />
              <Route path="/blog/:slug" element={<Reveal as="div"><BlogPost /></Reveal>} />
              <Route path="/leetcode-potd" element={<Reveal as="div"><LeetCodePOTD /></Reveal>} />
              <Route path="/leetcode-potd/:slug" element={<Reveal as="div"><LeetCodePOTD /></Reveal>} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </Router>
  )
}

export default App