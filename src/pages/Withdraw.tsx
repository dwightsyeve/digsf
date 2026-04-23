import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Withdraw() {
  const [showAccount, setShowAccount] = useState(false);
  const [bank, setBank] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (field: string, value: string) => {
    let error = '';
    if (field === 'bank' && !value) error = 'Please select a bank';
    if (field === 'accNumber') {
      if (!value) error = 'Account number is required';
      else if (!/^\d{10,18}$/.test(value)) error = 'Must be 10-18 digits';
    }
    if (field === 'amount') {
      const num = parseFloat(value);
      if (!value) error = 'Amount is required';
      else if (isNaN(num)) error = 'Must be a valid number';
      else if (num < 10000) error = 'Minimum amount is $10,000';
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const v1 = validate('bank', bank);
    const v2 = validate('accNumber', accNumber);
    const v3 = validate('amount', amount);
    
    if (v1 && v2 && v3) {
      alert('Withdrawal request submitted!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12 space-y-8 md:space-y-12">
      <header className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">Withdraw</h1>
        <p className="text-xs md:text-lg text-gray-400 font-medium opacity-80 uppercase tracking-widest">Secure Fund Transfer</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-20 items-start">
        {/* Left Side: Account Info */}
        <div className="space-y-8 md:space-y-12">
          <div className="bg-gray-100 p-6 md:p-10 rounded-[32px] md:rounded-[50px] space-y-6 md:space-y-8 relative overflow-hidden">
            <div className="space-y-3 md:space-y-4">
              <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wider">Savings Account No.</p>
              <div className="flex items-center justify-between">
                <p className="text-3xl md:text-6xl font-bold text-black tracking-tighter">
                  {showAccount ? '123456789012' : '••••••••••••'}
                </p>
                <button 
                  onClick={() => setShowAccount(!showAccount)}
                  className="p-2 md:p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  {showAccount ? <EyeOff className="w-5 h-5 md:w-6 md:h-6 text-gray-900" /> : <Eye className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] md:text-xs font-bold pt-4 md:pt-8">
              <div>
                <p className="text-gray-400 uppercase tracking-widest mb-1">Alt. Account No.</p>
                <p className="text-black">098976540987</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 uppercase tracking-widest mb-1">Status:</p>
                <p className="text-black uppercase">Regular</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Daily Transaction Limit: $1.00M</p>
            <div className="h-2 md:h-2.5 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-brand w-[10%]" />
            </div>
            <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
              <span>Used: $100K</span>
              <span>Rem: $900K</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link to="/settings/bank" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors">
              Update account details? <span className="border-b border-gray-300 hover:border-brand">Click here</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Form */}
        <form onSubmit={handleWithdraw} className="space-y-4 md:space-y-6">
          <div className="space-y-1">
            <div className="relative group">
              <select 
                value={bank}
                onChange={(e) => { setBank(e.target.value); validate('bank', e.target.value); }}
                className={`w-full h-14 md:h-16 px-8 rounded-full border bg-white appearance-none outline-none focus:border-brand transition-all font-semibold text-gray-700 text-base md:text-lg ${errors.bank ? 'border-red-500' : 'border-gray-100'}`}
              >
                <option value="" disabled>Select Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="icici">ICICI Bank</option>
                <option value="hdfc">HDFC Bank</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand flex items-center justify-center pointer-events-none">
                <ChevronDown className="w-3 h-3 md:w-5 md:h-5 text-white" />
              </div>
            </div>
            {errors.bank && <p className="text-red-500 text-[10px] font-bold ml-6 uppercase">{errors.bank}</p>}
          </div>

          <div className="space-y-1">
            <input 
              type="text" 
              value={accNumber}
              onChange={(e) => { setAccNumber(e.target.value); validate('accNumber', e.target.value); }}
              placeholder="Beneficiary account number" 
              className={`w-full h-14 md:h-16 px-8 rounded-full border outline-none focus:border-brand transition-all font-semibold text-gray-700 text-base md:text-lg ${errors.accNumber ? 'border-red-500' : 'border-gray-100'}`}
            />
            {errors.accNumber && <p className="text-red-500 text-[10px] font-bold ml-6 uppercase">{errors.accNumber}</p>}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-xl md:text-2xl font-bold text-gray-300">$</span>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => { setAmount(e.target.value); validate('amount', e.target.value); }}
                placeholder="Amount" 
                className={`w-full h-14 md:h-16 pl-12 md:pl-14 pr-8 rounded-full border outline-none focus:border-brand transition-all font-semibold text-gray-700 text-base md:text-lg ${errors.amount ? 'border-red-500' : 'border-gray-100'}`}
              />
            </div>
            <div className="flex justify-between px-6">
              {errors.amount ? <p className="text-red-500 text-[10px] font-bold uppercase">{errors.amount}</p> : <div />}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Min: <span className="text-black">$10K</span>
              </p>
            </div>
          </div>

          <textarea 
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            placeholder="Narration" 
            className="w-full h-24 md:h-32 p-6 md:p-8 rounded-[24px] md:rounded-[40px] border border-gray-100 outline-none focus:border-brand transition-all font-semibold text-gray-700 text-base md:text-lg resize-none"
          />

          <button 
            type="submit"
            className="w-full h-16 md:h-20 rounded-full bg-brand text-white text-xl md:text-2xl font-bold hover:bg-[#6d1b1b] transition-all shadow-xl shadow-brand/20 mt-2"
          >
            Withdraw to Bank
          </button>
        </form>
      </div>
    </div>
  );
}

