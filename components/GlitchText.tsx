import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  trigger?: boolean;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className = "", 
  as: Component = 'span',
  trigger = true 
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

  useEffect(() => {
    if (!trigger || !elementRef.current) return;

    const originalText = text;
    let iteration = 0;
    
    const interval = setInterval(() => {
      if (!elementRef.current) return;

      elementRef.current.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      
      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return (
    <Component ref={elementRef} className={`${className} font-mono tracking-wider`}>
      {text}
    </Component>
  );
};