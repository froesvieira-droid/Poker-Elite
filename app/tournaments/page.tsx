'use client';

import { motion } from 'motion/react';
import { Trophy, Clock, Users, DollarSign, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const TOURNAMENTS = [
  { id: 1, name: 'Daily Turbo', prize: '$5,000', entry: '$100', players: '42/100', time: 'Começa em 15m', difficulty: 'Beginner', color: 'border-blue-500' },
  { id: 2, name: 'High Roller', prize: '$50,000', entry: '$1,000', players: '12/20', time: 'Começa em 1h', difficulty: 'Expert', color: 'border-amber-500' },
  { id: 3, name: 'Free-Roll', prize: '$500', entry: 'FREE', players: '210/500', time: 'Começa em 5m', difficulty: 'Everyone', color: 'border-emerald-500' },
  { id: 4, name: 'Pro Shootout', prize: '$10,000', entry: '$250', players: '8/64', time: 'Inscrições abertas', difficulty: 'Advanced', color: 'border-rose-500' },
];

export default function TournamentsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 pt-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-white/5 group-hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
            <Home size={20} />
          </div>
          <span className="font-bold tracking-tight">LOBBY</span>
        </Link>
        <div className="text-xl font-black italic italic tracking-tighter">TORNEIOS ATIVOS</div>
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
           <Users size={18} className="text-white/40" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOURNAMENTS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "group relative bg-slate-900 border-l-4 p-6 rounded-2xl transition-all hover:bg-slate-800 cursor-pointer shadow-xl",
                t.color
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight group-hover:text-amber-400 transition-colors">{t.name}</h3>
                  <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase mt-1">
                     <Clock size={12} />
                     <span>{t.time}</span>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-amber-500">
                   <Trophy size={24} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-black uppercase mb-1">Prêmio</span>
                  <span className="text-lg font-mono font-bold text-white">{t.prize}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-black uppercase mb-1">Entrada</span>
                  <span className="text-lg font-mono font-bold text-white">{t.entry}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-black uppercase mb-1">Players</span>
                  <span className="text-lg font-mono font-bold text-white">{t.players}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                 <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-wider text-white/60">
                   {t.difficulty}
                 </div>
                 <button className="flex items-center gap-1 text-sm font-black uppercase tracking-widest text-amber-500 hover:text-amber-400">
                    INSCREVER <ChevronRight size={16} />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Content */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5 }}
           className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 rounded-3xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic tracking-tighter mb-2">WORLD SERIES PACKAGE</h2>
            <p className="text-white/80 font-medium mb-6 max-w-sm">Jogue agora e concorra a uma vaga no evento principal em Las Vegas.</p>
            <button className="px-6 py-3 bg-white text-indigo-700 font-black rounded-xl text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
              VER DETALHES
            </button>
          </div>
          <DollarSign size={180} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
        </motion.div>
      </div>
    </main>
  );
}
