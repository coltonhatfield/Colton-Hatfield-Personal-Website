import { motion } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Vitalis',
    year: '2024',
    description: 'An AI-powered health application designed to assist users in tracking wellness goals, integrating intelligent data analysis for personalized insights.',
    tags: ['AI/ML', 'HealthTech', 'Python', 'Web'],
    link: '#',
    github: 'https://github.com/coltonhatfield'
  },
  {
    title: 'Wazuh SIEM Deployment',
    year: '2025',
    description: 'Implemented and maintained a hybrid Wazuh SIEM infrastructure to actively monitor persistent environments and personal devices for threat detection and automated backups.',
    tags: ['Wazuh', 'SIEM', 'Security', 'Monitoring'],
    link: '#',
    github: 'https://github.com/coltonhatfield'
  },
  {
    title: 'Self-Hosted Environment',
    year: '2024',
    description: 'Deployed and maintained various Dockerized applications including Immich, FreshRSS, and AudioBooth on personal infrastructure for robust self-hosted services.',
    tags: ['Docker', 'Linux', 'Self-Hosting', 'Containers'],
    link: '#',
    github: 'https://github.com/coltonhatfield'
  },
  {
    title: 'Proxmox VM Cluster',
    year: '2024',
    description: 'Configured a powerful Proxmox virtualization environment hosting multiple VMs. Provisioned a dedicated gaming infrastructure including a custom Minecraft server.',
    tags: ['Proxmox', 'VMs', 'Networking', 'Infrastructure'],
    link: '#',
    github: 'https://github.com/coltonhatfield'
  }
];

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
        <span className="font-mono text-[10px] text-[#666] uppercase tracking-widest">[01—04]</span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#333] pt-8">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`group relative border border-[#333] p-6 bg-[#111] hover:border-[#F0B800] transition-colors flex flex-col justify-between ${idx === 2 ? 'md:col-span-2' : ''}`}
          >
            <div>
              <span className="absolute top-4 right-4 font-mono text-[10px] text-[#666] tracking-widest">[{project.year}]</span>
              <h3 className="text-xl font-bold mb-4 uppercase text-white group-hover:text-[#F0B800] transition-colors pr-12">
                {project.title}
              </h3>
              <p className="text-sm text-[#888] leading-relaxed mb-6 font-sans">
                {project.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              <div className="flex gap-2 flex-wrap">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[9px] border border-[#333] px-2 py-1 uppercase font-mono tracking-widest text-[#E0E0E0]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.github && (
                  <a href={project.github} className="text-[#666] hover:text-white transition-colors" aria-label="GitHub Repository">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.link && (
                  <a href={project.link} className="text-[#666] hover:text-[#F0B800] transition-colors" aria-label="Live Project">
                    <ExternalLink className="w-4 h-4" />
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
