import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Zesty AI | Smart Nutrition Intelligence',
  description: 'AI-powered nutrition assistant powered by Gemini, Vertex AI, and 15 Google Cloud services.',
  keywords: 'nutrition, AI, food tracking, health score, meal planning',
  openGraph: {
    title: 'Zesty AI',
    description: 'Smart nutrition intelligence — powered by Gemini 1.5 Flash and Vertex AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' http://localhost:8000;" />
      </head>
      <body className={`${inter.variable} font-sans bg-[#0F1117] min-h-screen`}>
        {/* Skip to main content — WCAG 2.1 AA */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[9999] btn-primary !py-2 !px-4"
        >
          Skip to main content
        </a>

        {/* ── Navbar ── */}
        <header role="banner" className="fixed w-full z-50 top-0">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav role="navigation" aria-label="Main navigation"
              className="glass flex items-center justify-between px-5 py-3 rounded-2xl max-w-7xl mx-auto">
              <a href="/" className="flex items-center gap-2.5 group" aria-label="Zesty home">
                <span className="text-2xl" role="img" aria-label="lemon">🍋</span>
                <span className="font-bold text-xl gradient-text tracking-tight">Zesty</span>
                <span className="hidden sm:inline text-[10px] font-medium text-slate-500 border border-slate-700 px-1.5 py-0.5 rounded-md">
                  v1.0 · asia-south1
                </span>
              </a>

              <div className="flex items-center gap-3" role="list">
                <div role="listitem" className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" aria-hidden="true" />
                  <span>Live · Cloud Run</span>
                </div>
                <div role="listitem" aria-label="User: Jai D." className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-glow-orange cursor-pointer">
                  JD
                </div>
              </div>
            </nav>
          </div>
        </header>

        {/* ── Main ── */}
        <main
          id="main-content"
          role="main"
          className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-mesh min-h-screen"
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15,17,23,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f1f5f9',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#0F1117' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#0F1117' } },
          }}
        />
      </body>
    </html>
  );
}
