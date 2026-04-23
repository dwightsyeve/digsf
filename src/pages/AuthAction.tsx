import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ShieldCheck, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function AuthAction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode');
  const actionCode = searchParams.get('oobCode');

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (mode === 'resetPassword' && actionCode) {
      verifyPasswordResetCode(auth, actionCode)
        .then((email) => {
          setEmail(email);
        })
        .catch((e) => {
          setError('Invalid or expired action code. Please try resetting your password again.');
        });
    } else {
      setError('Invalid request. Missing parameters.');
    }
  }, [mode, actionCode]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionCode) return;
    setLoading(true);
    setError('');
    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess('Your password has been successfully reset.');
      setTimeout(() => navigate('/signin'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
            <XCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Request Failed</h2>
          <p className="text-gray-500 text-sm font-medium">{error}</p>
          <button onClick={() => navigate('/signin')} className="w-full h-12 bg-black text-white rounded-full font-bold">
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto text-brand">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Password Reset</h2>
          <p className="text-gray-500 text-sm font-medium">{success}</p>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-4">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-8 sm:p-10 rounded-[32px] shadow-2xl max-w-md w-full space-y-8">
        <header className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-brand/20">
             <ShieldCheck size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create New Password</h2>
          {email && <p className="text-gray-400 text-sm font-medium">For {email}</p>}
        </header>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <input 
              type="password" 
              required
              disabled={loading}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password*"
              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-full px-6 text-sm font-semibold focus:border-brand outline-none transition-all"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full h-14 bg-brand text-white rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#6d1b1b] transition-all shadow-xl shadow-brand/20">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
