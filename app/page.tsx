'use client';

import { motion } from 'motion/react';
import { Swords, Trophy, Users, Laptop, ChevronRight, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const cards = [
    { title: 'MODO OFFLINE', desc: 'Aprimore suas habilidades contra oponentes de IA elite.', icon: Laptop, color: 'border-white/10', link: '/play/offline' },
    { title: 'MULTIPLAYER', desc: 'Junte-se a mesas de apostas altas com jogadores do mundo todo.', icon: Users, color: 'border-red-500/50', link: '/play/online' },
  ];

  return (
    <main className="min-h-screen bg-brand-bg text-white overflow-hidden selection:bg-red-500/30">
      {/* Header Nav */}
      <nav className="h-20 bg-brand-surface border-b border-white/5 flex items-center justify-between px-10 relative z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-red-400 rounded-xl flex items-center justify-center rotate-45 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
               <span className="font-black text-sm -rotate-45">♠</span>
             </div>
             <span className="font-display font-black text-2xl tracking-tighter uppercase">
               STAR<span className="text-red-500">POKER</span>
             </span>
          </div>
          <div className="hidden md:flex gap-8 text-[11px] font-black tracking-widest text-white/40">
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-black/40 px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
             <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] text-black font-black">$</div>
             <span className="text-sm font-display font-black tracking-tight">142,500.00</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 border border-white/20">
             <div className="w-full h-full rounded-full bg-slate-800" />
           </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-40 px-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.1)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-black tracking-[0.2em] mb-6">
              <Sparkles size={12} />
              A ELITE DA EXPERIÊNCIA GAMING
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black italic tracking-tighter leading-[0.85] uppercase mb-8">
              ONDE LENDAS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-400 to-white">SÃO FORJADAS.</span>
            </h1>
            <p className="text-lg text-white/40 max-w-md font-medium mb-12">
              Conheça a interface de poker mais refinada do mundo. Multiplayer em tempo real, treinamento com IA avançada e as maiores apostas da web.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Link
                href="/play/online"
                className="group relative px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-[0_20px_40px_rgba(220,38,38,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <Play size={20} className="fill-current" />
                  <span>MULTIPLAYER</span>
                </div>
              </Link>
              <Link
                href="/play/offline"
                className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-2xl transition-all"
              >
                JOGAR OFFLINE
              </Link>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="relative hidden lg:block"
          >
            <div className="w-full aspect-square relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent rounded-full blur-[120px]" />
               {/* Visual Poker Elements Mockup */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-brand-surface rounded-[40px] border border-white/10 shadow-2xl p-8 rotate-3">
                  <div className="w-full h-full poker-table-gradient rounded-[20px] border-4 border-[#2c2c2c] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">POTE TOTAL</p>
                      <p className="text-4xl font-black text-yellow-500 font-display">$1,240,500</p>
                    </div>
                  </div>
               </div>
               {/* Cards Decor */}
               <div className="absolute -bottom-10 left-0 w-32 h-44 bg-white rounded-xl shadow-2xl border-4 border-white transform -rotate-12 flex flex-col p-2 text-red-600">
                  <span className="font-black text-2xl">A</span>
                  <span className="text-3xl mt-auto">♥</span>
               </div>
               <div className="absolute -bottom-6 left-16 w-32 h-44 bg-white rounded-xl shadow-2xl border-4 border-white transform -rotate-3 flex flex-col p-2 text-black">
                  <span className="font-black text-2xl">K</span>
                  <span className="text-3xl mt-auto">♠</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-10 pb-40 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <Link href={card.link} key={idx}>
              <motion.div
                whileHover={{ y: -10, borderColor: idx === 1 ? 'rgba(239,68,68,0.8)' : 'rgba(255,255,255,0.2)' }}
                className={cn(
                  "h-full p-8 rounded-[32px] bg-brand-surface border transition-all group",
                  card.color
                )}
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                  <card.icon size={24} />
                </div>
                <h3 className="text-xl font-display font-black tracking-tight mb-3 uppercase italic">{card.title}</h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">{card.desc}</p>
                <div className="flex items-center gap-2 text-xs font-black tracking-widest text-red-500 group-hover:gap-4 transition-all">
                  ENTRAR <ChevronRight size={14} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Decorative Gradient Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-20" />
    </main>
  );
}
