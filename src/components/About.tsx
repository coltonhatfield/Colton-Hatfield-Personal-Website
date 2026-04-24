import { motion } from 'motion/react';
import { Database, Shield, Monitor, Network } from 'lucide-react';

const skills = [
  {
    category: 'Security Operations',
    icon: <Shield className="w-5 h-5 text-cyber-accent" />,
    items: ['Digital Forensics', 'Incident Response', 'Wazuh SIEM', 'Vulnerability Analysis']
  },
  {
    category: 'Infrastructure',
    icon: <Network className="w-5 h-5 text-purdue-gold" />,
    items: ['Proxmox & Docker', 'Oracle Cloud', 'Linux & Windows Server', 'Active Directory']
  },
  {
    category: 'Development',
    icon: <Monitor className="w-5 h-5 text-cyber-text" />,
    items: ['Java (3+ Yrs)', 'Python', 'C / C++', 'Bash Scripting']
  },
  {
    category: 'Systems & Networking',
    icon: <Database className="w-5 h-5 text-zinc-400" />,
    items: ['Network Administration', 'System Architecture', 'SQL', 'Self-Hosted Services']
  }
];

export default function About() {
  return (
    <section id="about" className="pt-24 mt-[-6rem]">
      <div className="flex flex-col md:flex-row gap-16">
        
        <div className="md:w-1/3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sticky top-32"
          >
            <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">Skills & Background</h2>
            <div className="h-px w-full bg-[#333] mb-8"></div>
            <p className="font-mono text-sm text-[#888] leading-relaxed mb-6">
              I am a sophomore at Purdue University double majoring in Cybersecurity and INET (Information Technology). 
              Passionate about offensive operations, secure architecture, and solving complex infrastructure problems.
            </p>
            <div className="font-mono text-xs uppercase tracking-widest text-[#E0E0E0] mt-12 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[#F0B800] mb-1">Status</span>
                <span className="text-white">Available</span>
              </div>
              <div>
                <span className="block text-[#F0B800] mb-1">LOCATION</span>
                <span className="text-white">San Clemente, CA</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((skillGroup, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-[#111] border border-[#333] p-6 hover:border-[#F0B800] transition-colors"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#333]">
                  {skillGroup.icon}
                  <h3 className="text-sm font-bold uppercase tracking-wide">{skillGroup.category}</h3>
                </div>
                <ul className="space-y-3">
                  {skillGroup.items.map((item, i) => (
                    <li key={i} className="text-[#888] text-sm flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-[#F0B800] shrink-0"></div>
                      <span className="font-sans font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
