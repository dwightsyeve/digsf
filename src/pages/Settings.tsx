import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { User as UserIcon, Lock, Bell, Landmark, ChevronRight, Loader2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Settings() {
  const tabs = [
    { name: 'Profile Settings', to: '/settings/profile', icon: <UserIcon className="w-5 h-5" /> },
    { name: 'Password', to: '/settings/password', icon: <Lock className="w-5 h-5" /> },
    { name: 'Notifications', to: '/settings/notifications', icon: <Bell className="w-5 h-5" /> },
    { name: 'Bank Details', to: '/settings/bank', icon: <Landmark className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      <header>
        <h1 className="text-4xl font-bold text-black">Settings</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <aside className="w-full lg:w-96 space-y-4">
          <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex items-center justify-between p-8 transition-all relative ${
                    isActive 
                    ? 'bg-gray-50/50 text-black font-bold' 
                    : 'text-gray-400 hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="text-xl">{tab.name}</span>
                    {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-brand rounded-l-full" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </aside>

        <div className="flex-1 bg-white p-6 md:p-12 rounded-[50px] border border-gray-100 shadow-sm min-h-[600px]">
          <Routes>
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="password" element={<PasswordSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="bank" element={<BankDetailsComponent />} />
            <Route path="/" element={<Navigate to="profile" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function BankDetailsComponent() {
  const { user } = useAuth();
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadBank() {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.bankDetails) {
            setBankName(data.bankDetails.bankName || '');
            setAccountName(data.bankDetails.accountName || '');
            setAccountNumber(data.bankDetails.accountNumber || '');
          }
        }
      } catch (e) {
        console.error("Error loading bank details:", e);
      }
      setFetching(false);
    }
    loadBank();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        bankDetails: {
          bankName,
          accountName,
          accountNumber
        }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mt-20" />;

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-black">Bank Information</h2>
        <p className="text-gray-400 font-medium tracking-tight">Withdrawals will be sent to this account.</p>
      </div>
      
      <form onSubmit={handleSave} className="grid grid-cols-1 gap-y-10 max-w-2xl">
        <InputComponent 
          label="Bank Name*" 
          placeholder="e.g. Access Bank" 
          value={bankName}
          onChange={(e: any) => setBankName(e.target.value)}
          required
        />
        <InputComponent 
          label="Account Name*" 
          placeholder="e.g. John Doe" 
          value={accountName}
          onChange={(e: any) => setAccountName(e.target.value)}
          required
        />
        <InputComponent 
          label="Account Number*" 
          placeholder="10 Digits" 
          value={accountNumber}
          onChange={(e: any) => setAccountNumber(e.target.value)}
          required
        />
        
        <div className="pt-8 flex items-center gap-6">
           <button 
             type="submit"
             disabled={loading}
             className="h-16 px-12 bg-brand text-white rounded-2xl font-bold hover:bg-[#6d1b1b] shadow-xl shadow-brand/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Details</>}
           </button>
           {success && <p className="text-green-600 font-bold animate-fade-in text-sm">Successfully Updated!</p>}
        </div>
      </form>
    </div>
  );
}

function InputComponent({ label, placeholder, type = "text", value, onChange, required, readOnly }: any) {
  return (
    <div className="space-y-4">
      <label className="text-lg font-bold text-black ml-1">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly || !onChange}
        className="w-full h-16 px-8 rounded-2xl bg-gray-50 border border-gray-100 focus:border-brand focus:bg-white outline-none transition-all placeholder:text-gray-300 font-semibold text-black disabled:opacity-50"
      />
    </div>
  );
}

function ProfileSettings() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState('Male');
  const [country, setCountry] = useState('Nigeria');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [avatarStr, setAvatarStr] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
      setAvatarStr(user.avatar || '');
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // basic resizing logic can go here, but doing simple Base64 for now
        // A simple canvas resize to save DB space
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setAvatarStr(dataUrl);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setAvatarStr('');
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        gender,
        country,
        mobile,
        address,
        avatar: avatarStr
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-5xl">
       <div className="flex items-center gap-12">
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img src={avatarStr || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative h-14 px-10 bg-brand text-white rounded-2xl font-bold hover:bg-[#6d1b1b] transition-all flex items-center justify-center cursor-pointer overflow-hidden">
            <span className="pointer-events-none text-sm z-10 whitespace-nowrap">Upload New</span>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full"
            />
          </div>
          <button type="button" onClick={handleDeletePhoto} className="h-14 px-10 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all text-sm whitespace-nowrap z-30">Delete photo</button>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8" onSubmit={(e) => e.preventDefault()}>
        <InputComponent label="First Name*" placeholder="Jimmy" value={firstName} onChange={(e: any) => setFirstName(e.target.value)} />
        <InputComponent label="Last Name*" placeholder="Donaldson" value={lastName} onChange={(e: any) => setLastName(e.target.value)} />
        <InputComponent label="Email*" placeholder="jimmydonaldson20@gmail.com" value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <SelectComponent label="Gender" options={['Male', 'Female', 'Other']} value={gender} onChange={(e: any) => setGender(e.target.value)} />
        <SelectComponent label="Country*" options={['Nigeria', 'Ghana', 'Kenya', 'USA']} value={country} onChange={(e: any) => setCountry(e.target.value)} />
        <InputComponent label="Mobile*" placeholder="+234 800 000 0000" value={mobile} onChange={(e: any) => setMobile(e.target.value)} />
        <div className="md:col-span-2">
          <InputComponent label="Address" placeholder="Street Address" value={address} onChange={(e: any) => setAddress(e.target.value)} />
        </div>
        
        <div className="md:col-span-2 pt-12 flex items-center gap-6">
           <button 
             type="button" 
             onClick={handleSave}
             disabled={loading}
             className="h-16 px-12 bg-brand text-white rounded-2xl font-bold hover:bg-[#6d1b1b] shadow-xl shadow-brand/20 flex items-center gap-2"
           >
             {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
           </button>
           {success && <p className="text-green-600 font-bold animate-fade-in">Profile Updated!</p>}
        </div>
      </form>
    </div>
  );
}

function PasswordSettings() {
  return (
    <div className="space-y-8 max-w-xl">
      <InputComponent label="Previous Password" type="password" placeholder="••••••••••••" />
      <InputComponent label="New Password" type="password" placeholder="••••••••••••" />
      <InputComponent label="Confirm Password" type="password" placeholder="••••••••••••" />
      
      <div className="pt-12 flex gap-6">
         <button type="button" className="h-16 px-12 bg-brand text-white rounded-2xl font-bold hover:bg-[#6d1b1b]">Save Changes</button>
         <button type="button" className="h-16 px-12 bg-gray-100 text-gray-400 rounded-2xl font-bold">Discard</button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-8">
      <p className="text-gray-400 text-lg font-medium">Manage your notification preferences here.</p>
      <div className="p-8 border border-gray-100 rounded-3xl space-y-6">
         <label className="flex items-center justify-between">
            <span className="font-bold text-black text-xl">Investment Updates</span>
            <input type="checkbox" defaultChecked className="w-6 h-6 accent-brand" />
         </label>
         <label className="flex items-center justify-between">
            <span className="font-bold text-black text-xl">Withdrawal Status</span>
            <input type="checkbox" defaultChecked className="w-6 h-6 accent-brand" />
         </label>
         <label className="flex items-center justify-between">
            <span className="font-bold text-black text-xl">Security Alerts</span>
            <input type="checkbox" defaultChecked className="w-6 h-6 accent-brand" />
         </label>
      </div>
    </div>
  );
}

function SelectComponent({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange?: any }) {
  return (
    <div className="space-y-4">
      <label className="text-lg font-bold text-black ml-1">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={onChange}
          className="w-full h-16 px-8 rounded-2xl bg-gray-50 border border-gray-100 focus:border-brand focus:bg-white outline-none transition-all appearance-none text-black font-semibold"
        >
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 rotate-90 pointer-events-none" />
      </div>
    </div>
  );
}
