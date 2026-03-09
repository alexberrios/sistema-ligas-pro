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
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <aside className="w-64 bg-gray-800 flex flex-col items-center py-6 shadow-xl relative z-10 border-r border-gray-700">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-10">SouthGo Ligas</h1>
        
        <nav className="flex flex-col w-full px-4 gap-2">
          {role === 'SUPERADMIN' ? (
            <>
              <Link href="/management" className="px-4 py-3 rounded-xl transition-all hover:bg-white/10 text-gray-300 hover:text-white">
                🏢 Gestión de Ligas
              </Link>
              <Link href="/users" className="px-4 py-3 rounded-xl transition-all hover:bg-white/10 text-gray-300 hover:text-white">
                👥 Usuarios Globales
              </Link>
            </>
          ) : (
            <>
              <Link href="/tournaments" className="px-4 py-3 rounded-xl transition-all hover:bg-blue-600/20 text-gray-300 hover:text-blue-300 flex items-center gap-2">
                <span>🏆</span> Mis Torneos
              </Link>
              <Link href="/teams" className="px-4 py-3 rounded-xl transition-all hover:bg-amber-600/20 text-gray-300 hover:text-amber-300 flex items-center gap-2">
                <span>🛡️</span> Directorio Equipos
              </Link>
            </>
          )}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-gray-800/50 backdrop-blur-md border-b border-gray-700/50">
          <h2 className="text-xl font-semibold tracking-wide text-gray-100 italic">Panel de Control</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm font-light text-gray-400 uppercase tracking-widest">{role}</span>
             <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 ring-2 ring-purple-500/30"></div>
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
