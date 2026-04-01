import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repo = 'sleep-well-financial';
const basePath = isGithubActions ? `/${repo}` : '';

export const metadata: Metadata = {
  title: 'Sleep-Well Finance',
  description: 'Sistem Pertahanan Kas & Pencatatan Keuangan Pribadi',
  manifest: `${basePath}/manifest.json`,
  icons: {
    icon: [
      { url: `${basePath}/icons/icon-192x192.png`, type: 'image/png', sizes: '192x192' },
      { url: `${basePath}/icons/icon-512x512.png`, type: 'image/png', sizes: '512x512' }
    ],
    shortcut: [`${basePath}/icons/icon-192x192.png`],
    apple: [
      { url: `${basePath}/icons/icon-192x192.png`, sizes: '192x192', type: 'image/png' },
      { url: `${basePath}/icons/icon-512x512.png`, sizes: '512x512', type: 'image/png' }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sleep-Well',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.className} dark`} suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased transition-colors">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
