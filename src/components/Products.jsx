import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';
import { trackEvent } from '../utils/analytics';
import SEOEnhancement from './SEOEnhancement';

const Products = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    setIsVisible(true);
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

      <div className={`relative z-10 max-w-7xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-scale-in">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gray-800/50 border border-gray-700/50 backdrop-blur-md">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent text-sm font-bold tracking-wider uppercase">
              Production Ready Solutions
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Our Premium <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            High-performance digital products built with robust architectures, modern user interfaces, and custom integrations to grow your business.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center space-x-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-btn-${cat.toLowerCase().replace('/', '-')}`}
              onClick={() => {
                setActiveFilter(cat);
                trackEvent('click', 'products_filter', cat);
              }}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm border ${
                activeFilter === cat
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-transparent shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {filteredProducts.map((product) => (
            <TiltCard
              key={product.id}
              className={`group relative glass-effect rounded-[2.5rem] p-8 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden ${product.shadowColor} hover:shadow-2xl flex flex-col h-full`}
            >
              {/* Highlight Gradient Card Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>

              {/* Accent Line top */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${product.color} opacity-30 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Product Header */}
              <div className="flex justify-between items-start mb-6">
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
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-emerald-400 transition-colors duration-300">
                  {product.category}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 transition-all duration-300">
                {product.title}
              </h3>
              <p className="text-emerald-400 text-sm font-semibold mb-4">{product.subtitle}</p>

              <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
                {product.description}
              </p>

              {/* Features List */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Key Highlights</h4>
                <ul className="space-y-2.5">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-xs text-zinc-300">
                      <svg className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Impact Metric */}
              <div className="pt-4 border-t border-zinc-800/80 mb-6 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">{product.metrics.label}</span>
                <span className="text-sm font-bold text-emerald-400">{product.metrics.value}</span>
              </div>

              {/* Action CTA Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
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
                  className={`py-3 px-4 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r ${product.color} shadow-lg shadow-black/35 hover:scale-[1.03] transition-all`}
                >
                  Live Preview
                </a>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Contact/Inquiry Banner */}
        <div className="max-w-5xl mx-auto relative animate-fadeIn" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-[3rem] blur-xl opacity-40"></div>
          
          <div className="relative glass-effect rounded-[3rem] p-12 border border-zinc-800 text-center overflow-hidden">
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
        </div>

        {/* Return to Portfolio Link */}
        <div className="mt-16 text-center">
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
        </div>

      </div>
    </div>
  );
};

export default Products;
