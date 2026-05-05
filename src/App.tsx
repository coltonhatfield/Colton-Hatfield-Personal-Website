/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { m, useScroll, useSpring, LazyMotion } from 'motion/react';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import InteractiveBackground from './components/InteractiveBackground';
import Footer from './components/Footer';

const loadFeatures = () => import('motion/react').then(res => res.domAnimation);

const About = React.lazy(() => import('./components/About'));
const Projects = React.lazy(() => import('./components/Projects'));
const Contact = React.lazy(() => import('./components/Contact'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const MalwareAnalysis = React.lazy(() => import('./pages/MalwareAnalysis'));

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <m.div
      className="fixed top-0 left-0 right-0 h-1 sm:h-2 bg-[#F0B800] origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <About />
        <Projects />
        <Contact />
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <BrowserRouter>
        <InteractiveBackground />
        <ScrollProgress />
        <div className="min-h-screen bg-transparent selection:bg-[#F0B800] selection:text-black border-[8px] md:border-[16px] border-[#1A1A1A] m-2 md:m-4 flex flex-col font-sans mb-2 md:mb-4 relative">
          <Navigation />
          <main className="max-w-6xl w-full mx-auto px-6 sm:px-12 pt-24 pb-12 md:py-20 flex-grow space-y-24 md:space-y-40 relative z-10">
            <Suspense fallback={<div className="flex justify-center items-center py-20 text-[#F0B800]">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/malware-analysis/bendi" element={<MalwareAnalysis />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LazyMotion>
  );
}
