import React, { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithFacebook, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setError('');
    setLoading(true);
    try {
      if (provider === 'google') await signInWithGoogle();
      else await signInWithFacebook();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Social login failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
      {/* Left: Mockup section */}
      <div className="hidden lg:block flex-1 relative animate-fade-in">
         <div className="bg-brand rounded-[48px] p-8 shadow-2xl relative overflow-hidden max-w-md mx-auto">
            <div className="bg-white rounded-[32px] p-6 shadow-inner aspect-[9/16] relative overflow-hidden">
               <div className="space-y-6">
                  <header className="flex justify-between items-center text-black">
                     <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-black rounded-full" /><div className="w-1.5 h-1.5 bg-black rounded-full" /></div>
                     <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-brand rounded-md flex items-center justify-center text-white scale-75">
                           <ShieldCheck size={12} />
                        </div>
                        <p className="text-xs font-black tracking-tight">Digi<span className="text-brand">Safe</span></p>
                     </div>
                     <div className="w-8 h-8 rounded-full border-2 border-gray-100 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop" alt="User" />
                     </div>
                  </header>

                  <div className="space-y-4">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-bold text-black">Hey, Jimmy</h3>
                       <p className="text-[9px] text-gray-300 leading-tight">Secure your digital future with PrimeInvest assets.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-white">
                       <div className="bg-brand p-4 rounded-2xl">
                          <p className="text-[8px] opacity-70 mb-0.5 font-bold">Total Payout</p>
                          <p className="text-xl font-bold">$50k</p>
                       </div>
                       <div className="bg-white border border-brand p-4 rounded-2xl text-brand">
                          <p className="text-[8px] opacity-70 mb-0.5 font-bold">Profit</p>
                          <p className="text-xl font-bold">$10k</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Right: Form section */}
      <div className="flex-1 w-full max-w-md space-y-6 md:space-y-8 animate-slide-up">
        <header className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">Login</h1>
          <p className="text-gray-400 font-medium text-sm mt-2">Access your digital vault and manage assets.</p>
        </header>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold border border-red-100 italic">
            {error}
          </div>
        )}

        <div className="space-y-3 md:space-y-4 text-center">
          <div className="space-y-2 md:space-y-3">
              <button 
                type="button"
                disabled={loading}
                onClick={() => handleOAuth('google')}
                className="w-full h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center gap-3 hover:bg-gray-100 transition-all px-6 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin text-gray-400" size={18} /> : (
                  <>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    <span className="text-sm font-semibold text-gray-700">Continue with Google</span>
                  </>
                )}
              </button>
              <button 
                type="button"
                disabled={loading}
                onClick={() => handleOAuth('facebook')}
                className="w-full h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center gap-3 hover:bg-gray-100 transition-all px-6 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin text-gray-400" size={18} /> : (
                  <>
                    <img src="https://www.svgrepo.com/show/448224/facebook.svg" className="w-5 h-5" alt="Facebook" />
                    <span className="text-sm font-semibold text-gray-700">Continue with Facebook</span>
                  </>
                )}
              </button>
          </div>

          <div className="relative py-2 md:py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black tracking-widest text-gray-300">
              <span className="bg-white px-4">OR</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2 md:space-y-3">
            <input 
              type="email" 
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email ID*"
              className="input-pill text-sm font-semibold h-11 transition-all"
            />
            <input 
              type="password" 
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password*"
              className="input-pill text-sm font-semibold h-11 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
             <button type="button" disabled={loading} className="text-xs font-bold text-gray-400 hover:text-brand order-2 sm:order-1 disabled:opacity-50">Forgot Password?</button>
             <button type="submit" disabled={loading} className="w-full sm:w-auto h-11 px-10 bg-brand text-white rounded-full text-sm font-bold hover:bg-[#6d1b1b] transition-all shadow-lg shadow-brand/20 order-1 sm:order-2 flex items-center justify-center gap-2">
               {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
             </button>
          </div>
        </form>

        <p className="text-center md:text-left text-xs font-semibold text-gray-900 border-t border-gray-50 pt-6">
          Don't have an account? <Link to="/signup" className="hover:underline text-brand font-bold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

