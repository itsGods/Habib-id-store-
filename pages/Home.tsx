import React, { useState, useEffect } from 'react';
import { Account, AccountCategory } from '../types';
import { getAccounts } from '../services/supabase';
import { AccountCard } from '../components/AccountCard';
import { Button } from '../components/Shared';
import { Search, Filter, Flame, Crosshair, ChevronDown, Terminal, Activity, Menu, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  // Initialize from session storage if available to support instant back-navigation scroll restoration
  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const cached = sessionStorage.getItem('habib_inventory_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Only show loading if we didn't have cached data
  const [loading, setLoading] = useState(() => accounts.length === 0);
  
  const [filterCategory, setFilterCategory] = useState<AccountCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetch = async () => {
      // Even if we have cache, fetch fresh data in background to update
      const data = await getAccounts();
      setAccounts(data);
      setLoading(false);
      // Update cache
      sessionStorage.setItem('habib_inventory_cache', JSON.stringify(data));
    };
    fetch();
  }, []);

  const filteredAccounts = accounts.filter(acc => {
    const matchesCategory = filterCategory === 'ALL' || acc.category === filterCategory;
    const matchesSearch = acc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          acc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredAccounts = accounts.filter(a => a.featured);

  const scrollToBrowse = () => {
    const el = document.getElementById('inventory');
    if (el) {
       const y = el.getBoundingClientRect().top + window.scrollY - 100; // Offset for sticky header
       window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative">
      
      {/* --- CINEMATIC HERO --- */}
      <section className="relative h-[85vh] md:h-[90vh] flex flex-col items-center justify-center overflow-hidden">
         {/* Spotlight Effect */}
         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gaming-neon/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
         
         <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            
            {/* Status Ticker */}
            <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-mono tracking-widest text-slate-500 border border-white/10 px-3 py-1.5 md:px-4 md:py-2 bg-black/60 backdrop-blur-md rounded-full animate-float">
               <span className="flex items-center gap-2 text-green-400"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> ONLINE</span>
               <span className="w-px h-3 bg-white/20"></span>
               <span className="flex items-center gap-2"><Activity size={10} /> DATABASE: SECURE</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 mb-4 md:mb-6 leading-[0.9] md:leading-[0.85] tracking-tighter relative">
               ELITE<br />ARMORY
               <span className="absolute -top-2 -right-4 md:-top-4 md:-right-8 text-xs md:text-2xl text-gaming-neon font-mono font-normal tracking-widest opacity-60">
                  v2.0
               </span>
            </h1>

            <p className="text-slate-400 font-mono text-xs md:text-base max-w-xs md:max-w-lg mx-auto mb-8 md:mb-10 leading-relaxed">
               <span className="text-gaming-neon">///</span> ACCESS AUTHORIZED <br/>
               Secure the rarest Free Fire identities. Verified ownership. Instant transfer.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto px-4 sm:px-0">
               <Button onClick={scrollToBrowse} variant="primary" className="w-full sm:w-auto px-8 md:px-12 py-3 md:py-4 text-base md:text-lg shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                  Initialize Scan
               </Button>
               <Button variant="outline" className="w-full sm:w-auto px-8 py-3 md:py-4 text-xs md:text-sm font-mono" onClick={() => window.open('https://wa.me/917602629250', '_blank')}>
                  <Terminal size={14} className="mr-2" /> Sell Account
               </Button>
            </div>
         </div>

         {/* Bottom Fade */}
         <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
         
         {/* Scroll Indicator */}
         <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-600 cursor-pointer" onClick={scrollToBrowse}>
            <ChevronDown size={20} className="md:w-6 md:h-6" />
         </div>
      </section>

      {/* --- FEATURED CAROUSEL (HORIZONTAL SCROLL) --- */}
      {featuredAccounts.length > 0 && (
         <div className="relative z-10 border-y border-white/5 bg-black/60 backdrop-blur-sm py-8 md:py-12">
            <div className="container mx-auto px-4">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg md:text-xl font-display font-bold text-white flex items-center gap-2">
                     <Flame className="text-gaming-accent animate-pulse" size={18} />
                     FEATURED DROPS
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                     <span className="hidden md:inline">Scroll</span>
                     <span className="md:hidden">Swipe</span>
                     <ArrowRight size={12} />
                  </div>
               </div>
               
               {/* Scroll Container */}
               <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                  {featuredAccounts.map(acc => (
                     <div key={acc.id} className="min-w-[85vw] sm:min-w-[350px] md:min-w-[400px] snap-center">
                        <AccountCard account={acc} />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* --- MAIN INVENTORY --- */}
      <section id="inventory" className="container mx-auto px-4 py-16 md:py-24 relative z-10">
         
         {/* Control Panel */}
         <div className="mb-8 md:mb-12 sticky top-20 md:top-24 z-30 bg-black/90 backdrop-blur-xl border border-white/10 p-3 md:p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
               <div className="flex items-center gap-3 md:gap-4 pb-2 md:pb-0 border-b md:border-none border-white/5">
                  <div className="hidden md:flex w-10 h-10 bg-gaming-neon/10 items-center justify-center rounded border border-gaming-neon/20">
                     <Filter size={20} className="text-gaming-neon" />
                  </div>
                  <div className="flex-1 md:flex-none">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white">INVENTORY</h2>
                    <p className="text-slate-500 font-mono text-[9px] md:text-[10px] uppercase tracking-widest">Select your loadout</p>
                  </div>
               </div>
               
               <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 flex-1 justify-end">
                  {/* Filter Tabs - Horizontal Scroll on Mobile */}
                  <div className="flex p-1 bg-black border border-white/10 rounded-lg overflow-x-auto scrollbar-hide -mx-1 md:mx-0">
                     {['ALL', 'BUDGET', 'RARE', 'PREMIUM'].map((cat) => (
                        <button
                           key={cat}
                           onClick={() => setFilterCategory(cat as any)}
                           className={`flex-shrink-0 px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-bold font-display uppercase tracking-widest transition-all duration-300 rounded ${
                              filterCategory === cat 
                              ? 'bg-gaming-neon text-black shadow-lg' 
                              : 'text-slate-500 hover:text-white'
                           }`}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>

                   {/* Search Bar */}
                   <div className="relative group w-full md:min-w-[250px] md:w-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-gaming-neon to-gaming-accent opacity-0 group-focus-within:opacity-20 transition duration-500 blur rounded-lg"></div>
                      <div className="relative flex items-center bg-black border border-white/10 rounded-lg px-3 md:px-4 py-2.5">
                         <Search className="text-slate-500 mr-2 md:mr-3" size={14} />
                         <input 
                            type="text" 
                            placeholder="SEARCH DATABASE..." 
                            className="bg-transparent border-none outline-none text-white font-mono text-xs w-full placeholder:text-slate-700 uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                      </div>
                   </div>
               </div>
            </div>
         </div>

         {/* Grid */}
         {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gaming-neon space-y-4">
               <div className="relative w-12 h-12 md:w-16 md:h-16">
                  <div className="absolute inset-0 border-4 border-gaming-neon/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-gaming-neon rounded-full animate-spin"></div>
               </div>
               <div className="font-mono text-[10px] md:text-xs animate-pulse tracking-widest">DECRYPTING DATA...</div>
            </div>
         ) : filteredAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
               {filteredAccounts.map(acc => (
                  <div key={acc.id} className="animate-in fade-in zoom-in duration-500 fill-mode-backwards" style={{ animationDelay: `${Math.random() * 300}ms` }}>
                     <AccountCard account={acc} />
                  </div>
               ))}
            </div>
         ) : (
            <div className="py-20 md:py-32 text-center border border-dashed border-white/10 bg-white/5 rounded-2xl">
               <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="text-slate-600" size={20} />
               </div>
               <h3 className="text-lg md:text-xl text-white font-display font-bold">NO ASSETS FOUND</h3>
               <p className="text-slate-500 text-xs md:text-sm mt-2 font-mono">ADJUST SEARCH PARAMETERS AND RETRY</p>
            </div>
         )}
      </section>
    </div>
  );
};