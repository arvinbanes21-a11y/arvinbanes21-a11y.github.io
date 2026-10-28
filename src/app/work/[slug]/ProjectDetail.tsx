'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, ExternalLink, Github, Layers, Calendar, Tag } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function ProjectDetail({ slug }: { slug: string }) {
  const { isDark, projects } = useTheme();
  const project = projects.find((p) => p.slug === slug) || projects[0];

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <Link href="/work" className="mt-4 inline-block text-primary underline">
          Back to Work
        </Link>
      </div>
    );
  }

  return (
    <article className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <Link
        href="/#work"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-primary dark:text-sky-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Featured Work</span>
      </Link>

      {/* Hero Header */}
      <div className="max-w-4xl space-y-4 mb-12">
        <div className="flex items-center space-x-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-400 uppercase tracking-wider">
            {project.category}
          </span>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase">
            Theme: {project.theme}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary dark:text-white tracking-tight">
          {project.title}
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Cover Image with premium image treatment */}
      <div className="w-full aspect-[21/9] p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-16">
        <img
          src={project.coverImage}
          alt={project.title}
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Case Study Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        
        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 pb-8 lg:pb-0 lg:pr-8">
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1">
              Role & Services
            </h4>
            <p className="text-sm font-semibold text-primary dark:text-white">
              Lead Product Design & Full-Stack Development
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1">
              Deliverables
            </h4>
            <p className="text-sm font-semibold text-primary dark:text-white">
              Design System, Web App, Interactive Canvas Engine
            </p>
          </div>

          {project.liveUrl && (
            <div>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm"
              >
                <span>Live Project</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Narrative Body */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-4 tracking-tight">
              The Challenge
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              Modern digital platforms require a seamless synthesis of performance and visual impact. The primary challenge was crafting an intuitive interface while preserving raw 60fps rendering speeds across desktop and mobile form factors.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-4 tracking-tight">
              The Solution
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              Built on the principles of modular components and tight design tokens, the final application delivers crisp typography, dynamic dark-mode alter-ego switching, and robust real-time database updates.
            </p>
          </div>
        </div>

      </div>

      {/* Additional Image Gallery */}
      {project.images && project.images.length > 0 && (
        <div className="space-y-8 mb-20">
          <h3 className="text-2xl font-bold text-primary dark:text-white tracking-tight">
            Visual Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden aspect-[16/10]"
              >
                <img
                  src={imgUrl}
                  alt={`Highlight ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <ContactForm />

    </article>
  );
}
