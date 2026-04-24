import { useEffect, useState } from 'react';

export default function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0D0D0D]">
      {/* Static dim grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '50% 50%'
        }}
      />
      
      {/* Interactive bright grid mask */}
      <div 
        className="absolute inset-0 opacity-[0.05] transition-opacity duration-100 ease-out"
        style={{
          backgroundImage: 'linear-gradient(#F0B800 1px, transparent 1px), linear-gradient(90deg, #F0B800 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '50% 50%',
          WebkitMaskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          maskImage: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
        }}
      />
      
      {/* Subtle cursor glow */}
      <div
        className="absolute inset-0 opacity-[0.03] transition-opacity duration-100 ease-out"
        style={{
          background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, #F0B800, transparent)`
        }}
      />

      {/* Cyber noise overlay */}
      <div 
        className="absolute inset-0 mix-blend-overlay opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
