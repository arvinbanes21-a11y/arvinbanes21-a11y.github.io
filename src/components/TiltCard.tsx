'use client';

import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onClick?: () => void;
}

export default function TiltCard({ children, className = '', onMouseEnter, onClick }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation angles (max 12deg tilt)
    const rY = ((mouseX - width / 2) / (width / 2)) * 10;
    const rX = -((mouseY - height / 2) / (height / 2)) * 10;

    setRotateX(rX);
    setRotateY(rY);

    // Calculate glow light coordinates
    const glowX = (mouseX / width) * 100;
    const glowY = (mouseY / height) * 100;
    setGlowPos({ x: glowX, y: glowY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: '1000px',
      }}
      className="relative h-full w-full"
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        className={`relative h-full w-full rounded-[28px] overflow-hidden ${className}`}
      >
        {/* Dynamic Light Radial Glow */}
        <div
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255, 255, 255, 0.35), transparent 70%)`
              : 'none',
          }}
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        />

        {children}
      </div>
    </div>
  );
}
