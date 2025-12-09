'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            {/* Animated Blobs Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-300/40 dark:bg-red-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/40 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-300/40 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Glass Card */}
            <div className="relative z-10 w-full max-w-lg text-center">
                <div className="bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl p-12 space-y-8">

                    <div className="space-y-4">
                        <h1 className="text-9xl font-extrabold text-[var(--color-primary)] opacity-50">404</h1>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Page not found
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Oops! It seems you've ventured into uncharted territory. The page you are looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-white bg-[var(--color-primary)] hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Return Home
                        </Link>
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-700 text-base font-bold rounded-full text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all backdrop-blur-sm"
                        >
                            Go Back
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
