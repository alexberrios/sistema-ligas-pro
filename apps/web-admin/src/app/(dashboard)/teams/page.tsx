'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/Modal';

interface Team {
  id: string;
  name: string;
  logo: string | null;
  players: any[];
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', logo: '' });

  // Assign Player States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTeamForAssign, setSelectedTeamForAssign] = useState<Team | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [assignPlayerForm, setAssignPlayerForm] = useState({ playerId: '', number: '', position: 'DELANTERO' });

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.teams.findAll();
      setTeams(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar equipos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data } = await api.players.findAll();
      setAvailablePlayers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openAssignPlayerModal = (team: Team) => {
    setSelectedTeamForAssign(team);
    setIsAssignModalOpen(true);
  };

  const handleAssignPlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignPlayerForm.playerId || !selectedTeamForAssign) {
      toast.error('Selecciona un jugador');
      return;
    }
    
    try {
      await api.teams.assignPlayer(selectedTeamForAssign.id, {
        playerId: assignPlayerForm.playerId,
        number: Number(assignPlayerForm.number) || 0,
        position: assignPlayerForm.position
      });
      toast.success('Jugador fichado exitosamente');
      setIsAssignModalOpen(false);
      setAssignPlayerForm({ playerId: '', number: '', position: 'DELANTERO' });
      fetchTeams(); // Refresh to update player count
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al fichar jugador dplicado');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress and encode
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        setNewTeam({ ...newTeam, logo: dataUrl });
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name) {
      toast.error('El nombre del equipo es obligatorio');
      return;
    }
    try {
      await api.teams.create(newTeam);
      toast.success('Equipo creado con éxito');
      setIsModalOpen(false);
      setNewTeam({ name: '', logo: '' });
      fetchTeams();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar equipo');
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-8 relative mb-8">
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-blue-500/50 via-emerald-500/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/20 to-transparent -z-10 skew-header mix-blend-overlay"></div>
        
        <div className="relative z-10 basis-2/3">
          <div className="inline-block px-4 py-1 mb-4 bg-blue-500/10 border-l-4 border-blue-500 text-blue-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            Directorio Global
          </div>
          <h1 className="font-heading text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 tracking-normal drop-shadow-md leading-none">
            CLUBES Y EQUIPOS
          </h1>
          <p className="text-slate-400 mt-4 font-light text-lg max-w-2xl leading-relaxed">
            Administra todos los clubes inscritos en tu Liga. Revisa sus plantillas, estadísticas y edita sus perfiles oficiales.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-8 md:mt-0 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-heading text-2xl tracking-wider text-white shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] hover:-translate-y-1 transition-all duration-300 skew-card border border-blue-400/50 flex items-center gap-2"
        >
          <span>+</span> REGISTRAR CLUB
        </button>
      </header>

      {/* Modal Creación de Equipo */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Equipo">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Nombre Oficial</label>
            <input 
              type="text"
              className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium backdrop-blur-sm"
              placeholder="Ej: F.C. Barcelona"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Escudo / Logo</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 bg-gray-900/50 rounded-xl hover:border-blue-500/50 hover:bg-gray-800 transition-colors cursor-pointer group relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                />
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📁</span>
                <span className="text-sm font-medium text-gray-400 group-hover:text-blue-400">Toca para Subir Imagen</span>
                <span className="text-xs text-gray-600 mt-1">PNG, JPG o WEBP (Máx. 2MB)</span>
              </label>
              
              {newTeam.logo && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-700 bg-white flex-shrink-0 flex items-center justify-center p-1">
                  <img src={newTeam.logo} alt="Preview" className="w-full h-full object-contain" />
                  <button 
                    type="button"
                    onClick={() => setNewTeam({ ...newTeam, logo: '' })}
                    className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <button 
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 transform active:scale-95"
          >
            Registrar Club
          </button>
        </form>
      </Modal>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
             <span className="text-2xl">🛡️</span>
           </div>
           <h3 className="text-xl font-bold text-gray-200 mb-2">No hay equipos registrados</h3>
           <p className="text-gray-500 max-w-md mx-auto">Crea los clubes para luego poder inscribirlos en tus torneos e ingresar sus jugadores.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="relative group bg-slate-900 border border-slate-700/80 hover:border-blue-500/50 transition-all duration-500 flex flex-col items-center p-8 text-center cursor-pointer overflow-hidden skew-card shadow-xl hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              {/* Card Background Effects */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-800/80 to-transparent -z-10 opacity-70"></div>
              
              {/* Dynamic Header Strip */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-emerald-500 transition-all duration-500"></div>

              <div className="w-28 h-28 mb-6 relative z-10 transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-700 group-hover:border-blue-400/80 shadow-[0_0_0_4px_rgba(15,23,42,1)] relative z-20">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-24 h-24 object-contain" />
                  ) : (
                    <span className="text-4xl opacity-50">🛡️</span>
                  )}
                </div>
              </div>
              
              <h3 className="font-heading text-4xl font-bold text-slate-100 group-hover:text-white transition-colors drop-shadow-sm leading-none z-10 relative">
                {team.name}
              </h3>
              
              <div className="mt-6 flex gap-2 w-full justify-center z-10 relative">
                <div className="bg-slate-950/60 rounded border border-slate-800/80 px-6 py-3 min-w-[120px] group-hover:border-blue-500/30 transition-colors">
                  <span className="block font-heading text-4xl text-blue-400 leading-none">{team.players?.length || 0}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1 block">Jugadores</span>
                </div>
              </div>

              <div className="w-full px-6 pb-6 mt-4 z-10 relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    openAssignPlayerModal(team);
                  }}
                  className="w-full py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all text-center flex justify-center items-center gap-2 shadow-lg rounded"
                >
                  Fichar Jugador
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Fichar Jugador */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Fichar en ${selectedTeamForAssign?.name}`}>
        <form onSubmit={handleAssignPlayerSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Buscar Jugador</label>
            <select
              value={assignPlayerForm.playerId}
              onChange={(e) => setAssignPlayerForm({ ...assignPlayerForm, playerId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">-- Elige un Jugador Libre --</option>
              {availablePlayers.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.rut})</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-1">Dorsal</label>
              <input 
                type="number"
                min="1"
                max="99"
                value={assignPlayerForm.number}
                onChange={(e) => setAssignPlayerForm({ ...assignPlayerForm, number: e.target.value })}
                placeholder="Ej: 10"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-1">Posición</label>
              <select
                value={assignPlayerForm.position}
                onChange={(e) => setAssignPlayerForm({ ...assignPlayerForm, position: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Sin Posición</option>
                <option value="ARQUERO">Arquero</option>
                <option value="DEFENSA">Defensa</option>
                <option value="MEDIOCAMPISTA">Mediocampista</option>
                <option value="DELANTERO">Delantero</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white rounded font-bold uppercase tracking-widest shadow-lg skew-card transition-all"
          >
            Confirmar Fichaje
          </button>
        </form>
      </Modal>
    </div>
  );
}
