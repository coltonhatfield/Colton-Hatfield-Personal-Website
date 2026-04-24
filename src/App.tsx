/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] selection:bg-[#F0B800] selection:text-black border-[8px] md:border-[16px] border-[#1A1A1A] m-2 md:m-4 flex flex-col font-sans mb-2 md:mb-4">
      <Navigation />
      <main className="max-w-6xl w-full mx-auto px-6 sm:px-12 pt-24 pb-12 md:py-20 flex-grow space-y-24 md:space-y-40">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      
      <footer className="border-t border-[#333] max-w-6xl w-full mx-auto px-6 sm:px-12 py-8 mt-24 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-[#666]">
        <p className="text-xs font-mono uppercase tracking-widest">© {new Date().getFullYear()} Colton Hatfield. Built for Web.</p>
        <span className="text-[10px] font-mono text-[#666] uppercase">coltonrhatfield@gmail.com</span>
      </footer>
    </div>
  );
}
