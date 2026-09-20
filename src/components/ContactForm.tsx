'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Clock, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import ScrollReveal from '@/components/ScrollReveal';
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile';

export default function ContactForm() {
  const { isDark } = useTheme();
  const performanceProfile = usePerformanceProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Dedicated subtle reveal state
  const [isRevealed, setIsRevealed] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);

  const contactEmail = 'arvinf.banes@gmail.com';

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const el = formCardRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const reducedEffects = performanceProfile.prefersReducedMotion || performanceProfile.tier === 'static';
  const mobileEffects = performanceProfile.isMobile || performanceProfile.hasCoarsePointer;
  const revealVisible = reducedEffects || isRevealed;

  const handleReplayReveal = () => {
    setIsRevealed(false);
    setTimeout(() => setIsRevealed(true), 50);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !projectBrief) {
      setErrorMsg('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      // 1. Send email through /api/contact via Resend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          projectBrief,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setProjectBrief('');

      // The email is the primary action. Keep the optional backup off the success path.
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        void (async () => {
          try {
            const [{ db }, { collection, addDoc }] = await Promise.all([
              import('@/lib/firebase'),
              import('firebase/firestore'),
            ]);
            await addDoc(collection(db, 'contactSubmissions'), {
              name,
              email,
              projectBrief,
              createdAt: new Date().toISOString(),
            });
          } catch (error) {
            console.warn('Firestore backup skipped:', error);
          }
        })();
      }
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setErrorMsg(err.message || 'Failed to submit form. Please check your inputs or try again.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 border-t border-slate-200/50 dark:border-slate-800/50">
      
      {/* Header Section */}
      <ScrollReveal direction="up" delay={30}>
        <div className="text-center mb-10 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-amber-400/10 border border-primary/20 dark:border-amber-400/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary dark:text-amber-400">
                {isDark ? 'Open for Transmissions' : 'Get In Touch'}
              </span>
            </div>

            {/* Replay Button to easily test animation */}
            <button
              onClick={handleReplayReveal}
              title="Replay Reveal Animation"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-amber-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Replay</span>
            </button>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-white tracking-tight">
            {isDark ? 'Initiate Direct Connection.' : 'Let’s Build Something Iconic.'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {isDark
              ? 'Have a challenging project, innovative thesis collaboration, or system architecture in mind?'
              : 'Have a project, prospective role, or simply want to talk tech? Drop a message below.'}
          </p>
        </div>
      </ScrollReveal>

      {/* Main Glass Form Card with Pronounced, Subtle Reveal Motion */}
      <div
        ref={formCardRef}
        style={{
          transform: revealVisible
            ? 'translate3d(0, 0, 0) scale(1) rotateX(0deg)'
            : 'translate3d(0, 48px, 0) scale(0.96) rotateX(4deg)',
          opacity: revealVisible ? 1 : 0,
          filter: mobileEffects || reducedEffects ? undefined : (isRevealed ? undefined : 'blur(12px)'),
          transition: reducedEffects
            ? undefined
            : `transform 850ms cubic-bezier(0.16, 1, 0.3, 1), opacity 750ms cubic-bezier(0.16, 1, 0.3, 1)${mobileEffects ? '' : ', filter 750ms cubic-bezier(0.16, 1, 0.3, 1)'}`,
          perspective: '1000px',
          willChange: !revealVisible ? (mobileEffects ? 'transform, opacity' : 'transform, opacity, filter') : undefined,
        }}
        className="mobile-glass relative rounded-3xl p-6 sm:p-10 bg-white/75 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl overflow-hidden transition-colors duration-300"
      >
        {/* Subtle Ambient Specular Light Bar */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 dark:via-amber-400/60 to-transparent pointer-events-none" />

        {/* Shimmer Sweep Animation on Arrival */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
            revealVisible && !reducedEffects ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(226,172,59,0.12) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: revealVisible && !reducedEffects ? 'shimmerSweep 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          }}
        />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {status === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center space-x-3 backdrop-blur-md">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />
              <span className="text-sm font-medium">Thank you! Your message has been delivered directly to my inbox.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 rounded-2xl bg-red-50/90 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center space-x-3 backdrop-blur-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span className="text-sm font-medium">{errorMsg || 'Failed to submit form. Please check your inputs.'}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              style={{
                transform: revealVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
                opacity: revealVisible ? 1 : 0,
                transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms, opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms',
              }}
            >
              <label htmlFor="name" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Your Name <span className="text-amber-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-3.5 rounded-xl bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-amber-400/20 focus:border-primary dark:focus:border-amber-400 transition-all text-sm shadow-inner"
              />
            </div>

            <div
              style={{
                transform: revealVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
                opacity: revealVisible ? 1 : 0,
                transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
              }}
            >
              <label htmlFor="email" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Email Address <span className="text-amber-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full px-4 py-3.5 rounded-xl bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-amber-400/20 focus:border-primary dark:focus:border-amber-400 transition-all text-sm shadow-inner"
              />
            </div>
          </div>

          <div
            style={{
              transform: revealVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
              opacity: revealVisible ? 1 : 0,
              transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 280ms, opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 280ms',
            }}
          >
            <label htmlFor="projectBrief" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Project Brief / Message <span className="text-amber-500">*</span>
            </label>
            <textarea
              id="projectBrief"
              rows={4}
              required
              value={projectBrief}
              onChange={(e) => setProjectBrief(e.target.value)}
              placeholder="Tell me about your goals, timelines, requirements, or ideas..."
              className="w-full px-4 py-3.5 rounded-xl bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-amber-400/20 focus:border-primary dark:focus:border-amber-400 transition-all text-sm shadow-inner resize-none"
            />
          </div>

          <div
            style={{
              transform: revealVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
              opacity: revealVisible ? 1 : 0,
              transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 360ms, opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 360ms',
            }}
          >
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="apple-liquid-btn-primary w-full py-4 px-6 rounded-xl text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-70"
            >
              <span>{status === 'submitting' ? 'Sending Transmission...' : 'Send Message'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Direct Metadata Row */}
        <div
          style={{
            transform: revealVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
            opacity: revealVisible ? 1 : 0,
            transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 440ms, opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 440ms',
          }}
          className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono relative z-10"
        >
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center space-x-1.5 hover:text-primary dark:hover:text-amber-400 transition-colors cursor-pointer"
              title="Click to copy email address"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{contactEmail}</span>
              {copiedEmail ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3 opacity-60" />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary dark:text-amber-400" />
              Iloilo City, Philippines
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              ~24h Response Time
            </span>
          </div>
        </div>

      </div>

    </section>
  );
}
