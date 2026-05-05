export default function HeroSkeleton() {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center pt-2.5">
       <div className="mt-8 border-t border-b border-[#333] py-8">
          <div className="border border-[#333] p-6 bg-[#111]">
             <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2 mt-0 font-sans">PROFESSIONAL OVERVIEW</h2>
             <p className="text-sm text-[#A3A3A3] leading-relaxed font-sans">Architecting resilient networks, enforcing rigorous system hardening, and engineering secure infrastructure from the ground up. Currently a sophomore in cybersecurity at Purdue University, with hands-on experience in enterprise-grade server environments.</p>
          </div>
       </div>
    </section>
  );
}
