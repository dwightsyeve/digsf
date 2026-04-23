import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(email, password, firstName, lastName);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
      <header className="mb-8 md:mb-16 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-bold text-black tracking-tight">Sign Up</h1>
      </header>

      {error && (
        <div className="mb-8 bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100 italic">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 md:gap-24">
        {/* Left: Inputs */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <input 
              className="input-pill h-12 md:h-16" 
              type="text" 
              placeholder="First name*" 
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input 
              className="input-pill h-12 md:h-16" 
              type="text" 
              placeholder="Last name*" 
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input 
            className="input-pill h-12 md:h-16" 
            type="email" 
            placeholder="Email*" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            className="input-pill h-12 md:h-16" 
            type="password" 
            placeholder="Password*" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input className="input-pill h-12 md:h-16" type="password" placeholder="Confirm Password*" required />
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <input className="input-pill h-12 md:h-16 text-xs md:text-base" type="text" placeholder="Code" />
            <div className="col-span-2">
              <input className="input-pill h-12 md:h-16" type="text" placeholder="Mobile Number" />
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-6">
            <button type="submit" className="w-full h-16 md:h-20 bg-brand text-white rounded-full text-xl md:text-2xl font-bold hover:bg-[#6d1b1b] transition-all shadow-xl shadow-brand/20">
              Create Account
            </button>
            <p className="text-sm font-semibold text-gray-900">
              Already have an account? <Link to="/signin" className="hover:underline">Sign In</Link>
            </p>
          </div>
        </form>

        {/* Right: Social */}
        <div className="flex-1 space-y-6 pt-8 md:pt-12">
          <div className="text-center space-y-4 md:space-y-6">
            <p className="text-xl md:text-2xl text-gray-400 font-bold">Sign up with</p>
            <div className="space-y-3 md:space-y-4 max-w-md mx-auto">
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
          </div>
        </div>
      </div>
    </div>
  );
}

