import React from 'react';
import { AccountStatus, AccountCategory } from '../types';
import { Loader2 } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', isLoading, fullWidth, className = '', ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gaming-neon text-black hover:bg-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]",
    secondary: "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600",
    outline: "bg-transparent border-2 border-gaming-neon text-gaming-neon hover:bg-gaming-neon/10",
    danger: "bg-gaming-danger/10 border border-gaming-danger text-gaming-danger hover:bg-gaming-danger/20",
    ghost: "bg-transparent text-slate-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
      {children}
    </button>
  );
};

// --- BADGE ---
export const StatusBadge: React.FC<{ status: AccountStatus }> = ({ status }) => {
  const styles = {
    [AccountStatus.AVAILABLE]: "bg-gaming-success/20 text-gaming-success border-gaming-success/50",
    [AccountStatus.RESERVED]: "bg-gaming-neon/20 text-yellow-300 border-gaming-neon/50",
    [AccountStatus.SOLD]: "bg-gaming-danger/20 text-gaming-danger border-gaming-danger/50"
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${styles[status]} backdrop-blur-sm`}>
      {status}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: AccountCategory }> = ({ category }) => {
  const styles = {
    [AccountCategory.PREMIUM]: "bg-purple-500/20 text-purple-300 border-purple-500/50",
    [AccountCategory.RARE]: "bg-gaming-neon/20 text-yellow-300 border-gaming-neon/50",
    [AccountCategory.BUDGET]: "bg-blue-500/20 text-blue-300 border-blue-500/50"
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${styles[category]}`}>
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
  const base = "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gaming-neon focus:ring-1 focus:ring-gaming-neon transition-colors placeholder:text-slate-600";
  
  return (
    <div className="mb-4">
      {label && <label className="block text-slate-400 text-sm font-semibold mb-1.5 uppercase tracking-wide">{label}</label>}
      {as === 'textarea' ? (
        <textarea className={`${base} min-h-[100px] ${className}`} {...(props as any)} />
      ) : as === 'select' ? (
        <select className={`${base} ${className}`} {...(props as any)}>
          {props.children}
        </select>
      ) : (
        <input className={`${base} ${className}`} {...props} />
      )}
      {error && <p className="text-gaming-danger text-xs mt-1">{error}</p>}
    </div>
  );
};
