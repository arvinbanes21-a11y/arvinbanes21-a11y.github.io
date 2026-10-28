'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ContactForm from '@/components/ContactForm';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import { Download, Code, Palette, Zap, Terminal, Coffee, ChevronDown } from 'lucide-react';
import { getOptimizedPortraitUrl } from '@/lib/media';

export default function AboutPage() {
  const { isDark, profile } = useTheme();
  const [expandedExpIdx, setExpandedExpIdx] = useState<number | null>(null);

  const activeProfile = profile;
  const activePortraitUrl = getOptimizedPortraitUrl(activeProfile.portraitUrl);

  const skills = activeProfile.skills || [
    { name: 'UI/UX Design & Architecture', level: '100%' },
    { name: 'React / Next.js / TypeScript', level: '95%' },
    { name: 'Design Systems & Tokens', level: '95%' },
  ];

  const experiences = activeProfile.experiences || [];

  // Flat surfaces: one card level, no blur or heavy shadow.
  const glassStyle: React.CSSProperties = {
    background: isDark ? 'rgba(15, 27, 45, 0.72)' : 'rgba(255, 255, 255, 0.72)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(15, 23, 42, 0.08)',
  };

  const itemStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.03)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(15, 23, 42, 0.06)',
  };

  return (
    <div className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div data-text-block="true" className="max-w-4xl mb-16">
        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 dark:bg-indigo-500/10 text-primary dark:text-indigo-400 uppercase tracking-wider">
          {isDark ? 'The Dark Origin Story' : 'Background & Philosophy'}
        </span>
        <EditableText
          value={activeProfile.aboutHeadline || (isDark ? 'Professional Vibe Coder' : 'The Silent Expert.')}
          as="h1"
          className="mt-4 text-4xl sm:text-5xl font-extrabold text-primary dark:text-white tracking-tight block"
        />
        <EditableText
          value={activeProfile.bio || ''}
          as="p"
          multiline={true}
          className="mt-3 text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed block"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        
        {/* Left Column: Portrait & Stats */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* 1. Photo Border Container */}
          <EditableImage
            currentUrl={activePortraitUrl}
            label="Replace Photo"
            style={glassStyle}
            className="p-4 pb-12 rounded-2xl overflow-hidden aspect-[4/5] relative z-[160]"
          >
            <img
              src={activePortraitUrl}
              alt={activeProfile.name}
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover rounded-xl"
            />
          </EditableImage>

          {/* 2. Core Arsenal Container (Categorized Skills & Leadership) */}
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
                        style={itemStyle}
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
        </div>

        {/* Right Column: Bio Narrative & Experience */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* 3. Philosophy Container */}
          <div
            style={glassStyle}
            className="p-6 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-3 tracking-tight">
              {isDark ? '01 // Operating System' : 'Philosophy'}
            </h2>
            <EditableText
              value={activeProfile.philosophy || (isDark
                ? 'I believe software should be fast, sharp, and slightly unpredictable.'
                : 'My work sits at the intersection of traditional typography and modern web architecture.')}
              as="p"
              multiline={true}
              className="text-slate-900 dark:text-slate-100 font-medium text-base leading-relaxed block"
            />
          </div>

          {/* 4. Experience Timeline Container (Interactive Compact Hover-to-Reveal) */}
          {experiences.length > 0 && (
            <div
              style={glassStyle}
              className="p-6 sm:p-7 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                <h2 className="text-2xl font-bold text-primary dark:text-white tracking-tight">
                  {isDark ? '02 // Midnight Logs' : 'Experience Timeline'}
                </h2>
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
                      style={itemStyle}
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
                          <h3 className={`font-bold text-sm sm:text-base transition-colors ${
                            isExpanded ? 'text-primary dark:text-amber-400' : 'text-slate-900 dark:text-white group-hover/item:text-primary dark:group-hover/item:text-amber-400'
                          }`}>
                            {exp.role}
                          </h3>
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
          )}

        </div>

      </div>

      {/* Contact CTA */}
      <ContactForm />

    </div>
  );
}
