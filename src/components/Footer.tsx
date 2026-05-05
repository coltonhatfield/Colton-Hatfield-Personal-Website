import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#333] max-w-6xl w-full mx-auto px-6 sm:px-12 py-12 text-center flex flex-col md:flex-row justify-between items-center gap-8 text-[#E0E0E0] relative z-10 mt-12 mb-8 bg-[#0D0D0D]/80 backdrop-blur-sm border-x border-[#333] border-b">
      <div className="flex flex-col items-center md:items-start tracking-widest space-y-4">
        <p className="text-[10px] sm:text-xs font-mono uppercase text-[#E0E0E0]">
          © {new Date().getFullYear()} Colton Hatfield. Built for Web.
        </p>
        <span className="text-[10px] sm:text-xs font-mono text-[#E0E0E0] uppercase">
          <a href="mailto:coltonrhatfield@gmail.com" className="hover:text-white transition-colors">coltonrhatfield@gmail.com</a>
        </span>
      </div>

      <button 
        onClick={scrollToTop}
        className="group flex flex-col items-center gap-2 text-[#E0E0E0] hover:text-[#F0B800] transition-colors"
      >
        <div className="p-3 border border-[#333] group-hover:border-[#F0B800] transition-colors rounded-none bg-[#111]">
          <ArrowUp size={16} />
        </div>
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest">Back to Top</span>
      </button>
    </footer>
  );
}
