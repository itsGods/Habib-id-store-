import React, { useRef, useState } from 'react';
import { Account, AccountStatus } from '../types';
import { StatusBadge } from './Shared';
import { Shield, Zap, Skull, Trophy, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  account: Account;
}

export const AccountCard: React.FC<Props> = ({ account }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isAvailable = account.status === AccountStatus.AVAILABLE;
  const isPremium = account.category === 'PREMIUM' || account.price > 15000;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return; // Disable tilt on mobile
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Subtle tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((y - centerY) / centerY) * -5;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="card-3d-wrapper h-full py-1 md:py-2">
      <Link 
        to={`/account/${account.id}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="block relative h-full bg-gaming-900 border border-white/10 group cursor-pointer overflow-hidden active:scale-[0.98] transition-all duration-100"
      >
        {/* --- Scanning Laser Effect --- */}
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gaming-neon/80 shadow-[0_0_15px_rgba(255,215,0,0.8)] z-30 pointer-events-none transition-all duration-[1.5s] ease-in-out ${isHovered ? 'translate-y-[350px] opacity-100' : '-translate-y-10 opacity-0'}`} />

        {/* Hover Border Glow */}
        <div className={`absolute inset-0 border transition-all duration-300 pointer-events-none z-20 ${isHovered ? 'border-gaming-neon/40 shadow-[inset_0_0_20px_rgba(255,215,0,0.1)]' : 'border-transparent'}`} />
        
        {/* Tech Decor Corners */}
        <div className="absolute top-0 left-0 p-1 z-20">
            <div className={`w-2 h-2 border-t-2 border-l-2 transition-colors duration-300 ${isHovered ? 'border-gaming-neon' : 'border-white/20'}`} />
        </div>
        <div className="absolute bottom-0 right-0 p-1 z-20">
            <div className={`w-2 h-2 border-b-2 border-r-2 transition-colors duration-300 ${isHovered ? 'border-gaming-neon' : 'border-white/20'}`} />
        </div>

        {/* Image Area */}
        <div className="relative aspect-video overflow-hidden bg-black border-b border-white/5">
          <img 
            src={account.thumbnail} 
            alt={account.title} 
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 sepia-0 brightness-110' : 'scale-100 sepia-[0.2] brightness-90'}`}
          />
          
          {/* Overlay for Status */}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[2px] z-10">
              <div className="border-2 border-red-500 text-red-500 px-4 py-1 font-display font-bold uppercase tracking-widest text-lg flex items-center gap-2 transform -rotate-12 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <Lock size={16} /> {account.status}
              </div>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20">
            <StatusBadge status={account.status} />
            {isPremium && (
              <span className="bg-purple-500/90 backdrop-blur-md text-white text-[9px] font-display font-bold px-2 py-0.5 uppercase tracking-wider border border-purple-400/50 shadow-lg">
                Elite
              </span>
            )}
          </div>
        </div>

        {/* Info Area */}
        <div className="p-3 md:p-4 relative">
           {/* Scanline background in card content */}
           <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none" />
           
           <h3 className="font-display font-bold text-slate-100 text-sm md:text-base leading-tight mb-2 md:mb-3 truncate group-hover:text-gaming-neon transition-colors">
             {account.title}
           </h3>

           {/* Compact Stats Grid */}
           <div className="grid grid-cols-2 gap-1 mb-3 md:mb-4">
              <div className="bg-white/5 border border-white/5 p-1 md:p-1.5 flex items-center gap-1.5 rounded-sm">
                 <Trophy size={10} className="text-gaming-neon shrink-0" />
                 <span className="text-[9px] md:text-[10px] font-mono text-slate-400 uppercase">Lv.{account.level}</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-1 md:p-1.5 flex items-center gap-1.5 rounded-sm">
                 <Shield size={10} className="text-blue-400 shrink-0" />
                 <span className="text-[9px] md:text-[10px] font-mono text-slate-400 uppercase truncate">{account.rankBr}</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-1 md:p-1.5 flex items-center gap-1.5 rounded-sm">
                 <Zap size={10} className="text-purple-400 shrink-0" />
                 <span className="text-[9px] md:text-[10px] font-mono text-slate-400 uppercase">{account.evoGunsCount} Evo</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-1 md:p-1.5 flex items-center gap-1.5 rounded-sm">
                 <Skull size={10} className="text-red-400 shrink-0" />
                 <span className="text-[9px] md:text-[10px] font-mono text-slate-400 uppercase">{account.skinsCount} Skins</span>
              </div>
           </div>

           {/* Price & Action */}
           <div className="flex items-end justify-between border-t border-white/10 pt-2 md:pt-3">
              <div>
                <div className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Price</div>
                <div className="text-base md:text-lg font-display font-bold text-white group-hover:text-gaming-neon transition-colors">
                   ₹{account.price.toLocaleString('en-IN')}
                </div>
              </div>
              <div className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border transition-all duration-300 rounded-sm ${isHovered ? 'bg-gaming-neon border-gaming-neon text-black translate-x-1' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-4 md:h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
           </div>
        </div>
      </Link>
    </div>
  );
};