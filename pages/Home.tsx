import React, { useState, useEffect } from 'react';
import { Account, AccountCategory } from '../types';
import { getAccounts } from '../services/firebase';
import { AccountCard } from '../components/AccountCard';
import { Button, Input } from '../components/Shared';
import { Search, Filter, Flame, ShieldCheck, Zap, Headphones, ChevronRight } from 'lucide-react';

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

  const scrollToBrowse = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('browse');
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const sellLink = "https://wa.me/917602629250?text=" + encodeURIComponent("I want to sell a account");

  return (
    <div className="min-h-screen pb-12 relative">
      {/* Decorative Background for Main Page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gaming-neon/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gaming-900 border-b border-slate-800 overflow-hidden z-10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gaming-neon/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gaming-neon/10 border border-gaming-neon/20 text-gaming-neon text-xs font-bold uppercase tracking-widest mb-6 animate-pulse-slow">
              <span className="w-2 h-2 rounded-full bg-gaming-neon"></span>
              Premium Stock Live
            </div>
            <h1 className="text-5xl md:text-7xl font-gaming font-bold text-white mb-6 leading-none tracking-tight">
              DOMINATE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-neon to-orange-500">THE BATTLEGROUND</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg mb-8 leading-relaxed">
              Access the most exclusive Free Fire accounts. 
              Featuring Sakura bundles, Evo max guns, and rare collectibles. 
              Verified ownership. Instant transfer.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={scrollToBrowse} 
                className="bg-gaming-neon text-black font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center gap-2"
              >
                Browse Inventory <ChevronRight size={18} />
              </button>
              <a 
                href={sellLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-lg border border-slate-700 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center"
              >
                Sell Account
              </a>
            </div>
          </div>
        </div>

        {/* Trust Indicators Strip */}
        <div className="border-t border-slate-800 bg-black/20 backdrop-blur-sm">
           <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 text-slate-300">
                <ShieldCheck className="text-gaming-neon" size={24} />
                <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase">100% Safe</span>
                  <span className="text-[10px] text-slate-500">Verified Sellers</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Zap className="text-gaming-neon" size={24} />
                <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase">Instant Delivery</span>
                  <span className="text-[10px] text-slate-500">Automated Process</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Headphones className="text-gaming-neon" size={24} />
                <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase">24/7 Support</span>
                  <span className="text-[10px] text-slate-500">Always Online</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Flame className="text-gaming-neon" size={24} />
                <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase">Rare Items</span>
                  <span className="text-[10px] text-slate-500">Exclusive Stock</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Featured Slider (Horizontal Scroll) */}
      {featuredAccounts.length > 0 && (
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-white font-gaming text-2xl font-bold uppercase tracking-wider">
              <Flame size={24} className="text-orange-500 fill-orange-500 animate-pulse" />
              <h2>Featured Collections</h2>
            </div>
            <div className="hidden md:flex gap-2">
               {/* Custom nav arrows could go here */}
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar mask-gradient-right">
            {featuredAccounts.map(acc => (
              <div key={acc.id} className="min-w-[280px] md:min-w-[350px] snap-center">
                <AccountCard account={acc} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Catalog */}
      <div id="browse" className="container mx-auto px-4 py-8 relative z-10">
        
        {/* Filters */}
        <div className="sticky top-16 md:top-20 z-30 bg-black/80 backdrop-blur-xl py-4 -mx-4 px-4 md:rounded-2xl md:mx-0 border-b border-slate-800 md:border md:shadow-2xl mb-8 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative w-full md:w-auto md:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search skins, guns, tags..." 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-1 focus:ring-gaming-neon focus:border-gaming-neon outline-none transition-all placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {(['ALL', 'BUDGET', 'RARE', 'PREMIUM'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all border ${
                    filterCategory === cat 
                    ? 'bg-gaming-neon text-black border-gaming-neon shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
             <div className="animate-spin w-10 h-10 border-4 border-gaming-neon border-t-transparent rounded-full mb-4"></div>
             <p className="text-gaming-neon font-gaming tracking-widest text-sm">LOADING ASSETS...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAccounts.map(acc => (
              <AccountCard key={acc.id} account={acc} />
            ))}
          </div>
        )}

        {!loading && filteredAccounts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <Filter className="mb-4 opacity-50" size={48} />
            <p className="font-bold text-lg">No accounts found</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};