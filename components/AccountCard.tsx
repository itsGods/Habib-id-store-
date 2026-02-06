import React from 'react';
import { Account, AccountStatus } from '../types';
import { StatusBadge } from './Shared';
import { Shield, Zap, Skull, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  account: Account;
}

export const AccountCard: React.FC<Props> = ({ account }) => {
  const isAvailable = account.status === AccountStatus.AVAILABLE;
  const isRare = account.tags.includes('Rare') || account.tags.includes('OG') || account.price > 20000;

  return (
    <Link to={`/account/${account.id}`} className="block group">
      <div className={`relative bg-gaming-800 rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${isRare ? 'border-gaming-neon/40 shadow-[0_0_10px_rgba(251,191,36,0.1)] hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'border-slate-700 hover:border-slate-500'}`}>
        
        {/* Image Container */}
        <div className="relative aspect-video bg-slate-900 overflow-hidden">
          <img 
            src={account.thumbnail} 
            alt={account.title} 
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!isAvailable ? 'grayscale opacity-60' : ''}`}
          />
          
          {/* Status Overlay if not available */}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <span className="text-xl font-bold uppercase tracking-widest text-white border-2 border-white px-4 py-2 rounded transform -rotate-12">
                {account.status}
              </span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <StatusBadge status={account.status} />
            {account.featured && <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Featured</span>}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-8">
            <h3 className="text-white font-gaming font-bold text-lg truncate leading-tight">{account.title}</h3>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
            <div className="flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded">
              <Trophy size={14} className="text-gaming-neon" />
              <span>Lv. {account.level}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded">
              <Shield size={14} className="text-blue-400" />
              <span className="truncate">{account.rankBr}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded">
              <Zap size={14} className="text-yellow-500" />
              <span>{account.evoGunsCount} Evo</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded">
              <Skull size={14} className="text-purple-400" />
              <span>{account.skinsCount} Skins</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-700 pt-3">
             <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 uppercase tracking-wider">Price</span>
               <span className="text-lg font-bold text-white">₹{account.price.toLocaleString('en-IN')}</span>
             </div>
             <div className="bg-gaming-neon/10 text-gaming-neon px-3 py-1.5 rounded text-xs font-bold uppercase group-hover:bg-gaming-neon group-hover:text-black transition-colors">
               View Details
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};