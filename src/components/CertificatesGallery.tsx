'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import {
  ArrowUpRight,
  Award,
  Bike,
  Brain,
  Calendar,
  Cloud,
  Code2,
  Download,
  FileText,
  Gamepad2,
  Layers,
  Monitor,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { gsap } from 'gsap';
import { Certificate } from '@/lib/types';
import { useTheme } from '@/context/ThemeContext';
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile';
import styles from './CertificatesGallery.module.css';

interface CertificatesGalleryProps {
  certificates: Certificate[];
  defaultIndex?: number;
}

interface CertificateKind {
  icon: LucideIcon;
  color: string;
}

function getCertificateKind(certificate: Certificate): CertificateKind {
  const content = `${certificate.category || ''} ${certificate.title || ''}`.toLowerCase();

  if (content.includes('data science')) return { icon: Brain, color: '#38bdf8' };
  if (content.includes('javascript') || content.includes('web development')) return { icon: Code2, color: '#fbbf24' };
  if (content.includes('cloud') || content.includes('artificial intelligence')) return { icon: Cloud, color: '#38bdf8' };
  if (content.includes('cyber') || content.includes('security')) return { icon: ShieldCheck, color: '#34d399' };
  if (content.includes('software') || content.includes('full-stack')) return { icon: Layers, color: '#a78bfa' };
  if (content.includes('motorcycle')) return { icon: Bike, color: '#fb923c' };
  if (content.includes('gaming') || content.includes('selena')) return { icon: Gamepad2, color: '#f472b6' };
  if (content.includes('creative') || content.includes('vibe')) return { icon: Sparkles, color: '#c084fc' };
  if (content.includes('computer')) return { icon: Monitor, color: '#fbbf24' };

  return { icon: Award, color: '#fbbf24' };
}

