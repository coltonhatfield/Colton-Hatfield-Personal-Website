import { motion } from 'motion/react';
import { Database, Shield, Monitor, Network, Award, Briefcase, Users, GraduationCap } from 'lucide-react';

const skills = [
  {
    category: 'Security Operations & Threat Intel',
    icon: <Shield className="w-5 h-5 text-cyber-accent" />,
    items: [
      'Wazuh SIEM Engineering & Alert Triage',
      'Log Analysis (Sysmon, Windows Event Logs)',
      'Cowrie Honeypots & IoC Extraction',
      'Incident Response & MITRE ATT&CK Mapping'
    ]
  },
  {
    category: 'Infrastructure & Cloud',
    icon: <Network className="w-5 h-5 text-purdue-gold" />,
    items: [
      'Proxmox Virtualization & Docker',
      'Terraform (IaC) & Automated Provisioning',
      'VMware & Active Directory Domain Services',
      'Linux & Windows Server Administration'
    ]
  },
  {
    category: 'Networking & Routing',
    icon: <Database className="w-5 h-5 text-zinc-400" />,
    items: [
      'OPNsense Firewalls & Network Isolation',
      'Tailscale Zero-Trust VPN Tunneling',
      'Cisco-based Enterprise Networks',
      'Network Administration & Protocol Analysis'
    ]
  },
  {
    category: 'Development & Systems Admin',
    icon: <Monitor className="w-5 h-5 text-cyber-text" />,
    items: [
      'Java (3+ years), Python, C',
      'Bash Scripting & SQL Querying',
      'FastAPI, React, Grafana & InfluxDB',
      'Linux Command-Line Utilities & Diagnostics'
    ]
  }
];

