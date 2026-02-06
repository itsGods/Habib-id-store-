import React from 'react';
import { AccountStatus, AccountCategory } from '../types';
import { Loader2, AlertTriangle } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'cyber';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', isLoading, fullWidth, className = '', ...props 
}) => {
  // Cyberpunk clip-path style
  const clipStyle = { clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' };
  
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-display font-bold uppercase tracking-widest transition-all duration-200 group overflow-hidden active:scale-95";
  
  const variants = {
    primary: "bg-gaming-neon text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]",
    secondary: "bg-gaming-800 border border-gaming-neon/30 text-gaming-neon hover:border-gaming-neon hover:bg-gaming-neon/10",
    outline: "bg-transparent border border-white/20 text-white hover:border-gaming-neon hover:text-gaming-neon hover:bg-gaming-neon/5",
    danger: "bg-red-900/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
    cyber: "bg-gaming-cyan text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      style={variant !== 'ghost' ? clipStyle : {}}
      {...props}
    >
      {/* Button Glitch Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
      
      <span className="relative z-20 flex items-center">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {children}
      </span>
    </button>
  );
};

// --- BADGE ---
export const StatusBadge: React.FC<{ status: AccountStatus }> = ({ status }) => {
  const styles = {
    [AccountStatus.AVAILABLE]: "text-green-400 border-green-400/30 bg-green-500/10 shadow-[0_0_10px_rgba(74,222,128,0.1)]",
    [AccountStatus.RESERVED]: "text-yellow-400 border-yellow-400/30 bg-yellow-500/10",
    [AccountStatus.SOLD]: "text-red-500 border-red-500/30 bg-red-500/10 opacity-70"
  };

  return (
    <span className={`px-2 py-0.5 text-[9px] font-display font-bold uppercase border backdrop-blur-md ${styles[status]}`}>
      {status}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: AccountCategory }> = ({ category }) => {
  const styles = {
    [AccountCategory.PREMIUM]: "text-purple-400 border-purple-500/50 bg-purple-500/10",
    [AccountCategory.RARE]: "text-gaming-neon border-gaming-neon/50 bg-gaming-neon/10",
    [AccountCategory.BUDGET]: "text-blue-400 border-blue-500/50 bg-blue-500/10"
  };

  return (
    <span className={`px-2 py-0.5 text-[9px] font-display font-bold uppercase border backdrop-blur-md ${styles[category]}`}>
      {category}
    </span>
  );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
}

export const Input: React.FC<InputProps> = ({ label, error, as = 'input', className = '', ...props }) => {
  const base = "w-full bg-black/60 border border-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-gaming-neon focus:ring-1 focus:ring-gaming-neon/50 transition-all placeholder:text-slate-600 backdrop-blur-sm group-hover:border-white/30";
  
  return (
    <div className="mb-5 group">
      {label && (
        <label className="block text-slate-400 text-[10px] font-display font-bold mb-1.5 uppercase tracking-widest group-focus-within:text-gaming-neon transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Corner marks */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 pointer-events-none group-focus-within:border-gaming-neon transition-colors" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 pointer-events-none group-focus-within:border-gaming-neon transition-colors" />
        
        {as === 'textarea' ? (
          <textarea className={`${base} min-h-[100px] ${className}`} {...(props as any)} />
        ) : as === 'select' ? (
          <select className={`${base} ${className}`} {...(props as any)}>
            {props.children}
          </select>
        ) : (
          <input className={`${base} ${className}`} {...props} />
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
          <AlertTriangle size={12} />
          <p className="text-[10px] font-mono uppercase tracking-wide">{error}</p>
        </div>
      )}
    </div>
  );
};