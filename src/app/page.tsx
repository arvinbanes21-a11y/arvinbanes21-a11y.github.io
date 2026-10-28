'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { Certificate, INITIAL_CERTIFICATES } from '@/lib/types';
import ParticleCanvas from '@/components/ParticleCanvas';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';
import TechStackPillCloud from '@/components/TechStackPillCloud';
import TiltCard from '@/components/TiltCard';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import CertificatesGallery from '@/components/CertificatesGallery';
import AccordionGallery from '@/components/AccordionGallery';
import ScrollReveal from '@/components/ScrollReveal';
import TypewriterText from '@/components/TypewriterText';
import AdaptiveLanyard from '@/components/AdaptiveLanyard';
import { getOptimizedPortraitUrl } from '@/lib/media';
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile';
import { soundFX } from '@/lib/soundFX';
import { ArrowRight, FileText, Sparkles, Terminal, X, Download, Coffee, Zap, Award, ExternalLink, CheckCircle2, Maximize2, ChevronDown } from 'lucide-react';

export default function Home() {
  const { isDark, profile, projects, certificates } = useTheme();
  const performanceProfile = usePerformanceProfile();
  const useCompactEffects = performanceProfile.ready && (
    performanceProfile.isMobile || performanceProfile.hasCoarsePointer
  );

  const activeProfile = profile;
  const activePortraitUrl = getOptimizedPortraitUrl(activeProfile.portraitUrl);
  const activeProjects = projects;
  const activeCertificates = (certificates && certificates.length > 0) ? certificates : INITIAL_CERTIFICATES;

  const [expandedExpIdx, setExpandedExpIdx] = useState<number | null>(null);

  const skills = activeProfile.skills || [
    { name: 'UI/UX Design & Architecture', level: '100%' },
    { name: 'React / Next.js / TypeScript', level: '95%' },
    { name: 'Design Systems & Tokens', level: '95%' },
  ];

  const experiences = activeProfile.experiences || [];

  const glassStyle: React.CSSProperties = {
    background: isDark
      ? `rgba(15, 27, 45, ${useCompactEffects ? 0.9 : 0.35})`
      : `rgba(255, 255, 255, ${useCompactEffects ? 0.88 : 0.18})`,
    backdropFilter: useCompactEffects ? 'none' : 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: useCompactEffects ? 'none' : 'blur(24px) saturate(180%)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.35)',
    borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: isDark
      ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.18)'
      : '0 8px 32px rgba(31, 41, 61, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  };

  const [hoveredCardId, setHoveredCardId] = React.useState<number | null>(null);
  const [showResumeModal, setShowResumeModal] = React.useState(false);

  // Dynamic grid template columns computation targeting only the exact pointed card
  const getGridTemplateColumns = () => {
    if (hoveredCardId === null) return '1fr 1fr 1fr';
    // Card 1 (Column 0, row-span-2)
    if (hoveredCardId === 1) return '2.5fr 0.6fr 0.6fr';
    // Card 2 (Columns 1 & 2 top wide)
    if (hoveredCardId === 2) return '0.6fr 2.5fr 1.2fr';
    // Card 3 (Column 1 middle square)
    if (hoveredCardId === 3) return '2.0fr 0.8fr 0.8fr';
    // Card 4 (Column 2 middle square)
    if (hoveredCardId === 4) return '0.8fr 2.0fr 0.8fr';
    // Card 5 (Columns 0 & 1 bottom wide)
    if (hoveredCardId === 5) return '2.2fr 1.0fr 0.8fr';
    // Card 6 (Column 2 bottom tall)
    if (hoveredCardId === 6) return '0.8fr 0.8fr 2.0fr';
    return '1fr 1fr 1fr';
  };

  return (
    <div className="relative overflow-x-clip min-h-[100dvh]">
      
      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl h-[90vh] bg-surface dark:bg-surface-dark border border-outline/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-outline/10">
              <h3 className="font-bold text-primary dark:text-white">Resume.pdf</h3>
              <div className="flex items-center space-x-2">
                <a
                  href={activeProfile.resumeUrl || '/resume.pdf'}
                  download
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 text-primary dark:text-white" />
                </a>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-primary dark:text-white" />
                </button>
              </div>
            </div>
            <iframe
              src={activeProfile.resumeUrl || '/resume.pdf'}
              className="w-full flex-grow"
              title="Resume"
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Hero Portrait (Top Anchored under Navbar on Mobile, Right Column on Desktop) */}
          <div className="order-1 md:order-2 md:col-span-5 flex flex-col justify-center items-center">
            <div
              data-profile-picture="true"
              className="mobile-lanyard-shell group relative z-[200] w-72 h-[380px] sm:w-80 sm:h-[660px] -mt-36 sm:-mt-44 filter drop-shadow-[0_24px_48px_rgba(15,23,42,0.22)] dark:drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)] touch-pan-y md:touch-none select-none"
            >
              {/* 3D Lanyard Canvas (Wide Swing Room, Fully Transparent, Frameless) */}
              <EditableImage
                currentUrl={activePortraitUrl}
                label="ID Photo"
                className="w-full h-full"
              >
                <div className="w-[800px] h-[400px] sm:w-[1100px] sm:h-[660px] absolute -left-[260px] sm:-left-[390px] top-0 pointer-events-auto touch-pan-y md:touch-none">
                  <AdaptiveLanyard
                    frontImage={activePortraitUrl}
                    imageFit="cover"
                    position={[0, 1.2, 20]}
                    fov={20}
                    lanyardColor="#ffffff"
                    lanyardWidth={0.75}
                  />
                </div>
              </EditableImage>

              {/* Floating Tech Stack Bubble Explosion (Pops out in 360-degree orbit around portrait on hover) */}
              <div className="hidden md:block pointer-events-none absolute inset-0 z-30">
                
                {/* Bubble 1: Next.js (Top Left) */}
                <div className="absolute -top-6 -left-8 px-3.5 py-2 rounded-full bg-slate-900/95 text-white border border-slate-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 opacity-0 scale-50 -translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out delay-75">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <span>Next.js 14</span>
                </div>

                {/* Bubble 2: Flutter (Top Right) */}
                <div className="absolute -top-8 -right-6 px-3.5 py-2 rounded-full bg-slate-900/95 text-indigo-300 border border-slate-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 opacity-0 scale-50 -translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out delay-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <span>Flutter / Dart</span>
                </div>

                {/* Bubble 3: TypeScript (Mid Left) */}
                <div className="absolute top-1/3 -left-12 px-3 py-1.5 rounded-full bg-slate-900/95 text-blue-200 border border-slate-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 opacity-0 scale-50 -translate-x-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out delay-150">
                  <span>TypeScript</span>
                </div>

                {/* Bubble 4: Python & AI/ML (Mid Right) */}
                <div className="absolute top-1/3 -right-14 px-3 py-1.5 rounded-full bg-slate-900/95 text-amber-300 border border-slate-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 opacity-0 scale-50 translate-x-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out delay-200">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>AI/ML & Vision</span>
                </div>

                {/* Bubble 5: PostgreSQL / Neon (Bottom Left) */}
                <div className="absolute bottom-12 -left-10 px-3.5 py-2 rounded-full bg-slate-900/95 text-indigo-200 border border-slate-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 opacity-0 scale-50 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out delay-250">
                  <span>PostgreSQL / Prisma</span>
                </div>

                {/* Bubble 6: ARKit / ARCore (Bottom Right) */}
                <div className="absolute bottom-8 -right-10 px-3.5 py-2 rounded-full bg-slate-900/95 text-purple-200 border border-slate-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 opacity-0 scale-50 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out delay-300">
                  <span>ARKit / ARCore</span>
                </div>

                {/* Bubble 7: PayMongo & APIs (Bottom Center) */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-900/95 text-emerald-300 border border-slate-700 shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 opacity-0 scale-50 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-out delay-350">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>PayMongo / Google Maps</span>
                </div>

              </div>

            </div>

          </div>

          {/* Hero Copy (Follows Directly Underneath on Mobile, Left Column on Desktop) */}
          <div data-text-block="true" className="order-2 md:order-1 relative z-[350] md:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B192C] dark:text-white tracking-tight leading-[1.2] flex flex-wrap items-baseline gap-x-2.5">
                <TypewriterText
                  phrases={["Hi, I'm", "Hello, I'm", "Welcome, I'm"]}
                  typingSpeed={130}
                  deletingSpeed={70}
                  pauseDuration={7000}
                  className="font-extrabold text-[#0B192C] dark:text-white tracking-tight"
                />
                <span className="relative inline-block border-b-[3.5px] border-[#E2AC3B] dark:border-[#F5B942] pb-0.5">
                  <span className="glossy-shine-text font-math-italic italic font-medium text-[1.12em] tracking-normal inline-block drop-shadow-[0_2px_8px_rgba(226,172,59,0.35)]">
                    <EditableText
                      value={activeProfile.name}
                      as="span"
                      className="inline-block"
                    />
                  </span>
                </span>
              </h1>

              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1C4E80]/10 dark:bg-[#F59E0B]/10 border border-[#1C4E80]/20 dark:border-[#F59E0B]/20 font-didact text-xs sm:text-sm font-semibold text-[#1C4E80] dark:text-[#F8B83B]">
                <span className="w-2 h-2 rounded-full bg-[#1C4E80] dark:bg-[#F59E0B] animate-pulse" />
                <EditableText
                  value={activeProfile.title}
                  as="span"
                  className="font-semibold text-xs sm:text-sm"
                />
              </div>
            </div>

            <EditableText
              value={activeProfile.heroSubtext || activeProfile.bio || ''}
              as="p"
              multiline={true}
              className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 max-w-xl leading-relaxed bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm text-justify"
            />

            <div className="pt-2 flex flex-wrap gap-4 items-center relative z-[400]">
              <a
                href="#work"
                className="apple-liquid-btn-primary px-6 py-3.5 rounded-xl text-white font-bold text-sm flex items-center space-x-2 relative z-[410] pointer-events-auto"
              >
                <span>{isDark ? 'View Vault Projects' : 'View Work'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#about"
                className="apple-liquid-btn-secondary px-6 py-3.5 rounded-xl text-primary dark:text-slate-100 font-bold text-sm flex items-center space-x-2 relative z-[410] pointer-events-auto"
              >
                <span>{isDark ? 'Read Lore' : 'About Me'}</span>
              </a>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowResumeModal(true);
                }}
                title="View Resume PDF"
                aria-label="View Resume PDF"
                className="apple-liquid-btn-secondary relative z-[420] pointer-events-auto p-3.5 rounded-xl text-primary dark:text-slate-100 flex items-center justify-center cursor-pointer active:scale-95 touch-manipulation"
              >
                <FileText className="w-5 h-5 text-primary dark:text-slate-300 pointer-events-none" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 🌟 In-Page About Section (Seamless One-Scroll Experience) */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 border-t border-slate-200/40 dark:border-slate-800/40">
        
        {/* Header Banner */}
        <ScrollReveal direction="up" delay={50}>
          <div data-text-block="true" className="max-w-4xl mb-16">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 dark:bg-indigo-500/10 text-primary dark:text-indigo-400 uppercase tracking-wider">
              {isDark ? 'The Dark Origin Story' : 'Background & Philosophy'}
            </span>
            <EditableText
              value={activeProfile.aboutHeadline || (isDark ? 'Professional Vibe Coder' : 'The Silent Expert.')}
              as="h2"
              className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary dark:text-white tracking-tight block"
            />
            <EditableText
              value={activeProfile.bio || ''}
              as="p"
              multiline={true}
              className="mt-3 text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed block text-justify"
            />
          </div>
        </ScrollReveal>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Left Column: Portrait & Skills */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 1. Photo Border Container */}
            <ScrollReveal direction="up" delay={100}>
              <EditableImage
                currentUrl={activePortraitUrl}
                label="Photo"
                style={glassStyle}
                className="p-4 pb-12 rounded-2xl overflow-hidden aspect-[4/5] relative z-[160]"
              >
                <img
                  src={activePortraitUrl}
                  alt={activeProfile.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-xl"
                />
              </EditableImage>
            </ScrollReveal>

            {/* 2. Core Arsenal Container (Categorized Skills & Leadership) */}
            <ScrollReveal direction="up" delay={150}>
              <div
                style={glassStyle}
                className="rounded-2xl p-6 sm:p-7 space-y-5"
              >
                <h3 className="font-bold text-lg text-primary dark:text-white flex items-center space-x-2 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                  {isDark ? <Coffee className="w-5 h-5 text-indigo-400" /> : <Zap className="w-5 h-5 text-primary" />}
                  <span>{isDark ? 'Chaotic Arsenal' : 'Core Arsenal'}</span>
                </h3>

              <div className="space-y-4">
                {(activeProfile.skillCategories || [
                  {
                    category: 'Core Skills',
                    skills: [
                      'AI Engineering',
                      'Computer Vision',
                      'Software Engineering',
                      'Full-Stack Development',
                      'Mobile Development',
                      'AR & Spatial Computing'
                    ]
                  },
                  {
                    category: 'Additional Technical Skills',
                    skills: [
                      'Data Science',
                      'Cybersecurity',
                      'Machine Learning',
                      'System Design',
                      'API Integration'
                    ]
                  },
                  {
                    category: 'Leadership',
                    skills: [
                      'Technical Leadership',
                      'Team Collaboration',
                      'Project Management'
                    ]
                  }
                ]).map((group, gIdx) => (
                  <div key={gIdx} className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skillName, sIdx) => (
                        <span
                          key={sIdx}
                          style={glassStyle}
                          className="px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 hover:border-amber-400/50 transition-colors shadow-2xs"
                        >
                          {skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

          {/* Right Column: Bio Narrative & Experience Timeline */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* 3. Philosophy Container */}
            <ScrollReveal direction="up" delay={120}>
              <div
                style={glassStyle}
                className="p-6 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-primary dark:text-white mb-3 tracking-tight">
                  {isDark ? '01 // Operating System' : 'Philosophy'}
                </h3>
                <EditableText
                  value={activeProfile.philosophy || (isDark
                    ? 'I believe software should be fast, sharp, and slightly unpredictable.'
                    : 'My work sits at the intersection of traditional typography and modern web architecture.')}
                  as="p"
                  multiline={true}
                  className="text-slate-900 dark:text-slate-100 font-medium text-base leading-relaxed block"
                />
              </div>
            </ScrollReveal>

            {/* 4. Experience Timeline Container (Interactive Compact Hover-to-Reveal) */}
            {experiences.length > 0 && (
              <ScrollReveal direction="up" delay={160}>
                <div
                  style={glassStyle}
                  className="p-6 sm:p-7 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                    <h3 className="text-2xl font-bold text-primary dark:text-white tracking-tight">
                      {isDark ? '02 // Midnight Logs' : 'Experience Timeline'}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Hover / Tap to expand
                    </span>
                  </div>

                  <div className="space-y-3.5 border-l-2 border-primary/30 dark:border-indigo-500/30 pl-6 ml-2">
                    {experiences.map((exp, idx) => {
                      const isExpanded = expandedExpIdx === idx;
                      return (
                        <div
                          key={idx}
                          style={glassStyle}
                          onClick={() => setExpandedExpIdx(isExpanded ? null : idx)}
                          onPointerEnter={(event) => {
                            if (event.pointerType === 'mouse') setExpandedExpIdx(idx);
                          }}
                          onPointerLeave={(event) => {
                            if (event.pointerType === 'mouse') setExpandedExpIdx(null);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setExpandedExpIdx(isExpanded ? null : idx);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-expanded={isExpanded}
                          className={`group/item relative p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                            isExpanded ? 'border-primary/50 dark:border-amber-400/50 shadow-md scale-[1.01]' : 'hover:border-primary/40 dark:hover:border-amber-400/40'
                          }`}
                        >
                          {/* Timeline Node Dot */}
                          <div
                            className={`absolute -left-[33px] top-4 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 transition-all duration-300 shadow-xs ${
                              isExpanded
                                ? 'bg-primary dark:bg-amber-400 scale-125 ring-4 ring-primary/20 dark:ring-amber-400/20'
                                : 'bg-slate-300 dark:bg-slate-700 group-hover/item:bg-primary dark:group-hover/item:bg-amber-400 group-hover/item:scale-110'
                            }`}
                          />

                          {/* Title & Period Header Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div className="pr-2">
                              <h4 className={`font-bold text-sm sm:text-base transition-colors ${
                                isExpanded ? 'text-primary dark:text-amber-400' : 'text-slate-900 dark:text-white group-hover/item:text-primary dark:group-hover/item:text-amber-400'
                              }`}>
                                {exp.role}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {exp.company}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 self-start sm:self-auto pt-0.5 sm:pt-0">
                              <span className="text-[11px] font-mono text-primary dark:text-amber-400 bg-primary/10 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap">
                                {exp.period}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                                  isExpanded ? 'rotate-180 text-primary dark:text-amber-400' : 'group-hover/item:translate-y-0.5'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Smooth Expandable Description Accordion */}
                          <div
                            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                              isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50' : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >
                            <div className="min-h-0 overflow-hidden">
                              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {exp.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            )}

          </div>

        </div>
      </section>

      {/* Featured Work Section */}
      <section id="work" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 border-t border-slate-200/40 dark:border-slate-800/40">
        <ScrollReveal direction="up" delay={50}>
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-primary dark:text-white tracking-tight">
              {isDark ? 'Chaotic Artifacts' : 'Featured Work'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {isDark
                ? 'High-risk side experiments and late-night builds.'
                : 'Selected projects showcasing commitment to precision and digital craftsmanship.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Featured Work Accordion Gallery */}
        <ScrollReveal direction="up" delay={120}>
          <AccordionGallery projects={activeProjects} />
        </ScrollReveal>
      </section>

      {/* 📜 Sticky Scroll-Stack Certificates & Credentials Section */}
      {/* 📜 Verified Credentials & Certificates 5-Card Gallery */}
      <section id="certificates" className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 border-t border-slate-200/40 dark:border-slate-800/40">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col justify-between gap-3 mb-8 sm:mb-10 sm:gap-4 md:flex-row md:items-end lg:mb-12">
            <div>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {isDark ? 'Authorized Clearances & Honors' : 'Verified Credentials & Specializations'}
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary dark:text-white tracking-tight">
                {isDark ? 'Declassified Protocols.' : 'Certifications.'}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {isDark
                  ? 'Cryptographically authenticated certifications, security defense clearance, and specialized architectural milestones.'
                  : 'Accredited specializations across Data Science, JavaScript engineering, Cloud Architecture, and Defensive Systems.'}
              </p>
            </div>

            <div className="inline-flex self-start items-center space-x-2 whitespace-nowrap rounded-full border border-slate-200/60 bg-white/70 px-3.5 py-2 text-xs font-mono text-slate-500 shadow-xs backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-400 md:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">{activeCertificates.length} VERIFIED CREDENTIALS</span>
            </div>
          </div>
        </ScrollReveal>

        {/* 5-Card Interactive Hover & Icon Gallery */}
        <CertificatesGallery certificates={activeCertificates} />
      </section>

      {/* Contact Section */}
      <ContactForm />

    </div>
  );
}
