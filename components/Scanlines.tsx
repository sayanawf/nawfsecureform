import React from 'react';

export const Scanlines: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full">
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" 
        style={{ backgroundSize: '100% 4px, 6px 100%' }}
      />
      
      {/* Noise (simulated with grain) - Removed animate-pulse to stop blinking */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-white" />
    </div>
  );
};