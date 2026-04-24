import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center pt-10" id="hero">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 pt-10">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-purdue-gold mb-4"
          >
            / / STUDENT PORTFOLIO V2.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="font-sans font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter leading-none text-white uppercase"
          >
            <div className="overflow-hidden">
              <motion.span className="block" initial={{ y: 200 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>COLTON</motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span className="block" initial={{ y: 200 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>HATFIELD</motion.span>
            </div>
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-left md:text-right"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666]">Major</p>
          <p className="text-xl md:text-2xl font-bold italic font-serif mt-1">Cybersecurity & INET</p>
          <p className="text-sm text-purdue-gold tracking-tighter uppercase font-bold mt-1">Purdue University '28</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-8 border-t border-b border-cyber-line py-8"
      >
        <div className="border border-[#333] p-6 bg-[#111] relative group hover:border-[#F0B800] transition-colors">
          <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Systems Overview</h3>
          <p className="text-sm text-[#888] leading-relaxed">Architecting resilient networks, enforcing rigorous system hardening, and engineering secure infrastructure from the ground up.</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="mt-12 flex gap-8 justify-start items-center"
      >
        <a href="#projects" className="text-xs font-mono uppercase tracking-widest border-b border-transparent hover:border-[#F0B800] transition-all text-white pb-1 flex items-center group">
          VIEW PROJECTS
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
        <a href="#contact" className="bg-[#F0B800] text-black px-6 py-2 text-xs font-black uppercase tracking-tighter hover:bg-white transition-colors">
          Get In Touch
        </a>
      </motion.div>
    </section>
  );
}
