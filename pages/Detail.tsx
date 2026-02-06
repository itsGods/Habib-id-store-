import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Account, AccountStatus } from '../types';
import { getAccountById } from '../services/firebase';
import { StatusBadge, CategoryBadge, Button } from '../components/Shared';
import { ChevronLeft, MessageCircle, Shield, Target, Award, PlayCircle, Layers, Check, Share2, ShieldCheck } from 'lucide-react';

export const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      getAccountById(id).then(acc => {
        setAccount(acc);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gaming-neon"><div className="animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full" /></div>;
  if (!account) return <div className="min-h-screen flex flex-col items-center justify-center text-white">Account not found <Link to="/" className="text-gaming-neon mt-4 hover:underline">Go Home</Link></div>;

  const isSold = account.status === AccountStatus.SOLD;
  // Include current URL in the WhatsApp message for easier context
  const currentUrl = window.location.href;
  const waMessage = encodeURIComponent(`Hi, I'm interested in the account "${account.title}" (ID: ${account.id}) priced at ₹${account.price.toLocaleString('en-IN')}. Is it still available?\n\nLink: ${currentUrl}`);
  // Updated phone number as requested
  const waLink = `https://wa.me/917602629250?text=${waMessage}`;

  const handleShare = async () => {
    const urlToShare = window.location.href;
    const shareData = {
      title: account.title,
      text: `Check out this ${account.title} on Habib FF Store! Price: ₹${account.price}`,
      url: urlToShare
    };

    try {
      // Try Native Share
      if (navigator.share && urlToShare.startsWith('http')) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported or invalid URL scheme');
      }
    } catch (err) {
      console.warn('Sharing failed, falling back to clipboard:', err);
      try {
        await navigator.clipboard.writeText(urlToShare);
        alert('Link copied to clipboard!');
      } catch (clipboardErr) {
        console.error('Clipboard failed:', clipboardErr);
        prompt('Copy this link:', urlToShare);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 pb-24 md:pb-8 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-900 to-black pointer-events-none z-0" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gaming-neon/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Back Header (Mobile) */}
      <div className="md:hidden absolute top-4 left-4 z-20">
        <Link to="/" className="bg-black/50 backdrop-blur p-2 rounded-full text-white hover:bg-black/80 border border-white/10">
          <ChevronLeft />
        </Link>
      </div>

      <div className="container mx-auto md:py-8 grid md:grid-cols-2 gap-8 relative z-10">
        
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-video bg-slate-900/50 backdrop-blur-sm rounded-none md:rounded-2xl overflow-hidden border-b border-slate-800 md:border md:border-slate-800 group">
            
            <img 
              src={account.images[activeImageIndex] || account.thumbnail} 
              alt="Main view" 
              className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {account.images.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all shadow-sm ${idx === activeImageIndex ? 'bg-gaming-neon w-8' : 'bg-white/30 w-4 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="hidden md:flex gap-3 overflow-x-auto p-1">
            {account.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImageIndex(idx)}
                className={`w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all relative ${idx === activeImageIndex ? 'border-gaming-neon opacity-100 ring-2 ring-gaming-neon/20' : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="px-4 md:px-0">
          
          <div className="flex items-start justify-between mb-4 mt-4 md:mt-0">
             <div>
                <div className="flex gap-2 mb-3">
                  <CategoryBadge category={account.category} />
                  <StatusBadge status={account.status} />
                </div>
                <h1 className="text-2xl md:text-4xl font-gaming font-bold text-white mb-2 leading-tight shadow-black drop-shadow-lg">{account.title}</h1>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  {account.tags.map(tag => (
                    <span key={tag} className="bg-slate-800/50 border border-slate-700 px-2 py-1 rounded text-slate-300">#{tag}</span>
                  ))}
                </div>
             </div>
             <div className="text-right">
                <div className="text-3xl font-bold text-gaming-neon drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">₹{account.price.toLocaleString('en-IN')}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">INR</div>
             </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-6" />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
             <StatBox icon={Award} label="Level" value={account.level} />
             <StatBox icon={Shield} label="BR Rank" value={account.rankBr} />
             <StatBox icon={Target} label="CS Rank" value={account.rankCs} />
             <StatBox icon={Layers} label="Skins" value={account.skinsCount} />
             <StatBox icon={PlayCircle} label="Evo Guns" value={account.evoGunsCount} />
             <StatBox icon={Shield} label="Elite Pass" value={account.elitePassCount} />
          </div>

          <div className="bg-slate-900/40 backdrop-blur rounded-xl p-4 border border-slate-800 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Login Method</h3>
              <div className="flex items-center gap-2 text-white font-bold">
                {account.loginMethod} 
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-400 text-xs bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <ShieldCheck size={14} />
              Verified & Safe
            </div>
          </div>

          <h3 className="text-white font-bold uppercase tracking-wider mb-3 text-sm flex items-center gap-2">
            <span className="w-1 h-4 bg-gaming-neon rounded-full"></span>
            Description
          </h3>
          <p className="text-slate-400 leading-relaxed mb-10 whitespace-pre-wrap text-sm md:text-base bg-slate-900/20 p-4 rounded-xl border border-white/5">
            {account.description}
          </p>

          {/* Sticky CTA */}
          <div className="fixed md:static bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-slate-800 md:border-none md:bg-transparent md:p-0 z-40">
            {isSold ? (
               <Button disabled fullWidth variant="secondary" className="opacity-50">Sold Out</Button>
            ) : (
              <div className="flex gap-3">
                 <button 
                   onClick={handleShare}
                   className="p-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                   aria-label="Share Account"
                 >
                   <Share2 size={20} />
                 </button>
                 <a href={waLink} target="_blank" rel="noopener noreferrer" className="block flex-1">
                  <Button fullWidth className="animate-pulse-slow shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                    <MessageCircle className="mr-2" size={20} />
                    Buy Now via WhatsApp
                  </Button>
                </a>
              </div>
            )}
            <p className="text-[10px] text-center text-slate-500 mt-3 flex items-center justify-center gap-1.5 opacity-60">
              <Shield size={10} /> Protected by EliteVault Guarantee
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon: Icon, label, value }: any) => (
  <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600 transition-colors group">
    <div className="flex items-center gap-2 text-slate-500 mb-1.5">
      <Icon size={14} className="group-hover:text-gaming-neon transition-colors" />
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </div>
    <div className="text-white font-bold truncate text-sm md:text-base">{value}</div>
  </div>
);