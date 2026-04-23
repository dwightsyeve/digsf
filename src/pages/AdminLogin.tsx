import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      // AuthContext will update, and if the user is an admin, App.tsx will allow the next gate
      navigate('/secret-admin-gate');
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-[40px] p-10 md:p-12 space-y-8"
      >
        <div className="text-center space-y-2">
           <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-brand/20">
              <ShieldCheck size={32} />
           </div>
           <h1 className="text-3xl font-black text-white tracking-tight">ADMIN GATE</h1>
           <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Internal Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase ml-4">Access Email</label>
                 <input 
                   type="email" 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full h-16 bg-white/5 border border-white/10 rounded-full px-8 text-white focus:border-brand outline-none transition-all font-bold"
                   placeholder="admin@primeinvest.com"
                   required
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase ml-4">Secure Key</label>
                 <input 
                   type="password" 
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full h-16 bg-white/5 border border-white/10 rounded-full px-8 text-white focus:border-brand outline-none transition-all font-bold"
                   placeholder="••••••••"
                   required
                 />
              </div>
           </div>

           {error && <p className="text-xs text-red-500 font-bold text-center italic">{error}</p>}

           <button 
             type="submit"
             disabled={loading}
             className="w-full h-20 bg-brand text-white rounded-full text-xl font-bold hover:bg-[#6d1b1b] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin" /> : 'Decrypt & Access'}
           </button>
        </form>

        <p className="text-center text-[10px] text-gray-600 font-medium">Unauthorized access attempts are logged.</p>
      </motion.div>
    </div>
  );
}
