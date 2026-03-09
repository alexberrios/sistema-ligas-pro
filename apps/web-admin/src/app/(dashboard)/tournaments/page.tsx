'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/Modal';

interface Tournament {
  id: string;
  name: string;
  slug: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTournament, setNewTournament] = useState({ name: '', slug: '' });

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.tournaments.findAll();
      setTournaments(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar torneos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTournament.name || !newTournament.slug) {
      toast.error('Nombre y slug son obligatorios');
      return;
    }
    try {
      await api.tournaments.create(newTournament);
      toast.success('Torneo creado exitosamente');
      setIsModalOpen(false);
      setNewTournament({ name: '', slug: '' });
      fetchTournaments(); // recargar
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear torneo');
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 relative">
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="relative z-10 basis-2/3">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
            Gestión de Competiciones
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-300 to-green-400 tracking-tight">
            Mis Torneos
          </h1>
          <p className="text-gray-400 mt-3 font-light text-lg max-w-2xl leading-relaxed">
            Centro de control operativo. Administra fixtures, tablas de posiciones y sanciones de las competiciones activas de tu liga.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-6 md:mt-0 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl font-bold text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 ring-1 ring-white/10 flex items-center gap-2"
        >
          <span>+</span> Crear Torneo
        </button>
      </header>

      {/* Modal de Creación */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Torneo">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Nombre del Torneo</label>
            <input 
              type="text"
              className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium backdrop-blur-sm"
              placeholder="Ej: Torneo Clausura 2024"
              value={newTournament.name}
              onChange={(e) => {
                const name = e.target.value;
                setNewTournament({ 
                  name, 
                  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') // auto slug
                });
              }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Slug (URL)</label>
            <input 
              type="text"
              className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium backdrop-blur-sm"
              placeholder="clausura-2024"
              value={newTournament.slug}
              onChange={(e) => setNewTournament({ ...newTournament, slug: e.target.value })}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 transform active:scale-95"
          >
            Lanzar Competición
          </button>
        </form>
      </Modal>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
             <span className="text-2xl">🏆</span>
           </div>
           <h3 className="text-xl font-bold text-gray-200 mb-2">No hay torneos activos</h3>
           <p className="text-gray-500 max-w-md mx-auto">Comienza creando tu primer torneo para inicializar la temporada deportiva.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-gray-700/50 to-gray-900/50 overflow-hidden hover:from-teal-500/40 hover:to-emerald-500/40 transition-all duration-500 cursor-pointer">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -z-10 group-hover:bg-teal-500/20 transition-colors duration-500 pointer-events-none"></div>
              
              <div className="relative h-full bg-gray-900/90 backdrop-blur-2xl rounded-[23px] p-6 flex flex-col justify-between">
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-100 group-hover:text-emerald-300 transition-colors duration-300">
                      {tournament.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(20,184,166,1)] ${tournament.status === 'ONGOING' ? 'bg-teal-500' : tournament.status === 'DRAFT' ? 'bg-amber-500' : 'bg-gray-500'}`}></span>
                      <p className="text-teal-400 text-sm font-medium">{tournament.status}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-4">
                  <div className="bg-gray-950/60 rounded-xl p-4 flex-1 text-center border border-gray-800/50 group-hover:border-teal-500/30 transition-colors shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
                    <span className="block text-3xl font-black text-teal-400 drop-shadow-md">0</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1 block">Equipos</span>
                  </div>
                  <div className="bg-gray-950/60 rounded-xl p-4 flex-1 text-center border border-gray-800/50 group-hover:border-blue-500/30 transition-colors shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                    <span className="block text-3xl font-black text-blue-400 drop-shadow-md">0</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1 block">Fechas</span>
                  </div>
                </div>
                
                <div className="w-full mt-6 py-3 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-xl text-sm font-bold hover:bg-teal-500/20 hover:border-teal-500/50 hover:text-teal-300 transition-all text-center flex justify-center items-center gap-2 shadow-lg">
                  Configurar Torneo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
