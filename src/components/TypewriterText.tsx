'use client';

import React, { useState, useEffect } from 'react';
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile';

const DEFAULT_PHRASES = ["Hi, I'm ", "Hello, I'm ", "Welcome, I'm "];

interface TypewriterTextProps {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export default function TypewriterText({
  phrases = DEFAULT_PHRASES,
  typingSpeed = 130,
  deletingSpeed = 70,
  pauseDuration = 7000,
  className = '',
  cursorClassName = '',
}: TypewriterTextProps) {
  const performanceProfile = usePerformanceProfile();
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const shouldAnimate = performanceProfile.ready &&
    !performanceProfile.prefersReducedMotion &&
    performanceProfile.tier !== 'static';

  useEffect(() => {
    if (!performanceProfile.ready) return;

    if (!shouldAnimate) {
      setPhraseIdx(0);
      setIsDeleting(false);
      setDisplayText(phrases[0] || '');
      return;
    }

    const currentPhrase = phrases[phraseIdx];

    let timer: ReturnType<typeof setTimeout> | undefined;

    if (!isDeleting && displayText === currentPhrase) {
      // Finished typing current phrase, pause before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && displayText === '') {
      // Finished deleting, move to next phrase
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
    } else {
      // Typing or deleting in progress
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentPhrase.substring(0, prev.length - 1)
            : currentPhrase.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    deletingSpeed,
    displayText,
    isDeleting,
    pauseDuration,
    performanceProfile.ready,
    phraseIdx,
    phrases,
    shouldAnimate,
    typingSpeed,
  ]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayText}</span>
      <span
        aria-hidden="true"
        className={`inline-block w-[2.5px] h-[0.85em] ml-0.5 bg-primary dark:bg-amber-400 ${shouldAnimate ? 'animate-pulse' : ''} align-middle ${cursorClassName}`}
      />
    </span>
  );
}
