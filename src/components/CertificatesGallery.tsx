'use client';

import React from 'react';
import {
  ExternalLink,
  FileText
} from 'lucide-react';
import { Certificate } from '@/lib/types';
import { useTheme } from '@/context/ThemeContext';
import ScrollReveal from '@/components/ScrollReveal';

interface CertificatesGalleryProps {
  certificates: Certificate[];
}

export default function CertificatesGallery({ certificates }: CertificatesGalleryProps) {
  const { isDark } = useTheme();

  const glassStyle: React.CSSProperties = {
    background: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  };

  return (
    <div className="w-full select-none">
      
      {/* Certificate Windows Grid (Landscape Proportions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.slice(0, 5).map((cert, idx) => {
          return (
            <ScrollReveal key={cert.id} direction="up" delay={idx * 70}>
              <div
                onClick={() => {
                  const targetUrl = cert.verificationUrl || cert.image;
                  if (targetUrl) {
                    window.open(targetUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                style={glassStyle}
                className="group relative h-[320px] sm:h-[350px] rounded-2xl overflow-hidden cursor-pointer border border-slate-200/90 dark:border-slate-800/90 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-2xl hover:border-amber-400/80 dark:hover:border-amber-400/70 flex flex-col justify-between"
              >
                
                {/* 1. Window Titlebar Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 z-20">
                  
                  {/* Left: Window Dots & Issuer */}
                  <div className="flex items-center space-x-2.5">
                    <div className="flex space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-slate-600 dark:text-slate-300 truncate max-w-[140px] sm:max-w-[180px]">
                      {cert.issuer}
                    </span>
                  </div>

                  {/* Right: Verified Pill & Year */}
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{cert.issueDate}</span>
                    </span>
                  </div>
                </div>

                {/* 2. Window Main Body: Certificate Image Preview */}
                <div className="relative flex-1 w-full overflow-hidden bg-slate-950/20">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Idle Bottom Bar: Certificate Title */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-0">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                      {cert.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                      {cert.title}
                    </h3>
                  </div>

                  {/* 3. Hover Overlay Drawer: Brief Description & Skills Reveal */}
                  <div className="absolute inset-0 bg-slate-950/85 dark:bg-slate-950/90 backdrop-blur-md p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-400 z-30 translate-y-2 group-hover:translate-y-0">
                    
                    {/* Top of Hover Drawer: Category & Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                          {cert.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ID: {cert.credentialId || 'VERIFIED'}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-white tracking-tight leading-snug">
                        {cert.title}
                      </h4>

                      {/* Brief Description */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 pt-1">
                        {cert.description}
                      </p>
                    </div>

                    {/* Bottom of Hover Drawer: Skills Pills & Open Official PDF Action */}
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {cert.skills.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20"
                            >
                              {skill}
                            </span>
                          ))}
                          {cert.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800">
                              +{cert.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400 group-hover:text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Open Official PDF</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                  </div>

                </div>

                {/* Subtle Specular Top Light Bar */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none z-30" />
              </div>
            </ScrollReveal>
          );
        })}
      </div>

    </div>
  );
}
