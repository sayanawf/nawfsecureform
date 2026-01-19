import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const GridBackground: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      // Animate the grid moving "forward"
      gsap.to(gridRef.current, {
        backgroundPosition: '0px 100px',
        ease: 'none',
        duration: 2,
        repeat: -1,
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none perspective-1000">
      <div 
        ref={gridRef}
        className="absolute inset-[-100%] w-[300%] h-[300%] origin-center transform-gpu rotate-x-60 opacity-20"
        style={{
          backgroundSize: '50px 50px',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 243, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 243, 255, 0.2) 1px, transparent 1px)
          `,
          transform: 'rotateX(45deg) scale(1.5)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/80 to-transparent" />
    </div>
  );
};