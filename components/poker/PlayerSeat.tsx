'use client';

import { motion } from 'motion/react';
import { Player, PlayerStatus } from '@/lib/poker/types';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export const PlayerSeat = ({ 
  player, 
  index, 
  totalPlayers, 
  isActing, 
  isHero 
}: { 
  player: Player, 
  index: number, 
  totalPlayers: number, 
  isActing: boolean,
  isHero: boolean
}) => {
  // Ellipse positioning
  const angle = (index * (360 / totalPlayers)) * (Math.PI / 180);
  const rx = 440; // Horizontal radius
  const ry = 220; // Vertical radius
  const x = Math.sin(angle) * rx;
  const y = -Math.cos(angle) * ry;

  const isFolded = player.status === PlayerStatus.Folded;

  return (
    <div 
      className="absolute z-20 transition-all duration-500"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <div className={cn(
        "relative flex flex-col items-center w-32 px-2 py-3 rounded-2xl transition-all duration-300",
        isHero ? "bg-gradient-to-b from-[#2a2d35] to-[#14171c] border-2 border-red-500 shadow-xl scale-110" : "bg-black/60 backdrop-blur-md border border-white/10",
        isActing && "ring-4 ring-red-500/30 border-red-500",
        isFolded && "opacity-40 grayscale"
      )}>
        {/* Dealer Button */}
        {player.isDealer && (
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-slate-900 shadow-lg flex items-center justify-center">
            <span className="text-[10px] font-black text-slate-950">D</span>
          </div>
        )}

        {/* Turn Indicator Glow */}
        {isActing && (
          <div className="absolute -inset-1 rounded-2xl bg-red-500/20 animate-pulse pointer-events-none" />
        )}

        {/* Avatar Area */}
        <div className="relative mb-2">
           <div className={cn(
             "w-12 h-12 rounded-full overflow-hidden border-2 p-0.5",
             isHero ? "border-red-500" : "border-white/10"
           )}>
             {player.avatar ? (
               <img src={player.avatar} alt={player.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-full">
                 <User className="text-white/20" size={20} />
               </div>
             )}
           </div>
           
           {player.lastAction && (
             <div className="absolute -bottom-1 -right-4 px-2 py-0.5 bg-red-600 text-[8px] font-black uppercase rounded shadow-lg animate-in zoom-in slide-in-from-bottom-1">
               {player.lastAction}
             </div>
           )}
        </div>

        {/* Player Info */}
        <div className="text-center font-display">
          <p className={cn("text-[10px] font-black tracking-tight uppercase truncate w-24", 
            isHero ? "text-white" : "text-white/60"
          )}>
            {isHero ? "YOU" : player.name}
          </p>
          <div className="flex items-center justify-center gap-1">
             <span className="text-[10px] font-black text-yellow-500 tracking-tighter">
               ${player.chips.toLocaleString()}
             </span>
          </div>
        </div>

        {/* Player Bet Bubble */}
        {player.bet > 0 && (
           <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              <div className="flex -space-x-1">
                {[...Array(Math.min(3, Math.ceil(player.bet / 100)))].map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-red-600 border border-white/20 shadow-sm" />
                ))}
              </div>
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-xl">
                 <span className="text-[10px] font-black text-white/80">${player.bet}</span>
              </div>
           </div>
        )}

        {/* Card Display */}
        {!isFolded && player.cards.length > 0 && (
           <div className="flex gap-1 mt-2">
             {player.cards.map((card, i) => (
               <motion.div 
                 key={i}
                 initial={{ y: 20, rotate: i === 0 ? -10 : 10, opacity: 0 }}
                 animate={{ y: 0, rotate: i === 0 ? -10 : 10, opacity: 1 }}
                 className={cn(
                   "w-7 h-10 rounded shadow-2xl flex flex-col items-center justify-center border border-black/10",
                   isHero ? "bg-white" : "bg-gradient-to-br from-red-700 to-red-900 border-red-500/50"
                 )}
               >
                 {isHero ? (
                   <>
                     <span className={cn("text-[10px] font-black leading-none", 
                       (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
                     )}>
                       {card.rank}
                     </span>
                     <span className={cn("text-xs leading-none", 
                       (card.suit === 'H' || card.suit === 'D') ? "text-red-600" : "text-black"
                     )}>
                       {getSuitSymbol(card.suit)}
                     </span>
                   </>
                 ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <div className="w-2 h-2 rounded-full bg-white/20" />
                    </div>
                 )}
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
