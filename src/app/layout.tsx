// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import QueryProvider from './providers';            // <-- uses src/app/providers.tsx
import { AuthProvider } from './context/AuthContext'; // <-- uses src/app/context/AuthContext.tsx
import Navbar from './components/navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'K12 Frontend',
  description: 'K12 Tutoring Platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}