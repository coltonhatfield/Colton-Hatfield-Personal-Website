/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';

const InteractiveBackground = React.lazy(() => import('./components/InteractiveBackground'));
const Footer = React.lazy(() => import('./components/Footer'));
const ScrollProgress = React.lazy(() => import('./components/ScrollProgress'));
const About = React.lazy(() => import('./components/About'));
const Projects = React.lazy(() => import('./components/Projects'));
const Contact = React.lazy(() => import('./components/Contact'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const MalwareAnalysis = React.lazy(() => import('./pages/MalwareAnalysis'));

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
    <BrowserRouter>
        <Suspense fallback={null}>
          <InteractiveBackground />
          <ScrollProgress />
        </Suspense>
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
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </div>
      </BrowserRouter>
  );
}
