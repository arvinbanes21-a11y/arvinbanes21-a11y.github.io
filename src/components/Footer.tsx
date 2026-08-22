'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const { isDark, profile } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 bg-white/90 dark:bg-[#080B2B]/95 border-t border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Brand Logo & Bio */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#1F4075] text-white font-bold flex items-center justify-center text-sm shadow-md border-t border-white/60">
                {isDark ? '🔥' : 'AB'}
              </div>

              <Link href="/" className="font-bold text-lg text-[#0B103C] dark:text-[#F9DFA1] tracking-tight hover:underline">
                {profile.name}
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {isDark
                ? 'Chaotic alter-ego mode active. Experimental builds, depth fusion research, and midnight coding.'
                : 'Computer Science undergraduate & full-stack developer dedicated to building intelligent, user-friendly digital products.'}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-3">
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-amber-400 hover:border-primary/40 dark:hover:border-amber-400/40 hover:scale-105 transition-all shadow-xs"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-amber-400 hover:border-primary/40 dark:hover:border-amber-400/40 hover:scale-105 transition-all shadow-xs"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-amber-400 hover:border-primary/40 dark:hover:border-amber-400/40 hover:scale-105 transition-all shadow-xs"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {profile.socialLinks?.email && (
              <a
                href={`mailto:${profile.socialLinks.email}`}
                aria-label="Email"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-amber-400 hover:border-primary/40 dark:hover:border-amber-400/40 hover:scale-105 transition-all shadow-xs"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              title="Back to top"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-amber-400 hover:border-primary/40 dark:hover:border-amber-400/40 hover:scale-105 transition-all shadow-xs cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

          {/* Copyright Text */}
          <div className="flex items-center space-x-3 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
