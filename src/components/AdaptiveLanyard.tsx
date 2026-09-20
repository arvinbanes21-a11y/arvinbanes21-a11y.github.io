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
  const [canUpgradeBalancedScene, setCanUpgradeBalancedScene] = useState(false);
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
  const handleSceneError = useCallback(() => setReadySceneKey(null), []);

  useEffect(() => {
    if (!ready || tier !== 'balanced') {
      setCanUpgradeBalancedScene(false);
      return;
    }

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idleHandle: number | undefined;
    const delayTimer = window.setTimeout(() => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(
          () => setCanUpgradeBalancedScene(true),
          { timeout: 2600 }
        );
      } else {
        setCanUpgradeBalancedScene(true);
      }
    }, 1000);

    return () => {
      window.clearTimeout(delayTimer);
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
    };
  }, [ready, tier]);

  if (!ready || tier === 'static' || (tier === 'balanced' && !canUpgradeBalancedScene)) {
    return <StaticLanyard frontImage={props.frontImage} />;
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
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
      <div
        aria-hidden={sceneReady}
        className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${sceneReady ? 'opacity-0' : 'opacity-100'}`}
      >
        <StaticLanyard frontImage={props.frontImage} />
      </div>
    </div>
  );
}
