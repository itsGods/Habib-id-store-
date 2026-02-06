import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser, checkIsAdmin } from '../services/supabase';
import { Button, Input } from '../components/Shared';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

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
        // We need to check if it's admin or user to redirect properly
        // For simplicity, checking email here matching the mock logic
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gaming-900">
       {/* Background decoration */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gaming-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-gaming font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join HABIB FF STORE'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Access your account to manage listings.' : 'Create an account to save your favorite items.'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-lg mb-6">
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLogin ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLogin ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-6 text-sm text-center">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <Input 
              label="Email Address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="email" 
              placeholder="name@example.com" 
              required 
            />
            <Input 
              label="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              required 
            />
            
            <div className="mt-8">
              <Button fullWidth type="submit" variant="primary" isLoading={loading}>
                {isLogin ? (
                  <span className="flex items-center gap-2"><LogIn size={18} /> Login</span>
                ) : (
                  <span className="flex items-center gap-2"><UserPlus size={18} /> Sign Up</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};