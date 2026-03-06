import type { Metadata } from 'next';
import { Press_Start_2P, VT323, DM_Sans } from 'next/font/google';
import ThemeProvider from './components/ThemeProvider';
import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GitHub Pixel Tree',
  description:
    'Turn your GitHub contribution history into a pixel art tree. Embed it in any README.',
  openGraph: {
    title: 'GitHub Pixel Tree',
    description: 'Your commits grow a tree.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${pressStart2P.variable} ${vt323.variable} ${dmSans.variable}`}>
      <body className="bg-bg text-text font-body antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
