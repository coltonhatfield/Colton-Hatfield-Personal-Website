import { motion } from 'motion/react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <section id="projects" className="pt-24 mt-[-6rem]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 flex items-end justify-between"
      >
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Featured Projects</h2>
        <span className="h-px bg-[#333] flex-grow mx-4 mb-2 hidden md:block"></span>
        <span className="font-mono text-[10px] text-[#666] uppercase tracking-widest">[01—{projects.length < 10 ? '0' : ''}{projects.length}]</span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#333] pt-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`group relative border border-[#333] p-6 bg-[#111] hover:border-[#F0B800] transition-colors flex flex-col justify-between`}
          >
            <div>
              <span className="absolute top-4 right-4 font-mono text-[10px] text-[#666] tracking-widest">[{project.year}]</span>
              <h3 className="text-xl font-bold mb-4 uppercase text-white group-hover:text-[#F0B800] transition-colors pr-12">
                {project.title}
              </h3>
              <p className="text-sm text-[#888] leading-relaxed mb-6 font-sans line-clamp-3">
                {project.description}
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-auto">
              <div className="flex gap-2 flex-wrap">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[9px] border border-[#333] px-2 py-1 uppercase font-mono tracking-widest text-[#E0E0E0]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-row gap-2 mt-4 lg:mt-0 lg:ml-auto shrink-0 w-full lg:w-auto">
                <Link to={`/project/${project.id}`} className="flex-1 lg:flex-none flex justify-center items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-black bg-[#F0B800] hover:bg-white transition-colors px-2 py-2" aria-label="View Project Details">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1 lg:flex-none flex justify-center items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#E0E0E0] border border-[#333] hover:border-[#F0B800] hover:text-[#F0B800] transition-colors px-2 py-2" aria-label="GitHub Repository">
                    <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>View on GitHub</span>
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1 lg:flex-none flex justify-center items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#E0E0E0] border border-[#333] hover:border-[#F0B800] hover:text-[#F0B800] transition-colors px-2 py-2" aria-label="Live Project">
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
