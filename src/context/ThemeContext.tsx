'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Profile,
  Project,
  Certificate,
  INITIAL_LIGHT_PROFILE,
  INITIAL_DARK_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_CERTIFICATES,
} from '@/lib/types';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  isGlitching: boolean;
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateProfile: (mode: 'light' | 'dark', updated: Profile) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const HAS_FIREBASE_CONFIG = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [lightProfile, setLightProfile] = useState<Profile>(INITIAL_LIGHT_PROFILE);
  const [darkProfile, setDarkProfile] = useState<Profile>(INITIAL_DARK_PROFILE);
  const [projectsList, setProjectsList] = useState<Project[]>(INITIAL_PROJECTS);
  const [certificatesList, setCertificatesList] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [loading, setLoading] = useState(true);

  const updateProfile = (mode: 'light' | 'dark', updated: Profile) => {
    if (mode === 'light') {
      setLightProfile(updated);
      try {
        localStorage.setItem('profile_light', JSON.stringify(updated));
      } catch (error) {
        console.warn('Could not cache the light profile:', error);
      }
    } else {
      setDarkProfile(updated);
      try {
        localStorage.setItem('profile_dark', JSON.stringify(updated));
      } catch (error) {
        console.warn('Could not cache the dark profile:', error);
      }
    }
  };

  const hydrateLocalData = () => {
    const savedLight = localStorage.getItem('profile_light');
    if (savedLight) {
      try {
        const parsed = JSON.parse(savedLight);
        setLightProfile({
          ...INITIAL_LIGHT_PROFILE,
          ...parsed,
          bio: INITIAL_LIGHT_PROFILE.bio,
          skills: INITIAL_LIGHT_PROFILE.skills,
          skillCategories: INITIAL_LIGHT_PROFILE.skillCategories,
          experiences: INITIAL_LIGHT_PROFILE.experiences,
        });
      } catch {
        setLightProfile(INITIAL_LIGHT_PROFILE);
      }
    }

    const savedDark = localStorage.getItem('profile_dark');
    if (savedDark) {
      try {
        const parsed = JSON.parse(savedDark);
        setDarkProfile({
          ...INITIAL_DARK_PROFILE,
          ...parsed,
          skills: INITIAL_DARK_PROFILE.skills,
          skillCategories: INITIAL_DARK_PROFILE.skillCategories,
          experiences: INITIAL_DARK_PROFILE.experiences,
        });
      } catch {
        setDarkProfile(INITIAL_DARK_PROFILE);
      }
    }

    const savedProjects = localStorage.getItem('cached_projects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjectsList(
          Array.isArray(parsed) && parsed.length >= INITIAL_PROJECTS.length
            ? parsed
            : INITIAL_PROJECTS
        );
      } catch {
        setProjectsList(INITIAL_PROJECTS);
      }
    }

    const savedCertificates = localStorage.getItem('cached_certificates');
    if (savedCertificates) {
      try {
        const parsed = JSON.parse(savedCertificates);
        const hasCurrentCertificates = Array.isArray(parsed) && parsed.some(
          (certificate) => certificate.id === 'cert-intro-data-science' || certificate.image?.startsWith('/certs/')
        );
        setCertificatesList(hasCurrentCertificates ? parsed : INITIAL_CERTIFICATES);
      } catch {
        setCertificatesList(INITIAL_CERTIFICATES);
      }
    }
  };

  const syncRemoteData = async () => {
    if (!HAS_FIREBASE_CONFIG || !navigator.onLine) return;

    try {
      const [{ db }, firestore] = await Promise.all([
        import('@/lib/firebase'),
        import('firebase/firestore'),
      ]);
      const { doc, getDoc, collection, getDocs } = firestore;

      const [lightResult, darkResult, projectsResult, certificatesResult] = await Promise.allSettled([
        getDoc(doc(db, 'profile', 'light')),
        getDoc(doc(db, 'profile_dark', 'dark')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'certificates')),
      ]);

      if (lightResult.status === 'fulfilled' && lightResult.value.exists()) {
        setLightProfile(lightResult.value.data() as Profile);
      }
      if (darkResult.status === 'fulfilled' && darkResult.value.exists()) {
        setDarkProfile(darkResult.value.data() as Profile);
      }

      if (projectsResult.status === 'fulfilled' && !projectsResult.value.empty) {
        setProjectsList(projectsResult.value.docs.map((projectDoc) => ({
          id: projectDoc.id,
          ...projectDoc.data(),
        } as Project)));
      }

      if (certificatesResult.status === 'fulfilled' && !certificatesResult.value.empty) {
        setCertificatesList(certificatesResult.value.docs.map((certificateDoc) => ({
          id: certificateDoc.id,
          ...certificateDoc.data(),
        } as Certificate)));
      }
    } catch (error) {
      console.warn('Using local portfolio data:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    hydrateLocalData();
    await syncRemoteData();
    setLoading(false);
  };

  useEffect(() => {
    hydrateLocalData();
    setLoading(false);

    if (!HAS_FIREBASE_CONFIG) return;
    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let syncStarted = false;
    const runRemoteSync = () => {
      if (syncStarted || !navigator.onLine) return;
      syncStarted = true;
      void syncRemoteData();
    };
    const idleHandle = idleWindow.requestIdleCallback?.(runRemoteSync, { timeout: 6000 });
    const timer = idleHandle === undefined
      ? window.setTimeout(runRemoteSync, 4500)
      : undefined;
    window.addEventListener('online', runRemoteSync);

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      window.removeEventListener('online', runRemoteSync);
    };
  }, []);

  const toggleTheme = () => {
    setIsGlitching(true);
    window.setTimeout(() => setIsDark((previous) => !previous), 200);
    window.setTimeout(() => setIsGlitching(false), 450);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const activeProfile = isDark ? darkProfile : lightProfile;
  const activeProjects = projectsList.length > 0 ? projectsList : INITIAL_PROJECTS;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        isGlitching,
        profile: activeProfile,
        projects: activeProjects,
        certificates: certificatesList,
        loading,
        refreshData,
        updateProfile,
      }}
    >
      {isGlitching && <div className="glitch-overlay" />}
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
