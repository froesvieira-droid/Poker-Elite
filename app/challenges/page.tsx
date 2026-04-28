'use client';

import { motion } from 'motion/react';
import { Target, Star, Gift, CheckCircle2, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CHALLENGES = [
  { id: 1, title: 'Ganhe com Par de Ases', reward: '500 Chips', progress: 0, total: 1, icon: Star, color: 'text-amber-400' },
  { id: 2, title: 'Faça 5 Flushes', reward: '1,200 Chips', progress: 2, total: 5, icon: Target, color: 'text-blue-400' },
  { id: 3, title: 'Jogue 10 mãos offline', reward: '300 Chips', progress: 7, total: 10, icon: Gift, color: 'text-rose-400' },
  { id: 4, title: 'Elimine um bot', reward: '1,000 Chips', progress: 0, total: 1, icon: CheckCircle2, color: 'text-emerald-400' },
];

export default function ChallengesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 pt-24">
      <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-white/5 group-hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
            <Home size={20} />
          </div>
          <span className="font-bold tracking-tight">LOBBY</span>
        </Link>
        <div className="text-xl font-black italic tracking-tighter">MISSÕES DIÁRIAS</div>
        <div className="text-amber-400 font-mono font-black text-sm">23:45:12 restantes</div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {CHALLENGES.map((c, idx) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-slate-900 transition-all"
          >
            <div className={cn("p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform", c.color)}>
              <c.icon size={32} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-black uppercase italic tracking-tight mb-2">{c.title}</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.progress / c.total) * 100}%` }}
                    className={cn("h-full bg-current", c.color)} 
                  />
                </div>
                <span className="text-xs font-mono font-bold text-white/40">{c.progress}/{c.total}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/40 font-black uppercase mb-1">Recompensa</span>
              <span className="text-sm font-black text-amber-400 uppercase tracking-tighter">{c.reward}</span>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-8 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Gift className="text-white/20" size={32} />
          </div>
          <h4 className="text-white/40 font-bold uppercase tracking-widest text-sm">Mais missões em breve</h4>
          <p className="text-xs text-white/20 mt-2 max-w-[200px]">Complete todas as missões diárias para ganhar um bônus de 5,000 chips.</p>
        </motion.div>
      </div>
    </main>
  );
}
