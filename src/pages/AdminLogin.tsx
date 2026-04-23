import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { googleProvider } from '../lib/firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/secret-admin-gate');
    }
  }, [user, navigate]);

  const verifyAdminRole = async (userEmail: string, userId: string) => {
    const bootstrapEmail = import.meta.env.VITE_ADMIN_EMAIL || 'tester419tester@gmail.com';
    if (userEmail.toLowerCase().trim() === bootstrapEmail.toLowerCase().trim()) {
       const userRef = doc(db, 'users', userId);
       await updateDoc(userRef, { role: 'admin' });
       return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const cleanEmail = email.toLowerCase().trim();
      const bootstrapEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'tester419tester@gmail.com').toLowerCase().trim();
      const bootstrapPass = import.meta.env.VITE_ADMIN_PASSWORD || 'Jackson1?';

      try {
        await signIn(cleanEmail, password);
        if (auth.currentUser) {
           await verifyAdminRole(auth.currentUser.email || cleanEmail, auth.currentUser.uid);
        }
      } catch (err: any) {
        if (
          cleanEmail === bootstrapEmail && 
          password === bootstrapPass
        ) {
           try {
             await signUp(cleanEmail, password, 'System', 'Admin');
           } catch(signUpErr: any) {
             // If email already exists, inform the user they need to link or use Google
             if (signUpErr.message?.includes('already-in-use')) {
               setError('Account exists. Please use "Admin Google Auth" to log in, or reset your password.');
               setLoading(false);
               return;
             }
             throw err; // throw original invalid credential error
           }
           if (auth.currentUser) {
              await verifyAdminRole(cleanEmail, auth.currentUser.uid);
           }
        } else {
           throw err;
        }
      }
      
      // useEffect will handle navigation once role is updated
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAdmin = async () => {
    setLoading(true);
    setError('');
    try {
       await signInWithGoogle();
       if (auth.currentUser) {
          const isAdmin = await verifyAdminRole(auth.currentUser.email || '', auth.currentUser.uid);
          if (isAdmin) {
             // useEffect will handle navigation
             return;
          } else {
             // Not admin
             setError('This Google account does not have admin privileges.');
          }
       }
    } catch(err:any) {
       setError(err.message || 'Failed to sign in with Google');
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

           <div className="space-y-4">
             <button 
               type="submit"
               disabled={loading}
               className="w-full h-16 bg-brand text-white rounded-full text-lg font-bold hover:bg-[#6d1b1b] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
               {loading ? <Loader2 className="animate-spin" /> : 'Decrypt & Access'}
             </button>

             <div className="relative py-2">
               <div className="absolute inset-0 flex items-center">
                 <span className="w-full border-t border-white/10" />
               </div>
               <div className="relative flex justify-center text-[10px] font-black tracking-widest text-gray-500">
                 <span className="bg-[#111] px-4">OR</span>
               </div>
             </div>

             <button 
               type="button"
               disabled={loading}
               onClick={handleGoogleAdmin}
               className="w-full h-16 bg-white/5 border border-white/10 text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
               {loading ? <Loader2 className="animate-spin" /> : (
                 <>
                   <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                   Admin Google Auth
                 </>
               )}
             </button>
           </div>
        </form>

        <p className="text-center text-[10px] text-gray-600 font-medium">Unauthorized access attempts are logged.</p>
      </motion.div>
    </div>
  );
}
