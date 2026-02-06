import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, MessageCircle, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.includes('/account/');

  return (
    <footer className={`bg-gaming-900 border-t border-slate-800 pt-16 text-slate-400 relative overflow-hidden transition-all duration-300 ${isDetailPage ? 'pb-32 md:pb-8' : 'pb-8'}`}>
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gaming-neon/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gaming-neon rounded flex items-center justify-center transform rotate-45">
                 <div className="transform -rotate-45 font-gaming font-bold text-black text-xl">H</div>
              </div>
              <span className="font-gaming font-bold text-xl tracking-wider text-white">HABIB <span className="text-gaming-neon">FF STORE</span></span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              The premier destination for high-tier Free Fire accounts. 
              We provide secure, verified, and instant access to the rarest collections in the game.
              Level up your legacy today.
            </p>
            <div className="flex gap-4">
               <a 
                 href="https://t.me/its_Gods" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-gaming-neon hover:text-black transition-all"
                 title="Join Telegram Channel"
               >
                 <MessageCircle size={18} />
               </a>
               <a 
                 href="mailto:truexgods@gmail.com" 
                 className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-gaming-neon hover:text-black transition-all"
                 title="Send Email"
               >
                 <Mail size={18} />
               </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-gaming-neon transition-colors">Browse Accounts</Link></li>
              <li><a href="#" className="hover:text-gaming-neon transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact / Trust */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Guarantee</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <ShieldCheck className="text-green-500 shrink-0" size={20} />
                <span>100% Secure Transactions with Escrow-like safety.</span>
              </li>
              <li className="flex items-start gap-3">
                <ExternalLink className="text-blue-500 shrink-0" size={20} />
                <span>Instant credentials delivery via WhatsApp after verification.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} HABIB FF STORE. All rights reserved.</p>
          <p className="opacity-50">Designed for Elites.</p>
        </div>
      </div>
    </footer>
  );
};