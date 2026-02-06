import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../services/supabase';
import { Button, Input } from '../components/Shared';
import { LogIn, UserPlus, Lock, ShieldAlert, Cpu } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
        if (email === 'admin@demo.com') {
           navigate('/admin');
        } else {
           navigate('/');
        }
      } else {
        await registerUser(email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
       {/* Dark Background Overlay */}
       <div className="absolute inset-0 bg-black/80 z-0" />

       <div className="w-full max-w-md relative z-10">
        
        {/* Terminal Header Decoration */}
        <div className="flex justify-between items-end mb-2 px-1">
           <div className="flex gap-1">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
             <div className="w-2 h-2 bg-yellow-500 rounded-full" />
             <div className="w-2 h-2 bg-green-500 rounded-full" />
           </div>
           <div className="text-[10px] font-mono text-slate-500 uppercase">Secure Connection: TLS 1.3</div>
        </div>

        <div className="bg-black/80 backdrop-blur-xl p-8 rounded-sm border border-gaming-neon/30 shadow-[0_0_50px_rgba(255,215,0,0.1)] relative group">
          
          {/* Corner Tech Accents */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-gaming-neon" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-gaming-neon" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gaming-neon/10 border border-gaming-neon/30 rounded-full flex items-center justify-center mx-auto mb-4 relative">
               <Lock size={24} className="text-gaming-neon" />
               <div className="absolute inset-0 border border-t-gaming-neon rounded-full animate-spin-slow opacity-50" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-1 uppercase tracking-widest">
              {isLogin ? 'Identity Verification' : 'New Agent Registration'}
            </h2>
            <p className="text-slate-500 font-mono text-xs">
              {isLogin ? 'Enter credentials to access the mainframe.' : 'Create a secure frequency to proceed.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border-l-2 border-red-500 text-red-200 p-3 mb-6 text-xs font-mono flex items-start gap-2">
               <ShieldAlert size={14} className="shrink-0 mt-0.5" />
               <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Agent Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="email" 
              placeholder="IDENTIFIER..." 
              required 
              autoComplete="off"
            />
            <Input 
              label="Access Code" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              required 
            />
            
            <div className="mt-8">
              <Button fullWidth type="submit" variant="primary" isLoading={loading} className="h-12 shadow-lg">
                {isLogin ? (
                  <span className="flex items-center gap-2"> AUTHORIZE <LogIn size={16} /></span>
                ) : (
                  <span className="flex items-center gap-2"> INITIALIZE <UserPlus size={16} /></span>
                )}
              </Button>
            </div>
          </form>

          {/* Toggle Switch */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-slate-500 text-xs font-mono mb-3">
               {isLogin ? 'Need clearance?' : 'Already verified?'}
            </p>
            <button 
               onClick={() => { setIsLogin(!isLogin); setError(''); }}
               className="text-gaming-neon hover:text-white text-xs font-bold uppercase tracking-widest border border-gaming-neon/30 hover:bg-gaming-neon/10 px-4 py-2 transition-all"
            >
               {isLogin ? 'Request Access' : 'Return to Login'}
            </button>
          </div>
        </div>
        
        <div className="text-center mt-4 text-[10px] text-slate-600 font-mono">
           UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
        </div>
      </div>
    </div>
  );
};