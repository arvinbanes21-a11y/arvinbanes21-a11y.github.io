'use client';

import dynamic from 'next/dynamic';
import { Component, ReactNode, useCallback, useEffect, useState } from 'react';
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile';
import { getOptimizedPortraitUrl } from '@/lib/media';

const Lanyard = dynamic(() => import('@/components/Lanyard'), { ssr: false });

interface AdaptiveLanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardColor?: string;
  lanyardWidth?: number;
  lanyardImage?: string | null;
}

class LanyardErrorBoundary extends Component<{
  children: ReactNode;
  onError: () => void;
  resetKey: string;
}, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('Interactive lanyard unavailable; keeping the static card.', error);
    this.props.onError();
  }

  componentDidUpdate(previousProps: Readonly<{ resetKey: string }>) {
    if (this.state.failed && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function StaticLanyard({ frontImage }: Pick<AdaptiveLanyardProps, 'frontImage'>) {
  return (
    <div className="static-lanyard" aria-label="Profile identification card">
      <div className="static-lanyard-strap" />
      <div className="static-lanyard-clip" />
      <div className="static-lanyard-card">
        <div className="static-lanyard-slot" />
        <img
          src={getOptimizedPortraitUrl(frontImage)}
          alt=""
          width={420}
          height={520}
          decoding="async"
          fetchPriority="high"
          className="static-lanyard-photo"
        />
        <div className="static-lanyard-meta">
          <strong>ARVIN F. BAÑES</strong>
          <span>DEV ACCESS</span>
        </div>
      </div>
    </div>
  );
}

export default function AdaptiveLanyard(props: AdaptiveLanyardProps) {
  const { ready, tier } = usePerformanceProfile();
  const [readySceneKey, setReadySceneKey] = useState<string | null>(null);
  const [showStaticFallback, setShowStaticFallback] = useState(true);
  const [mount3D, setMount3D] = useState(false);
  const optimizedProps = {
    ...props,
    frontImage: getOptimizedPortraitUrl(props.frontImage),
    backImage: props.backImage ? getOptimizedPortraitUrl(props.backImage) : props.backImage,
  };
  const currentSceneKey = `${tier}:${optimizedProps.frontImage || ''}:${optimizedProps.backImage || ''}`;
  const sceneReady = readySceneKey === currentSceneKey;
  const handleSceneReady = useCallback(() => {
    setReadySceneKey(currentSceneKey);
  }, [currentSceneKey]);
  const handleSceneError = useCallback(() => {
    setReadySceneKey(null);
    setShowStaticFallback(true);
  }, []);

  // Paint the static card first; fetch the 3D chunk and card.glb once the page
  // has loaded and the browser is idle (the 2.3 MB model otherwise competes
  // with first paint).
  useEffect(() => {
    if (!ready || tier === 'static') return;
    let idle: number | undefined;
    const start = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setMount3D(true), { timeout: 2000 })
        : window.setTimeout(() => setMount3D(true), 300);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      if (idle !== undefined) (window.cancelIdleCallback || clearTimeout)(idle);
    };
  }, [ready, tier]);

  // Reserve the portrait space during hydration without briefly showing the
  // old HTML ID card. That card remains available only for devices that
  // cannot run WebGL or when the interactive scene fails.
  if (!ready) {
    return <div className="w-full h-full min-h-[400px]" aria-busy="true" />;
  }

  if (tier === 'static') {
    return <StaticLanyard frontImage={props.frontImage} />;
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {mount3D && (
        <LanyardErrorBoundary
          resetKey={currentSceneKey}
          onError={handleSceneError}
        >
          <Lanyard
            {...optimizedProps}
            quality={tier === 'balanced' ? 'balanced' : 'full'}
            onReady={handleSceneReady}
          />
        </LanyardErrorBoundary>
      )}
      {showStaticFallback && (
        <div
          aria-hidden={sceneReady}
          className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${sceneReady ? 'opacity-0' : 'opacity-100'}`}
        >
          <StaticLanyard frontImage={props.frontImage} />
        </div>
      )}
    </div>
  );
}
