import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col justify-center relative">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2 text-white font-sans font-black text-xs md:text-sm tracking-widest uppercase">
            <span>COLTON<span className="text-[#666] ml-1">v2.0</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-mono text-[10px] tracking-widest uppercase">
            <a href="#about" className="text-cyber-muted hover:text-purdue-gold transition-colors block border-b border-transparent hover:border-purdue-gold pb-1">/ About</a>
            <a href="#projects" className="text-cyber-muted hover:text-purdue-gold transition-colors block border-b border-transparent hover:border-purdue-gold pb-1">/ Projects</a>
            <a href="#contact" className="text-cyber-muted hover:text-purdue-gold transition-colors block border-b border-transparent hover:border-purdue-gold pb-1">/ Contact</a>
            <a 
              href="/resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              download="Colton_Hatfield_Resume.pdf"
              className="text-purdue-gold border border-purdue-gold px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:bg-purdue-gold hover:text-black transition-colors ml-4"
            >
              Resume
            </a>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-cyber-muted hover:text-purdue-gold transition-colors border border-cyber-line px-3 py-1 bg-[#111] font-mono text-[10px] uppercase tracking-widest"
          >
            {isOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-4 md:hidden flex flex-col bg-[#0D0D0D]/95 backdrop-blur-lg border border-[#333] p-6 shadow-2xl z-50"
          >
            <a href="#about" onClick={() => setIsOpen(false)} className="text-cyber-muted hover:text-purdue-gold transition-colors block border-b border-[#222] pb-4 mb-4 font-mono text-xs tracking-widest uppercase">/ About</a>
            <a href="#projects" onClick={() => setIsOpen(false)} className="text-cyber-muted hover:text-purdue-gold transition-colors block border-b border-[#222] pb-4 mb-4 font-mono text-xs tracking-widest uppercase">/ Projects</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="text-cyber-muted hover:text-purdue-gold transition-colors block font-mono text-xs tracking-widest uppercase">/ Contact</a>
            <a 
              href="/resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              download="Colton_Hatfield_Resume.pdf"
              onClick={() => setIsOpen(false)} 
              className="text-purdue-gold hover:text-black hover:bg-purdue-gold transition-colors block border border-purdue-gold p-3 text-center font-mono text-xs tracking-widest uppercase mt-6"
            >
              Download Resume
            </a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
