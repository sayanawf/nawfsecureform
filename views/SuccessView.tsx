import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { UserData } from '../types';
import { GlitchText } from '../components/GlitchText';
import { CheckCircle, Globe, ArrowRight } from 'lucide-react';

interface SuccessViewProps {
  userData: UserData;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ userData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial Burst
      tl.set(containerRef.current, { opacity: 1 })
        .from(".success-text", {
          scale: 2,
          opacity: 0,
          filter: "blur(20px)",
          duration: 1.5,
          stagger: 0.2,
          ease: "expo.out",
        })
        .to(circleRef.current, {
          scale: 50,
          opacity: 0,
          duration: 2,
          ease: "power2.inOut",
        }, "-=1")
        .from(".redirect-panel", {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.7)",
        }, "-=0.5");

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleRedirect = () => {
    window.location.href = 'https://farmleypitchbynawf.netlify.app';
  };

  return (
    <div ref={containerRef} className="relative z-20 w-full h-screen flex flex-col items-center justify-center overflow-hidden opacity-0">
      
      {/* Explosive Circle Animation Element */}
      <div 
        ref={circleRef} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyber-primary rounded-full blur-sm z-0 pointer-events-none" 
      />

      <div className="z-10 text-center space-y-6">
        <div className="success-text text-cyber-primary mb-2">
          <CheckCircle size={80} className="mx-auto animate-pulse" />
        </div>
        
        <h1 className="success-text font-sans text-6xl md:text-8xl font-bold text-white tracking-tighter uppercase">
          Authorization Verified
        </h1>
        
        <div className="success-text font-mono text-xl text-cyber-secondary tracking-[0.5em]">
          WELCOME {userData.name.toUpperCase()}
        </div>

        <div className="redirect-panel mt-16 p-8 border border-white/10 bg-black/40 backdrop-blur-xl rounded-lg max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4 text-left">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Globe className="text-blue-400" />
            </div>
            <div>
              <div className="text-xs font-mono text-gray-500 uppercase">Destination</div>
              <div className="text-lg font-sans font-semibold text-blue-100">Farmley's Teaser Proposal</div>
            </div>
          </div>
          
          <button 
            onClick={handleRedirect}
            className="w-full group relative flex items-center justify-between px-6 py-4 bg-white text-black font-bold font-mono overflow-hidden transition-all hover:bg-cyber-primary hover:text-black"
          >
            <span className="relative z-10">PROCEED TO DECK</span>
            <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};