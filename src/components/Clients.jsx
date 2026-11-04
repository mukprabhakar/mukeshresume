import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
import SEOEnhancement from './SEOEnhancement';

const Clients = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const clients = [
    {
      id: 1,
      name: 'IIMT University',
      url: 'https://iimtu.edu.in/',
      logo: 'https://iimtu.edu.in/images/logo.png',
      description: 'A leading university providing quality education across various disciplines with cutting-edge facilities.',
      industry: 'Education',
      location: 'Meerut, India',
      color: 'from-blue-600 via-indigo-600 to-purple-600',
      shadowColor: 'hover:shadow-blue-500/30'
    },
    {
      id: 2,
      name: 'Oye College',
      url: 'https://oyecollege.com/',
      logo: 'https://oyecollege.com/assets/images/logo2.png',
      description: 'Innovative platform connecting ambitious students with premier educational institutions worldwide.',
      industry: 'EdTech',
      location: 'India',
      color: 'from-green-500 via-emerald-500 to-teal-500',
      shadowColor: 'hover:shadow-green-500/30'
    },
    {
      id: 3,
      name: 'RBS Tours and Travels',
      url: 'https://rbstourandtravels.in/',
      logo: 'https://rbstourandtravels.in/assets/rbs_logo-Fp0bdru1.png',
      description: 'Premium travel services offering unforgettable, bespoke experiences and seamless journeys.',
      industry: 'Travel & Tourism',
      location: 'India',
      color: 'from-orange-500 via-red-500 to-rose-500',
      shadowColor: 'hover:shadow-orange-500/30'
    },
    {
      id: 4,
      name: 'Dry Fruit Delight',
      url: 'https://www.dryfruitsdelight.com/',
      logo: 'https://static.wixstatic.com/media/c6b2f0_332d9aa4fb51435eae15f3c52b54e2cb~mv2.png/v1/fill/w_414,h_392,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c6b2f0_332d9aa4fb51435eae15f3c52b54e2cb~mv2.png',
      description: 'Premium e-commerce platform for dry fruits, nuts, seeds, and spices with nationwide delivery across India.',
      industry: 'E-commerce & Food',
      location: 'India',
      color: 'from-amber-500 via-orange-500 to-red-500',
      shadowColor: 'hover:shadow-amber-500/30'
    },
    {
      id: 5,
      name: 'Just Mewa',
      url: 'https://justmewa.com/',
      logo: 'https://justmewa.com/static/images/dry%20fruits%20logo.png',
      description: 'Modern e-commerce platform specializing in organic, hand-picked dry fruits and nuts from around the world.',
      industry: 'E-commerce & Food',
      location: 'India',
      color: 'from-emerald-500 via-green-500 to-teal-500',
      shadowColor: 'hover:shadow-emerald-500/30'
    },
    {
      id: 6,
      name: 'CCS University Meerut',
      url: 'https://www.ccsuniversity.ac.in/',
      logo: 'https://www.ccsuniversity.ac.in/assets/images/CCSU-Logo.jpg',
      description: 'Chaudhary Charan Singh University (formerly Meerut University) is a prominent public state university offering higher education across various disciplines with cutting-edge academic programs.',
      industry: 'Education',
      location: 'Meerut, India',
      color: 'from-sky-500 via-blue-500 to-indigo-500',
      shadowColor: 'hover:shadow-sky-500/30'
    }
  ];

  const handleClientClick = (clientName, url) => {
    trackEvent('click', 'client', `visit_${clientName.toLowerCase().replace(/\s+/g, '_')}`);
    window.open(url, '_blank');
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0a0a]">
      <SEOEnhancement
        title="Clients & Testimonials | Mukesh Pal - Full-Stack Developer"
        description="Trusted by companies, startups, and institutions including IIMT University, Oye College, RBS Tours, and e-commerce platforms for custom web and full-stack solutions."
        type="website"
      />
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className={`relative z-10 max-w-7xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

        {/* Header Section */}
        <div className="text-center mb-20 animate-scale-in">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gray-800/50 border border-gray-700/50 backdrop-blur-md">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent text-sm font-bold tracking-wider uppercase">
              Partnerships & Collaborations
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Our Valued <span className="bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Clients</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Empowering innovative organizations across education, technology, and travel with state-of-the-art digital solutions.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            { value: '6+', label: 'Happy Clients', icon: '🤝', delay: '0.1s', color: 'text-green-400', border: 'hover:border-green-500/50' },
            { value: '4', label: 'Industries Served', icon: '🏢', delay: '0.2s', color: 'text-teal-400', border: 'hover:border-teal-500/50' },
            { value: '100%', label: 'Satisfaction Rate', icon: '⭐', delay: '0.3s', color: 'text-cyan-400', border: 'hover:border-cyan-500/50' }
          ].map((stat, index) => (
            <div
              key={index}
              className={`glass-effect rounded-3xl p-8 border border-gray-800 hover:-translate-y-2 transition-all duration-500 ${stat.border} animate-fadeIn flex items-center space-x-6`}
              style={{ animationDelay: stat.delay, animationFillMode: 'both' }}
            >
              <div className="text-5xl">{stat.icon}</div>
              <div>
                <div className={`text-4xl font-extrabold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 font-medium uppercase tracking-wide text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map((client, index) => (
            <div
              key={client.id}
              className={`group relative glass-effect rounded-3xl p-8 border border-gray-800 transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden ${client.shadowColor} hover:shadow-2xl animate-fadeIn card-3d`}
              style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: 'both' }}
              onClick={() => handleClientClick(client.name, client.url)}
            >
              {/* Animated Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${client.color} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`}></div>

              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${client.color} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  {/* Logo Container */}
                  <div className={`w-20 h-20 rounded-2xl bg-gray-900/80 border border-gray-700/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${client.color} opacity-20`}></div>
                    <img 
                      src={client.logo} 
                    alt={`${client.name} logo`} 
                    className="relative z-10 w-16 h-16 object-contain drop-shadow-md"
                    />
                  </div>

                  {/* External Link Icon */}
                  <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-gray-700/80 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1 border border-gray-700/50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>

                {/* Industry Tags */}
                <div className="flex items-center space-x-2 mb-5">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gray-800/80 border border-gray-700 text-gray-300 group-hover:border-gray-500 transition-colors duration-300 flex items-center`}>
                    <span className={`w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${client.color}`}></span>
                    {client.industry}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                  {client.name}
                </h3>

                <p className="text-gray-400 mb-8 line-clamp-3 leading-relaxed flex-grow group-hover:text-gray-300 transition-colors duration-300">
                  {client.description}
                </p>

                {/* Footer / Location */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-800/80">
                  <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {client.location}
                  </div>

                  <div className="flex items-center text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-400 group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    Visit Site
                    <svg
                      className="w-4 h-4 ml-1 text-gray-500 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="max-w-5xl mx-auto mt-32 relative animate-fadeIn" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          {/* CTA Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-teal-500/20 to-cyan-500/20 rounded-[3rem] blur-xl opacity-50"></div>

          <div className="relative glass-effect rounded-[3rem] p-12 md:p-16 border border-gray-700/50 text-center overflow-hidden">
            {/* Inner background patterns */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-2xl"></div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Scale Together?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join our growing list of elite partners. Let&apos;s build something extraordinary that pushes the boundaries of digital innovation.
            </p>
            <Link
              to="/#contact"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gray-900 border border-gray-700 rounded-full hover:border-green-500/50 hover:bg-gray-800 hover:scale-105 overflow-hidden shadow-lg shadow-black/50"
              onClick={() => trackEvent('click', 'client_page', 'contact_cta')}
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-green-500"></span>
              <span className="relative flex items-center">
                Start a Conversation
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-16 text-center animate-fadeIn" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-full glass-effect border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-300 hover:-translate-y-1"
            onClick={() => trackEvent('click', 'client_page', 'back_to_home')}
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

export default Clients;
