'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Modal } from '@/components/Modal';

interface Player {
  id: string;
  rut: string;
  firstName: string;
  lastName: string;
  photo: string | null;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ rut: '', firstName: '', lastName: '', photo: '' });

  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.players.findAll();
      setPlayers(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar jugadores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.firstName || !newPlayer.rut) {
      toast.error('Nombre y RUT/Pasaporte son obligatorios');
      return;
    }
    try {
      await api.players.create(newPlayer);
      toast.success('Deportista creado con éxito');
      setIsModalOpen(false);
      setNewPlayer({ rut: '', firstName: '', lastName: '', photo: '' });
      fetchPlayers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar jugador. Puede que el RUT ya exista.');
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-8 relative mb-8">
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-orange-500/50 via-red-500/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-900/20 to-transparent -z-10 skew-header mix-blend-overlay"></div>
        
        <div className="relative z-10 basis-2/3">
          <div className="inline-block px-4 py-1 mb-4 bg-orange-500/10 border-l-4 border-orange-500 text-orange-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            Agentes Libres
          </div>
          <h1 className="font-heading text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-100 to-orange-400 tracking-normal drop-shadow-md leading-none">
            JUGADORES
          </h1>
          <p className="text-slate-400 mt-4 font-light text-lg max-w-2xl leading-relaxed">
            Administra el directorio universal de deportistas en tu liga. Una vez creados aquí, podrán ser llamados a cualquier Equipo oficial.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-8 md:mt-0 px-8 py-4 bg-orange-600 hover:bg-orange-500 rounded-lg font-heading text-xl tracking-wider text-white shadow-[0_0_30px_-5px_rgba(249,115,22,0.6)] hover:shadow-[0_0_50px_rgba(249,115,22,0.8)] hover:-translate-y-1 transition-all duration-300 skew-card border border-orange-400/50 flex items-center gap-2"
        >
          <span>+</span> REGISTRAR ATLETA
        </button>
      </header>

      {/* Modal Creación de Jugador */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Deportista">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Documento / Pasaporte</label>
            <input 
              type="text"
              className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="12345678-9"
              value={newPlayer.rut}
              onChange={(e) => setNewPlayer({ ...newPlayer, rut: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Nombres</label>
              <input 
                type="text"
                className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Cristiano"
                value={newPlayer.firstName}
                onChange={(e) => setNewPlayer({ ...newPlayer, firstName: e.target.value })}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Apellidos</label>
              <input 
                type="text"
                className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Ronaldo"
                value={newPlayer.lastName}
                onChange={(e) => setNewPlayer({ ...newPlayer, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all skew-card"
          >
            Registrar Perfil
          </button>
        </form>
      </Modal>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
             <span className="text-2xl">👤</span>
           </div>
           <h3 className="text-xl font-bold text-gray-200 mb-2">No hay jugadores registrados</h3>
           <p className="text-gray-500 max-w-md mx-auto">Crea deportistas en la base de datos libre antes de ficharlos en clubes oficiales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {players.map((player) => (
            <div key={player.id} className="group bg-slate-900 border border-slate-700/80 hover:border-orange-500/50 transition-all flex flex-col p-4 shadow-xl">
              <div className="w-full bg-slate-800 aspect-square rounded overflow-hidden flex items-end justify-center mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <h3 className="font-heading text-2xl font-bold text-white relative z-10 drop-shadow-md pb-2 uppercase text-center w-full px-2 truncate">
                  {player.firstName} <br className="hidden lg:block"/> {player.lastName}
                </h3>
              </div>
              <div className="flex justify-center gap-2 mb-2 w-full text-center">
                 <span className="text-xs text-slate-400 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded w-full">ID/RUT: {player.rut}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
