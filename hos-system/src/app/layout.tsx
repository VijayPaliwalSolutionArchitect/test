/**
 * HOS - Hospital Management System
 * Root Layout
 * ===========================================
 * Global layout wrapper with providers
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'HOS - Hospital Management System',
    template: '%s | HOS',
  },
  description: 'Enterprise-grade Hospital Management System with HMS, EMR, PHR integration',
  keywords: ['hospital', 'management', 'healthcare', 'EMR', 'HMS', 'PHR'],
  authors: [{ name: 'HOS Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
