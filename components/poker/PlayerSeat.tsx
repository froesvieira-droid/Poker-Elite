'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Player, PlayerStatus } from '@/lib/poker/types';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { getRankLabel } from '@/lib/poker/utils';

export const PlayerSeat = ({ 
  player, 
  index, 
  totalPlayers, 
  isActing, 
  isHero,
  tableDimensions
}: { 
  player: Player, 
  index: number, 
  totalPlayers: number, 
  isActing: boolean,
  isHero: boolean,
  tableDimensions: { width: number, height: number }
}) => {
  // Ellipse positioning relative to table dimensions
  // Offset by 180 degrees to put index 0 (Hero) at the bottom
  const angle = ((index * (360 / totalPlayers)) + 180) * (Math.PI / 180);
  
  // Use responsive radius: roughly 85-90% of half-width/half-height to stay inside the table area
  const rx = tableDimensions.width * 0.40; 
  const ry = tableDimensions.height * 0.45; // Increased vertical radius to fit the new perspective
  
  const x = Math.sin(angle) * rx;
  const y = -Math.cos(angle) * ry;

  const isFolded = player.status === PlayerStatus.Folded;

  return (
    <div 
      className="absolute z-20 transition-all duration-500"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <div className={cn(
        "relative flex flex-col items-center w-28 sm:w-40 transition-all duration-300",
        isFolded && "opacity-40 grayscale"
      )}>
        {/* Turn Indicator Ring Glow */}
        <AnimatePresence>
          {isActing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse" 
            />
          )}
        </AnimatePresence>

        {/* Dealer Button */}
        {player.isDealer && (
          <div className="absolute -top-4 -right-2 z-30 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-slate-900 shadow-xl flex items-center justify-center">
            <span className="text-[10px] sm:text-[12px] font-black text-slate-950 uppercase">D</span>
          </div>
        )}

        {/* Avatar Area - Circular */}
        <div className="relative mb-3 z-10">
           <div className={cn(
             "w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-300",
             isHero ? "border-red-500 scale-110" : "border-white/20",
             isActing && "border-red-500 ring-4 ring-red-500/20"
           )}>
             {player.avatar ? (
               <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-slate-800">
                 <User className="text-white/20" size={32} />
               </div>
             )}
           </div>
           
           {/* Action Badge */}
           <AnimatePresence>
             {player.lastAction && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.8 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-[8px] sm:text-[10px] font-black uppercase rounded-full shadow-[0_4px_15px_rgba(220,38,38,0.4)] border border-white/20 z-20 whitespace-nowrap"
               >
                 {player.lastAction === 'fold' ? 'DESISTIR' : 
                  player.lastAction === 'call' ? 'PAGAR' : 
                  player.lastAction === 'raise' ? 'APOSTAR' : player.lastAction}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Info Pill - Mobile Poker Style */}
        <div className={cn(
          "relative z-20 flex flex-col items-center min-w-[100px] sm:min-w-[140px] px-3 py-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all",
          isHero && "border-red-500/50"
        )}>
          <p className={cn("text-[9px] sm:text-xs font-black tracking-tighter uppercase truncate w-full text-center", 
            isHero ? "text-white" : "text-white/60"
          )}>
            {isHero ? "VOCÊ" : player.name}
          </p>
          <p className="text-[10px] sm:text-[14px] font-display font-black text-yellow-500 tracking-tight leading-none mt-0.5">
            ${player.chips.toLocaleString()}
          </p>
        </div>

        {/* Bet Amount Overlay */}
        {player.bet > 0 && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             className="absolute -bottom-10 sm:-bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30"
           >
              <div className="flex -space-x-2">
                {[...Array(Math.min(5, Math.ceil(player.bet / 100)))].map((_, i) => (
                  <div key={i} className="w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-red-600 border-2 border-white/20 shadow-lg" />
                ))}
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/10">
                 <span className="text-[9px] sm:text-xs font-black text-yellow-500">${player.bet.toLocaleString()}</span>
              </div>
           </motion.div>
        )}

        {/* Opponent Cards with Animation */}
        {!isFolded && player.cards.length > 0 && !isHero && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex -space-x-3 sm:-space-x-6 z-0 opacity-80 scale-75 group-hover:scale-100 transition-transform">
             {[0, 1].map((_, i) => (
               <motion.div 
                 key={i}
                 initial={{ y: 0, rotate: i === 0 ? -15 : 15, opacity: 0 }}
                 animate={{ y: 0, rotate: i === 0 ? -15 : 15, opacity: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="w-10 h-14 sm:w-16 sm:h-22 rounded-md sm:rounded-xl bg-gradient-to-br from-red-600 to-red-950 border-2 border-red-500 shadow-2xl relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                 <div className="w-full h-full border-[1px] border-white/10 rounded-md sm:rounded-xl flex items-center justify-center px-1">
                    <div className="w-full aspect-square border-2 border-white/5 rounded-full flex items-center justify-center">
                       <h4 className="text-[6px] sm:text-[10px] font-black text-white/10 font-display">MEGA</h4>
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
};

const getSuitSymbol = (suit: string) => {
  switch (suit) {
    case 'H': return '♥';
    case 'D': return '♦';
    case 'C': return '♣';
    case 'S': return '♠';
    default: return '';
  }
};