const coursework = [
  'Cybersecurity Fundamentals (I & II)',
  'Digital Forensics',
  'Cyber Criminology',
  'Network Administration',
  'Internetwork Design & Implementation',
  'System & UNIX Administration',
  'Systems Programming',
  'Database Fundamentals',
  'Systems Analysis & Design'
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
            <p className="font-mono text-sm text-[#A3A3A3] leading-relaxed mb-4">
              Studying Cybersecurity & Computing Infrastructure and Network Engineering Technology (INET) at Purdue University (Expected May 2028).
            </p>
            <p className="font-mono text-sm text-[#A3A3A3] leading-relaxed mb-6">
              IT Technician at Purdue IT, resolving high-volume technical issues across campus facilities, monitoring endpoint workstation health, and maintaining secure enterprise computing environments.
            </p>

            <div className="bg-[#111] border border-[#333] p-4 mb-6 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#222]">
                <span className="text-[#A3A3A3]">ACADEMIC GPA</span>
                <span className="text-white font-bold">3.46</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A3A3A3]">HONORS</span>
                <span className="text-[#F0B800] text-right font-medium text-[11px]">Dean's List (2024 - 2025)</span>
              </div>
            </div>

            <div className="font-mono text-xs uppercase tracking-widest text-[#E0E0E0] mt-8 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[#F0B800] mb-1">ROLE</span>
                <span className="text-white">IT Technician</span>
              </div>
              <div>
                <span className="block text-[#F0B800] mb-1">LOCATION</span>
                <span className="text-white">West Lafayette, IN</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#222]">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-widest text-[#A3A3A3]">
                <GraduationCap className="w-4 h-4 text-[#F0B800]" />
                <span>Relevant Coursework</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {coursework.map((course, idx) => (
                  <span key={idx} className="text-[10px] font-mono bg-[#111] border border-[#262626] px-2 py-0.5 text-[#A3A3A3]">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="md:w-2/3 space-y-8">
          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#111] border border-[#333] p-6 hover:border-[#F0B800] transition-colors"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#333]">
              <Briefcase className="w-5 h-5 text-[#F0B800]" />
              <h3 className="text-sm font-bold uppercase tracking-wide">Work Experience</h3>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <div>
                  <div className="font-sans font-bold text-[#E0E0E0] text-lg">Purdue IT</div>
                  <div className="font-mono text-sm text-[#F0B800] uppercase tracking-wide">IT Technician</div>
                </div>
                <div className="font-mono text-xs text-[#A3A3A3] sm:text-right mt-1">
                  <div className="text-white font-medium">August 2026 – Present</div>
                  <div>West Lafayette, IN</div>
                </div>
              </div>
              <ul className="space-y-3 mt-4">
                <li className="text-[#A3A3A3] text-sm flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#F0B800] shrink-0 mt-2"></div>
                  <span className="leading-relaxed">Provided Tier 1 technical support for users across high-traffic facilities, resolving hardware, software, and peripheral issues.</span>
                </li>
                <li className="text-[#A3A3A3] text-sm flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#F0B800] shrink-0 mt-2"></div>
                  <span className="leading-relaxed">Monitored endpoint health across hundreds of workstations using internal dashboards to diagnose and restore offline systems.</span>
                </li>
                <li className="text-[#A3A3A3] text-sm flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#F0B800] shrink-0 mt-2"></div>
                  <span className="leading-relaxed">Managed hardware outages and escalated network failures using a ticketing system to ensure accurate incident tracking.</span>
                </li>
                <li className="text-[#A3A3A3] text-sm flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#F0B800] shrink-0 mt-2"></div>
                  <span className="leading-relaxed">Troubleshot high-volume network printers and conducted routine hardware audits to maintain continuous IT asset availability.</span>
                </li>
                <li className="text-[#A3A3A3] text-sm flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#F0B800] shrink-0 mt-2"></div>
                  <span className="leading-relaxed">Audited technical inventories and enforced physical access controls to maintain secure computing environments across campus.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Certifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#111] border border-[#333] p-6 hover:border-[#F0B800] transition-colors"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#333]">
              <Award className="w-5 h-5 text-[#F0B800]" />
              <h3 className="text-sm font-bold uppercase tracking-wide">Certifications</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="flex items-start gap-3 p-3 bg-[#0D0D0D] border border-[#222]">
                <div className="mt-2 w-1.5 h-1.5 bg-[#F0B800] shrink-0"></div>
                <div>
                  <div className="font-sans font-medium text-[#E0E0E0] text-sm">CompTIA Security+ Certificate</div>
                  <div className="font-mono text-xs text-[#A3A3A3] mt-0.5">Completed</div>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-[#0D0D0D] border border-[#222]">
                <div className="mt-2 w-1.5 h-1.5 bg-[#F0B800] shrink-0"></div>
                <div>
                  <div className="font-sans font-medium text-[#E0E0E0] text-sm">TCM Security Practical SOC Analyst</div>
                  <div className="font-mono text-xs text-[#A3A3A3] mt-0.5">Completed</div>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-[#0D0D0D] border border-[#222]">
                <div className="mt-2 w-1.5 h-1.5 bg-[#F0B800] shrink-0"></div>
                <div>
                  <div className="font-sans font-medium text-[#E0E0E0] text-sm">Google Cybersecurity Professional</div>
                  <div className="font-mono text-xs text-[#A3A3A3] mt-0.5">Completed</div>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-[#0D0D0D] border border-[#222]">
                <div className="mt-2 w-1.5 h-1.5 border border-[#F0B800] shrink-0"></div>
                <div>
                  <div className="font-sans font-medium text-[#E0E0E0] text-sm">TCM Practical Malware Research</div>
                  <div className="font-mono text-xs text-[#F0B800] mt-0.5">In Progress</div>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Leadership & Extracurriculars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#111] border border-[#333] p-6 hover:border-[#F0B800] transition-colors"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#333]">
              <Users className="w-5 h-5 text-[#F0B800]" />
              <h3 className="text-sm font-bold uppercase tracking-wide">Leadership & Extracurriculars</h3>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <div>
                  <div className="font-sans font-bold text-[#E0E0E0] text-lg">Purdue Men's Club Volleyball</div>
                  <div className="font-mono text-sm text-[#F0B800] uppercase tracking-wide">Captain</div>
                </div>
                <div className="font-mono text-xs text-[#A3A3A3] sm:text-right mt-1">
                  <div className="text-white font-medium">2024 – Present</div>
                </div>
              </div>
              <ul className="space-y-3 mt-4">
                <li className="text-[#A3A3A3] text-sm flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#F0B800] shrink-0 mt-2"></div>
                  <span className="leading-relaxed">Directed on-court defensive strategy and proactively coordinated tournament logistics to drive competitive team performance.</span>
                </li>
                <li className="text-[#A3A3A3] text-sm flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#F0B800] shrink-0 mt-2"></div>
                  <span className="leading-relaxed">Fostered a collaborative team culture by mentoring new athletes and maintaining rigorous practice schedules during the season.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Technical Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((skillGroup, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                className="bg-[#111] border border-[#333] p-6 hover:border-[#F0B800] transition-colors"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#333]">
                  {skillGroup.icon}
                  <h3 className="text-sm font-bold uppercase tracking-wide">{skillGroup.category}</h3>
                </div>
                <ul className="space-y-3">
                  {skills[idx].items.map((item, i) => (
                    <li key={i} className="text-[#A3A3A3] text-sm flex items-center gap-3">
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
