import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import Markdown from 'react-markdown';
import { projects } from '../data/projects';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center pt-32">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-[#F0B800]">Project Not Found</h2>
        <p className="text-[#888] font-sans mb-8">The project you are looking for does not exist or has been moved.</p>
        <Link to="/" className="border border-[#F0B800] px-6 py-2 font-mono text-sm tracking-widest uppercase text-[#F0B800] hover:bg-[#F0B800] hover:text-black transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto pt-16 md:pt-24 relative z-10"
    >
      <Link to="/#projects" className="inline-flex items-center gap-2 text-cyber-muted hover:text-purdue-gold transition-colors font-mono text-sm tracking-widest uppercase mb-12">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      <div className="flex items-center gap-4 mb-4">
        <span className="font-mono text-sm text-[#F0B800] tracking-widest">[{project.year}]</span>
        <div className="flex gap-2 flex-wrap">
          {project.tags.map(tag => (
            <span key={tag} className="text-[10px] border border-[#333] px-2 py-1 uppercase font-mono tracking-widest text-[#E0E0E0] bg-[#111]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
        {project.title}
      </h1>

      <div className="mb-12 border-l-2 border-[#333] pl-6 md:pl-8">
        <p className="text-lg md:text-xl text-white font-medium mb-6 font-sans">
          {project.description}
        </p>
        
        {project.longDescription && (
          <div className="prose prose-invert prose-p:text-[#A0A0A0] prose-p:leading-relaxed prose-headings:text-white prose-a:text-[#F0B800] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-[#F0B800] max-w-none font-sans">
            <Markdown>{project.longDescription}</Markdown>
          </div>
        )}

      </div>

      <div className="flex gap-6 border-t border-[#333] pt-8">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono tracking-widest uppercase text-white hover:text-[#F0B800] transition-colors border border-[#333] hover:border-[#F0B800] px-6 py-3 bg-[#111]">
            <Github className="w-5 h-5" />
            <span>View Source</span>
          </a>
        )}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono tracking-widest uppercase text-white hover:text-[#F0B800] transition-colors border border-[#333] hover:border-[#F0B800] px-6 py-3 bg-[#111]">
            <span>Live Project</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
