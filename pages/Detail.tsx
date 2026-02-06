import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Account, AccountStatus } from '../types';
import { getAccountById } from '../services/supabase';
import { StatusBadge, Button } from '../components/Shared';
import { ChevronLeft, Share2, Shield, Target, Zap, Skull, Crown, Smartphone, ArrowRight } from 'lucide-react';

export const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (id) getAccountById(id).then(setAccount);
  }, [id]);

  if (!account) return <div className="min-h-screen flex items-center justify-center text-white font-mono">LOADING DATA...</div>;

  const waLink = `https://wa.me/917602629250?text=${encodeURIComponent(`I want to buy ID: ${account.id}`)}`;

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Decorative Grid Background */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Breadcrumb / Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-gaming-neon mb-8 font-mono text-xs uppercase tracking-widest transition-colors">
          <ChevronLeft size={14} /> Back to Armory
        </Link>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* --- LEFT: VISUALS (Cols 7) --- */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Preview */}
            <div className="relative aspect-video bg-black border border-white/10 overflow-hidden group">
               {/* Cyber Corners */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gaming-neon/50 z-20" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gaming-neon/50 z-20" />
               
               <img 
                 src={account.images[activeImg] || account.thumbnail} 
                 className="w-full h-full object-contain relative z-10"
                 alt="Preview"
               />
               
               {/* Controls */}
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 z-20 flex justify-center gap-3">
                 {account.images.map((_, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setActiveImg(idx)}
                     className={`w-12 h-1 bg-white/20 transition-all hover:bg-gaming-neon ${activeImg === idx ? 'bg-gaming-neon w-16 shadow-[0_0_10px_rgba(255,215,0,0.8)]' : ''}`}
                   />
                 ))}
               </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {account.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`relative w-24 h-16 border flex-shrink-0 transition-all ${activeImg === idx ? 'border-gaming-neon opacity-100' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: DATA (Cols 5) --- */}
          <div className="lg:col-span-5 flex flex-col justify-center">
             
             <div className="mb-2 flex items-center gap-3">
                <StatusBadge status={account.status} />
                <span className="text-gaming-neon font-mono text-xs tracking-widest uppercase">
                  Server: {account.server}
                </span>
             </div>

             <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-none text-cyber">
               {account.title}
             </h1>

             <div className="flex items-end gap-4 mb-8 border-b border-white/10 pb-8">
               <div className="text-4xl font-display font-bold text-gaming-neon text-glow">
                 ₹{account.price.toLocaleString('en-IN')}
               </div>
               <div className="text-slate-500 font-mono text-sm mb-2">FIXED PRICE</div>
             </div>

             {/* Tech Specs */}
             <div className="grid grid-cols-2 gap-4 mb-8">
                <SpecItem label="Level" value={account.level} icon={Crown} />
                <SpecItem label="Evo Guns" value={account.evoGunsCount} icon={Zap} />
                <SpecItem label="BR Rank" value={account.rankBr} icon={Shield} />
                <SpecItem label="CS Rank" value={account.rankCs} icon={Target} />
                <SpecItem label="Total Skins" value={account.skinsCount} icon={Skull} />
                <SpecItem label="Login" value={account.loginMethod} icon={Smartphone} />
             </div>

             <div className="bg-white/5 border border-white/10 p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                   <Shield size={100} />
                </div>
                <h3 className="text-white font-display font-bold uppercase mb-2 text-sm tracking-widest">Description</h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap relative z-10">
                  {account.description}
                </p>
             </div>

             {/* Action Bar */}
             <div className="space-y-4">
                {account.status === AccountStatus.AVAILABLE ? (
                  <a href={waLink} target="_blank" rel="noreferrer" className="block w-full">
                    <Button fullWidth className="h-16 text-lg shadow-[0_0_30px_rgba(255,215,0,0.2)] animate-pulse-fast">
                      Initialize Purchase <ArrowRight className="ml-2" />
                    </Button>
                  </a>
                ) : (
                  <Button disabled fullWidth variant="danger" className="h-14">
                    ASSET UNAVAILABLE
                  </Button>
                )}
                
                <button 
                  onClick={() => navigator.share({ title: account.title, url: window.location.href })}
                  className="w-full py-3 flex items-center justify-center gap-2 text-slate-500 hover:text-white border border-white/10 hover:border-white/30 uppercase text-xs font-bold tracking-widest transition-all"
                >
                  <Share2 size={16} /> Share Access Code
                </button>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-center gap-4 bg-black border border-white/10 p-3 hover:border-gaming-neon/50 transition-colors group">
    <div className="w-10 h-10 bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-gaming-neon transition-colors">
      <Icon size={20} />
    </div>
    <div>
      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</div>
      <div className="text-white font-bold font-display">{value}</div>
    </div>
  </div>
);