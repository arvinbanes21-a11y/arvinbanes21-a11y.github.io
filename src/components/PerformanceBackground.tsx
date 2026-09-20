'use client';

import dynamic from 'next/dynamic';
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile';

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), { ssr: false });

const PALETTE = ['#252936', '#5B6472', '#F5B942', '#F9DFA1'];

export default function PerformanceBackground() {
  const { ready, tier, isMobile } = usePerformanceProfile();
  // Preserve the visual background layers on phones without running the
  // continuous WebGL fluid simulation that makes scrolling feel heavy.
  const shouldRenderFluid = ready && tier !== 'static' && !isMobile;
  const isBalanced = tier === 'balanced';

  return (
    <div className={`liquid-ether-bg performance-${ready ? tier : 'pending'}`} aria-hidden="true">
      <div className="background-texture" />
      {shouldRenderFluid && (
        <LiquidEther
          colors={PALETTE}
          mouseForce={isBalanced ? 7 : 10}
          cursorSize={isBalanced ? 90 : 110}
          isViscous={true}
          viscous={isBalanced ? 18 : 24}
          iterationsViscous={isBalanced ? 10 : 24}
          iterationsPoisson={isBalanced ? 14 : 32}
          resolution={isBalanced ? 0.28 : 0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={isBalanced ? 0.16 : 0.22}
          autoIntensity={isBalanced ? 0.9 : 1.15}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          maxPixelRatio={isBalanced ? 1 : 2}
          maxFps={isBalanced ? 30 : 60}
          antialias={!isBalanced}
          interactive={!isBalanced}
        />
      )}
    </div>
  );
}
