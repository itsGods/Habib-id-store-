import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, LogIn, User, LogOut, Menu, X } from 'lucide-react';
import { subscribeToAuth, logoutUser, checkIsAdmin } from '../services/supabase';

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return subscribeToAuth((u) => setUser(u));
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
           <div className={`relative backdrop-blur-xl border border-white/5 rounded-none md:rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-black/80 border-gaming-neon/20 shadow-[0_0_20px_rgba(0,0,0,0.8)]' : 'bg-black/40'}`}>
              
              {/* Animated Border Line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-gaming-neon/50 to-transparent opacity-50" />

              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 flex items-center justify-center bg-gaming-neon text-black font-display font-bold text-xl skew-x-[-10deg] hover:skew-x-0 transition-transform duration-300 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                   H
                   <div className="absolute inset-0 border border-white/20" />
                </div>
                <div className="flex flex-col">
                   <span className="font-display font-bold text-white text-lg leading-none tracking-widest group-hover:text-gaming-neon transition-colors">HABIB</span>
                   <span className="text-[9px] text-slate-400 font-mono tracking-[0.3em] uppercase">Store</span>
                </div>
              </Link>

              {/* Nav Actions */}
              <div className="flex items-center gap-6">
                {user ? (
                  <div className="flex items-center gap-4">
                    {checkIsAdmin(user) && (
                      <Link 
                        to="/admin" 
                        className="hidden md:flex items-center gap-2 text-gaming-neon hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-gaming-neon/30 px-3 py-1.5 rounded bg-gaming-neon/5 hover:bg-gaming-neon/20"
                      >
                        <Lock size={12} />
                        <span>CMD Center</span>
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 text-white hover:text-gaming-neon transition-colors text-xs font-bold uppercase tracking-widest group"
                  >
                    <span className="hidden sm:inline">Agent Login</span>
                    <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
           </div>
        </div>
      </div>
      {/* Spacer */}
      <div className="h-24" />
    </>
  );
};