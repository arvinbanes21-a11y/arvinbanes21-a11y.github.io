'use me';
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, Project, Certificate, INITIAL_LIGHT_PROFILE, INITIAL_DARK_PROFILE, INITIAL_PROJECTS, INITIAL_CERTIFICATES } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

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
      } catch (err) {
        console.warn('localStorage quota exceeded for profile_light cache, updating in memory state:', err);
      }
    } else {
      setDarkProfile(updated);
      try {
        localStorage.setItem('profile_dark', JSON.stringify(updated));
      } catch (err) {
        console.warn('localStorage quota exceeded for profile_dark cache, updating in memory state:', err);
      }
    }
  };

  const refreshData = async () => {
    // Check localStorage cache first for immediate client persistence
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
      } catch (e) {
        setLightProfile(INITIAL_LIGHT_PROFILE);
      }
    } else {
      setLightProfile(INITIAL_LIGHT_PROFILE);
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
      } catch (e) {
        setDarkProfile(INITIAL_DARK_PROFILE);
      }
    } else {
      setDarkProfile(INITIAL_DARK_PROFILE);
    }

    const savedProjects = localStorage.getItem('cached_projects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PROJECTS.length) {
          setProjectsList(parsed);
        } else {
          setProjectsList(INITIAL_PROJECTS);
        }
      } catch (e) {
        setProjectsList(INITIAL_PROJECTS);
      }
    } else {
      setProjectsList(INITIAL_PROJECTS);
    }

    const savedCerts = localStorage.getItem('cached_certificates');
    if (savedCerts) {
      try {
        const parsed = JSON.parse(savedCerts);
        // If parsed certs still contain outdated unsplash placeholders for the first two certs, sync with INITIAL_CERTIFICATES
        if (Array.isArray(parsed) && parsed.some(c => c.id === 'cert-intro-data-science' || c.image?.startsWith('/certs/'))) {
          setCertificatesList(parsed);
        } else {
          setCertificatesList(INITIAL_CERTIFICATES);
        }
      } catch (e) {
        setCertificatesList(INITIAL_CERTIFICATES);
      }
    } else {
      setCertificatesList(INITIAL_CERTIFICATES);
    }

    try {
      // Fetch Light Profile from Firestore
      const lightDoc = await getDoc(doc(db, 'profile', 'light'));
      if (lightDoc.exists()) {
        const data = lightDoc.data() as Profile;
        setLightProfile(data);
      }

      // Fetch Dark Profile from Firestore
      const darkDoc = await getDoc(doc(db, 'profile_dark', 'dark'));
      if (darkDoc.exists()) {
        const fetchedDarkProfile = darkDoc.data() as Profile;
        setDarkProfile(fetchedDarkProfile);
      }

      // Fetch Projects from Firestore
      const projectsSnap = await getDocs(collection(db, 'projects'));
      if (!projectsSnap.empty) {
        const fetched: Project[] = projectsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));
        setProjectsList(fetched);
      }

      // Fetch Certificates from Firestore
      const certsSnap = await getDocs(collection(db, 'certificates'));
      if (!certsSnap.empty) {
        const fetchedCerts: Certificate[] = certsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Certificate));
        setCertificatesList(fetchedCerts);
      }
    } catch (e) {
      console.warn("Using local fallback seed state:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const toggleTheme = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsDark((prev) => !prev);
    }, 200);

    setTimeout(() => {
      setIsGlitching(false);
    }, 450);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
