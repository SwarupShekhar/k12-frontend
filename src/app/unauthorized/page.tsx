// src/app/unauthorized/page.tsx
'use client';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Unauthorized</h2>
        <p className="text-slate-600 mb-6">You don't have permission to access this page.</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go Home
        </Link>
      </div>
    </div>
  );
}

