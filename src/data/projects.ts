export interface Project {
  id: string;
  title: string;
  year: string;
  description: string;
  longDescription?: string;
  tags: string[];
  link?: string;
  github?: string;
}

const honeypotMd = `
### Overview
To gain hands-on experience with real-world threat actors and attack patterns, I deployed a public-facing honeypot infrastructure on Oracle Cloud. The system was designed to mimic a vulnerable IoT device or Linux server, intentionally exposing SSH and Telnet services to the open internet and feeding telemetry directly to a Wazuh SIEM pipeline.

### Threat Intelligence & SIEM Pipeline
I containerized a Cowrie honeypot and forwarded public traffic into the trap. To make sense of the noisy, raw logs, I engineered a SIEM pipeline using Wazuh and OpenSearch. I wrote custom decoders and rules to extract crucial indicators of compromise (IOCs), successfully capturing an automated attack sequence from the "RedTail" botnet (Trojan.Alevaul) within a 12-hour window. This botnet successfully performed credential stuffing, manipulated authorized keys for persistence, and delivered architecture-aware payloads—all within 21.3 seconds of initial breach.

### Dynamic Malware Analysis & Containment
To safely analyze the captured payloads, I engineered an isolated malware analysis sandbox using a REMnux VM on a Proxmox hypervisor. I implemented strict egress filtering via an OPNsense firewall to neuter the worm's outbound attacks while allowing it to pull dependencies. By dynamically detonating the malware, I used system call tracing (\`strace\`) and network packet capture (Wireshark) to uncover its true nature as a sophisticated, multi-stage Python worm. Finally, I established an air-gapped exfiltration protocol using virtual hardware to safely retrieve telemetry for reporting.

### Key Skills Demonstrated
This project demonstrates practical skills in **Threat Intelligence**, **SIEM Engineering (Wazuh)**, **Dynamic Malware Analysis**, **Network Containment**, and **Linux System Administration**. It bridged the gap between theoretical security concepts and actual, in-the-wild cyber attacks.
`;

const vitalisMd = `
### Overview
Vitalis is a comprehensive health and fitness dashboard I developed to act as a personal performance laboratory. It goes beyond standard fitness apps by integrating deep biometric tracking, workout logging, and AI-driven insights into a single, cohesive interface.

### What I Did
I built the frontend using React 19, TypeScript, and Tailwind CSS, focusing on a highly interactive, data-rich experience. The backend leverages Node.js, Firebase Auth, and Cloud Firestore for real-time data synchronization. I engineered an integration with Apple iOS Health via Shortcuts for automated physiological data export. A standout feature is the AI Recovery Planner, which uses the Groq API (Llama 3) to analyze recent biometrics and visually highlight sore muscles on a 3D-styled interactive body map.

### Why It Matters
This project showcases my ability to architect and deploy a **Full-Stack Web Application** from end-to-end. It emphasizes skills in **Frontend Engineering (React/TypeScript)**, **Database Architecture (NoSQL/Firestore)**, **API Integration**, and **Applied AI**. Vitalis translates complex physiological data into actionable insights, representing my ability to build polished, performant apps that solve real problems.
`;

const cyberRangeMd = `
### Overview
Practical cybersecurity training requires realistic environments. To create a secure, repeatable playground for penetration testing and incident response, I designed and deployed an Enterprise Cyber Range hosted on a bare-metal Proxmox hypervisor.

### What I Did
I fully codified the infrastructure using **Terraform (IaC)** to allow for rapid teardown and reproducible deployments. The environment features an automated provisioning pipeline using Cloud-Init for target Virtual Machines (primarily Ubuntu and Windows 10 target systems). To construct a realistic, segmented network, I deployed an OPNsense perimeter firewall. Access to the segmented lab environment is securely tunneled using Tailscale, providing a zero-trust administrative entry point.

### Why It Matters
This cyber range serves as my personal laboratory for offensive and defensive operations. Building it demonstrated a deep understanding of **Infrastructure as Code (Terraform)**, **Network Segmentation & Routing (OPNsense)**, **Virtualization (Proxmox)**, and **Zero-Trust Networking (Tailscale)**. It proves my capability to design resilient, enterprise-grade IT architectures from the ground up.
`;

const portfolioMd = `
### Overview
This portfolio website was created to serve as a digital resumé, centralizing my projects, technical experience, and background in Cybersecurity and Network Engineering. It was intentionally modeled with an editorial-meets-terminal aesthetic to reflect my operational focus and personal brand.

### What I Did
I designed and developed the site as a Static Single Page Application (SPA) using React 19, Vite, and TypeScript. To manage the brutalist styling and responsive layout, I used Tailwind CSS v4, while Framer Motion drives the fluid interactive transitions and scroll effects. The site is globally distributed through Cloudflare Pages to ensure fast, reliable delivery.

### Why It Matters
Beyond just presenting information, the portfolio itself is a testament to my **Frontend Development** capabilities. It highlights proficiency with **Modern Web Frameworks (React, Vite)**, **UI/UX Design Patterns**, and **Cloud Deployment (Cloudflare)**. It proves my ability to communicate highly technical topics through well-executed design.
`;

