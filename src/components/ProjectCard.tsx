'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  isFeatured?: boolean;
}

export default function ProjectCard({ project, isFeatured = false }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group block bg-white dark:bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 border-t-2 border-t-primary dark:border-t-indigo-500 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md relative ${
        isFeatured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <div className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-xl shadow-sm overflow-hidden m-6 mb-0">
        <div className={`relative w-full overflow-hidden rounded-lg ${
          isFeatured ? 'aspect-[16/9] md:aspect-[21/10]' : 'aspect-[16/10]'
        }`}>
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm bg-slate-100 dark:bg-slate-900">
              No image available
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-primary dark:text-indigo-400 shadow-sm backdrop-blur-sm border border-slate-200/40 dark:border-slate-800/40">
              {project.category}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-start justify-between">
          <h3 className={`font-bold text-primary dark:text-white group-hover:text-primary/80 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 ${
            isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl'
          }`}>
            {project.title}
          </h3>
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-slate-300 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-background-dark transition-colors flex-shrink-0 ml-2">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <p className={`mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed ${
          isFeatured ? 'text-base line-clamp-3' : 'line-clamp-2'
        }`}>
          {project.description}
        </p>
      </div>
    </Link>
  );
}
