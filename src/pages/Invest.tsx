import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Shield, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { formatError } from '../lib/utils';

export default function Invest() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12 space-y-8 md:space-y-12">
      <header className="text-center space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Invest</h1>
        <p className="text-[10px] md:text-sm text-gray-400 font-medium px-4 opacity-80 uppercase tracking-widest">Growth Plans (NGN)</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
        <PlanCard 
          title="30 Days"
          roi={150}
          duration={30}
          min={2000}
          icon={<Shield className="w-8 h-8 md:w-12 md:h-12" />}
        />
        <PlanCard 
          title="60 Days"
          roi={300}
          duration={60}
          min={2000}
          icon={<Zap className="w-8 h-8 md:w-12 md:h-12" />}
          featured
        />
        <PlanCard 
          title="90 Days"
          roi={450}
          duration={90}
          min={2000}
          icon={<Target className="w-8 h-8 md:w-12 md:h-12" />}
        />
      </div>
    </div>
  );
}

function PlanCard({ title, roi, duration, min, icon, featured }: any) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(min);

  const generateDailyBreakdown = (totalProfit: number, days: number) => {
    const avg = totalProfit / days;
    const breakdown = [];
    let remaining = totalProfit;
    for (let i = 0; i < days - 1; i++) {
      // Random variance between 80% and 120% of average
      const daily = Math.floor(avg * (0.8 + Math.random() * 0.4));
      breakdown.push(daily);
      remaining -= daily;
    }
    breakdown.push(remaining);
    return breakdown;
  };

  const handleInvest = async () => {
    if (!user) return navigate('/signin');
    setLoading(true);
    setError('');

    try {
      if (amount < min) throw new Error(`Minimum investment is ₦${min.toLocaleString()}`);

      // Check user balance
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      if (!userData || (userData.walletBalance || 0) < amount) {
        throw new Error('Insufficient wallet balance. Please deposit funds first.');
      }

      const totalExpectedProfit = (amount * roi) / 100;
      const dailyBreakdown = generateDailyBreakdown(totalExpectedProfit, duration);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + duration);

      // Deduct balance first
      await updateDoc(doc(db, 'users', user.uid), {
        walletBalance: increment(-amount)
      });

      await addDoc(collection(db, 'investments'), {
        userId: user.uid,
        plan: title,
        amount: Number(amount),
        roiPercent: roi,
        totalExpectedProfit: totalExpectedProfit,
        durationDays: duration,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active',
        accruedProfit: 0,
        withdrawnProfit: 0,
        dailyBreakdown: dailyBreakdown,
        createdAt: serverTimestamp()
      });

      setIsModalOpen(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(formatError(err));
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] border flex flex-col space-y-4 md:space-y-6 transition-all hover:shadow-xl ${
        featured ? 'bg-brand text-white border-brand shadow-lg lg:scale-105' : 'bg-white text-black border-gray-100'
      }`}>
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center ${featured ? 'bg-white/20' : 'bg-brand-muted text-brand'}`}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6 md:w-8 md:h-8' })}
        </div>
        <div className="space-y-0.5 md:space-y-1">
          <h3 className="text-xl md:text-2xl font-bold">{title} Plan</h3>
          <p className={`text-2xl md:text-3xl font-black ${featured ? 'text-white' : 'text-brand'}`}>
            {roi}% <span className="text-[10px] md:text-xs font-bold opacity-60">PROFIT</span>
          </p>
        </div>
        
        <div className="space-y-2 md:space-y-3 border-t border-current/10 pt-4 md:pt-6 flex-1 text-inherit">
          <div className="flex justify-between font-bold text-xs md:text-sm">
            <span className="opacity-60">Duration</span>
            <span>{duration} Days</span>
          </div>
          <div className="flex justify-between font-bold text-xs md:text-sm">
            <span className="opacity-60">Min Deposit</span>
            <span>₦{min.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-xs md:text-sm">
            <span className="opacity-60">Total Return</span>
            <span>{100 + roi}%</span>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className={`h-12 md:h-14 rounded-full font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all ${
            featured ? 'bg-white text-brand hover:bg-gray-100' : 'bg-brand text-white hover:bg-[#6d1b1b]'
          }`}
        >
          Invest Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[32px] p-6 md:p-8 shadow-2xl relative z-10 space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-black">Confirm Investment</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Plan: <span className="text-brand">{title}</span></p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 ml-1">Investment Amount (₦)*</label>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="input-pill h-12 text-base font-bold"
                  placeholder={`Min ₦${min}`}
                />
                <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Total Profit</span>
                      <span className="font-bold text-green-600">₦{((amount * roi) / 100).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Total Payout</span>
                      <span className="font-bold text-brand">₦{(amount + (amount * roi) / 100).toLocaleString()}</span>
                   </div>
                </div>
              </div>

              {error && <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl italic">{error}</p>}

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleInvest}
                  disabled={loading}
                  className="w-full h-12 md:h-14 bg-brand text-white rounded-full text-base font-bold hover:bg-[#6d1b1b] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <>Confirm & Pay <Shield size={16} /></>}
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="w-full h-10 text-gray-400 font-bold text-xs hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
