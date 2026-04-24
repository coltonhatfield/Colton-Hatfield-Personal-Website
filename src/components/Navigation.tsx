import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-1 left-1 right-1 sm:top-2 sm:left-2 sm:right-2 md:top-4 md:left-4 md:right-4 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0D0D0D]/90 backdrop-blur-md border border-[#333] py-4' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white font-sans font-black text-xs md:text-sm tracking-widest uppercase">
          <span>COLTON<span className="text-[#666] ml-1">v2.0</span></span>
        </div>
        
        <div className="hidden md:flex gap-8 font-mono text-[10px] tracking-widest uppercase">
          <a href="#about" className="text-cyber-muted hover:text-purdue-gold transition-colors block border-b border-transparent hover:border-purdue-gold pb-1">/ About</a>
          <a href="#projects" className="text-cyber-muted hover:text-purdue-gold transition-colors block border-b border-transparent hover:border-purdue-gold pb-1">/ Projects</a>
          <a href="#contact" className="text-cyber-muted hover:text-purdue-gold transition-colors block border-b border-transparent hover:border-purdue-gold pb-1">/ Contact</a>
        </div>

        <button className="md:hidden text-cyber-muted hover:text-purdue-gold transition-colors border border-cyber-line px-3 py-1 bg-[#111] font-mono text-[10px] uppercase tracking-widest">
          MENU
        </button>
      </div>
    </motion.nav>
  );
}
