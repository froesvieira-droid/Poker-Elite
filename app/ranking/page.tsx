'use client';

import { motion } from 'motion/react';
import { Medal, Home, User, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const RANKINGS = [
  { rank: 1, name: 'Daniel_Negreanu', chips: '14,250,000', trend: 'up', avatar: 'https://picsum.photos/seed/p1/100' },
  { rank: 2, name: 'Doyle_Brunson', chips: '12,100,000', trend: 'down', avatar: 'https://picsum.photos/seed/p2/100' },
  { rank: 3, name: 'Phil_Ivey', chips: '9,800,000', trend: 'up', avatar: 'https://picsum.photos/seed/p3/100' },
  { rank: 4, name: 'PokerFish99', chips: '7,500,000', trend: 'up', avatar: 'https://picsum.photos/seed/p4/100' },
  { rank: 5, name: 'SharkAttack', chips: '5,200,000', trend: 'down', avatar: 'https://picsum.photos/seed/p5/100' },
  { rank: 6, name: 'GigaChad_01', chips: '4,100,000', trend: 'up', avatar: 'https://picsum.photos/seed/p6/100' },
  { rank: 7, name: 'Local_Player', chips: '1,000,000', trend: 'flat', avatar: 'https://picsum.photos/seed/poker_user/100', isUser: true },
];

export default function RankingPage() {
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
        <div className="text-xl font-black italic tracking-tighter">GLOBAL RANKING</div>
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
           <Medal size={18} className="text-amber-400" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Top 3 Podiums */}
        <div className="flex justify-center items-end gap-4 mb-16 pt-8">
           {/* 2nd Place */}
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="flex flex-col items-center"
           >
              <div className="w-20 h-20 rounded-full border-4 border-slate-400 p-1 mb-2">
                 <img src={RANKINGS[1].avatar} alt={RANKINGS[1].name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="bg-slate-400 text-black px-4 py-1 rounded-t-xl font-black italic text-sm">2nd</div>
              <div className="h-24 w-24 bg-slate-800 rounded-b-xl border border-slate-400/20 flex items-center justify-center">
                <span className="text-xl font-black">#2</span>
              </div>
           </motion.div>

           {/* 1st Place */}
           <motion.div
             initial={{ opacity: 0, y: 80 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col items-center z-10"
           >
              <div className="w-28 h-28 rounded-full border-4 border-amber-400 p-1 mb-2 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                 <img src={RANKINGS[0].avatar} alt={RANKINGS[0].name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="bg-amber-400 text-black px-6 py-2 rounded-t-xl font-black italic">1st</div>
              <div className="h-32 w-32 bg-slate-800 rounded-b-xl border border-amber-400/20 flex items-center justify-center">
                <Medal size={40} className="text-amber-400" />
              </div>
           </motion.div>

           {/* 3rd Place */}
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-col items-center"
           >
              <div className="w-20 h-20 rounded-full border-4 border-amber-700 p-1 mb-2">
                 <img src={RANKINGS[2].avatar} alt={RANKINGS[2].name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="bg-amber-700 text-white px-4 py-1 rounded-t-xl font-black italic text-sm">3rd</div>
              <div className="h-20 w-24 bg-slate-800 rounded-b-xl border border-amber-700/20 flex items-center justify-center">
                 <span className="text-xl font-black text-amber-700">#3</span>
              </div>
           </motion.div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {RANKINGS.map((p, idx) => (
             <motion.div
               key={p.name}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 + idx * 0.1 }}
               className={cn(
                 "p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/5 border border-white/5",
                 p.isUser && "bg-indigo-600/20 border-indigo-500/30"
               )}
             >
                <div className="w-8 text-center font-black italic italic text-white/40">#{p.rank}</div>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                   <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                   <div className="font-bold flex items-center gap-2">
                     {p.name}
                     {p.isUser && <span className="text-[10px] bg-indigo-500 px-1.5 py-0.5 rounded uppercase font-black tracking-widest leading-none">Tu</span>}
                   </div>
                   <div className="text-xs text-white/40 font-mono font-bold">${p.chips}</div>
                </div>
                <div className="flex items-center gap-2">
                   {p.trend === 'up' && <TrendingUp size={16} className="text-emerald-500" />}
                   {p.trend === 'down' && <TrendingDown size={16} className="text-rose-500" />}
                   <ChevronRight size={16} className="text-white/20" />
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
