import React from 'react';

export default function ManagementPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 relative">
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="relative z-10 basis-2/3">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            Vista Global
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-tight">
            Gestión de Ligas
          </h1>
          <p className="text-gray-400 mt-3 font-light text-lg max-w-2xl leading-relaxed">
            Administración central del ecosistema. Supervisa, autoriza o restringe organizaciones y operadores deportivos a nivel nacional.
          </p>
        </div>
        <button className="mt-6 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-white shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.6)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 ring-1 ring-white/10 flex items-center gap-2">
          <span>+</span> Nueva Organización
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-gray-700/50 to-gray-900/50 overflow-hidden hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-gray-900/90 backdrop-blur-2xl rounded-[23px] p-6 flex flex-col justify-between">
              
              <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 ring-1 ring-blue-500/30 flex items-center justify-center text-2xl font-black text-blue-300 shadow-inner">
                  L{item}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full font-bold border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(52,211,153,0.3)]">ACTIVA</span>
                  <span className="text-xs font-mono text-gray-500">ID: ORG-{9420 + item}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-300 transition-colors duration-300">
                  Liga Metropolitana {item}
                </h3>
                <div className="flex gap-4 mt-3 mb-6">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-white">12</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Torneos</span>
                  </div>
                  <div className="w-px h-full bg-gray-700"></div>
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-white">320</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Equipos</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800/50">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((avatar) => (
                    <div key={avatar} className="h-9 w-9 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-bold ring-1 ring-gray-700 shadow-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent"></div>
                      A
                    </div>
                  ))}
                  <div className="h-9 w-9 rounded-full bg-gray-800/80 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-400 backdrop-blur-sm">+2</div>
                </div>
                <button className="text-blue-400 text-sm font-semibold hover:text-white transition-colors flex items-center gap-1 group/btn">
                  Administrar 
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
