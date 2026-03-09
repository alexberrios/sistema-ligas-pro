import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="z-10 max-w-lg w-full bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 shadow-2xl text-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-4">
          SouthGo Ligas
        </h1>
        <p className="text-gray-400 mb-10 font-light">
          El sistema definitivo para la gestión integral de tus ligas y torneos deportivos.
        </p>

        <div className="flex flex-col gap-4">
          <Link href="/login" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:-translate-y-1 hover:shadow-blue-500/40 transition-all">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="w-full py-3.5 bg-gray-800 border border-gray-700 rounded-xl font-semibold text-white hover:bg-gray-700 transition-all">
            Crear Nueva Liga
          </Link>
        </div>
      </div>
    </div>
  );
}
