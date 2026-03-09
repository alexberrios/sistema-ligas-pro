'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  datetime: string | null;
  stage: string | null;
}

interface Tournament {
  id: string;
  name: string;
}

export default function FixturePage() {
  const params = useParams();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [matchesRes, teamsRes, tourneyRes] = await Promise.all([
        apiClient.get(`/matches/tournament/${params.id}`),
        apiClient.get(`/teams/tournament/${params.id}`),
        apiClient.get(`/tournaments/${params.id}`),
      ]);
      setMatches(matchesRes.data);
      setTeams(teamsRes.data);
      setTournament(tourneyRes.data);
    } catch (error) {
      toast.error('Error al cargar datos del Fixture');
    } finally {
      setIsLoading(false);
    }
  };

  const createMatchFormik = useFormik({
    initialValues: {
      homeTeamId: '',
      awayTeamId: '',
      datetime: '',
      stage: 'Regular',
    },
    validationSchema: Yup.object({
      homeTeamId: Yup.string().required('Requerido'),
      awayTeamId: Yup.string()
        .required('Requerido')
        .notOneOf([Yup.ref('homeTeamId')], 'Ambos equipos no pueden ser iguales'),
      datetime: Yup.date().required('Requerido'),
      stage: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await apiClient.post('/matches', {
          tournamentId: params.id,
          ...values,
          datetime: new Date(values.datetime).toISOString(),
        });
        toast.success('Partido programado exitosamente');
        setIsMatchModalOpen(false);
        resetForm();
        fetchData();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al programar partido');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const updateScoreFormik = useFormik({
    initialValues: {
      homeScore: 0,
      awayScore: 0,
      status: 'FINISHED',
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedMatch) return;
      try {
        await apiClient.patch(`/matches/${selectedMatch.id}/score`, values);
        toast.success('Marcador actualizado');
        setIsScoreModalOpen(false);
        fetchData();
      } catch (error) {
        toast.error('Error al actualizar marcador');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const openScoreModal = (match: Match) => {
    setSelectedMatch(match);
    updateScoreFormik.setValues({
      homeScore: match.homeScore || 0,
      awayScore: match.awayScore || 0,
      status: match.status === 'SCHEDULED' ? 'IN_PLAY' : match.status,
    });
    setIsScoreModalOpen(true);
  };

  if (isLoading) return <div className="p-10 text-white font-heading text-2xl text-center animate-pulse">CARGANDO FIXTURE...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-8 relative mb-8">
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-emerald-500/50 via-teal-500/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-900/20 to-transparent -z-10 skew-header mix-blend-overlay"></div>
        
        <div className="relative z-10 basis-2/3">
          <div className="inline-block px-4 py-1 mb-4 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            Fixture Deportivo
          </div>
          <button onClick={() => router.push('/tournaments')} className="block text-slate-400 hover:text-white mb-2 text-sm">
            ← Volver a Torneos
          </button>
          <h1 className="font-heading text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-400 tracking-normal drop-shadow-md leading-none">
            {tournament?.name}
          </h1>
        </div>
        <div className="flex gap-4 mt-8 md:mt-0">
          <button 
            onClick={() => setIsMatchModalOpen(true)}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-heading text-xl tracking-wider text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.6)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)] hover:-translate-y-1 transition-all duration-300 skew-card border border-emerald-400/50 flex items-center gap-2"
          >
            NUEVO PARTIDO
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((match) => (
          <div key={match.id} className="relative group bg-slate-900 border border-slate-700/80 transition-all duration-500 overflow-hidden skew-card shadow-xl flex flex-col p-6">
            <div className="absolute top-0 left-0 h-1 w-full bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-500 transition-all duration-500"></div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {new Date(match.datetime || '').toLocaleString()} • {match.stage}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded border ${match.status === 'FINISHED' ? 'bg-slate-800/80 text-emerald-400 border-emerald-500/30' : match.status === 'IN_PLAY' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {match.status}
              </span>
            </div>

            <div className="flex justify-between items-center px-4 w-full">
              {/* Home */}
              <div className="flex flex-col items-center gap-3 w-1/3">
                <div className="w-16 h-16 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center p-2">
                  {match.homeTeam.logo ? <img src={match.homeTeam.logo} className="w-full h-full object-contain" /> : '🛡️'}
                </div>
                <span className="font-heading text-xl text-center leading-none text-slate-200">{match.homeTeam.name}</span>
              </div>
              
              {/* Score */}
              <div className="flex flex-col items-center w-1/3 cursor-pointer group-hover:scale-110 transition-transform" onClick={() => openScoreModal(match)}>
                <div className="bg-slate-950 px-6 py-2 rounded border border-slate-800 flex gap-4 text-4xl font-heading font-bold shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <span className={match.homeScore !== null && match.homeScore > (match.awayScore || 0) ? 'text-emerald-400' : 'text-white'}>
                    {match.homeScore ?? '-'}
                  </span>
                  <span className="text-slate-600">:</span>
                  <span className={match.awayScore !== null && match.awayScore > (match.homeScore || 0) ? 'text-emerald-400' : 'text-white'}>
                    {match.awayScore ?? '-'}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-500 uppercase font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Editar</span>
              </div>

              {/* Away */}
              <div className="flex flex-col items-center gap-3 w-1/3">
                <div className="w-16 h-16 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center p-2">
                  {match.awayTeam.logo ? <img src={match.awayTeam.logo} className="w-full h-full object-contain" /> : '🛡️'}
                </div>
                <span className="font-heading text-xl text-center leading-none text-slate-200">{match.awayTeam.name}</span>
              </div>
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-slate-700/50 rounded-2xl bg-slate-900/30">
            <span className="text-4xl block mb-4">📅</span>
            <h3 className="text-xl text-slate-300 font-heading">Sin partidos programados</h3>
            <p className="text-slate-500 mt-2">Crea el primer partido de este torneo para empezar a registrar resultados.</p>
          </div>
        )}
      </div>

      {/* Match Scheduling Modal */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 shadow-2xl skew-card">
            <h3 className="font-heading text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 mb-6">Programar Partido</h3>
            
            <form onSubmit={createMatchFormik.handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-1 font-bold">Local</label>
                  <select
                    name="homeTeamId"
                    onChange={createMatchFormik.handleChange}
                    value={createMatchFormik.values.homeTeamId}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="">Seleccione...</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-center pt-6 text-slate-500">VS</div>
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-widest text-slate-400 mb-1 font-bold">Visita</label>
                  <select
                    name="awayTeamId"
                    onChange={createMatchFormik.handleChange}
                    value={createMatchFormik.values.awayTeamId}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="">Seleccione...</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-1 font-bold">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  name="datetime"
                  onChange={createMatchFormik.handleChange}
                  value={createMatchFormik.values.datetime}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-1 font-bold">Fase / Jornada</label>
                <input
                  type="text"
                  name="stage"
                  placeholder="Ej: Fecha 1, Semifinal"
                  onChange={createMatchFormik.handleChange}
                  value={createMatchFormik.values.stage}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                <button type="button" onClick={() => setIsMatchModalOpen(false)} className="px-6 py-2 text-slate-400 hover:text-white">Cancelar</button>
                <button type="submit" disabled={createMatchFormik.isSubmitting} className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-heading text-xl skew-card">
                  {createMatchFormik.isSubmitting ? 'Guardando...' : 'Programar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Score Modal */}
      {isScoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm p-8 shadow-2xl skew-card">
            <h3 className="font-heading text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-6 text-center">Registrar Marcador</h3>
            
            <form onSubmit={updateScoreFormik.handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <span className="block text-sm text-slate-400 mb-2 truncate">{selectedMatch?.homeTeam.name}</span>
                  <input
                    type="number"
                    name="homeScore"
                    min="0"
                    onChange={updateScoreFormik.handleChange}
                    value={updateScoreFormik.values.homeScore}
                    className="w-20 h-20 bg-slate-950 border-2 border-slate-700 rounded text-center text-4xl font-heading text-white focus:border-emerald-500 outline-none mx-auto block"
                  />
                </div>
                <div className="text-2xl font-black text-slate-600 pt-6">-</div>
                <div className="text-center flex-1">
                  <span className="block text-sm text-slate-400 mb-2 truncate">{selectedMatch?.awayTeam.name}</span>
                  <input
                    type="number"
                    name="awayScore"
                    min="0"
                    onChange={updateScoreFormik.handleChange}
                    value={updateScoreFormik.values.awayScore}
                    className="w-20 h-20 bg-slate-950 border-2 border-slate-700 rounded text-center text-4xl font-heading text-white focus:border-emerald-500 outline-none mx-auto block"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2 font-bold text-center">Estado del Partido</label>
                <select
                  name="status"
                  onChange={updateScoreFormik.handleChange}
                  value={updateScoreFormik.values.status}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-200 text-center focus:border-emerald-500 outline-none font-bold tracking-widest text-sm"
                >
                  <option value="IN_PLAY">EN JUEGO</option>
                  <option value="FINISHED">FINALIZADO</option>
                  <option value="CANCELLED">CANCELADO</option>
                </select>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button type="button" onClick={() => setIsScoreModalOpen(false)} className="px-6 py-2 text-slate-400 hover:text-white">Cancelar</button>
                <button type="submit" disabled={updateScoreFormik.isSubmitting} className="px-8 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded font-heading text-xl skew-card">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
