'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCw } from 'lucide-react';

interface Spark {
  id: number;
  dx: number;
  dy: number;
  size: number;
}

interface DecoyParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  glow: string;
  baseOpacity: number;
}

export interface CollagePhoto {
  id: number;
  title: string;
  date: string;
  caption: string;
  category: string;
  imageUrl: string;
  xOffset?: number; // Horizontal pan offset
  yOffset?: number; // Vertical pan offset
  scale?: number;   // Zoom scale
}

export const DEFAULT_COLLAGE_PHOTOS: CollagePhoto[] = [
  // Center Core
  {
    id: 1,
    title: 'The Origin & Core',
    date: 'University of San Agustin',
    caption: 'The foundation of my Computer Science journey at USA.',
    category: 'Center Core',
    imageUrl: '/gallery/optimized/IMG_5297.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
  // Middle Ring (6 Arc Wedges)
  {
    id: 2,
    title: 'Algorithms & Data Structures',
    date: 'Year 1 • CS Core',
    caption: 'Mastering pointer mechanics, recursion, and sorting algorithms in C/C++.',
    category: 'Middle Arc #1',
    imageUrl: '/gallery/optimized/IMG_4367.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
  {
    id: 3,
    title: 'NOTER UI Workspace',
    date: 'Year 2 • Web Systems',
    caption: 'Building high-performance design tokens and developer note workspaces.',
    category: 'Middle Arc #2',
    imageUrl: '/gallery/optimized/e9384b143857f9dfc9ec7735020ecedc.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
  {
    id: 4,
    title: 'SPTS Online Tutoring Platform',
    date: 'Year 3 • Capstone',
    caption: 'Peer learning matching system connecting USA students with verified tutors.',
    category: 'Capstone',
    imageUrl: '/gallery/optimized/IMG_5024.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
  {
    id: 5,
    title: 'AR Food Volume Estimation',
    date: 'Year 4 • Research',
    caption: '3D spatial camera meshing and computer vision volume estimation shaders.',
    category: 'Research',
    imageUrl: '/gallery/optimized/IMG_5400.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
  {
    id: 6,
    title: 'Hackathon Production Pushes',
    date: 'USA Student Chapter',
    caption: 'Late night coding sprints, energy drinks, and live deployment deadlines.',
    category: 'Hackathons',
    imageUrl: '/gallery/optimized/IMG_5912.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
  {
    id: 7,
    title: 'AI System Engineering',
    date: 'Present & Beyond',
    caption: 'Agentic workflows, modern web frameworks, and synthetic AI architectures.',
    category: 'Middle Arc #6',
    imageUrl: '/gallery/optimized/IMG_7466.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
  // Outer Ring (3 Sweeping Arcs)
  {
    id: 8,
    title: 'Campus Life & Collaboration',
    date: 'University of San Agustin',
    caption: 'Working together with peer developers on capstone projects and lab work.',
    category: 'Outer Arc #1',
    imageUrl: '/gallery/optimized/IMG_5374.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
  {
    id: 9,
    title: 'Creative Code & Shaders',
    date: 'Late-Night R&D',
    caption: 'Experimenting with HTML5 Canvas, WebGL, and organic background physics.',
    category: 'Outer Arc #2',
    imageUrl: '/gallery/optimized/e09a30b48f59fdf634f8df966719737d.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
  {
    id: 10,
    title: 'The Alter-Ego Portfolio',
    date: 'Corporate & Chaotic',
    caption: 'Dual theme architecture balancing client precision with unhinged creativity.',
    category: 'Outer Arc #3',
    imageUrl: '/gallery/optimized/3598eea636dc6e1329bb917794b736c2.jpeg',
    xOffset: 0,
    yOffset: 0,
    scale: 1,
  },
];

// Helper to generate SVG polar arc path string with ZERO gaps
export function makeArcPath(cx: number, cy: number, r1: number, r2: number, startAngleDeg: number, endAngleDeg: number, gapDeg = 0) {
  const a1 = ((startAngleDeg + gapDeg / 2) * Math.PI) / 180;
  const a2 = ((endAngleDeg - gapDeg / 2) * Math.PI) / 180;

  const x1 = cx + r2 * Math.cos(a1);
  const y1 = cy + r2 * Math.sin(a1);
  const x2 = cx + r2 * Math.cos(a2);
  const y2 = cy + r2 * Math.sin(a2);

  const x3 = cx + r1 * Math.cos(a2);
  const y3 = cy + r1 * Math.sin(a2);
  const x4 = cx + r1 * Math.cos(a1);
  const y4 = cy + r1 * Math.sin(a1);

  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${r2} ${r2} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

export const ARC_DEFINITIONS = [
  { id: 1, type: 'circle', r: 72 },

  { id: 2, type: 'arc', r1: 72, r2: 160, start: -90, end: -30 },
  { id: 3, type: 'arc', r1: 72, r2: 160, start: -30, end: 30 },
  { id: 4, type: 'arc', r1: 72, r2: 160, start: 30, end: 90 },
  { id: 5, type: 'arc', r1: 72, r2: 160, start: 90, end: 150 },
  { id: 6, type: 'arc', r1: 72, r2: 160, start: 150, end: 210 },
  { id: 7, type: 'arc', r1: 72, r2: 160, start: 210, end: 270 },

  { id: 8, type: 'arc', r1: 160, r2: 242, start: -90, end: 30 },
  { id: 9, type: 'arc', r1: 160, r2: 242, start: 30, end: 150 },
  { id: 10, type: 'arc', r1: 160, r2: 242, start: 150, end: 270 },
];

export function getSliceCentroid(id: number) {
  if (id === 1) return { cx: 250, cy: 250, size: 280 };

  const def = ARC_DEFINITIONS.find((d) => d.id === id);
  if (!def || def.type !== 'arc') return { cx: 250, cy: 250, size: 300 };

  const midR = (def.r1! + def.r2!) / 2;
  const midAngleRad = (((def.start! + def.end!) / 2) * Math.PI) / 180;
  const radialSpan = def.r2! - def.r1!;

  return {
    cx: 250 + midR * Math.cos(midAngleRad),
    cy: 250 + midR * Math.sin(midAngleRad),
    size: Math.max(340, radialSpan * 2.8),
  };
}

// Decoy Particles positioned safely away from profile picture column
const INITIAL_DECOYS: DecoyParticle[] = [
  { id: 1, x: 120, y: 150, vx: -0.22, vy: 0.25, size: 14, color: '#FFD700', glow: 'rgba(255,215,0,0.6)', baseOpacity: 0.8 },
  { id: 2, x: 280, y: 420, vx: 0.25, vy: -0.28, size: 18, color: '#E6A100', glow: 'rgba(230,161,0,0.5)', baseOpacity: 0.75 },
  { id: 3, x: 150, y: 580, vx: -0.25, vy: -0.28, size: 12, color: '#FFF0A5', glow: 'rgba(255,240,165,0.7)', baseOpacity: 0.85 },
  { id: 4, x: 320, y: 200, vx: 0.28, vy: 0.24, size: 16, color: '#F39C12', glow: 'rgba(243,156,18,0.6)', baseOpacity: 0.7 },
  { id: 5, x: 340, y: 680, vx: -0.22, vy: 0.22, size: 20, color: '#F1C40F', glow: 'rgba(241,196,15,0.5)', baseOpacity: 0.65 },
  { id: 6, x: 250, y: 850, vx: 0.28, vy: -0.25, size: 13, color: '#D4AC0D', glow: 'rgba(212,172,13,0.6)', baseOpacity: 0.75 },
  { id: 7, x: 120, y: 100, vx: -0.25, vy: -0.21, size: 15, color: '#F5B942', glow: 'rgba(245,185,66,0.4)', baseOpacity: 0.6 },
  { id: 8, x: 90, y: 300, vx: 0.21, vy: -0.25, size: 11, color: '#6366F1', glow: 'rgba(99,102,241,0.6)', baseOpacity: 0.8 },
  { id: 9, x: 220, y: 710, vx: -0.29, vy: 0.29, size: 17, color: '#FF6D00', glow: 'rgba(255,109,0,0.5)', baseOpacity: 0.7 },
  { id: 10, x: 310, y: 780, vx: 0.23, vy: -0.24, size: 10, color: '#FFFFFF', glow: 'rgba(255,255,255,0.8)', baseOpacity: 0.85 },
];

export default function GoldenParticleEasterEgg() {
  // 1. THE 1 TRUE SECRET INTERACTIVE EASTER EGG PARTICLE
  const dotRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: 120, y: 120 });
  const velRef = useRef({ vx: 0.35, vy: 0.25 });

  // 2. Decoy Particles
  const decoysRef = useRef<DecoyParticle[]>(INITIAL_DECOYS);
  const decoyElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isExploded, setIsExploded] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [tapCoords, setTapCoords] = useState<{ x: number; y: number } | null>(null);
  
  // Custom photo list state
  const [photosList, setPhotosList] = useState<CollagePhoto[]>(DEFAULT_COLLAGE_PHOTOS);

  // Hover & Portal state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hoveredPhotoId, setHoveredPhotoId] = useState<number | null>(null);
  const [rotationDeg, setRotationDeg] = useState(0);

  const [portalStyle, setPortalStyle] = useState<{
    left: number;
    top: number;
    size: number;
    originX: number;
    originY: number;
  } | null>(null);

  // Smooth RAF interpolation for wedge outer-radius expansion per slice
  const [hoverProgresses, setHoverProgresses] = useState<{ [key: number]: number }>({});
  const hoverAnimRef = useRef<{ [key: number]: number }>({});

  const loadCustomPhotos = useCallback(() => {
    try {
      const saved = localStorage.getItem('easter_egg_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPhotosList(parsed);
        }
      }
    } catch (err) {
      console.warn("Could not parse saved easter egg photos:", err);
    }
  }, []);

  useEffect(() => {
    loadCustomPhotos();
    const handleStorage = () => loadCustomPhotos();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadCustomPhotos]);

  // --- 1. Master Wandering Loop with Zero Profile Picture Interception / Fading ---
  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${window.innerWidth - 80}px, ${window.innerHeight - 80}px, 0)`;
      }
      return;
    }

    let rafId: number;

    const updateMotion = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = 44;

      // Query Profile Picture containers
      const profilePicNodes = typeof document !== 'undefined'
        ? document.querySelectorAll('[data-profile-picture="true"]')
        : [];

      const profileRects: DOMRect[] = [];
      profilePicNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < vh) {
          profileRects.push(rect);
        }
      });

      // Calculate particle proximity factor to profile picture (1.0 = normal, 0.0 = completely invisible near profile)
      const getProfileProximityOpacity = (px: number, py: number, baseOp: number) => {
        let opacityMultiplier = 1.0;
        const particleCenterX = px + 22;
        const particleCenterY = py + 22;

        for (const rect of profileRects) {
          // Bounding box with 80px fade buffer
          const fadeBuffer = 90;
          const closestX = Math.max(rect.left, Math.min(particleCenterX, rect.right));
          const closestY = Math.max(rect.top, Math.min(particleCenterY, rect.bottom));

          const dx = particleCenterX - closestX;
          const dy = particleCenterY - closestY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < fadeBuffer) {
            // Smoothly dissolve particle opacity to 0 near profile picture zone
            const factor = Math.max(0, dist / fadeBuffer);
            opacityMultiplier = Math.min(opacityMultiplier, factor * factor);
          }
        }

        return baseOp * opacityMultiplier;
      };

      // --- A. Move 1 True Secret Interactive Color-Pulsing Particle ---
      if (!isExploded && !isGalleryOpen) {
        let { x, y } = posRef.current;
        let { vx, vy } = velRef.current;

        x += vx;
        y += vy;

        if (x <= 10) {
          x = 10;
          velRef.current.vx = Math.abs(vx);
        } else if (x >= vw - size - 10) {
          x = vw - size - 10;
          velRef.current.vx = -Math.abs(vx);
        }

        if (y <= 10) {
          y = 10;
          velRef.current.vy = Math.abs(vy);
        } else if (y >= vh - size - 10) {
          y = vh - size - 10;
          velRef.current.vy = -Math.abs(vy);
        }

        posRef.current = { x, y };

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          const currentOpacity = getProfileProximityOpacity(x, y, 1.0);
          dotRef.current.style.opacity = currentOpacity.toFixed(2);
        }
      }

      // --- B. Move Decoy Particles ---
      decoysRef.current.forEach((decoy, index) => {
        let { x, y, vx, vy } = decoy;

        x += vx;
        y += vy;

        if (x <= 10) {
          x = 10;
          decoy.vx = Math.abs(vx);
        } else if (x >= vw - size - 10) {
          x = vw - size - 10;
          decoy.vx = -Math.abs(vx);
        }

        if (y <= 10) {
          y = 10;
          decoy.vy = Math.abs(vy);
        } else if (y >= vh - size - 10) {
          y = vh - size - 10;
          decoy.vy = -Math.abs(vy);
        }

        decoy.x = x;
        decoy.y = y;

        const el = decoyElementsRef.current[index];
        if (el) {
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          const currentOpacity = getProfileProximityOpacity(x, y, decoy.baseOpacity);
          el.style.opacity = currentOpacity.toFixed(2);
        }
      });

      rafId = requestAnimationFrame(updateMotion);
    };

    rafId = requestAnimationFrame(updateMotion);

    return () => cancelAnimationFrame(rafId);
  }, [isExploded, isGalleryOpen]);

  // --- 2. Smooth 60FPS Outer Radius Expansion Animation Loop ---
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const updateProgresses = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      let changed = false;
      const newProgresses: { [key: number]: number } = { ...hoverAnimRef.current };

      ARC_DEFINITIONS.forEach((def) => {
        const isHovered = hoveredPhotoId === def.id;
        const target = isHovered ? 1.0 : 0.0;
        const current = newProgresses[def.id] || 0.0;

        if (Math.abs(current - target) > 0.001) {
          const step = (target - current) * Math.min(1.0, dt * 14.0);
          newProgresses[def.id] = current + step;
          changed = true;
        } else {
          newProgresses[def.id] = target;
        }
      });

      if (changed) {
        hoverAnimRef.current = newProgresses;
        setHoverProgresses({ ...newProgresses });
      }

      animFrame = requestAnimationFrame(updateProgresses);
    };

    animFrame = requestAnimationFrame(updateProgresses);

    return () => cancelAnimationFrame(animFrame);
  }, [hoveredPhotoId]);

  // --- 3. Calculate Viewport-Clamped Circular Portal Position ---
  const calculateClampedCircularPortalPos = useCallback((clientX: number, clientY: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const size = Math.min(520, Math.min(vw - 24, vh - 24));
    const radius = size / 2;

    let left = clientX - radius;
    let top = clientY - radius;

    left = Math.min(Math.max(12, left), vw - size - 12);
    top = Math.min(Math.max(12, top), vh - size - 12);

    const originX = clientX - left;
    const originY = clientY - top;

    return { left, top, size, originX, originY };
  }, []);

  // --- 4. Trigger Explosion & Open Collage ---
  const triggerTapSuccess = useCallback((clientX: number, clientY: number) => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const generatedSparks: Spark[] = Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const distance = 55 + Math.random() * 70;
        return {
          id: i,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          size: 4 + Math.random() * 5,
        };
      });
      setSparks(generatedSparks);
      setTimeout(() => setSparks([]), 650);
    }

    const portal = calculateClampedCircularPortalPos(clientX, clientY);
    setTapCoords({ x: clientX, y: clientY });
    setPortalStyle(portal);

    setHoveredPhotoId(null);
    setRotationDeg(0);
    setIsExploded(true);
    setIsGalleryOpen(true);
  }, [calculateClampedCircularPortalPos]);

  const handleTap = (e: React.PointerEvent) => {
    e.preventDefault();
    triggerTapSuccess(e.clientX, e.clientY);
  };

  // --- 5. Close with Out-Transition ---
  const handleCloseGallery = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    
    setTimeout(() => {
      setIsGalleryOpen(false);
      setIsClosing(false);
      setHoveredPhotoId(null);
      setRotationDeg(0);
      
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      posRef.current = {
        x: tapCoords ? Math.min(vw - 60, Math.max(40, tapCoords.x)) : Math.random() * (vw - 120) + 60,
        y: tapCoords ? Math.min(vh - 60, Math.max(40, tapCoords.y)) : Math.random() * (vh - 120) + 60,
      };
      velRef.current = {
        vx: (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.2),
        vy: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.2),
      };
      setIsExploded(false);
    }, 340);
  }, [isClosing, tapCoords]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return;
      if (e.key === 'Escape') {
        handleCloseGallery();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, handleCloseGallery]);

  const handleRotateWheel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotationDeg((prev) => prev + 60);
  };

  // Sort definitions so hovered/expanding arc slice draws at top of layer stack
  const sortedArcDefs = [...ARC_DEFINITIONS].sort((a, b) => {
    if (a.id === hoveredPhotoId) return 1;
    if (b.id === hoveredPhotoId) return -1;
    return 0;
  });

  return (
    <>
      {/* 1. THE 1 TRUE SECRET INTERACTIVE EASTER EGG PARTICLE */}
      {!isExploded && (
        <div
          ref={dotRef}
          onPointerDown={handleTap}
          className="fixed top-0 left-0 z-[150] w-[44px] h-[44px] flex items-center justify-center cursor-pointer select-none touch-none transition-opacity duration-300"
          title="Tap to unlock secret photo collage"
          role="button"
          aria-label="Secret Multi-Color Neon Particle. Tap to unlock secret photo collage."
        >
          <div className="w-[18px] h-[18px] rounded-full animate-secretPulseColor transition-transform active:scale-125 hover:scale-110" />
        </div>
      )}

      {/* 2. DECOY PARTICLES (FADE TO INVISIBLE NEAR PROFILE PICTURE ZONE) */}
      {INITIAL_DECOYS.map((decoy, index) => (
        <div
          key={decoy.id}
          ref={(el) => { decoyElementsRef.current[index] = el; }}
          className="fixed top-0 left-0 z-[140] w-[44px] h-[44px] flex items-center justify-center pointer-events-none select-none transition-opacity duration-300"
          aria-hidden="true"
        >
          <div
            className="rounded-full transition-transform"
            style={{
              width: decoy.size,
              height: decoy.size,
              backgroundColor: decoy.color,
              boxShadow: `0 0 14px ${decoy.glow}`,
            }}
          />
        </div>
      ))}

      {/* 3. Particle Ring Explosion Sparks */}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="fixed pointer-events-none rounded-full bg-[#F5B942] shadow-[0_0_12px_#F5B942] z-[190] animate-sparkBurst"
          style={{
            left: tapCoords?.x,
            top: tapCoords?.y,
            width: spark.size,
            height: spark.size,
            '--dx': `${spark.dx}px`,
            '--dy': `${spark.dy}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* 4. Pure Photo Arc Collage Portal */}
      {isGalleryOpen && portalStyle && (
        <div
          className={`fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={handleCloseGallery}
        >
          <div
            className={`fixed z-[210] rounded-full border-4 border-[#F5B942] shadow-[0_0_80px_rgba(245,185,66,0.65)] bg-slate-950 flex items-center justify-center p-0 select-none overflow-visible ${isClosing ? 'animate-circleUnmorph' : 'animate-circleMorph'}`}
            style={{
              left: portalStyle.left,
              top: portalStyle.top,
              width: portalStyle.size,
              height: portalStyle.size,
              transformOrigin: `${portalStyle.originX}px ${portalStyle.originY}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ROTATION TOGGLE BUTTON FLOATING OUTSIDE ON THE RIGHT */}
            <button
              onClick={handleRotateWheel}
              className="absolute -right-16 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-950/95 border-2 border-[#F5B942] text-[#F5B942] hover:bg-[#F5B942] hover:text-slate-950 transition-all shadow-[0_0_25px_rgba(245,185,66,0.7)] active:scale-90"
              title="Rotate collage wheel"
              aria-label="Rotate collage wheel clockwise"
            >
              <RotateCw className="w-5 h-5 transition-transform duration-300 active:rotate-180" />
            </button>

            {/* 100% PURE PHOTO COLLAGE MATRIX WITH 1 NON-REPEATING IMAGE PER FRAME */}
            <div className="relative w-full h-full flex items-center justify-center p-0 m-0 overflow-visible">
              <svg
                viewBox="0 0 500 500"
                className="w-full h-full overflow-visible transition-transform duration-700 ease-out"
                style={{
                  transform: `rotate(${rotationDeg}deg)`,
                  transformOrigin: '250px 250px',
                }}
              >
                <defs>
                  {/* Dynamic SVG clipPaths for each arc slice frame */}
                  {sortedArcDefs.map((def) => {
                    const progress = hoverProgresses[def.id] || 0.0;
                    const expandedR2 = def.type === 'arc'
                      ? def.r2! + (def.r2! * 0.68) * progress
                      : def.r! + (def.r! * 0.68) * progress;

                    const pathData = def.type === 'arc'
                      ? makeArcPath(250, 250, def.r1!, expandedR2, def.start!, def.end!, 0)
                      : '';

                    return (
                      <clipPath key={`portal-clip-${def.id}`} id={`portal-clip-${def.id}`}>
                        {def.type === 'circle' ? (
                          <circle cx="250" cy="250" r={expandedR2} />
                        ) : (
                          <path d={pathData} />
                        )}
                      </clipPath>
                    );
                  })}

                  <filter id="hover-wedge-glow" x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#F5B942" floodOpacity="0.95" />
                  </filter>
                </defs>

                {/* Render Concentric Slices: 1 Non-Tiling Centered Image Per Frame */}
                {sortedArcDefs.map((def) => {
                  const photo = photosList.find((p) => p.id === def.id) || DEFAULT_COLLAGE_PHOTOS.find((p) => p.id === def.id);
                  if (!photo) return null;

                  const isHovered = hoveredPhotoId === photo.id;
                  const progress = hoverProgresses[photo.id] || 0.0;

                  const expandedR2 = def.type === 'arc'
                    ? def.r2! + (def.r2! * 0.68) * progress
                    : def.r! + (def.r! * 0.68) * progress;

                  const pathData = def.type === 'arc'
                    ? makeArcPath(250, 250, def.r1!, expandedR2, def.start!, def.end!, 0)
                    : '';

                  const centroid = getSliceCentroid(def.id);
                  const xOff = photo.xOffset || 0;
                  const yOff = photo.yOffset || 0;
                  const sc = photo.scale || 1.0;
                  const imgSize = centroid.size;

                  return (
                    <g
                      key={def.id}
                      className="cursor-pointer group overflow-visible"
                      onMouseEnter={() => setHoveredPhotoId(photo.id)}
                      onMouseLeave={() => setHoveredPhotoId(null)}
                      onPointerDown={() => setHoveredPhotoId(photo.id)}
                      onPointerUp={() => setHoveredPhotoId(null)}
                    >
                      {/* Clipped Single Image Frame (Zero Tiling / Zero Repeat) */}
                      <g clipPath={`url(#portal-clip-${def.id})`}>
                        <image
                          href={photo.imageUrl}
                          x={centroid.cx - imgSize / 2}
                          y={centroid.cy - imgSize / 2}
                          width={imgSize}
                          height={imgSize}
                          preserveAspectRatio="xMidYMid slice"
                          style={{
                            transform: `translate(${xOff}px, ${yOff}px) scale(${sc})`,
                            transformOrigin: `${centroid.cx}px ${centroid.cy}px`,
                            opacity: hoveredPhotoId !== null && !isHovered ? 0.85 : 1,
                          }}
                        />
                      </g>

                      {/* Golden Border Outline */}
                      {def.type === 'circle' ? (
                        <circle
                          cx="250"
                          cy="250"
                          r={expandedR2}
                          fill="none"
                          stroke={progress > 0.05 ? '#F5B942' : 'rgba(255,255,255,0.4)'}
                          strokeWidth={progress > 0.05 ? 5.5 : 1.5}
                          style={{
                            filter: progress > 0.05 ? 'url(#hover-wedge-glow)' : 'none',
                          }}
                        />
                      ) : (
                        <path
                          d={pathData}
                          fill="none"
                          stroke={progress > 0.05 ? '#F5B942' : 'rgba(255,255,255,0.3)'}
                          strokeWidth={progress > 0.05 ? 5 : 1}
                          style={{
                            filter: progress > 0.05 ? 'url(#hover-wedge-glow)' : 'none',
                          }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
