import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setError('');
    try {
      if (provider === 'google') await signInWithGoogle();
      else await signInWithFacebook();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Social login failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col lg:flex-row items-center gap-24">
      {/* Left: Mockup section */}
      <div className="hidden lg:block flex-1 relative">
         <div className="bg-brand rounded-[60px] p-10 shadow-2xl relative overflow-hidden max-w-lg">
            <div className="bg-white rounded-[40px] p-8 shadow-inner aspect-[9/16] relative overflow-hidden">
               <div className="space-y-8">
                  <header className="flex justify-between items-center text-black">
                     <div className="flex gap-1"><div className="w-2 h-2 bg-black rounded-full" /><div className="w-2 h-2 bg-black rounded-full" /></div>
                     <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-brand rounded-md flex items-center justify-center text-white scale-75">
                          <ShieldCheck size={14} />
                        </div>
                        <p className="text-sm font-black tracking-tight">Digi<span className="text-brand">Safe</span></p>
                     </div>
                     <div className="w-10 h-10 rounded-full border-2 border-gray-100 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="User" />
                     </div>
                  </header>

                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-3xl font-bold text-black">Hey, Jimmy</h3>
                       <p className="text-[10px] text-gray-300 leading-tight">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-white">
                       <div className="bg-brand p-5 rounded-3xl">
                          <p className="text-[10px] opacity-70 mb-1 font-bold">Total Payout</p>
                          <p className="text-2xl font-bold">$50,000</p>
                       </div>
                       <div className="bg-white border border-brand p-5 rounded-3xl text-brand">
                          <p className="text-[10px] opacity-70 mb-1 font-bold">Profit</p>
                          <p className="text-2xl font-bold">$10,000</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Right: Form section */}
      <div className="flex-1 w-full max-w-xl space-y-8 md:space-y-12">
        <header className="text-center md:text-left">
          <h1 className="text-6xl md:text-8xl font-bold text-black tracking-tight">Login</h1>
        </header>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100 italic">
            {error}
          </div>
        )}

        <div className="space-y-4 md:space-y-6 text-center">
          <div className="space-y-3 md:space-y-4 max-w-md mx-auto lg:mx-0">
              <button 
                type="button"
                onClick={() => handleOAuth('google')}
                className="w-full h-14 md:h-16 rounded-full bg-gray-100 flex items-center justify-center gap-4 hover:bg-gray-200 transition-all px-6"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 md:w-8 md:h-8" alt="Google" />
                <span className="text-base md:text-xl font-semibold text-gray-700">Continue with Google</span>
              </button>
              <button 
                type="button"
                onClick={() => handleOAuth('facebook')}
                className="w-full h-14 md:h-16 rounded-full bg-gray-100 flex items-center justify-center gap-4 hover:bg-gray-200 transition-all px-6"
              >
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" className="w-6 h-6 md:w-8 md:h-8" alt="Facebook" />
                <span className="text-base md:text-xl font-semibold text-gray-700">Continue with Facebook</span>
              </button>
          </div>

          <div className="relative py-4 md:py-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-lg md:text-xl font-bold">
              <span className="bg-white px-6 text-gray-300">OR</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
          <div className="space-y-4 md:space-y-6">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email ID*"
              className="input-pill text-lg md:text-xl font-semibold h-14 md:h-16"
            />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password*"
              className="input-pill text-lg md:text-xl font-semibold h-14 md:h-16"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
             <button type="button" className="text-base md:text-lg font-semibold text-gray-400 hover:text-brand order-2 sm:order-1">Forgot Password?</button>
             <button type="submit" className="w-full sm:w-auto h-16 md:h-20 px-12 md:px-20 bg-brand text-white rounded-full text-xl md:text-2xl font-bold hover:bg-[#6d1b1b] transition-all shadow-xl shadow-brand/20 order-1 sm:order-2">
               Sign In
             </button>
          </div>
        </form>

        <p className="text-center md:text-left text-base md:text-lg font-semibold text-gray-900">
          Don't have an account? <Link to="/signup" className="hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

