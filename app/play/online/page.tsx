'use client';

import { motion } from 'motion/react';
import { Globe, Home, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { OnlineLobby } from '@/components/poker/OnlineLobby';
import { signInWithGoogle } from '@/lib/firebase';

export default function OnlinePlayPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-md w-full bg-slate-900 border border-white/10 p-12 rounded-3xl text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
             <Globe size={40} className="text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">MULTIPLAYER</h1>
          <p className="text-white/40 font-medium mb-10">Você precisa estar logado para jogar online com outros players.</p>
          
          <button 
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <LogIn size={20} />
            ENTRAR COM GOOGLE
          </button>

          <Link href="/" className="inline-block text-white/20 text-sm font-bold mt-8 hover:text-white transition-colors">
            VOLTAR PARA O LOBBY
          </Link>
        </motion.div>
      </main>
    );
  }

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
        <div className="text-xl font-black italic tracking-tighter uppercase font-display">Multiplayer Online</div>
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden">
           <img src={user.photoURL || ''} alt="me" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="container mx-auto">
        <OnlineLobby />
      </div>

      {/* Decorative */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent pointer-events-none" />
    </main>
  );
}
