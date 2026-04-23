import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Settings, 
  Plus, 
  Copy, 
  CheckCircle2,
  User as UserIcon,
  BadgeCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

export default function Sidebar() {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('210462822');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: TrendingUp, label: 'Invest', path: '/invest' },
    { icon: Wallet, label: 'Withdraw', path: '/withdraw' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  if (!user) return null;

  return (
    <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-gray-100 h-[calc(100vh-64px)] sticky top-16 z-40 overflow-y-auto">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center overflow-hidden">
               {user.photoURL ? (
                 <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <UserIcon className="text-brand" size={20} />
               )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <BadgeCheck className="text-white" size={10} />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{user.firstName} {user.lastName}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{user.email}</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Balance</p>
           <p className="text-xl font-black text-black">₦{user.walletBalance?.toLocaleString() || '0'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Navigation</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Deposit Section */}
      <div className="p-6 space-y-4">
        <div className="p-5 bg-black rounded-3xl text-white space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
          
          <div className="relative space-y-3">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center">
                  <Plus size={16} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest">Fund Account</p>
             </div>
             
             <div className="space-y-2 py-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Deposit Account</p>
                <div className="bg-white/10 rounded-2xl p-4 space-y-2 border border-white/5">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-black tracking-tight leading-none mb-1">210462822</p>
                         <p className="text-[10px] text-brand font-bold uppercase tracking-tighter">OPAY DIGITAL BANK</p>
                      </div>
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                      >
                        {copied ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                      </button>
                   </div>
                   <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Account Name</p>
                      <p className="text-[11px] font-black uppercase text-brand">DIGISAFE LIMITED</p>
                   </div>
                </div>
             </div>

             <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-deposit-modal'))}
              className="w-full py-4 bg-brand rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand/20 border border-brand/20"
             >
                Confirm Transfer
             </button>
          </div>
        </div>

        <p className="text-[9px] text-center text-gray-400 font-medium leading-relaxed px-2">
          Make a transfer to the account above and click confirm to upload your receipt.
        </p>
      </div>
    </aside>
  );
}
