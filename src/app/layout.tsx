import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PerformanceBackground from '@/components/PerformanceBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

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
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className="min-h-[100dvh] flex flex-col antialiased relative">
        <ThemeProvider>
          <PerformanceBackground />
          
          <Navbar />
          <main className="flex-grow relative z-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
