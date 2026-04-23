import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Plus, Copy, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState(2000);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('210462822');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitDeposit = async () => {
    if (!user) return;
    if (!receiptFile) return setError('Please upload a transfer receipt');
    setLoading(true);
    setError('');
    try {
      if (amount < 2000) throw new Error('Minimum deposit is ₦2,000');
      
      const storageRef = ref(storage, `receipts/${user.uid}/${Date.now()}_${receiptFile.name}`);
      const uploadResult = await uploadBytes(storageRef, receiptFile);
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, 'deposits'), {
        userId: user.uid,
        userEmail: user.email,
        amount: amount,
        receiptUrl: downloadUrl,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      onClose();
      setAmount(2000);
      setReceiptUrl('');
      setReceiptFile(null);
      alert('Deposit submitted! Awaiting admin approval.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[32px] p-6 md:p-8 shadow-2xl relative z-10 space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-black">Deposit Funds</h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                Professional Asset Funding
              </p>
            </div>

            <div className="bg-brand/5 border border-brand/10 p-5 rounded-2xl space-y-3">
               <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-brand uppercase tracking-widest">Bank Transfer Details</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                     Instant Verification
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center justify-between">
                     <p className="text-xl font-black tracking-tight text-gray-900">210462822</p>
                     <button onClick={copyToClipboard} className="p-2 hover:bg-brand/10 rounded-xl transition-colors">
                        {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-brand" />}
                     </button>
                  </div>
                  <p className="text-xs font-bold text-gray-500">OPAY DIGITAL BANK (NIGERIA)</p>
                  <p className="text-xs font-black text-brand">DIGISAFE LIMITED</p>
               </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 ml-1">Amount to Fund (₦)*</label>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="input-pill h-12 text-base font-bold"
                placeholder="Min ₦2,000"
              />
              
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-400 ml-1">Upload Payment Proof (Receipt)*</label>
                <div className="relative h-32 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden">
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={handleFileChange}
                     className="absolute inset-0 opacity-0 cursor-pointer"
                   />
                   {receiptUrl ? (
                     <img src={receiptUrl} className="w-full h-full object-cover" />
                   ) : (
                     <div className="flex flex-col items-center gap-2">
                        <Plus className="text-gray-300" size={24} />
                        <p className="text-xs font-bold text-gray-400">Click to upload receipt</p>
                     </div>
                   )}
                </div>
              </div>
            </div>

            {error && <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl italic">{error}</p>}

            <div className="flex flex-col gap-3">
              <button 
                onClick={submitDeposit}
                disabled={loading}
                className="w-full h-12 bg-brand text-white rounded-full text-base font-bold hover:bg-[#6d1b1b] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-brand/20"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Submit for Approval'}
              </button>
              <button 
                onClick={onClose}
                disabled={loading}
                className="w-full h-10 text-gray-400 font-bold text-xs hover:text-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
