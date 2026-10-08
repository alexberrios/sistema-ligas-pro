'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, apiClient } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api';
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

interface TeamOption {
  id: string;
  name: string;
}

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTournament, setNewTournament] = useState({ name: '', slug: '' });

  // Roster states
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedTournamentForEnroll, setSelectedTournamentForEnroll] = useState<Tournament | null>(null);
  const [availableTeams, setAvailableTeams] = useState<TeamOption[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.tournaments.findAll();
      setTournaments(data);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Error al cargar torneos'));
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
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Error al crear torneo'));
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data } = await api.teams.findAll();
      setAvailableTeams(data);
    } catch(err) {
      console.error(err);
    }
  };

  const openEnrollModal = (tournament: Tournament) => {
    setSelectedTournamentForEnroll(tournament);
    setIsEnrollModalOpen(true);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !selectedTournamentForEnroll) {
      toast.error('Seleccione un equipo');
      return;
    }
    try {
      await apiClient.post(`/tournaments/${selectedTournamentForEnroll.id}/teams`, { teamId: selectedTeamId });
      toast.success('Equipo inscrito exitosamente');
      setIsEnrollModalOpen(false);
      setSelectedTeamId('');
      fetchTournaments(); // Refresh to update numbers if possible
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          'Error al inscribir equipo (probablemente ya inscrito)',
        ),
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-8 relative mb-8">
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-emerald-500/50 via-teal-500/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-900/20 to-transparent -z-10 skew-header mix-blend-overlay"></div>
        
        <div className="relative z-10 basis-2/3">
          <div className="inline-block px-4 py-1 mb-4 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            Gestión de Competiciones
          </div>
          <h1 className="font-heading text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-400 tracking-normal drop-shadow-md leading-none">
            MIS TORNEOS
          </h1>
          <p className="text-slate-400 mt-4 font-light text-lg max-w-2xl leading-relaxed">
            Centro de control operativo. Administra fixtures, tablas de posiciones y sanciones de las competiciones activas de tu liga.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-8 md:mt-0 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-heading text-2xl tracking-wider text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.6)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)] hover:-translate-y-1 transition-all duration-300 skew-card border border-emerald-400/50 flex items-center gap-2"
        >
          <span>+</span> NUEVO TORNEO
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
            <div key={tournament.id} className="relative group bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 transition-all duration-500 cursor-pointer overflow-hidden skew-card shadow-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col">
              {/* Card Background Effects */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-400/30 transition-colors"></div>
              
              {/* Dynamic Header Strip */}
              <div className="h-2 w-full bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-500 transition-all duration-500"></div>

              <div className="p-6 relative z-10 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
                      <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${tournament.status === 'ONGOING' ? 'bg-emerald-400 text-emerald-400' : tournament.status === 'DRAFT' ? 'bg-amber-400 text-amber-400' : 'bg-slate-400 text-slate-400'}`}></span>
                      <p className="text-slate-300 text-[10px] font-bold tracking-widest uppercase">{tournament.status}</p>
                    </div>
                  </div>
                  <h3 className="font-heading text-4xl leading-none font-bold text-slate-100 group-hover:text-white transition-colors drop-shadow-sm mb-4">
                    {tournament.name}
                  </h3>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <div className="bg-slate-950/60 rounded border border-slate-800/80 p-3 flex-1 text-center relative overflow-hidden group-hover:border-emerald-500/30 transition-colors">
                    <span className="block font-heading text-4xl text-emerald-400 drop-shadow-md leading-none">0</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1 block">Clubes</span>
                  </div>
                  <div className="bg-slate-950/60 rounded border border-slate-800/80 p-3 flex-1 text-center relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                    <span className="block font-heading text-4xl text-blue-400 drop-shadow-md leading-none">0</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1 block">Fechas</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-6">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tournaments/${tournament.id}/fixture`);
                    }}
                    className="w-full py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all text-center flex justify-center items-center gap-2 shadow-lg skew-card"
                  >
                    Gestionar Fixture
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEnrollModal(tournament);
                    }}
                    className="w-full py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all text-center flex justify-center items-center gap-2 shadow-lg"
                  >
                    Inscribir Clubes
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal Inscribir Club */}
      <Modal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} title={`Inscribir Club en ${selectedTournamentForEnroll?.name}`}>
        <form onSubmit={handleEnrollSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Seleccionar o Buscar Equipo</label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">-- Elige un Club --</option>
              {availableTeams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 mt-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded font-bold uppercase tracking-widest shadow-lg skew-card transition-all"
          >
            Vincular Equipo
          </button>
        </form>
      </Modal>
    </div>
  );
}
