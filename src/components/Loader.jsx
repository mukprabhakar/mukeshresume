import React, { useEffect, useState } from 'react';

const quotes = [
  "\"First, solve the problem. Then, write the code.\" — John Johnson",
  "\"Code is like humor. When you have to explain it, it's bad.\" — Cory House",
  "\"Simplicity is the soul of efficiency.\" — Austin Freeman",
  "\"Make it work, make it right, make it fast.\" — Kent Beck",
  "\"Clean code always looks like it was written by someone who cares.\" — Robert C. Martin",
  "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" — Martin Fowler",
  "\"Experience is the name everyone gives to their mistakes.\" — Oscar Wilde"
];

const Loader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick a random quote on mount
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Simulate loading progress
    const duration = 2500; // 2.5 seconds
    const interval = 20; // 20ms steps
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onLoadingComplete();
        }, 400); // Pause briefly at 100% before firing complete
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] text-white overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

      <div className="relative flex flex-col items-center z-10 w-full px-6">
        
        {/* Animated Image Container */}
        <div className="relative w-48 h-48 mb-10 mx-auto group flex items-center justify-center">
          {/* Outer Rotating Ring 1 */}
          <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-emerald-400 opacity-80 animate-spin" style={{ animationDuration: '2s' }}></div>
          
          {/* Inner Rotating Ring 2 (Reversed) */}
          <div className="absolute inset-2 rounded-full border-b-2 border-r-2 border-blue-500 opacity-80 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          
          {/* Image Wrapper */}
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-[6px] border-zinc-900 shadow-[0_0_40px_rgba(239,68,68,0.3)] z-10 isolate bg-zinc-900">
            {/* The Image! */}
            <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
            <img 
              src="https://res.cloudinary.com/dddmyjevn/image/upload/v1775017930/mukesh_russan_ambassi_mmnusg.jpg" 
              alt="Profile Loader"
              className="w-full h-full object-cover animate-scale-in"
              style={{ animationDuration: '1.5s' }}
            />
          </div>
        </div>

        {/* Dynamic Text Section */}
        <div className="h-8 mb-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent animate-shimmer">
              Authenticating
            </span>
            <span className="inline-block animate-pulse text-emerald-400">...</span>
          </h2>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-sm h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          {/* Progress Bar Fill */}
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-75 ease-linear relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer inside progress bar */}
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 w-8 blur-sm animate-pulse" style={{ transform: 'skewX(-20deg)' }}></div>
          </div>
        </div>

        {/* Futuristic Status Labels */}
        <div className="flex justify-between w-full max-w-sm px-1 text-[10px] sm:text-xs font-mono text-zinc-500 tracking-widest uppercase mb-8">
          <div>SYS.INIT</div>
          <div className="text-emerald-400 font-bold">{Math.floor(progress)}%</div>
          <div>NET.STATUS: <span className="text-blue-400">OK</span></div>
        </div>

        {/* Developer Quote Section */}
        <div className="mt-4 max-w-md text-center h-16 animate-fade-in px-4">
          <p className="text-sm italic text-zinc-400 opacity-80 leading-relaxed font-mono">
            {quote}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Loader;
