'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { Project } from '@/lib/types';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Github, 
  Sparkles, 
  Maximize2, 
  X, 
  Layers, 
  ArrowUpRight,
  Code2,
  Calendar
} from 'lucide-react';

import { INITIAL_PROJECTS } from '@/lib/types';

interface WorksCarouselProps {
  projects: Project[];
}

export default function WorksCarousel({ projects }: WorksCarouselProps) {
  const { isDark } = useTheme();

  const displayProjects = (projects && projects.length > 0) ? projects : INITIAL_PROJECTS;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isInView, setIsInView] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const total = displayProjects.length;

  // IntersectionObserver to trigger the ascend smooth pop up fade entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentEl = containerRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, []);

  // Auto-spin timer: spins every 4.5 seconds when not hovered or dragged
  useEffect(() => {
    if (isHovered || isDragging || total <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, isDragging, total]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  // Drag & Swipe Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 50) {
      handlePrev();
    } else if (dragOffset < -50) {
      handleNext();
    }
    setDragOffset(0);
  };

  const glassStyle: React.CSSProperties = {
    background: isDark ? 'rgba(15, 27, 45, 0.4)' : 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.45)',
    borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.7)',
    boxShadow: isDark
      ? '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      : '0 16px 40px rgba(31, 41, 61, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  };

  return (
    <div className="relative w-full py-8 select-none">
      
      {/* Top Carousel Navigation Toolbar */}
      <div className="flex items-center justify-between mb-8 px-2 sm:px-4">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 dark:bg-amber-400/75 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary dark:bg-amber-400"></span>
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isHovered ? 'Interactive Focus • Auto-Spin Paused' : 'Spinning Carousel • Hover to Inspect'}
          </span>
        </div>

        {/* Prev / Next Action Arrows */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            aria-label="Previous Project"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-amber-400 hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Project"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-amber-400 hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D Circular Stage with Ascend Smooth Pop-Up Fade */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: isInView ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 42px, 0) scale(0.93)',
          opacity: isInView ? 1 : 0,
          filter: isInView ? 'blur(0px)' : 'blur(10px)',
          transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), filter 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-full h-[540px] sm:h-[580px] flex items-center justify-center perspective-[1200px] overflow-visible touch-none cursor-grab active:cursor-grabbing will-change-[transform,opacity,filter]"
      >
        {displayProjects.map((proj, idx) => {
          // Calculate relative circular position from active index
          let offset = idx - activeIndex;
          if (offset < -Math.floor(total / 2)) offset += total;
          if (offset > Math.floor(total / 2)) offset -= total;

          const isCenter = offset === 0;
          const isImmediateNeighbor = Math.abs(offset) === 1;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          // Staggered 3D orbital transforms
          const translateX = offset * 320 + dragOffset * 0.8;
          const translateZ = isCenter ? 60 : -Math.abs(offset) * 160;
          const rotateY = offset * -22 + (dragOffset * 0.05);
          const scale = isCenter ? 1.05 : Math.max(0.78, 1 - Math.abs(offset) * 0.16);
          const opacity = isCenter ? 1 : isImmediateNeighbor ? 0.65 : 0.3;
          const zIndex = isCenter ? 40 : 30 - Math.abs(offset) * 5;

          return (
            <div
              key={proj.id}
              onClick={() => {
                if (!isCenter) setActiveIndex(idx);
              }}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transition: isDragging ? 'none' : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease',
              }}
              className={`group/card absolute w-[320px] sm:w-[380px] h-[480px] sm:h-[510px] rounded-3xl p-5 flex flex-col justify-between overflow-hidden cursor-pointer transition-shadow duration-300 ${
                isCenter ? 'ring-2 ring-primary/40 dark:ring-amber-400/40 shadow-2xl' : 'hover:opacity-90'
              }`}
            >
              {/* Glass Background Panel */}
              <div 
                style={glassStyle} 
                className="absolute inset-0 rounded-3xl -z-10 transition-colors duration-300 group-hover/card:brightness-105" 
              />

              {/* Card Top: Category Pill & Year & Modal Trigger */}
              <div className="flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400 border border-primary/20 dark:border-amber-400/20 shadow-2xs font-mono">
                  {proj.category}
                </span>

                <div className="flex items-center space-x-1.5">
                  {proj.year && (
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {proj.year}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(proj);
                    }}
                    title="View Full Case Study"
                    className="p-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 text-slate-500 hover:text-primary dark:hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Center: High-Res Mockup Image */}
              <div className="relative my-3 flex-1 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-inner group-hover/card:scale-[1.02] transition-transform duration-500">
                <EditableImage
                  currentUrl={proj.coverImage}
                  label="Image"
                  className="w-full h-full"
                >
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-108"
                  />
                </EditableImage>

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity" />

                {/* Hover Live Site Quick Chip */}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md flex items-center space-x-1 shadow-md opacity-0 group-hover/card:opacity-100 transition-all duration-300 hover:scale-105"
                  >
                    <span>Visit Live</span>
                    <ArrowUpRight className="w-3 h-3 text-primary dark:text-amber-400" />
                  </a>
                )}
              </div>

              {/* Card Bottom: Title, Description, Tags, & Buttons */}
              <div className="space-y-3 z-10">
                <div>
                  <EditableText
                    value={proj.title}
                    as="h3"
                    className="font-extrabold text-base sm:text-lg text-primary dark:text-white tracking-tight leading-snug line-clamp-1 block group-hover/card:text-primary dark:group-hover/card:text-amber-400 transition-colors"
                  />
                  <EditableText
                    value={proj.description}
                    as="p"
                    multiline={true}
                    className="mt-1 text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed"
                  />
                </div>

                {/* Tech Stack Chips */}
                {proj.tags && proj.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {proj.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-slate-300/40 dark:border-slate-700/40"
                      >
                        {tag}
                      </span>
                    ))}
                    {proj.tags.length > 3 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono self-center">
                        +{proj.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={proj.liveUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-primary to-[#132C54] dark:from-amber-400 dark:to-amber-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="View GitHub Repository"
                      className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-xs"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center space-x-2 mt-8">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex
                ? 'w-8 bg-primary dark:bg-amber-400'
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

      {/* Full Project Deep Dive Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            style={glassStyle}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-[#0B103C]/95 border border-white/40 dark:border-slate-700/80 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400 border border-primary/20 dark:border-amber-400/20">
                  {selectedProject.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-white mt-2">
                  {selectedProject.title}
                </h2>
                {selectedProject.year && (
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                    Milestone Year: {selectedProject.year}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="my-6 rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-md">
              <img
                src={selectedProject.coverImage}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Description */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Project Overview
                </h4>
                <p className="mt-1 text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Technologies */}
              {selectedProject.tags && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mb-2">
                    Core Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 flex flex-wrap gap-3">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-[#132C54] dark:from-amber-400 dark:to-amber-500 text-white dark:text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm flex items-center space-x-2 hover:border-primary/40 dark:hover:border-amber-400/40 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Source</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
