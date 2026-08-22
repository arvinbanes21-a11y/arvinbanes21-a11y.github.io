'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export default function TypewriterText({
  phrases = ["Hi, I'm ", "Hello, I'm ", "Welcome, I'm "],
  typingSpeed = 130,
  deletingSpeed = 70,
  pauseDuration = 7000,
  className = '',
  cursorClassName = '',
}: TypewriterTextProps) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];

    let timer: NodeJS.Timeout;

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

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayText}</span>
      <span
        aria-hidden="true"
        className={`inline-block w-[2.5px] h-[0.85em] ml-0.5 bg-primary dark:bg-amber-400 animate-pulse align-middle ${cursorClassName}`}
      />
    </span>
  );
}
