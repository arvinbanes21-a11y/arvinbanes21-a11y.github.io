'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const lightColors = ['#0b3964', '#f27e13', '#f5ce04', '#737780'];
    const darkColors = ['#00f0ff', '#f27e13', '#ffaa00', '#1a5fb4', '#ffffff'];

    const currentPalette = isDark ? darkColors : lightColors;

    // Rich particle density (~350 particles)
    const particleCount = Math.min(Math.floor((width * height) / 2000), 380);
    const particles: Particle[] = [];

    // Mouse state
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2.5 + 1.2,
          color: currentPalette[Math.floor(Math.random() * currentPalette.length)],
        });
      }
    }

    initParticles();

    function render() {
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Distance from mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repulsion force
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 5;
          const pushY = Math.sin(angle) * force * 5;

          p.vx -= pushX;
          p.vy -= pushY;
        }

        // Return spring
        const springX = (p.originX - p.x) * 0.05;
        const springY = (p.originY - p.y) * 0.05;
        p.vx += springX;
        p.vy += springY;

        // Friction
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        // Proximity hover factor
        const hoverFactor = dist < mouse.radius ? (1 - dist / mouse.radius) : 0;

        // Draw background particle
        ctx.beginPath();
        const currentSize = p.size * (1 + hoverFactor * 0.9);
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        const baseAlpha = isDark ? 0.08 : 0.05;
        const hoverBoost = hoverFactor * (1.0 - baseAlpha);
        ctx.globalAlpha = baseAlpha + hoverBoost;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (pDist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            
            const dx2 = mouse.x - p2.x;
            const dy2 = mouse.y - p2.y;
            const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            const avgDist = (dist + dist2) / 2;
            
            const baseLineAlpha = isDark ? 0.08 : 0.05;
            const lineHoverBoost = avgDist < mouse.radius ? (1 - avgDist / mouse.radius) * (isDark ? 0.65 : 0.45) : 0;
            ctx.globalAlpha = (1 - pDist / 110) * (baseLineAlpha + lineHoverBoost);
            
            const lineThickness = 0.9 * (1 + (avgDist < mouse.radius ? (1 - avgDist / mouse.radius) * 1.5 : 0));
            ctx.lineWidth = lineThickness;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
