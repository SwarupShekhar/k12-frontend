// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import QueryProvider from './providers';            // <-- uses src/app/providers.tsx
import { AuthProvider } from './context/AuthContext'; // <-- uses src/app/context/AuthContext.tsx
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Script from 'next/script';

export const metadata = {
  title: 'Vaidik Tutoring',
  description: 'Vaidik Tutoring Platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
        </QueryProvider>
        <Script src="https://meet.jit.si/external_api.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}