import React, { useState } from 'react';
import { Search, Menu, X, ShieldCheck, TrendingUp, User as UserIcon, LogOut, Settings, ArrowRight, Plus } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: isAuthenticated ? "/dashboard" : "/", label: isAuthenticated ? "Dashboard" : "Home" },
    { to: isAuthenticated ? "/invest" : "/about", label: isAuthenticated ? "Invest" : "About Us" },
    { to: isAuthenticated ? "/withdraw" : "/careers", label: isAuthenticated ? "Withdraw" : "Careers" },
    { to: isAuthenticated ? "/settings" : "/contact", label: isAuthenticated ? "Settings" : "Contact" },
    ...(isAuthenticated ? [{ to: "/contact", label: "Support" }] : [])
  ];

  return (
    <nav className="bg-white px-4 md:px-8 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-50 md:border-none">
      <div className="flex items-center gap-4 md:gap-16">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 md:hidden text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
            Prime<span className="text-brand">Invest</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-4 xl:gap-8">
          {navLinks.map((link) => (
            <NavMenuItem key={link.to} to={link.to}>
              {link.label}
            </NavMenuItem>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-8">
        <div className="relative hidden lg:block w-48 xl:w-72">
          <input
            type="text"
            placeholder="Search Anything"
            className="w-full bg-gray-100 rounded-full py-2.5 px-6 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-brand border-none placeholder:text-gray-400"
            id="global-search"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900" />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 md:gap-4 font-bold">
              <div className="hidden sm:flex flex-col items-end leading-none">
                <span className="text-sm text-gray-900">Hey, {user?.firstName}</span>
                <span className="text-[10px] text-brand uppercase tracking-tighter">Verified Account</span>
              </div>
              
              <div className="relative group">
                <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 p-1 md:p-1.5 rounded-full border border-gray-100 transition-all group-hover:border-brand/30">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white overflow-hidden shadow-sm">
                    <img src={user?.avatar} alt={user?.firstName} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <Menu size={16} className="text-gray-400 mr-1 hidden md:block" />
                </button>
                
                <div className="absolute right-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden py-3">
                    <div className="px-6 py-4 border-b border-gray-50 mb-3">
                      <p className="text-sm text-gray-900 font-bold leading-tight">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-1">Premium Investor</p>
                    </div>
                    
                    <Link to="/settings/profile" className="flex items-center gap-3 px-6 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings size={18} className="text-gray-400" />
                      <span>Account Settings</span>
                    </Link>
                    
                    <div className="mt-2 border-t border-gray-50 pt-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/signin" className="hidden sm:block text-sm font-bold text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="btn-brand h-10 px-6 text-sm shadow-lg shadow-brand/20 flex items-center gap-2">
                 <span>Join Now</span>
                 <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 p-6 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
                    <TrendingUp size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-xl font-black text-gray-900 tracking-tight flex items-center">
                    Prime<span className="text-brand">Invest</span>
                  </span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                        isActive 
                          ? 'bg-brand text-white shadow-lg' 
                          : 'text-gray-900 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-6 py-4 rounded-2xl text-lg font-bold text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 mt-2"
                  >
                    Sign Out
                  </button>
                )}
              </div>

              {isAuthenticated && (
                <div className="mt-8 p-6 bg-brand/5 rounded-3xl border border-brand/10 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center text-white">
                      <Plus size={16} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-brand">Deposit Funds</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-brand/5 space-y-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">210462822 • OPAY</p>
                    <p className="text-xs font-black uppercase text-brand">PRIMEINVEST LIMITED</p>
                  </div>
                  <button 
                    onClick={() => {
                       setIsMobileMenuOpen(false);
                       window.dispatchEvent(new CustomEvent('open-deposit-modal'));
                    }}
                    className="w-full py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand/20"
                  >
                    Confirm Transfer
                  </button>
                </div>
              )}

              <div className="mt-12 pt-12 border-t border-gray-100 space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Anything"
                    className="w-full bg-gray-100 rounded-2xl py-4 px-6 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-brand border-none"
                  />
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavMenuItem({ to, children }: { to: string; children: React.ReactNode; key?: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 xl:px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
          isActive 
            ? 'bg-brand text-white shadow-md' 
            : 'text-black hover:text-brand'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

