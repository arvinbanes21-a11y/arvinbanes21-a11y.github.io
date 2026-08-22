'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, GraduationCap, Award, Sparkles, Code, Cpu, BookOpen, Rocket } from 'lucide-react';

interface JourneyMilestone {
  id: number;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: React.ElementType;
  gradient: string;
}

const MILESTONES: JourneyMilestone[] = [
  {
    id: 1,
    year: 'Year 1 — Foundations',
    title: 'The First "Hello, World!"',
    subtitle: 'University of San Agustin — CS Core',
    description: 'Began the Computer Science journey at USA. Mastered core algorithmic logic, C/C++ memory mechanics, Object-Oriented Programming, and Data Structures.',
    tags: ['C/C++', 'Data Structures', 'OOP', 'Logic Design'],
    icon: Code,
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 2,
    year: 'Year 2 — System Architecture',
    title: 'Full-Stack Engineering & NOTER',
    subtitle: 'Component Systems & Modern Web',
    description: 'Engineered NOTER, a modular component library and developer note workspace designed for high-performance productivity and dark-mode fluid transitions.',
    tags: ['React', 'Next.js', 'Design Systems', 'TypeScript'],
    icon: Cpu,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 3,
    year: 'Year 3 — Capstone Flagship',
    title: 'SPTS Online Tutoring Platform',
    subtitle: 'Empowering Student Peer Learning',
    description: 'Designed and deployed SPTS, an online tutoring platform connecting University of San Agustin students with verified tutors, live scheduling, and study session tracking.',
    tags: ['Full-Stack', 'Database Architecture', 'Education Tech'],
    icon: BookOpen,
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 4,
    year: 'Year 4 — Computer Vision Research',
    title: 'AR Food Volume Estimation',
    subtitle: 'Augmented Reality & 3D Shaders',
    description: 'Developed an AR application capable of calculating 3D food volume in real-time through camera spatial meshing, geometric shaders, and computer vision models.',
    tags: ['Augmented Reality', 'Computer Vision', '3D Spatial AI'],
    icon: Sparkles,
    gradient: 'from-purple-600 to-violet-700',
  },
  {
    id: 5,
    year: 'Present & Beyond',
    title: 'The Alter-Ego & AI Systems',
    subtitle: 'Bridging Corporate Precision & Creative R&D',
    description: 'Synthesizing clean enterprise architecture ("Corporate Arvin") with late-night experimental building ("Chaotic Arvin"). Pushing into AI agentic workflows and web innovation.',
    tags: ['AI Agents', 'Full-Stack UX', 'Future-Ready'],
    icon: Rocket,
    gradient: 'from-rose-600 to-pink-700',
  },
];

export default function StudentJourneyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [originPos, setOriginPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEv = e as CustomEvent;
      if (customEv.detail && typeof customEv.detail.x === 'number') {
        setOriginPos({ x: customEv.detail.x, y: customEv.detail.y });
      } else {
        setOriginPos(null);
      }
      setIsOpen(true);
    };
    window.addEventListener('open-journey-modal', handleOpen);
    return () => window.removeEventListener('open-journey-modal', handleOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const current = MILESTONES[currentIndex];
  const IconComponent = current.icon;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MILESTONES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MILESTONES.length) % MILESTONES.length);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md transition-all">
      {/* Container expanding directly from tap point */}
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-popFromTap"
        style={{
          transformOrigin: originPos ? `${originPos.x}px ${originPos.y}px` : 'center center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 inline" /> Secret Particle Unlocked!
              </span>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Arvin's Computer Science Student Journey
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* Card Hero Banner */}
          <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${current.gradient} text-white shadow-lg relative overflow-hidden transition-all duration-300`}>
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md uppercase tracking-wider">
                {current.year}
              </span>
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
                <IconComponent className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
              {current.title}
            </h3>
            <p className="text-sm text-white/80 font-medium">
              {current.subtitle}
            </p>
          </div>

          {/* Card Narrative */}
          <div className="space-y-4">
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {current.description}
            </p>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {current.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {MILESTONES.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'w-6 bg-amber-500' 
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all"
              aria-label="Previous milestone"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
              {currentIndex + 1} / {MILESTONES.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-primary dark:bg-sky-600 text-white hover:opacity-90 transition-all shadow-sm"
              aria-label="Next milestone"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
