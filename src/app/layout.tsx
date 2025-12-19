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

import { NotificationProvider } from './context/NotificationContext';
import GlobalNotification from './components/GlobalNotification';
import VerificationModal from './components/auth/VerificationModal';
import VerificationBanner from './components/auth/VerificationBanner';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <Navbar />
              <VerificationBanner />
              <GlobalNotification />
              <VerificationModal />
              {children}
              <Footer />
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
        <Script src="https://meet.jit.si/external_api.js" strategy="afterInteractive" />
      </body>
    </html >
  );
}