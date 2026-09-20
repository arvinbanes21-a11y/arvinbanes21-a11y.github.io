'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // delay in ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number; // distance in px
  duration?: number; // duration in ms
  threshold?: number; // intersection threshold (0 - 1)
  blur?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 750,
  threshold = 0.12,
  blur = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  const performanceProfile = usePerformanceProfile();
  const shouldAnimate = performanceProfile.ready && !performanceProfile.prefersReducedMotion && performanceProfile.tier !== 'static';
  const shouldBlur = blur && !performanceProfile.isMobile && !performanceProfile.hasCoarsePointer;

  useEffect(() => {
    if (!performanceProfile.ready) return;

    if (!shouldAnimate || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentEl = domRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      observer.disconnect();
    };
  }, [performanceProfile.ready, shouldAnimate, threshold]);

  const getTransform = () => {
    if (performanceProfile.ready && (!shouldAnimate || isVisible)) {
      return 'translate3d(0, 0, 0) scale(1)';
    }
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0) scale(0.985)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0) scale(0.985)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0) scale(0.985)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0) scale(0.985)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0) scale(0.985)';
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transform: getTransform(),
        opacity: performanceProfile.ready && (!shouldAnimate || isVisible) ? 1 : 0,
        filter: shouldBlur && shouldAnimate && !isVisible ? 'blur(8px)' : undefined,
        transition: shouldAnimate
          ? `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms${shouldBlur ? `, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms` : ''}`
          : undefined,
        willChange: shouldAnimate && !isVisible ? (shouldBlur ? 'transform, opacity, filter' : 'transform, opacity') : undefined,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
