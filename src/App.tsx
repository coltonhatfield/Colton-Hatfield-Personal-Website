/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import InteractiveBackground from './components/InteractiveBackground';
import Footer from './components/Footer';
import ProjectDetail from './pages/ProjectDetail';
import MalwareAnalysis from './pages/MalwareAnalysis';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 sm:h-2 bg-[#F0B800] origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <InteractiveBackground />
      <ScrollProgress />
      <div className="min-h-screen bg-transparent selection:bg-[#F0B800] selection:text-black border-[8px] md:border-[16px] border-[#1A1A1A] m-2 md:m-4 flex flex-col font-sans mb-2 md:mb-4 relative">
        <Navigation />
        <main className="max-w-6xl w-full mx-auto px-6 sm:px-12 pt-24 pb-12 md:py-20 flex-grow space-y-24 md:space-y-40 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/malware-analysis/bendi" element={<MalwareAnalysis />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