export const projects: Project[] = [
  {
    id: 'vitalis',
    title: 'Vitalis v2.1',
    year: '2026',
    description: 'An AI-powered health application designed to assist users in tracking wellness goals. Features deep biometric tracking, workout logging, AI recovery planning, and Firebase integration.',
    longDescription: vitalisMd,
    tags: ['AI/ML', 'HealthTech', 'Proxmox', 'Tailscale', 'React', 'Firebase'],
    github: 'https://github.com/coltonhatfield/AI-Health-App/tree/main'
  },
  {
    id: 'enterprise-cyber-range',
    title: 'Enterprise Cyber Range Infrastructure',
    year: '2026',
    description: 'Developed an Infrastructure as Code (IaC) cyber range on a bare-metal Proxmox hypervisor. Automated provisioning of target VMs, an OPNsense perimeter firewall, and secure Tailscale VPN tunneling.',
    longDescription: cyberRangeMd,
    tags: ['Terraform', 'Proxmox', 'OPNsense', 'Tailscale'],
    github: 'https://github.com/coltonhatfield/proxmox-cyber-range-iac'
  },
  {
    id: 'public-honeypot',
    title: 'Public Honeypot & Threat Analysis',
    year: '2026',
    description: 'Deployed a public honeypot and Wazuh SIEM pipeline to capture real-world attacks. Engineered a Proxmox/REMnux sandbox to dynamically analyze and contain the sophisticated botnet payloads.',
    longDescription: honeypotMd,
    tags: ['Security', 'Honeypot', 'Wazuh', 'Malware Analysis', 'Threat Intelligence'],
    github: 'https://github.com/coltonhatfield/oracle-wazuh-honeypot'
  },
  {
    id: 'personal-portfolio',
    title: 'Personal Portfolio Website',
    year: '2026',
    description: 'A modern, responsive portfolio website built with React, Vite, and Tailwind CSS. Features fully interactive components, fluid Framer Motion animations, and a Brutalist-inspired aesthetic.',
    longDescription: portfolioMd,
    tags: ['React', 'Tailwind', 'Motion', 'TypeScript'],
    github: 'https://github.com/coltonhatfield/Colton-Hatfield-Personal-Website'
  },
  {
    id: 'wazuh-siem',
    title: 'Wazuh SIEM Deployment',
    year: '2026',
    description: 'Implemented and maintained a hybrid Wazuh SIEM infrastructure to actively monitor persistent environments and personal devices for threat detection and automated backups.',
    longDescription: 'To strengthen personal operational security, I deployed a centralized Wazuh SIEM instance. Agents are deployed across various operating systems in my homelab and personal devices to ingest logs, perform rootkit detection, and enforce file integrity monitoring. The solution automates alerts based on custom rulesets matching MITRE ATT&CK techniques.',
    tags: ['Wazuh', 'SIEM', 'Security', 'Monitoring']
  },
  {
    id: 'self-hosted-homelab',
    title: 'Self-Hosted Homelab Infrastructure',
    year: '2025—2026',
    description: 'Configured a robust Proxmox virtualization environment hosting multiple VMs and a fleet of Dockerized applications (Immich, FreshRSS, AudioBooth). Features custom deployment of personal services alongside dedicated gaming infrastructure.',
    longDescription: 'Serving as the backbone of my personal operations, the homelab features an enterprise-grade Proxmox installation running multiple distinct environments. The overarching architecture heavily utilizes Docker containerization for simple lifecycle management and resource optimization, featuring self-hosted alternatives to cloud services like Google Photos (Immich) alongside dedicated local game servers.',
    tags: ['Proxmox', 'Docker', 'Self-Hosting', 'Linux']
  },
  {
    id: 'enterprise-ad',
    title: 'Enterprise Active Directory Environment',
    year: '2025',
    description: 'Designed and implemented an enterprise Active Directory environment utilizing Windows Server and VMware Hypervisor for CNIT 242.',
    longDescription: 'Developed as part of CNIT 242 coursework, this project involved designing a resilient Windows Server environment conforming to enterprise standards. It includes a functional Active Directory domain structure, implemented Group Policy Objects for automated security baselining, and functional role-based access control (RBAC) modeling across integrated services.',
    tags: ['Active Directory', 'Windows Server', 'VMware', 'Networking']
  }
];
