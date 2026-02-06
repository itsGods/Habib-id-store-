import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogIn, User, LogOut } from 'lucide-react';
import { subscribeToAuth, logoutUser, checkIsAdmin } from '../services/supabase';

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return subscribeToAuth((u) => setUser(u));
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <>
      {/* Top Bar (Brand) */}
      <div className="fixed top-0 left-0 right-0 bg-gaming-900/80 backdrop-blur-md border-b border-slate-800 z-50 h-16 flex items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gaming-neon rounded flex items-center justify-center transform rotate-45">
             <div className="transform -rotate-45 font-gaming font-bold text-black text-xl">H</div>
          </div>
          <span className="font-gaming font-bold text-xl tracking-wider text-white">HABIB <span className="text-gaming-neon">FF STORE</span></span>
        </Link>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {checkIsAdmin(user) && (
                <Link 
                  to="/admin" 
                  className="hidden sm:flex items-center gap-2 text-gaming-neon hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                >
                  <Lock size={16} />
                  <span>Admin Panel</span>
                </Link>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-xs hidden md:inline">{user.email?.split('@')[0]}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-slate-400 hover:text-gaming-neon transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Spacer for Top Bar */}
      <div className="h-16" />
    </>
  );
};