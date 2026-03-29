import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sleep-Well Finance',
  description: 'Pencatatan keuangan pribadi',
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
