import { motion } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  title: string;
  year: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    title: 'Vitalis',
    year: '2026',
    description: 'An AI-powered health application designed to assist users in tracking wellness goals. Hosted privately on a Proxmox cluster and securely accessed via Tailscale.',
    tags: ['AI/ML', 'HealthTech', 'Proxmox', 'Tailscale'],
    github: 'https://github.com/coltonhatfield/AI-Health-App/tree/main'
  },
  {
    title: 'Enterprise Cyber Range Infrastructure',
    year: '2026',
    description: 'Developed an Infrastructure as Code (IaC) cyber range on a bare-metal Proxmox hypervisor. Automated provisioning of target VMs, an OPNsense perimeter firewall, and secure Tailscale VPN tunneling using Terraform and Cloud-Init.',
    tags: ['Terraform', 'Proxmox', 'OPNsense', 'Tailscale'],
    github: 'https://github.com/coltonhatfield/proxmox-cyber-range-iac'
  },
  {
    title: 'Personal Portfolio Website',
    year: '2026',
    description: 'A modern, responsive portfolio website built with React, Vite, and Tailwind CSS. Features fully interactive components, fluid Framer Motion animations, and a Brutalist-inspired aesthetic to showcase projects and experience.',
    tags: ['React', 'Tailwind', 'Motion', 'TypeScript'],
    github: 'https://github.com/coltonhatfield/Colton-Hatfield-Personal-Website'
  },
  {
    title: 'Wazuh SIEM Deployment',
    year: '2026',
    description: 'Implemented and maintained a hybrid Wazuh SIEM infrastructure to actively monitor persistent environments and personal devices for threat detection and automated backups.',
    tags: ['Wazuh', 'SIEM', 'Security', 'Monitoring']
  },
  {
    title: 'Self-Hosted Homelab Infrastructure',
    year: '2025—2026',
    description: 'Configured a robust Proxmox virtualization environment hosting multiple VMs and a fleet of Dockerized applications (Immich, FreshRSS, AudioBooth). Features custom deployment of personal services alongside dedicated gaming infrastructure.',
    tags: ['Proxmox', 'Docker', 'Self-Hosting', 'Linux']
  },
  {
    title: 'Enterprise Active Directory Environment',
    year: '2025',
    description: 'Designed and implemented an enterprise Active Directory environment utilizing Windows Server and VMware Hypervisor for CNIT 242.',
    tags: ['Active Directory', 'Windows Server', 'VMware', 'Networking']
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
        <span className="font-mono text-[10px] text-[#666] uppercase tracking-widest">[01—{projects.length < 10 ? '0' : ''}{projects.length}]</span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#333] pt-8">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
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
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#666] hover:text-white transition-colors" aria-label="GitHub Repository">
                    <Github className="w-4 h-4" />
                    <span>View on GitHub</span>
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#666] hover:text-[#F0B800] transition-colors" aria-label="Live Project">
                    <span>Live Deployment</span>
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
