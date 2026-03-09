import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-900/40 via-slate-900 to-slate-950 -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute inset-0 mesh-pattern opacity-30 -z-10"></div>

      <div className="z-10 max-w-2xl w-full text-center">
        <div className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold tracking-widest uppercase">
          Plataforma de Gestión Pro
        </div>
        <h1 className="font-heading text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-300 to-green-400 mb-2 drop-shadow-lg tracking-normal">
          SOUTHGO LIGAS
        </h1>
        <p className="text-slate-400 mb-12 font-light text-xl max-w-xl mx-auto leading-relaxed">
          El sistema definitivo para la gestión integral de tus competiciones deportivas. Eleva el nivel de tu liga a estatus profesional.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/login" className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-heading text-2xl tracking-wide text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.8)] hover:shadow-[0_0_60px_-10px_rgba(37,99,235,1)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 border border-blue-500/50 skew-card">
            <span>INICIAR SESIÓN</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
          <Link href="/register" className="px-10 py-5 bg-slate-900/80 border-2 border-slate-700/80 rounded-xl font-heading text-2xl tracking-wide text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all flex items-center justify-center skew-card">
            CREAR NUEVA LIGA
          </Link>
        </div>
      </div>
    </div>
  );
}
