import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Github, FileText, Copy, Check } from 'lucide-react';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('coltonrhatfield@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="pt-24 mt-[-6rem]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border border-[#333] bg-[#111] p-8 md:p-16 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic text-white mb-6 tracking-tighter">
              Get in Touch
            </h2>
            <p className="font-sans text-sm text-[#888] leading-relaxed">
              Currently seeking internship opportunities for Summer 2026. Whether it's a full-time role, freelance project, or just looking to connect, my inbox is open.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex w-full items-stretch border border-[#333] bg-[#0D0D0D] hover:border-[#F0B800] transition-colors group">
              <a href="mailto:coltonrhatfield@gmail.com" className="flex-1 flex items-center gap-4 px-4 md:px-6 py-4 overflow-hidden hover:bg-[#111] transition-colors" title="Send Mail">
                <Mail className="w-5 h-5 shrink-0 text-[#F0B800]" />
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[#E0E0E0] group-hover:text-white truncate block">coltonrhatfield@gmail.com</span>
              </a>
              <div className="w-[1px] bg-[#333] group-hover:bg-[#F0B800] transition-colors my-2"></div>
              <button 
                onClick={handleCopy}
                className="flex items-center justify-center px-4 md:px-6 shrink-0 hover:bg-[#111] hover:text-[#F0B800] transition-colors text-[#666]"
                title="Copy Email"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <a href="https://www.linkedin.com/in/colton-hatfield-299072332/" target="_blank" rel="noopener noreferrer" className="relative flex flex-col items-center justify-center py-5 px-2 bg-[#0D0D0D] border border-[#333] hover:border-[#F0B800] hover:bg-[#F0B800]/5 transition-all text-[#666] group h-[100px]">
                <Linkedin className="w-6 h-6 mb-2 text-white group-hover:text-[#F0B800] group-hover:-translate-y-1 transition-all" />
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white group-hover:text-[#F0B800] transition-colors">LinkedIn</span>
                <span className="font-mono text-[8px] uppercase tracking-widest mt-1 transition-colors flex items-center gap-1 text-white group-hover:text-[#F0B800] absolute bottom-3">Visit ↗</span>
              </a>
              <a href="https://github.com/coltonhatfield" target="_blank" rel="noopener noreferrer" className="relative flex flex-col items-center justify-center py-5 px-2 bg-[#0D0D0D] border border-[#333] hover:border-[#F0B800] hover:bg-[#F0B800]/5 transition-all text-[#666] group h-[100px]">
                <Github className="w-6 h-6 mb-2 text-white group-hover:text-[#F0B800] group-hover:-translate-y-1 transition-all" />
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white group-hover:text-[#F0B800] transition-colors">Github</span>
                <span className="font-mono text-[8px] uppercase tracking-widest mt-1 transition-colors flex items-center gap-1 text-white group-hover:text-[#F0B800] absolute bottom-3">Visit ↗</span>
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download="Colton_Hatfield_Resume.pdf" className="relative flex flex-col items-center justify-center py-5 px-2 bg-[#0D0D0D] border border-[#333] hover:border-[#F0B800] hover:bg-[#F0B800]/5 transition-all text-[#666] group h-[100px]">
                <FileText className="w-6 h-6 mb-2 text-white group-hover:text-[#F0B800] group-hover:-translate-y-1 transition-all" />
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white group-hover:text-[#F0B800] transition-colors">Resume</span>
                <span className="font-mono text-[8px] uppercase tracking-widest mt-1 transition-colors flex items-center gap-1 text-white group-hover:text-[#F0B800] absolute bottom-3">View ↗</span>
              </a>
            </div>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
