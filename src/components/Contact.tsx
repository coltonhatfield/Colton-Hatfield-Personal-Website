import { motion } from 'motion/react';
import { Mail, Linkedin, Github, FileText } from 'lucide-react';

export default function Contact() {
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
              Establish Connection
            </h2>
            <p className="font-sans text-sm text-[#888] leading-relaxed">
              Currently seeking internship opportunities for Summer 2026. Whether it's a full-time role, freelance project, or just establishing communication protocols, my inbox is open.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <a href="mailto:coltonrhatfield@gmail.com" className="group relative flex items-center justify-between gap-8 bg-[#0D0D0D] px-6 py-4 border border-[#333] hover:border-[#F0B800] transition-all duration-300">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-[#F0B800]" />
                <span className="font-mono text-xs uppercase tracking-widest text-white">coltonrhatfield@gmail.com</span>
              </div>
              <span className="font-mono text-[10px] text-[#666] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Send Mail</span>
            </a>

            <div className="grid grid-cols-3 gap-4">
              <a href="https://www.linkedin.com/in/colton-hatfield-299072332/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#0D0D0D] border border-[#333] hover:border-[#F0B800] hover:text-[#F0B800] transition-colors text-[#666] group">
                <Linkedin className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[9px] uppercase tracking-widest">LinkedIn</span>
              </a>
              <a href="https://github.com/coltonhatfield" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#0D0D0D] border border-[#333] hover:border-[#F0B800] hover:text-[#F0B800] transition-colors text-[#666] group">
                <Github className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[9px] uppercase tracking-widest">Github</span>
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-[#0D0D0D] border border-[#333] hover:border-[#F0B800] hover:text-[#F0B800] transition-colors text-[#666] group">
                <FileText className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[9px] uppercase tracking-widest">Resume</span>
              </a>
            </div>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
