import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader2, Shield, Bell, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, orderBy, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

const lineData = [
  { name: 'Day 1', value: 2000 },
  { name: 'Day 5', value: 4500 },
  { name: 'Day 10', value: 8000 },
  { name: 'Day 15', value: 12000 },
  { name: 'Day 20', value: 15000 },
  { name: 'Day 25', value: 21000 },
  { name: 'Day 30', value: 25000 },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // States
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [transAmount, setTransAmount] = useState(2000);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      // Simulate file upload to data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!user) return;

    const qInv = query(collection(db, 'investments'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubInv = onSnapshot(qInv, (s) => {
      setInvestments(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setDataLoading(false);
    });

    const unsubD = onSnapshot(query(collection(db, 'deposits'), where('userId', '==', user.uid)), (s) => setDeposits(s.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubW = onSnapshot(query(collection(db, 'withdrawals'), where('userId', '==', user.uid)), (s) => setWithdrawals(s.docs.map(d => ({id: d.id, ...d.data()}))));
    
    // Notifications logic: Specific to user OR broadcast to 'all'
    const unsubN = onSnapshot(query(collection(db, 'notifications'), where('userId', '==', user.uid)), (s) => {
      const userNotifs = s.docs.map(d => ({id: d.id, ...d.data()}));
      setNotifications(prev => {
        const others = prev.filter(p => p.userId === 'all');
        return [...others, ...userNotifs];
      });
    });

    const unsubNB = onSnapshot(query(collection(db, 'notifications'), where('userId', '==', 'all')), (s) => {
      const allNotifs = s.docs.map(d => ({id: d.id, ...d.data()}));
      setNotifications(prev => {
        const others = prev.filter(p => p.userId !== 'all');
        return [...others, ...allNotifs];
      });
    });

    return () => { unsubInv(); unsubD(); unsubW(); unsubN(); unsubNB(); };
  }, [user]);

  if (authLoading || dataLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-brand animate-spin" />
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest animate-pulse">Syncing Portfolio...</p>
      </div>
    </div>
  );

  // LOGIC CALCULATIONS
  const processedInvestments = investments.map(inv => {
    const start = new Date(inv.startDate).getTime();
    const now = new Date().getTime();
    const end = new Date(inv.endDate).getTime();
    
    const daysPassed = Math.min(
      inv.durationDays,
      Math.floor((now - start) / (1000 * 60 * 60 * 24))
    );

    const currentAccruedTotal = inv.dailyBreakdown?.slice(0, daysPassed).reduce((s: number, v: number) => s + v, 0) || 0;
    
    // Available to Withdraw Logic (capped at 50% until maturity)
    const principalLimit = inv.amount * 0.5;
    const hasEnded = now >= end;
    const currentProfit = currentAccruedTotal - (inv.withdrawnProfit || 0);
    
    const availableFromThis = hasEnded 
      ? currentProfit 
      : Math.min(currentProfit, Math.max(0, principalLimit - (inv.withdrawnProfit || 0)));

    return { ...inv, currentAccruedTotal, availableFromThis, hasEnded };
  });

  const activeInvestments = processedInvestments.filter(i => i.status === 'active');
  const totalActivePrincipal = activeInvestments.reduce((sum, i) => sum + i.amount, 0);
  const totalAccruedProfitActive = activeInvestments.reduce((sum, i) => sum + i.currentAccruedTotal, 0);
  
  const availableToWithdraw = processedInvestments.reduce((sum, i) => sum + i.availableFromThis, 0);
  
  // Total Account Value (Everything combined)
  const totalAccountValue = totalActivePrincipal + totalAccruedProfitActive + (user?.walletBalance || 0);
  
  // Actual liquid cash in the user's wallet
  const liquidWalletBalance = user?.walletBalance || 0;

  const submitDeposit = async () => {
    if (!user) return;
    if (!receiptFile) return setError('Please upload a transfer receipt');
    setLoading(true);
    setError('');
    try {
      if (transAmount < 2000) throw new Error('Minimum deposit is ₦2,000');
      
      // Upload to Storage
      const storageRef = ref(storage, `receipts/${user.uid}/${Date.now()}_${receiptFile.name}`);
      const uploadResult = await uploadBytes(storageRef, receiptFile);
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, 'deposits'), {
        userId: user.uid,
        userEmail: user.email,
        amount: transAmount,
        receiptUrl: downloadUrl,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      setIsDepositOpen(false);
      setTransAmount(2000);
      setReceiptUrl('');
      setReceiptFile(null);
      alert('Deposit submitted! Awaiting admin approval.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitWithdrawal = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const amount = Number(transAmount);
      if (isNaN(amount) || amount < 2000) throw new Error('Minimum withdrawal is ₦2,000');
      if (amount > availableToWithdraw) throw new Error('Insufficient withdrawable profit.');

      await addDoc(collection(db, 'withdrawals'), {
        userId: user.uid,
        userEmail: user.email,
        amount: amount,
        status: 'pending',
        bankDetails: user.bankDetails || { bankName: 'Not Provided', accountName: 'Not Provided', accountNumber: 'Not Provided' },
        createdAt: new Date().toISOString()
      });

      setIsWithdrawOpen(false);
      setTransAmount(2000);
      alert('Withdrawal request pending admin approval.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
      <header className="space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">Hey, {user?.firstName}</h1>
              <p className="text-gray-400 font-medium md:text-lg">Real-time assets in Nigerian Naira (₦).</p>
           </div>
           <div className="flex gap-3">
              <button 
                onClick={() => { setIsDepositOpen(true); setError(''); }}
                className="px-6 py-3 bg-brand text-white rounded-full font-bold text-sm hover:translate-y-[-2px] transition-all shadow-lg shadow-brand/20"
              >
                Deposit (₦)
              </button>
              <button 
                onClick={() => { setIsWithdrawOpen(true); setError(''); }}
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-full font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Withdraw
              </button>
           </div>
        </div>
      </header>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Portfolio Value" value={`₦${totalAccountValue.toLocaleString()}`} variant="solid" />
        <StatCard title="Active Invested" value={`₦${totalActivePrincipal.toLocaleString()}`} variant="outline" />
        <StatCard title="Available to Withdraw" value={`₦${availableToWithdraw.toLocaleString()}`} variant="outline" showTrend />
        <StatCard title="Wallet (Cash)" value={`₦${liquidWalletBalance.toLocaleString()}`} variant="outline" />
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 pt-4 items-end border-b border-gray-100 pb-12">
         <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signup Bonus (Protected)</p>
            <p className="text-4xl font-bold text-black">₦{user?.signupBonus?.toLocaleString() || '0'}</p>
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Plans</p>
            <p className="text-4xl font-bold text-black">{activeInvestments.length}</p>
         </div>
         <div className="flex-1 bg-gray-50 border border-gray-100 p-6 rounded-3xl flex items-center justify-between gap-4">
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Referral Link</p>
               <p className="font-mono text-sm font-bold text-brand break-all">
                  {window.location.origin}/signup?ref={user?.referralCode}
               </p>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${user?.referralCode}`);
                alert('Referral link copied!');
              }}
              className="px-6 h-12 bg-black text-white rounded-full font-bold text-xs whitespace-nowrap hover:bg-gray-800 transition-all"
            >
              Copy Link
            </button>
         </div>
      </div>

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="space-y-4">
           <h3 className="text-xl font-bold flex items-center gap-2"><Bell className="text-brand" size={20} /> Latest Updates</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notifications.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4).map((n:any) => (
                <div key={n.id} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex gap-4 items-start">
                   <div className="w-10 h-10 bg-brand-muted rounded-2xl flex items-center justify-center shrink-0">
                      <Bell size={18} className="text-brand" />
                   </div>
                   <div>
                      <p className="font-bold text-black">{n.title}</p>
                      <p className="text-sm text-gray-400 font-medium">{n.message}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Pending Transactions Section */}
      {(deposits.some(d => d.status === 'pending') || withdrawals.some(w => w.status === 'pending')) && (
        <div className="bg-orange-50 border border-orange-100 p-8 rounded-[40px] space-y-6">
           <div className="flex items-center gap-3 text-orange-800">
              <Loader2 className="animate-spin" size={24} />
              <h3 className="text-xl font-bold">Processing Operations</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deposits.filter(d => d.status === 'pending').map(d => (
                <div key={d.id} className="bg-white/50 p-6 rounded-3xl border border-orange-200">
                   <p className="text-[10px] font-bold uppercase text-orange-600">Pending Refill</p>
                   <p className="text-2xl font-black text-black">₦{d.amount.toLocaleString()}</p>
                </div>
              ))}
              {withdrawals.filter(w => w.status === 'pending').map(w => (
                <div key={w.id} className="bg-white/50 p-6 rounded-3xl border border-orange-200">
                   <p className="text-[10px] font-bold uppercase text-orange-600">Withdrawal Request</p>
                   <p className="text-2xl font-black text-black">₦{w.amount.toLocaleString()}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 md:gap-12">
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[50px] border border-gray-100 shadow-sm space-y-6 md:space-y-8">
          <h3 className="text-lg md:text-xl font-bold text-black">Growth Analytics</h3>
          <div className="h-48 md:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#802020" strokeWidth={3} fill="#802020" fillOpacity={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[50px] border border-gray-100 shadow-sm space-y-6 md:space-y-8">
          <h3 className="text-lg md:text-xl font-bold text-black">Active Performance</h3>
          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
            {processedInvestments.length > 0 ? processedInvestments.map(inv => (
              <div key={inv.id} className="p-4 rounded-3xl border border-gray-50 flex justify-between items-center">
                 <div>
                    <p className="font-bold text-black">{inv.plan} Plan</p>
                    <p className="text-xs text-gray-400">Principal: ₦{inv.amount.toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="font-bold text-green-600">+₦{inv.currentAccruedTotal.toLocaleString()}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Current ROI</p>
                 </div>
              </div>
            )) : (
              <p className="text-gray-400 italic text-center py-8">No active investments found.</p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isDepositOpen || isWithdrawOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsDepositOpen(false); setIsWithdrawOpen(false); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10 space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-black">
                  {isDepositOpen ? 'Deposit Funds' : 'Withdraw Profit'}
                </h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                  ₦2,000 Minimum
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400 ml-1">Amount (₦)*</label>
                <input 
                  type="number"
                  value={transAmount}
                  onChange={(e) => setTransAmount(Number(e.target.value))}
                  className="input-pill h-16 text-xl font-bold"
                  placeholder="Min ₦2,000"
                />
                {!isDepositOpen && (
                   <div className="bg-brand-muted p-4 rounded-2xl">
                      <p className="text-xs text-brand font-bold">Max Withdrawable Now: ₦{availableToWithdraw.toLocaleString()}</p>
                      <p className="text-[10px] text-brand/60 mt-1 leading-tight italic">Note: Only up to 50% of your principal can be withdrawn before the plan matures.</p>
                   </div>
                )}
                {isDepositOpen && (
                  <div className="space-y-4 pt-4">
                    <label className="text-sm font-bold text-gray-400 ml-1">Upload Transfer Receipt (Image)*</label>
                    <div className="relative h-32 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden">
                       <input 
                         type="file" 
                         accept="image/*"
                         onChange={handleFileChange}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       />
                       {receiptUrl ? (
                         <img src={receiptUrl} className="w-full h-full object-cover" />
                       ) : (
                         <>
                            <Plus className="text-gray-300" />
                            <p className="text-xs font-bold text-gray-400">Click to select receipt</p>
                         </>
                       )}
                    </div>
                  </div>
                )}
              </div>

              {error && <p className="text-sm font-bold text-red-500 bg-red-50 p-4 rounded-2xl italic">{error}</p>}

              <div className="flex flex-col gap-4">
                <button 
                  onClick={isDepositOpen ? submitDeposit : submitWithdrawal}
                  disabled={loading}
                  className="w-full h-16 md:h-20 bg-brand text-white rounded-full text-xl font-bold hover:bg-[#6d1b1b] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-brand/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>{isDepositOpen ? 'Send for Approval' : 'Request Payout'}</>}
                </button>
                <button 
                  onClick={() => { setIsDepositOpen(false); setIsWithdrawOpen(false); }}
                  disabled={loading}
                  className="w-full h-14 text-gray-400 font-bold hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, variant = "solid", showTrend }: { title: string; value: string; variant?: 'solid' | 'outline'; showTrend?: boolean }) {
  return (
    <div className={variant === 'solid' ? 'dashboard-card-solid' : 'dashboard-card-outline'}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{title}</p>
        {showTrend && <TrendingUp className="w-4 h-4" />}
      </div>
      <p className="text-3xl font-extrabold tracking-tight leading-none">{value}</p>
    </div>
  );
}
