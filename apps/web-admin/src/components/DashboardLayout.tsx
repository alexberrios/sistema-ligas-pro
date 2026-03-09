import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
  role
}: {
  children: React.ReactNode,
  role: 'SUPERADMIN' | 'LEAGUE_ADMIN'
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden">
      {/* Sportive Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-20"></div>
      <div className="absolute inset-0 mesh-pattern opacity-10 -z-10"></div>

      <aside className="w-72 bg-slate-900/80 backdrop-blur-xl flex flex-col items-center py-8 shadow-2xl relative z-20 border-r border-slate-800/80">
        <h1 className="font-heading text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200 mb-12 tracking-wide text-center leading-none">
          SOUTHGO<br/><span className="text-3xl text-slate-400">LIGAS</span>
        </h1>
        
        <nav className="flex flex-col w-full px-6 gap-3">
          {role === 'SUPERADMIN' ? (
            <>
              <Link href="/management" className="px-5 py-4 rounded-xl transition-all bg-slate-800/40 hover:bg-blue-600/20 border border-transparent hover:border-blue-500/30 text-slate-300 hover:text-white font-medium flex items-center gap-3">
                <span className="text-xl">🏢</span> Gestión de Ligas
              </Link>
              <Link href="/users" className="px-5 py-4 rounded-xl transition-all bg-slate-800/40 hover:bg-blue-600/20 border border-transparent hover:border-blue-500/30 text-slate-300 hover:text-white font-medium flex items-center gap-3">
                <span className="text-xl">👥</span> Usuarios Globales
              </Link>
            </>
          ) : (
            <>
              <Link href="/tournaments" className="px-5 py-4 rounded-xl transition-all bg-slate-800/40 hover:bg-emerald-600/20 border border-transparent hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 font-medium flex items-center gap-3 group skew-card">
                <span className="text-xl group-hover:scale-110 transition-transform">🏆</span> Mis Torneos
              </Link>
              <Link href="/teams" className="px-5 py-4 rounded-xl transition-all bg-slate-800/40 hover:bg-blue-600/20 border border-transparent hover:border-blue-500/30 text-slate-300 hover:text-blue-300 font-medium flex items-center gap-3 group skew-card">
                <span className="text-xl group-hover:scale-110 transition-transform">🛡️</span> Clubes
              </Link>
              <Link href="/players" className="px-5 py-4 rounded-xl transition-all bg-slate-800/40 hover:bg-orange-600/20 border border-transparent hover:border-orange-500/30 text-slate-300 hover:text-orange-300 font-medium flex items-center gap-3 group skew-card">
                <span className="text-xl group-hover:scale-110 transition-transform">🏃</span> Jugadores Libres
              </Link>
            </>
          )}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        <header className="h-20 flex items-center justify-between px-10 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/60 relative z-30">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-blue-500/50 via-emerald-500/50 to-transparent"></div>
          <h2 className="font-heading text-3xl tracking-wide text-slate-200 uppercase">Panel de Control</h2>
          <div className="flex items-center gap-6">
             <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">{role}</span>
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 ring-4 ring-slate-900 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          {children}
        </div>
      </main>
    </div>
  );
}
