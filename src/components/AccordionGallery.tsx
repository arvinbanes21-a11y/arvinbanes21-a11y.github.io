'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, Calendar, ExternalLink, Github } from 'lucide-react';
import { Project, INITIAL_PROJECTS } from '@/lib/types';
import { useTheme } from '@/context/ThemeContext';
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile';
import styles from './AccordionGallery.module.css';

interface AccordionGalleryProps {
  projects: Project[];
  defaultIndex?: number;
}

export default function AccordionGallery({ projects, defaultIndex = 0 }: AccordionGalleryProps) {
  const { isDark } = useTheme();
  const performanceProfile = usePerformanceProfile();
  const displayProjects = projects.length > 0 ? projects : INITIAL_PROJECTS;
  const [activeIndex, setActiveIndex] = useState(() => Math.min(Math.max(defaultIndex, 0), Math.max(displayProjects.length - 1, 0)));
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);
  const isCompact = performanceProfile.ready && (performanceProfile.isMobile || performanceProfile.hasCoarsePointer);
  const prefersReducedMotion = performanceProfile.prefersReducedMotion;
  const total = displayProjects.length;

  useEffect(() => {
    if (activeIndex >= total) setActiveIndex(0);
  }, [activeIndex, total]);

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
        const media = panel.querySelector<HTMLElement>('[data-gallery-media]');
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

  const selectProject = (index: number) => setActiveIndex(index);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      selectProject((index + 1) % total);
      panelRefs.current[(index + 1) % total]?.querySelector('button')?.focus();
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const previous = (index - 1 + total) % total;
      selectProject(previous);
      panelRefs.current[previous]?.querySelector('button')?.focus();
    }
  };

  if (total === 0) return null;

  return (
    <div
      ref={rootRef}
      className={styles.gallery}
      role="list"
      aria-label="Featured projects"
      style={{
        '--ag-accent': isDark ? '#fbbf24' : '#dbeafe',
        '--ag-accent-rgb': isDark ? '251, 191, 36' : '219, 234, 254',
        '--ag-overlay': isDark ? '8, 15, 32' : '15, 39, 79',
      } as React.CSSProperties}
    >
      {displayProjects.map((project, index) => {
        const isActive = index === activeIndex;
        return (
          <article
            key={project.id}
            ref={(element) => { panelRefs.current[index] = element; }}
            className={styles.panel}
            data-active={isActive}
            role="listitem"
            style={{
              '--panel-dim': isActive ? 0 : 0.42,
              '--panel-gray': isActive ? 0 : 1,
            } as React.CSSProperties}
            onMouseEnter={() => {
              if (!isCompact) selectProject(index);
            }}
          >
            <div className={styles.media} data-gallery-media>
              <img src={project.coverImage} alt="" loading="lazy" decoding="async" draggable={false} />
            </div>
            <button
              type="button"
              className={styles.panelButton}
              aria-expanded={isActive}
              aria-label={`${isActive ? 'Selected' : 'Select'} project: ${project.title}`}
              onClick={() => selectProject(index)}
              onFocus={() => selectProject(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
            <span className={styles.railTitle}>{project.title}</span>
            <div className={styles.content} data-active={isActive} aria-hidden={!isActive}>
              <span className={styles.eyebrow}>{project.category}</span>
              <h3 className={styles.title}>{project.title}</h3>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.actions}>
                <Link href={`/work/${project.slug}`} className={styles.primaryAction} tabIndex={isActive ? 0 : -1}>
                  View case study <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.iconAction} aria-label={`Visit ${project.title} live site`} tabIndex={isActive ? 0 : -1}>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.iconAction} aria-label={`View ${project.title} on GitHub`} tabIndex={isActive ? 0 : -1}>
                    <Github className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                {project.year && (
                  <span className={styles.meta}><Calendar className="mr-1 inline h-3 w-3" aria-hidden="true" />{project.year}</span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
