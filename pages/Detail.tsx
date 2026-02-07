import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Account, AccountStatus } from '../types';
import { getAccountById } from '../services/supabase';
import { StatusBadge, Button } from '../components/Shared';
import { ChevronLeft, Share2, Shield, Target, Zap, Skull, Crown, Smartphone, ArrowRight, Copy } from 'lucide-react';

export const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (id) getAccountById(id).then(setAccount);
  }, [id]);

  if (!account) return <div className="min-h-screen flex items-center justify-center text-white font-mono">LOADING DATA...</div>;

  const currentUrl = window.location.href;
  const message = `Greetings Team HABIB,

I am interested in acquiring the following Elite Asset:

• Title: ${account.title}
• ID Ref: ${account.id}
• Price: ₹${account.price.toLocaleString('en-IN')}

Asset Link: ${currentUrl}

Please confirm availability and transaction details.`;

  const waLink = `https://wa.me/917602629250?text=${encodeURIComponent(message)}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: account.title, url: window.location.href });
      } catch (err) { console.log('Share cancelled'); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/inventory');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      {/* Decorative Grid Background */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0" />

      {/* --- MOBILE STICKY BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 md:hidden flex gap-3 animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
         <div className="flex flex-col justify-center px-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Price</span>
            <span className="text-xl font-display font-bold text-gaming-neon">₹{account.price.toLocaleString('en-IN')}</span>
         </div>
         <div className="flex-1 flex gap-2">
            {account.status === AccountStatus.AVAILABLE ? (
               <a href={waLink} target="_blank" rel="noreferrer" className="flex-1">
                 <Button fullWidth variant="primary" className="h-12 text-sm shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                   BUY NOW
                 </Button>
               </a>
            ) : (
               <Button disabled fullWidth variant="danger" className="h-12 text-xs flex-1">
                 SOLD
               </Button>
            )}
            <button 
              onClick={handleShare}
              className="w-12 flex items-center justify-center bg-white/10 border border-white/10 rounded active:bg-white/20 transition-colors"
            >
              <Share2 size={18} className="text-white" />
            </button>
         </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-gaming-neon mb-6 font-mono text-[10px] md:text-xs uppercase tracking-widest transition-colors"
        >
          <ChevronLeft size={14} /> Back to Inventory
        </button>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* --- LEFT: VISUALS (Cols 7) --- */}
          <div className="lg:col-span-7 space-y-4 md:space-y-6">
            {/* Main Preview */}
            <div className="relative w-full h-[450px] md:h-[600px] bg-black border border-white/10 overflow-hidden group flex items-center justify-center rounded-sm">
               {/* Cyber Corners */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gaming-neon/50 z-20" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gaming-neon/50 z-20" />
               
               <img 
                 src={account.images[activeImg] || account.thumbnail} 
                 className="max-w-full max-h-full object-contain relative z-10 shadow-2xl"
                 alt="Preview"
               />
               
               {/* Controls */}
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-20 flex justify-center flex-wrap gap-2">
                 {account.images.map((_, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setActiveImg(idx)}
                     className={`h-1.5 rounded-full transition-all duration-300 ${
                       activeImg === idx 
                         ? 'bg-gaming-neon w-8 shadow-[0_0_10px_rgba(255,215,0,0.8)]' 
                         : 'bg-white/20 w-3'
                     }`}
                   />
                 ))}
               </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
              {account.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`relative w-16 h-16 md:w-24 md:h-24 border flex-shrink-0 transition-all rounded-sm overflow-hidden ${
                    activeImg === idx 
                      ? 'border-gaming-neon opacity-100 ring-1 ring-gaming-neon' 
                      : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: DATA (Cols 5) --- */}
          <div className="lg:col-span-5 flex flex-col justify-center">
             
             <div className="mb-3 flex items-center gap-3">
                <StatusBadge status={account.status} />
                <span className="text-gaming-neon font-mono text-[10px] md:text-xs tracking-widest uppercase bg-gaming-neon/5 px-2 py-0.5 rounded border border-gaming-neon/10">
                  {account.server} Server
                </span>
             </div>

             <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight text-cyber">
               {account.title}
             </h1>

             {/* Price Section - Hidden on Mobile (moved to bottom bar) */}
             <div className="hidden md:flex items-end gap-4 mb-8 border-b border-white/10 pb-8">
               <div className="text-4xl font-display font-bold text-gaming-neon text-glow">
                 ₹{account.price.toLocaleString('en-IN')}
               </div>
               <div className="text-slate-500 font-mono text-sm mb-2">FIXED PRICE</div>
             </div>

             {/* Tech Specs */}
             <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
                <SpecItem label="Level" value={account.level} icon={Crown} />
                <SpecItem label="Evo Guns" value={account.evoGunsCount} icon={Zap} />
                <SpecItem label="BR Rank" value={account.rankBr} icon={Shield} />
                <SpecItem label="CS Rank" value={account.rankCs} icon={Target} />
                <SpecItem label="Total Skins" value={account.skinsCount} icon={Skull} />
                <SpecItem label="Login" value={account.loginMethod} icon={Smartphone} />
             </div>

             <div className="bg-white/5 border border-white/10 p-5 md:p-6 mb-8 relative overflow-hidden rounded-lg">
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                   <Shield size={100} />
                </div>
                <h3 className="text-white font-display font-bold uppercase mb-3 text-xs tracking-widest flex items-center gap-2">
                   <span className="w-1 h-4 bg-gaming-neon"></span>
                   Description
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap relative z-10 font-sans">
                  {account.description}
                </p>
             </div>

             {/* Desktop Action Bar */}
             <div className="space-y-4 hidden md:block">
                {account.status === AccountStatus.AVAILABLE ? (
                  <a href={waLink} target="_blank" rel="noreferrer" className="block w-full">
                    <Button fullWidth className="h-16 text-lg shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:scale-[1.02] transition-transform">
                      Initialize Purchase <ArrowRight className="ml-2" />
                    </Button>
                  </a>
                ) : (
                  <Button disabled fullWidth variant="danger" className="h-14">
                    ASSET UNAVAILABLE
                  </Button>
                )}
                
                <button 
                  onClick={handleShare}
                  className="w-full py-3 flex items-center justify-center gap-2 text-slate-500 hover:text-white border border-white/10 hover:border-white/30 uppercase text-xs font-bold tracking-widest transition-all rounded"
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
  <div className="flex items-center gap-3 md:gap-4 bg-black/40 border border-white/10 p-2.5 md:p-3 hover:border-gaming-neon/50 transition-colors group rounded-sm">
    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded flex items-center justify-center text-slate-500 group-hover:text-gaming-neon transition-colors">
      <Icon size={16} className="md:w-5 md:h-5" />
    </div>
    <div className="min-w-0">
      <div className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest truncate">{label}</div>
      <div className="text-white font-bold font-display text-sm md:text-base truncate">{value}</div>
    </div>
  </div>
);