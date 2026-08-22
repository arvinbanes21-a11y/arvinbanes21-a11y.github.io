'use client';

import React from 'react';
import { soundFX } from '@/lib/soundFX';

interface TechStackPillCloudProps {
  skills: { name: string; level: string; icon?: string }[];
}

export default function TechStackPillCloud({ skills }: TechStackPillCloudProps) {
  const defaultSkills = [
    { name: 'TypeScript', level: '95%' },
    { name: 'Next.js 14', level: '92%' },
    { name: 'React 18', level: '96%' },
    { name: 'Tailwind CSS', level: '98%' },
    { name: 'Firebase', level: '90%' },
    { name: 'Node.js', level: '88%' },
    { name: 'Python', level: '85%' },
    { name: 'Web Audio API', level: '84%' },
  ];

  const activeSkills = skills && skills.length > 0 ? skills : defaultSkills;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-400">
          Capabilities & Arsenal
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-white mt-1">
          Technology Stack
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto leading-relaxed">
          Languages, frameworks, and tools structured for performance and modern web standards.
        </p>
      </div>

      {/* Floating Glassmorphism Pills Grid */}
      <div className="flex flex-wrap justify-center items-center gap-3 max-w-4xl mx-auto">
        {activeSkills.map((tech, i) => (
          <div
            key={i}
            className="group relative cursor-pointer px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary dark:hover:border-sky-500 flex items-center space-x-2"
          >
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-sky-500" />
            
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
