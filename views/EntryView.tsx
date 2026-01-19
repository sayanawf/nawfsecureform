import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ShieldAlert, ChevronDown, Check, Lock, Terminal } from 'lucide-react';
import { GlitchText } from '../components/GlitchText';
import { UserData } from '../types';

interface EntryViewProps {
  onSubmit: (data: UserData) => void;
}

export const EntryView: React.FC<EntryViewProps> = ({ onSubmit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const [name, setName] = useState('');
  const [hasReadDisclaimer, setHasReadDisclaimer] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [scrolledPercent, setScrolledPercent] = useState(0);

  // Intro Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".cyber-panel", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      })
      .from(".cyber-input-group", {
        x: -20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.5")
      .from(".disclaimer-container", {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "top",
        duration: 0.8,
        ease: "circ.out",
      }, "-=0.3");

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Handle Scroll Progress
  const handleScroll = () => {
    if (disclaimerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = disclaimerRef.current;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrolledPercent(progress);
      
      // Update progress bar visual
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          height: `${progress * 100}%`,
          duration: 0.1,
          ease: "none"
        });
      }

      // Unlock if near bottom
      if (progress > 0.95 && !hasReadDisclaimer) {
        setHasReadDisclaimer(true);
      }
    }
  };

  useEffect(() => {
    setCanSubmit(name.length > 2 && hasReadDisclaimer);
  }, [name, hasReadDisclaimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      // Exit animation
      const ctx = gsap.context(() => {
        gsap.to(containerRef.current, {
          scale: 0.95,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.8,
          ease: "power4.in",
          onComplete: () => onSubmit({ name, acceptedDisclaimer: true })
        });
      }, containerRef);
    }
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 items-stretch h-full md:h-[600px]">
      
      {/* Left Column: Identity */}
      <div className="cyber-panel flex-1 bg-cyber-panel/80 backdrop-blur-md border border-cyber-primary/30 p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-primary" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-primary" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-primary" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-primary" />
        
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyber-primary mb-6">
              <Terminal size={20} />
              <h2 className="font-mono text-sm tracking-[0.2em] uppercase opacity-70">NAWF Identity Access</h2>
            </div>

            <div className="cyber-input-group space-y-2 mb-8">
              <label htmlFor="name" className="block font-mono text-xs text-cyber-secondary uppercase tracking-widest">
                Visitor Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ENTER FULL NAME..."
                className="w-full bg-cyber-dark/50 border-b-2 border-cyber-primary/20 focus:border-cyber-primary text-cyber-text font-sans text-2xl py-2 px-1 outline-none transition-colors placeholder-white/10"
              />
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                <div className={`w-3 h-3 rounded-full ${name.length > 2 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-900'}`} />
                <span>NAME_VALIDATION</span>
             </div>
             <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                <div className={`w-3 h-3 rounded-full ${hasReadDisclaimer ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-900'}`} />
                <span>NDA_ACKNOWLEDGEMENT</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column: Disclaimer */}
      <div className="cyber-panel flex-1 bg-cyber-panel/80 backdrop-blur-md border border-cyber-secondary/30 relative flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-cyber-secondary/20 bg-cyber-secondary/5 flex justify-between items-center">
          <div className="flex items-center gap-2 text-cyber-secondary">
            <ShieldAlert size={18} />
            <span className="font-mono text-xs tracking-widest">LEGAL PROTOCOLS</span>
          </div>
          <div className="font-mono text-xs text-cyber-secondary/70">
            {Math.round(scrolledPercent * 100)}% READ
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-hidden">
           {/* Scroll Progress Indicator Line */}
           <div className="absolute right-0 top-0 w-1 h-full bg-cyber-dark z-20">
              <div ref={progressBarRef} className="w-full bg-cyber-secondary shadow-[0_0_10px_#bc13fe] h-0" />
           </div>

           <div 
            ref={disclaimerRef}
            onScroll={handleScroll}
            className="absolute inset-0 p-6 overflow-y-auto cyber-scrollbar font-mono text-xs leading-relaxed text-gray-400 text-justify"
           >
             <div className="disclaimer-container space-y-4 pb-12">
               <GlitchText as="h3" text="NAWF // NON-DISCLOSURE AGREEMENT" className="text-white text-lg font-bold mb-4 block" />
               
               <p>
                 The contents of this document including but not limited to ideas, concepts, techniques, slogans, tag-lines, designs, strategies are the property of Nawf and its affiliates with the exception of any rights-based content sourced from third parties.
               </p>
               <p>
                 It must not be reproduced, transmitted, disclosed in whole or in part, or stored in a retrieval system or transmitted in any form or by any means, electronic or mechanical including photocopying and recording or otherwise for any purpose other than under the executed non disclosure agreement (NDA) or under any mutually executed agreement or with the prior written consent from Nawf and its affiliates.
               </p>
               <p>
                 If you do not accept these terms, please do not view or access the contents of this document any further.
               </p>
               <p>
                 Non-compliance of the same will incur necessary legal action and penalties.
               </p>

               <p className="text-cyber-primary mt-6">
                 &gt;&gt; SCROLL TO BOTTOM TO CONFIRM ACKNOWLEDGEMENT
               </p>
               <div className="h-8"></div>
             </div>
           </div>
           
           {/* Scroll Hint Overlay (fades out when scrolled) */}
           <div 
             className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cyber-panel to-transparent pointer-events-none transition-opacity duration-500 flex justify-center items-end pb-4 ${hasReadDisclaimer ? 'opacity-0' : 'opacity-100'}`}
           >
             <ChevronDown className="text-cyber-secondary animate-bounce" />
           </div>
        </div>

        {/* Footer / Submit */}
        <div className="p-4 border-t border-cyber-secondary/20 bg-cyber-dark/50">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              w-full py-4 px-6 font-sans text-xl font-bold tracking-widest transition-all duration-300 relative overflow-hidden group
              ${canSubmit 
                ? 'bg-cyber-primary/10 hover:bg-cyber-primary/20 text-cyber-primary border border-cyber-primary shadow-[0_0_20px_rgba(0,243,255,0.2)]' 
                : 'bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed grayscale'}
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {canSubmit ? (
                <>
                  <Lock className="w-4 h-4" />
                  ACCEPT & ENTER
                </>
              ) : (
                <>
                  READ_FULL_DISCLAIMER
                </>
              )}
            </span>
            {canSubmit && (
              <div className="absolute inset-0 bg-cyber-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};