import './globals.css';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), { ssr: false });

export const metadata: Metadata = {
  title: 'Arvin Banes — Personal Portfolio & Alter-Ego',
  description: 'Multi-disciplinary portfolio of Arvin Banes featuring interactive particle background and alter-ego dark mode.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased relative">
        <ThemeProvider>
          {/* React Bits Liquid Ether background; particle canvas and easter egg remain stashed. */}
          <div className="liquid-ether-bg" aria-hidden="true">
            <div className="background-texture" />
            <LiquidEther
              colors={['#252936', '#5B6472', '#F5B942', '#F9DFA1']}
              mouseForce={10}
              cursorSize={110}
              isViscous={true}
              viscous={24}
              iterationsViscous={24}
              iterationsPoisson={32}
              resolution={0.5}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.22}
              autoIntensity={1.15}
              takeoverDuration={0.25}
              autoResumeDelay={3000}
              autoRampDuration={0.6}
            />
          </div>
          
          <Navbar />
          <main className="flex-grow relative z-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
