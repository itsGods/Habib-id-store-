import React, { useState, useEffect } from 'react';
import { Account, AccountCategory } from '../types';
import { getAccounts } from '../services/supabase';
import { AccountCard } from '../components/AccountCard';
import { Button } from '../components/Shared';
import { Search, Filter, Flame, Crosshair, ChevronDown, Terminal, Activity } from 'lucide-react';

export const Home: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<AccountCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const data = await getAccounts();
      setAccounts(data);
      setLoading(false);
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
    document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      
      {/* --- CINEMATIC HERO --- */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden">
         {/* Spotlight Effect */}
         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gaming-neon/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
         
         <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            
            {/* Status Ticker */}
            <div className="mb-8 flex items-center gap-4 text-[10px] font-mono tracking-widest text-slate-500 border border-white/10 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full animate-float">
               <span className="flex items-center gap-2 text-green-400"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> SYSTEM ONLINE</span>
               <span className="w-px h-3 bg-white/20"></span>
               <span className="flex items-center gap-2"><Activity size={10} /> DATABASE: SECURE</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 mb-6 leading-[0.85] tracking-tighter relative">
               ELITE<br />ARMORY
               <span className="absolute -top-4 -right-8 text-lg md:text-2xl text-gaming-neon font-mono font-normal tracking-widest opacity-60 hidden md:block">
                  v2.0
               </span>
            </h1>

            <p className="text-slate-400 font-mono text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed">
               <span className="text-gaming-neon">///</span> ACCESS AUTHORIZED <br/>
               Secure the rarest Free Fire identities. Verified ownership. Instant transfer. Absolute dominance.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
               <Button onClick={scrollToBrowse} variant="primary" className="w-full sm:w-auto px-12 py-4 text-lg shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                  Initialize Scan
               </Button>
               <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-sm font-mono" onClick={() => window.open('https://wa.me/917602629250', '_blank')}>
                  <Terminal size={16} className="mr-2" /> Sell ID
               </Button>
            </div>
         </div>

         {/* Bottom Fade */}
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
         
         {/* Scroll Indicator */}
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-600 cursor-pointer" onClick={scrollToBrowse}>
            <ChevronDown size={24} />
         </div>
      </section>

      {/* --- FEATURED CAROUSEL --- */}
      {featuredAccounts.length > 0 && (
         <div className="relative z-10 border-y border-white/5 bg-black/60 backdrop-blur-sm py-16">
            <div className="container mx-auto px-4">
               <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                     <Flame className="text-gaming-accent animate-pulse" />
                     FEATURED ASSETS
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-gaming-neon/50 to-transparent ml-6 opacity-30" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredAccounts.slice(0, 3).map(acc => (
                     <AccountCard key={acc.id} account={acc} />
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* --- MAIN INVENTORY --- */}
      <section id="inventory" className="container mx-auto px-4 py-24 relative z-10">
         
         {/* Control Panel */}
         <div className="mb-12 sticky top-24 z-30 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="hidden md:flex w-10 h-10 bg-gaming-neon/10 items-center justify-center rounded border border-gaming-neon/20">
                     <Filter size={20} className="text-gaming-neon" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">INVENTORY</h2>
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Select your loadout</p>
                  </div>
               </div>
               
               <div className="flex flex-col md:flex-row gap-4 flex-1 justify-end">
                  {/* Filter Tabs */}
                  <div className="flex p-1 bg-black border border-white/10 rounded-lg overflow-x-auto">
                     {['ALL', 'BUDGET', 'RARE', 'PREMIUM'].map((cat) => (
                        <button
                           key={cat}
                           onClick={() => setFilterCategory(cat as any)}
                           className={`px-4 py-2 text-[10px] font-bold font-display uppercase tracking-widest transition-all duration-300 rounded ${
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
                   <div className="relative group min-w-[250px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-gaming-neon to-gaming-accent opacity-0 group-focus-within:opacity-20 transition duration-500 blur rounded-lg"></div>
                      <div className="relative flex items-center bg-black border border-white/10 rounded-lg px-4 py-2.5">
                         <Search className="text-slate-500 mr-3" size={16} />
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
               <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-gaming-neon/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-gaming-neon rounded-full animate-spin"></div>
               </div>
               <div className="font-mono text-xs animate-pulse tracking-widest">DECRYPTING DATA...</div>
            </div>
         ) : filteredAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredAccounts.map(acc => (
                  <div key={acc.id} className="animate-in fade-in zoom-in duration-500 fill-mode-backwards" style={{ animationDelay: `${Math.random() * 300}ms` }}>
                     <AccountCard account={acc} />
                  </div>
               ))}
            </div>
         ) : (
            <div className="py-32 text-center border border-dashed border-white/10 bg-white/5 rounded-2xl">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="text-slate-600" size={24} />
               </div>
               <h3 className="text-xl text-white font-display font-bold">NO ASSETS FOUND</h3>
               <p className="text-slate-500 text-sm mt-2 font-mono">ADJUST SEARCH PARAMETERS AND RETRY</p>
            </div>
         )}
      </section>
    </div>
  );
};