import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, signInWithFacebook, isAuthenticated } = useAuth();
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
      await signUp(email, password, firstName, lastName);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-16 animate-fade-in">
      <header className="mb-8 md:mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">Sign Up</h1>
        <p className="text-gray-400 font-medium text-sm mt-2">Start your investment journey in minutes.</p>
      </header>

      {error && (
        <div className="mb-6 bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold border border-red-100 italic">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 md:gap-24 items-start">
        {/* Left: Inputs */}
        <form onSubmit={handleSubmit} className="flex-1 w-full space-y-3 md:space-y-4">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <input 
              className="input-pill h-11 text-sm font-semibold" 
              type="text" 
              placeholder="First name*" 
              required
              disabled={loading}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input 
              className="input-pill h-11 text-sm font-semibold" 
              type="text" 
              placeholder="Last name*" 
              required
              disabled={loading}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input 
            className="input-pill h-11 text-sm font-semibold" 
            type="email" 
            placeholder="Email*" 
            required
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            className="input-pill h-11 text-sm font-semibold" 
            type="password" 
            placeholder="Password*" 
            required
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input className="input-pill h-11 text-sm font-semibold" type="password" placeholder="Confirm Password*" required disabled={loading} />
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <input className="input-pill h-11 text-sm font-semibold" type="text" placeholder="Code" disabled={loading} />
            <div className="col-span-2">
              <input className="input-pill h-11 text-sm font-semibold" type="text" placeholder="Mobile Number" disabled={loading} />
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-4">
            <button type="submit" disabled={loading} className="w-full h-12 bg-brand text-white rounded-full text-base font-bold hover:bg-[#6d1b1b] transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
            </button>
            <p className="text-xs font-semibold text-gray-900">
              Already have an account? <Link to="/signin" className="hover:underline text-brand font-bold">Sign In</Link>
            </p>
          </div>
        </form>

        {/* Right: Social */}
        <div className="flex-1 w-full space-y-6 pt-4 lg:pt-0">
          <div className="text-center lg:text-left space-y-4">
            <p className="text-lg text-gray-400 font-bold uppercase tracking-wider">Quick Sign Up</p>
            <div className="space-y-3 max-w-sm">
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
          </div>
        </div>
      </div>
    </div>
  );
}