export default function CertificatesGallery({ certificates, defaultIndex = 0 }: CertificatesGalleryProps) {
  const { isDark } = useTheme();
  const performanceProfile = usePerformanceProfile();
  const displayCertificates = certificates.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(() => (
    Math.min(Math.max(defaultIndex, 0), Math.max(displayCertificates.length - 1, 0))
  ));
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);
  const isCompact = performanceProfile.ready && (
    performanceProfile.isMobile || performanceProfile.hasCoarsePointer
  );
  const prefersReducedMotion = performanceProfile.prefersReducedMotion;
  const total = displayCertificates.length;

  useEffect(() => {
    if (activeIndex >= total) setActiveIndex(0);
  }, [activeIndex, total]);

  useEffect(() => {
    if (!previewCertificate) return;

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewCertificate(null);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [previewCertificate]);

  const animatePanels = useCallback((animate: boolean) => {
    if (isCompact) return;
    const panels = panelRefs.current.filter((panel): panel is HTMLElement => Boolean(panel));
    if (panels.length === 0) return;

    const expandedRatio = 0.56;
    const expandedGrow = total > 1 ? (expandedRatio * (total - 1)) / (1 - expandedRatio) : 1;
    const duration = animate && !prefersReducedMotion ? 0.58 : 0;

    const context = gsap.context(() => {
      panels.forEach((panel, index) => {
        const isActive = index === activeIndex;
        const direction = index < activeIndex ? 1 : -1;
        const media = panel.querySelector<HTMLElement>('[data-certificate-media]');

        gsap.to(panel, {
          flexGrow: isActive ? expandedGrow : 1,
          rotateY: isActive ? 0 : direction * 7,
          duration,
          ease: 'power3.out',
          overwrite: true,
        });

        if (media) {
          gsap.to(media, {
            x: isActive ? 0 : direction * 10,
            duration,
            ease: 'power3.out',
            overwrite: true,
          });
        }
      });
    }, rootRef);

    return () => context.revert();
  }, [activeIndex, isCompact, prefersReducedMotion, total]);

  useLayoutEffect(() => {
    const cleanup = animatePanels(!firstRenderRef.current);
    firstRenderRef.current = false;
    return cleanup;
  }, [animatePanels]);

  const selectCertificate = (index: number) => setActiveIndex(index);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (index + 1) % total;
      selectCertificate(next);
      panelRefs.current[next]?.querySelector('button')?.focus();
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const previous = (index - 1 + total) % total;
      selectCertificate(previous);
      panelRefs.current[previous]?.querySelector('button')?.focus();
    }
  };

  if (total === 0) return null;

  return (
    <div
      ref={rootRef}
      className={styles.gallery}
      role="list"
      aria-label="Certificates and honors"
      style={{
        '--cg-accent': isDark ? '#fbbf24' : '#dbeafe',
        '--cg-accent-rgb': isDark ? '251, 191, 36' : '219, 234, 254',
        '--cg-overlay': isDark ? '8, 15, 32' : '15, 39, 79',
      } as CSSProperties}
    >
      {displayCertificates.map((certificate, index) => {
        const isActive = index === activeIndex;
        const previewUrl = certificate.image;
        const documentUrl = certificate.verificationUrl;
        const hasPdfDocument = Boolean(documentUrl?.toLowerCase().endsWith('.pdf'));
        const kind = getCertificateKind(certificate);
        const KindIcon = kind.icon;

        return (
          <article
            key={certificate.id}
            ref={(element) => { panelRefs.current[index] = element; }}
            className={styles.panel}
            data-active={isActive}
            role="listitem"
            style={{
              '--panel-dim': isActive ? 0 : 0.42,
              '--panel-gray': isActive ? 0 : 1,
              '--kind-color': kind.color,
            } as CSSProperties}
            onMouseEnter={() => {
              if (!isCompact) selectCertificate(index);
            }}
          >
            <div className={styles.media} data-certificate-media>
              <img src={certificate.showcaseImage || certificate.image} alt="" loading="lazy" decoding="async" draggable={false} />
            </div>

            <div className={styles.categoryCanvas} aria-hidden="true">
              <span className={styles.categoryMark}>
                <KindIcon className="h-7 w-7" strokeWidth={1.8} />
              </span>
            </div>

            <button
              type="button"
              className={styles.panelButton}
              aria-expanded={isActive}
              aria-label={`${isActive ? 'Selected' : 'Select'} certificate: ${certificate.title}`}
              onClick={() => selectCertificate(index)}
              onFocus={() => selectCertificate(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />

            <div className={styles.content} data-active={isActive} aria-hidden={!isActive}>
              <span className={styles.eyebrow}>{certificate.issuer}</span>
              <h3 className={styles.title}>{certificate.title}</h3>
              <p className={styles.description}>{certificate.description}</p>
              <div className={styles.actions}>
                {previewUrl && (
                  <button
                    type="button"
                    className={styles.primaryAction}
                    onClick={() => setPreviewCertificate(certificate)}
                  >
                    View certificate <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
                {hasPdfDocument ? (
                  <a
                    href={documentUrl}
                    download
                    className={styles.iconAction}
                    aria-label={`Download PDF for ${certificate.title}`}
                    tabIndex={isActive ? 0 : -1}
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <span className={styles.iconAction} aria-hidden="true">
                    <FileText className="h-4 w-4" />
                  </span>
                )}
                {certificate.issueDate && (
                  <span className={styles.meta}>
                    <Calendar className="mr-1 inline h-3 w-3" aria-hidden="true" />{certificate.issueDate}
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}

      {previewCertificate && (
        <div
          className={styles.previewBackdrop}
          role="presentation"
          onMouseDown={() => setPreviewCertificate(null)}
        >
          <section
            className={styles.previewDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-preview-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className={styles.previewHeader}>
              <div className={styles.previewHeading}>
                <span>{previewCertificate.issuer}</span>
                <h3 id="certificate-preview-title">{previewCertificate.title}</h3>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setPreviewCertificate(null)}
                aria-label="Close certificate preview"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className={styles.previewImageStage}>
              <img src={previewCertificate.image} alt={previewCertificate.title} />
            </div>

            <footer className={styles.previewFooter}>
              <span>{previewCertificate.issueDate}</span>
              {previewCertificate.verificationUrl?.toLowerCase().endsWith('.pdf') && (
                <a href={previewCertificate.verificationUrl} download className={styles.downloadAction}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download PDF
                </a>
              )}
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
