'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { isDark, toggleTheme, profile } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Work', href: '/#work' },
    { name: 'Certificates', href: '/#certificates' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="apple-glass-nav sticky top-0 z-[100] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Persona indicator */}
        <Link href="/" className="group flex items-center space-x-3 active:scale-97 transition-transform">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#1F4075] text-white font-bold flex items-center justify-center text-lg shadow-md border-t border-white/60 group-hover:scale-105 transition-transform duration-200">
            AB
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg text-[#0B103C] dark:text-[#F9DFA1] tracking-tight block">
              {profile.name}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[#1F4075] dark:text-[#F9DFA1] block">
              {isDark ? '// ALTER-EGO MODE' : '// DEVELOPER'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Floating Glass Pill Highlights */}
        <nav className="hidden md:flex items-center space-x-2 neu-inset p-1.5 rounded-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#1F4075] dark:text-[#F9DFA1] font-semibold bg-white/90 dark:bg-[#1F4075]/60 backdrop-blur-md border border-white/80 dark:border-[#E2AC3B]/40 shadow-xs'
                    : 'text-slate-800 dark:text-slate-200 hover:text-[#1F4075] dark:hover:text-[#F9DFA1] hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Liquid Glass Interactive Theme Switch */}
          <button
            onClick={() => {
              toggleTheme();
            }}
            role="switch"
            aria-checked={isDark}
            aria-label={isDark ? "Switch to Corporate Light Mode" : "Switch to Chaotic Dark Mode"}
            title={isDark ? "Corporate Light Mode" : "Chaotic Dark Mode"}
            className={`relative w-14 sm:w-16 h-7 sm:h-8 rounded-full p-1 transition-all duration-300 flex items-center backdrop-blur-xl focus:outline-none ${
              isDark
                ? 'bg-slate-900/80 border border-slate-700/80 shadow-inner'
                : 'bg-white/60 border border-white/90 shadow-xs'
            }`}
          >
            {/* Background Icons */}
            <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none text-xs">
              <Sun className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 transition-opacity duration-200 ${isDark ? 'opacity-40' : 'opacity-100'}`} />
              <Moon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3B82F6] transition-opacity duration-200 ${isDark ? 'opacity-100' : 'opacity-40'}`} />
            </div>

            {/* Sliding Glossy Knob */}
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white dark:bg-indigo-500 shadow-md transform transition-all duration-300 flex items-center justify-center border border-white/60 ${
                isDark ? 'translate-x-7 sm:translate-x-8 shadow-[0_0_14px_rgba(99,102,241,0.6)]' : 'translate-x-0'
              }`}
            >
              {isDark ? (
                <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              ) : (
                <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
              )}
            </div>
          </button>

          {/* Liquid Glass "What's up?" CTA Button */}
          <Link
            href="/#contact"
            className="apple-liquid-btn-primary px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-white dark:text-[#0B103C] font-semibold text-xs sm:text-sm flex items-center space-x-1"
          >
            <span>What&apos;s up?</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 backdrop-blur-md"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-Down Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/40 dark:border-slate-800/40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-4 py-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Thin Apple-Style Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden pointer-events-none">
        <div
          style={{ width: `${scrollProgress}%` }}
          className="h-full bg-gradient-to-r from-[#3B82F6] via-[#F5B942] to-[#E2AC3B] shadow-[0_0_8px_rgba(245,185,66,0.8)] transition-[width] duration-150 ease-out"
        />
      </div>
    </header>
  );
}
