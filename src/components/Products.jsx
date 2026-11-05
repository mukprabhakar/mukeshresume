import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TiltCard from './TiltCard';
import CountUp from './CountUp';
import PageHero from './PageHero';
import { Reveal, EASE } from './motion/Reveal';
import { HoverShine } from './motion/StatBar';
import { useSpotlight } from '../utils/useSpotlight';
import { trackEvent } from '../utils/analytics';
import SEOEnhancement from './SEOEnhancement';

// Metrics are stored as display strings ("500+", "+40%"). Split them so the
// number itself can count up while the decoration stays where it belongs.
const splitMetric = (value) => {
  const match = String(value).match(/^(\D*)(\d+)(.*)$/);
  if (!match) return { prefix: '', number: null, suffix: String(value) };
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
};

const MetricValue = ({ value, className = '' }) => {
  const { prefix, number, suffix } = splitMetric(value);
  if (number === null) return <span className={className}>{value}</span>;
  return (
    <span className={className}>
      <CountUp value={number} prefix={prefix} suffix={suffix} />
    </span>
  );
};

const Products = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const spotlight = useSpotlight();

  // Standalone route: always land at the top of the products page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ['All', 'SaaS', 'E-Commerce', 'AI/ML'];

  const products = [
    {
      id: 1,
      title: 'CodeOra Launchpad',
      subtitle: 'AI-Guided Ed-Tech SaaS',
      category: 'SaaS',
      price: '$19/mo',
      period: 'per user',
      description: 'A comprehensive SaaS-based ed-tech platform featuring AI-generated project roadmaps, adaptive quizzes, role-based dashboards, and college/club management systems.',
      icon: '🚀',
      color: 'from-indigo-600 via-purple-600 to-pink-600',
      shadowColor: 'hover:shadow-indigo-500/20',
      demoUrl: 'https://github.com/mukprabhakar/codeora-launchpad',
      sourceUrl: 'https://github.com/mukprabhakar/codeora-launchpad',
      features: [
        'AI-driven custom project generator',
        'Adaptive skills assessment & quizzes',
        'Stripe payment & subscription plans',
        'Recruiter & campus partner portal'
      ],
      metrics: { label: 'Active Users', value: '500+' }
    },
    {
      id: 2,
      title: 'Trigo Medical',
      subtitle: 'Pharmacy Delivery Network',
      category: 'SaaS',
      price: 'Custom',
      period: 'licensing',
      description: 'Location-based pharmaceutical delivery platform linking local pharmacies with consumers for sub-hour order fulfillment and real-time inventory management.',
      icon: '💊',
      color: 'from-emerald-500 via-teal-500 to-cyan-500',
      shadowColor: 'hover:shadow-emerald-500/20',
      demoUrl: 'https://github.com/mukprabhakar/trigo-medical',
      sourceUrl: 'https://github.com/mukprabhakar/trigo-medical',
      features: [
        'Real-time inventory synchronization',
        'WebSocket-powered live tracking',
        'Location-based pharmacy discovery',
        'Detailed admin & pharmacy dashboards'
      ],
      metrics: { label: 'Pharmacy Partners', value: '50+' }
    },
    {
      id: 3,
      title: 'Dry Fruit Delight',
      subtitle: 'Premium E-Commerce Solution',
      category: 'E-Commerce',
      price: '$499',
      period: 'one-time license',
      description: 'A modern, high-converting retail platform optimized for organic wholesale products, dry fruits, and nuts with intelligent search, cataloging, and shipping APIs.',
      icon: '🛒',
      color: 'from-amber-500 via-orange-500 to-rose-500',
      shadowColor: 'hover:shadow-amber-500/20',
      demoUrl: 'https://www.dryfruitsdelight.com/',
      sourceUrl: 'https://www.dryfruitsdelight.com/',
      features: [
        'Dynamic smart pricing & discounts',
        'Integrated shipping & tax engines',
        'Conversion optimized UX design',
        'SEO-first semantic configuration'
      ],
      metrics: { label: 'Traffic Increase', value: '+40%' }
    }
  ];

  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter(p => p.category === activeFilter || (activeFilter === 'AI/ML' && p.title.includes('AI')));

  // Numbers for the animated hero strip. `products` is a static list declared
  // in this component, so plain derived constants are enough here.
  const pricePoints = products
    .map((product) => Number(String(product.price).replace(/[^\d.]/g, '')))
    .filter((n) => Number.isFinite(n) && n > 0);
  const heroStats = [
    { label: 'Products live', value: products.length },
    { label: 'Categories', value: new Set(products.map((product) => product.category)).size },
    pricePoints.length
      ? { label: 'Starting at', value: Math.min(...pricePoints), prefix: '$', suffix: '/mo' }
      : { label: 'Licensing', value: 'Custom' },
  ];

  const handleProductClick = (productTitle, type) => {
    trackEvent('click', 'products_page', `${type}_${productTitle.toLowerCase().replace(/\s+/g, '_')}`);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0a0a]">
      <SEOEnhancement
        title="Software Products | Mukesh Pal - SaaS & Web Applications"
        description="Explore premium SaaS platforms, e-commerce networks, and software applications built by Mukesh Pal. Featuring CodeOra, Trigo Medical, and Dry Fruit Delight."
        type="website"
      />

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[130px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <PageHero
          eyebrow="Production Ready Solutions"
          title="Our Premium"
          highlight="Products"
          description="High-performance digital products built with robust architectures, modern user interfaces, and custom integrations to grow your business."
          stats={heroStats}
        />

        {/* Category Filter – the active pill slides from chip to chip */}
        <Reveal direction="fade" className="mb-16 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const active = activeFilter === cat;
            return (
              <button
                key={cat}
                id={`filter-btn-${cat.toLowerCase().replace('/', '-')}`}
                onClick={() => {
                  setActiveFilter(cat);
                  trackEvent('click', 'products_filter', cat);
                }}
                className={`relative rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  active
                    ? 'border-transparent text-white'
                    : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="product-filter-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 shadow-lg shadow-emerald-500/20"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </Reveal>

        {/* Products Grid */}
        <motion.div layout className="relative mb-24 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.article
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.95 }}
                transition={{ duration: 0.5, ease: EASE, delay: Math.min(index, 5) * 0.08 }}
                className="h-full"
              >
                <TiltCard className="h-full">
                  <div
                    {...spotlight}
                    className={`group card-spotlight-dark glass-effect relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[2.5rem] border border-zinc-800 p-8 transition-all duration-500 hover:-translate-y-3 hover:border-zinc-700 hover:shadow-2xl ${product.shadowColor}`}
                  >
                    {/* Highlight Gradient Card Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>

                    {/* Accent Line top */}
                    <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${product.color} opacity-30 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    {/* Product Header */}
                    <div className="relative z-10 flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900/85 border border-zinc-800 flex items-center justify-center text-3xl shadow-md relative overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-10`}></div>
                        <span className="relative z-10">{product.icon}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-white">{product.price}</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">{product.period}</div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="relative z-10 mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-emerald-400 transition-colors duration-300">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="relative z-10 text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 transition-all duration-300">
                      {product.title}
                    </h3>
                    <p className="relative z-10 text-emerald-400 text-sm font-semibold mb-4">{product.subtitle}</p>

                    <p className="relative z-10 text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
                      {product.description}
                    </p>

                    {/* Features List */}
                    <div className="relative z-10 mb-8">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Key Highlights</h4>
                      <ul className="space-y-2.5">
                        {product.features.map((feature, idx) => (
                          <motion.li
                            key={feature}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.35, ease: EASE, delay: 0.2 + idx * 0.07 }}
                            className="flex items-start text-xs text-zinc-300"
                          >
                            <svg className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer Impact Metric */}
                    <div className="relative z-10 pt-4 border-t border-zinc-800/80 mb-6 flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-medium">{product.metrics.label}</span>
                      <MetricValue value={product.metrics.value} className="text-sm font-bold text-emerald-400" />
                    </div>

                    {/* Action CTA Buttons */}
                    <div className="relative z-10 grid grid-cols-2 gap-3 mt-auto">
                      <a
                        href={product.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        id={`cta-src-${product.id}`}
                        onClick={() => handleProductClick(product.title, 'source_code')}
                        className="py-3 px-4 rounded-xl text-center text-xs font-bold bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
                      >
                        Source Code
                      </a>
                      <a
                        href={product.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        id={`cta-demo-${product.id}`}
                        onClick={() => handleProductClick(product.title, 'live_demo')}
                        className={`relative overflow-hidden py-3 px-4 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r ${product.color} shadow-lg shadow-black/35 hover:scale-[1.03] transition-all`}
                      >
                        <span className="relative z-10">Live Preview</span>
                        <HoverShine />
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Contact/Inquiry Banner */}
        <Reveal direction="scale" className="relative mx-auto max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-[3rem] blur-xl opacity-40"></div>
          
          <div className="relative glass-effect rounded-[3rem] p-8 sm:p-12 border border-zinc-800 text-center overflow-hidden">
            <HoverShine />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Need a Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Software Product?</span>
            </h2>
            <p className="text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Have a custom SaaS or mobile application idea? Let&apos;s team up to build a secure, robust, and scalable product from scratch.
            </p>
            <Link
              to="/#contact"
              onClick={() => trackEvent('click', 'products_page', 'custom_inquiry')}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-zinc-900 border border-zinc-700 rounded-full hover:border-emerald-500/50 hover:bg-zinc-850 hover:scale-105 overflow-hidden shadow-lg"
            >
              <span className="relative flex items-center">
                Get Free Consultation
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </Reveal>

        {/* Return to Portfolio Link */}
        <Reveal direction="fade" delay={0.1} className="mt-16 text-center">
          <Link
            to="/"
            onClick={() => trackEvent('click', 'products_page', 'back_home')}
            className="inline-flex items-center px-6 py-3 rounded-full glass-effect border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Portfolio
          </Link>
        </Reveal>

      </div>
    </div>
  );
};

export default Products;
