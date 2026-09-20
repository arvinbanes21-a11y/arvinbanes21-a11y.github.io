'use client';

import { useSyncExternalStore } from 'react';

export type PerformanceTier = 'full' | 'balanced' | 'static';

interface NetworkInformationLike extends EventTarget {
  saveData?: boolean;
}

interface NavigatorWithHints extends Navigator {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
}

export interface PerformanceProfile {
  ready: boolean;
  tier: PerformanceTier;
  isMobile: boolean;
  hasCoarsePointer: boolean;
  prefersReducedMotion: boolean;
  saveData: boolean;
}

const INITIAL_PROFILE: PerformanceProfile = {
  ready: false,
  tier: 'balanced',
  isMobile: false,
  hasCoarsePointer: false,
  prefersReducedMotion: false,
  saveData: false,
};

let currentProfile = INITIAL_PROFILE;
let stopBrowserListeners: (() => void) | null = null;
const subscribers = new Set<() => void>();

function hasWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

function startBrowserListeners() {
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = navigator as NavigatorWithHints;
  const connection = nav.connection;
  const webGLAvailable = hasWebGLSupport();

  const updateProfile = () => {
    const isMobile = mobileQuery.matches;
    const hasCoarsePointer = coarsePointerQuery.matches;
    const prefersReducedMotion = reducedMotionQuery.matches;
    const saveData = Boolean(connection?.saveData);
    const memory = nav.deviceMemory;
    const cores = nav.hardwareConcurrency;
    const constrainedHardware =
      (typeof memory === 'number' && memory <= 2) ||
      (typeof cores === 'number' && cores <= 2);

    let tier: PerformanceTier = 'full';
    if (
      !webGLAvailable ||
      prefersReducedMotion ||
      saveData ||
      ((isMobile || hasCoarsePointer) && constrainedHardware)
    ) {
      tier = 'static';
    } else if (isMobile || hasCoarsePointer) {
      tier = 'balanced';
    }

    currentProfile = {
      ready: true,
      tier,
      isMobile,
      hasCoarsePointer,
      prefersReducedMotion,
      saveData,
    };
    subscribers.forEach((notify) => notify());
  };

  updateProfile();
  const listenToMediaQuery = (query: MediaQueryList) => {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', updateProfile);
      return () => query.removeEventListener('change', updateProfile);
    }
    query.addListener(updateProfile);
    return () => query.removeListener(updateProfile);
  };
  const removeMobileListener = listenToMediaQuery(mobileQuery);
  const removeCoarsePointerListener = listenToMediaQuery(coarsePointerQuery);
  const removeReducedMotionListener = listenToMediaQuery(reducedMotionQuery);
  connection?.addEventListener?.('change', updateProfile);

  return () => {
    removeMobileListener();
    removeCoarsePointerListener();
    removeReducedMotionListener();
    connection?.removeEventListener?.('change', updateProfile);
  };
}

function subscribe(notify: () => void) {
  subscribers.add(notify);
  if (!stopBrowserListeners) stopBrowserListeners = startBrowserListeners();

  return () => {
    subscribers.delete(notify);
    if (subscribers.size === 0 && stopBrowserListeners) {
      stopBrowserListeners();
      stopBrowserListeners = null;
    }
  };
}

function getSnapshot() {
  return currentProfile;
}

function getServerSnapshot() {
  return INITIAL_PROFILE;
}

/** One shared capability profile for every animation and rendering consumer. */
export function usePerformanceProfile(): PerformanceProfile {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
