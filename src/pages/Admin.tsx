import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Bell, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Search,
  Plus,
  Loader2,
  Image as ImageIcon,
  MessageSquare,
  LifeBuoy,
  Send
} from 'lucide-react';
import { collection, query, onSnapshot, doc, updateDoc, increment, getDocs, addDoc, serverTimestamp, getDoc, where, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'deposits' | 'withdrawals' | 'settings' | 'notifications' | 'support' | 'inquiries'>('users');
  const [supportMessages, setSupportMessages] = useState<any[]>([]);
  const [contactInquiries, setContactInquiries] = useState<any[]>([]);

  // Authorization Check
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), 
      (s) => setUsers(s.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error("Admin user list error:", err)
    );
    const unsubDeposits = onSnapshot(query(collection(db, 'deposits')), 
      (s) => setDeposits(s.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error("Admin deposits list error:", err)
    );
    const unsubWithdrawals = onSnapshot(query(collection(db, 'withdrawals')), 
      (s) => setWithdrawals(s.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error("Admin withdrawals list error:", err)
    );
    const unsubSettings = onSnapshot(doc(db, 'system', 'settings'), 
      (s) => setSystemSettings(s.data()),
      (err) => console.error("Admin settings error:", err)
    );
    const unsubSupport = onSnapshot(collection(db, 'support_messages'), 
      (s) => setSupportMessages(s.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error("Admin support messages error:", err)
    );
    const unsubInquiries = onSnapshot(collection(db, 'contact_inquiries'), 
      (s) => setContactInquiries(s.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error("Admin contact inquiries error:", err)
    );

    return () => {
      unsubUsers();
      unsubDeposits();
      unsubWithdrawals();
      unsubSettings();
      unsubSupport();
      unsubInquiries();
    };
  }, []);

  const approveDeposit = async (dep: any) => {
    try {
      const depRef = doc(db, 'deposits', dep.id);
      const userRef = doc(db, 'users', dep.userId);
      
      // Check if this is the first approved deposit to trigger referral bonus
      const q = query(collection(db, 'deposits'), where('userId', '==', dep.userId), where('status', '==', 'approved'));
      const existingApproved = await getDocs(q);
      const isFirstDeposit = existingApproved.empty;

      await updateDoc(depRef, { status: 'approved' });
      await updateDoc(userRef, {
        walletBalance: increment(dep.amount),
        totalDeposited: increment(dep.amount)
      });

      // Handle Referral Bonus (10% of first deposit)
      if (isFirstDeposit) {
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        if (userData?.referredBy) {
          const qRef = query(collection(db, 'users'), where('referralCode', '==', userData.referredBy));
          const referrerDocs = await getDocs(qRef);
          
          if (!referrerDocs.empty) {
            const referrerDoc = referrerDocs.docs[0];
            const referralBonus = dep.amount * 0.1; // 10%
            
            await updateDoc(doc(db, 'users', referrerDoc.id), {
              walletBalance: increment(referralBonus),
              referralEarnings: increment(referralBonus)
            });

            await addDoc(collection(db, 'notifications'), {
              userId: referrerDoc.id,
              title: 'Referral Commission Paid!',
              message: `You earned ₦${referralBonus.toLocaleString()} (10%) from your referee's first deposit.`,
              type: 'success',
              read: false,
              createdAt: serverTimestamp()
            });
          }
        }
      }

      // Send Notification to depositor
      await addDoc(collection(db, 'notifications'), {
        userId: dep.userId,
        title: 'Deposit Approved',
        message: `Your deposit of ₦${dep.amount.toLocaleString()} has been approved and added to your wallet.`,
        type: 'success',
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (e) { alert('Action failed'); }
  };

  const declineDeposit = async (dep: any) => {
    try {
      await updateDoc(doc(db, 'deposits', dep.id), { status: 'rejected' });
      await addDoc(collection(db, 'notifications'), {
        userId: dep.userId,
        title: 'Deposit Declined',
        message: `Your deposit of ₦${dep.amount.toLocaleString()} was declined. Please contact support.`,
        type: 'error',
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (e) { alert('Action failed'); }
  };

  const approveWithdrawal = async (wd: any) => {
    try {
      const wdRef = doc(db, 'withdrawals', wd.id);
      const userRef = doc(db, 'users', wd.userId);
      await updateDoc(wdRef, { status: 'approved' });
      // Deduct from wallet balance
      await updateDoc(userRef, {
        walletBalance: increment(-wd.amount),
        totalWithdrawn: increment(wd.amount)
      });
      // Send Notification
      await addDoc(collection(db, 'notifications'), {
        userId: wd.userId,
        title: 'Withdrawal Approved',
        message: `Your withdrawal request of ₦${wd.amount.toLocaleString()} has been processed.`,
        type: 'success',
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (e) { alert('Action failed'); }
  };

  const declineWithdrawal = async (wd: any) => {
    try {
      await updateDoc(doc(db, 'withdrawals', wd.id), { status: 'rejected' });
      await addDoc(collection(db, 'notifications'), {
        userId: wd.userId,
        title: 'Withdrawal Declined',
        message: `Your withdrawal of ₦${wd.amount.toLocaleString()} was declined.`,
        type: 'error',
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (e) { alert('Action failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-80 bg-black text-white p-6 md:p-8 flex flex-col gap-8 md:gap-12 md:sticky md:top-0 md:h-screen">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2">
            <ShieldCheck className="text-brand" /> ADMIN PANEL
          </h2>
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-2">PrimeInvest Management v1.0</p>
        </div>

        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          <AdminNavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="Users" />
          <AdminNavItem active={activeTab === 'deposits'} onClick={() => setActiveTab('deposits')} icon={<ArrowDownCircle size={18} />} label="Deposits" count={deposits.filter(d => d.status === 'pending').length} />
          <AdminNavItem active={activeTab === 'withdrawals'} onClick={() => setActiveTab('withdrawals')} icon={<ArrowUpCircle size={18} />} label="Withdrawals" count={withdrawals.filter(w => w.status === 'pending').length} />
          <AdminNavItem active={activeTab === 'support'} onClick={() => setActiveTab('support')} icon={<MessageSquare size={18} />} label="Live Chat" count={supportMessages.filter(m => !m.isAdmin && !m.isRead).length} />
          <AdminNavItem active={activeTab === 'inquiries'} onClick={() => setActiveTab('inquiries')} icon={<LifeBuoy size={18} />} label="Inquiries" count={contactInquiries.filter(i => i.status === 'new').length} />
          <AdminNavItem active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={<Bell size={18} />} label="Push Alerts" />
          <AdminNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon size={18} />} label="Config" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 w-full overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 md:mb-12">
           <h1 className="text-3xl md:text-5xl font-bold text-gray-900 capitalize italic">{activeTab}</h1>
           <div className="flex gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                 <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold shrink-0">₦</div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Total Assets</p>
                    <p className="font-bold text-black text-sm md:text-base">₦{users.reduce((s, u) => s + (u.walletBalance || 0), 0).toLocaleString()}</p>
                 </div>
              </div>
           </div>
        </header>

        <section className="bg-white rounded-3xl md:rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-10 min-h-[600px] overflow-hidden">
           {activeTab === 'users' && <UserList users={users} />}
           {activeTab === 'deposits' && <TransactionList items={deposits} type="deposit" onApprove={approveDeposit} onDecline={declineDeposit} />}
           {activeTab === 'withdrawals' && <TransactionList items={withdrawals} type="withdrawal" onApprove={approveWithdrawal} onDecline={declineWithdrawal} />}
           {activeTab === 'settings' && <SystemSettings settings={systemSettings} />}
           {activeTab === 'notifications' && <NotificationCenter users={users} />}
           {activeTab === 'support' && <SupportManagement messages={supportMessages} users={users} />}
           {activeTab === 'inquiries' && <InquiryManagement inquiries={contactInquiries} />}
        </section>
      </main>
    </div>
  );
}

function SupportManagement({ messages, users }: { messages: any[]; users: any[] }) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  // Group messages by user
  const chatThreads = users.map(u => {
    const userMessages = messages
      .filter(m => m.userId === u.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return {
      user: u,
      messages: userMessages,
      lastMessage: userMessages[userMessages.length - 1],
      unreadCount: userMessages.filter(m => !m.isAdmin && !m.isRead).length
    };
  }).filter(t => t.messages.length > 0)
    .sort((a, b) => new Date(b.lastMessage?.timestamp || 0).getTime() - new Date(a.lastMessage?.timestamp || 0).getTime());

  const sendReply = async () => {
    if (!selectedUser || !replyText.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'support_messages'), {
        userId: selectedUser,
        senderId: 'admin',
        senderName: 'PrimeInvest Support',
        text: replyText,
        timestamp: new Date().toISOString(),
        isAdmin: true,
        isRead: false
      });
      setReplyText('');
    } catch (e) { alert('Failed to send'); }
    finally { setSending(false); }
  };

  const activeThread = chatThreads.find(t => t.user.id === selectedUser);

  return (
    <div className="flex h-[600px] gap-6">
       <div className="w-80 border-r border-gray-100 flex flex-col gap-4 pr-6 overflow-y-auto">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 px-2">Active Conversations</h3>
          {chatThreads.map(t => (
            <button 
              key={t.user.id} 
              onClick={() => setSelectedUser(t.user.id)}
              className={`p-4 rounded-3xl text-left transition-all ${selectedUser === t.user.id ? 'bg-brand text-white shadow-xl shadow-brand/20' : 'hover:bg-gray-50'}`}
            >
               <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-sm truncate">{t.user.firstName} {t.user.lastName}</p>
                  {t.unreadCount > 0 && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />}
               </div>
               <p className={`text-[10px] truncate ${selectedUser === t.user.id ? 'opacity-70' : 'text-gray-400'}`}>
                 {t.lastMessage?.text || 'No messages'}
               </p>
            </button>
          ))}
          {chatThreads.length === 0 && <p className="text-xs text-gray-400 font-medium text-center py-10 italic">No chat history found.</p>}
       </div>

       <div className="flex-1 flex flex-col min-w-0">
          {activeThread ? (
             <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 rounded-3xl mb-4">
                   {activeThread.messages.map(m => (
                     <div key={m.id} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${m.isAdmin ? 'bg-black text-white rounded-tr-none' : 'bg-white text-black border border-gray-100 rounded-tl-none shadow-sm'}`}>
                           <p className="font-medium">{m.text}</p>
                           <p className={`text-[9px] mt-1 ${m.isAdmin ? 'text-white/50' : 'text-gray-400'}`}>{new Date(m.timestamp).toLocaleTimeString()}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="relative">
                   <input 
                     value={replyText}
                     onChange={e => setReplyText(e.target.value)}
                     onKeyPress={e => e.key === 'Enter' && sendReply()}
                     className="w-full h-14 bg-white border border-gray-100 rounded-2xl px-6 pr-16 font-medium outline-none focus:border-brand shadow-sm" 
                     placeholder={`Reply to ${activeThread.user.firstName}...`}
                   />
                   <button 
                     onClick={sendReply}
                     disabled={sending}
                     className="absolute right-2 top-2 w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center hover:bg-[#6d1b1b] transition-all disabled:opacity-50"
                   >
                     {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                   </button>
                </div>
             </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-300 italic">
               Select a conversation to start chatting
            </div>
          )}
       </div>
    </div>
  );
}

function InquiryManagement({ inquiries }: { inquiries: any[] }) {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inquiries.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(i => (
             <button 
               key={i.id} 
               onClick={() => setSelected(i)}
               className={`p-6 border rounded-[32px] text-left transition-all ${i.status === 'new' ? 'border-brand-muted bg-brand-muted/5' : 'border-gray-50 bg-white hover:bg-gray-50'}`}
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-bold uppercase text-[10px]">INQ</div>
                   <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${i.status === 'new' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{i.status}</span>
                </div>
                <div className="space-y-1">
                   <p className="font-bold text-black truncate">{i.name}</p>
                   <p className="text-xs text-gray-400 font-medium truncate">{i.email}</p>
                </div>
                <p className="mt-4 text-xs text-gray-500 line-clamp-3 leading-relaxed">{i.message}</p>
             </button>
          ))}
       </div>

       <AnimatePresence>
          {selected && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
               <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSelected(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
               <motion.div 
                 initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}}
                 className="bg-white w-full max-w-lg rounded-[40px] p-10 relative z-10 space-y-8"
               >
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-brand uppercase tracking-widest tracking-tighter">Contact Submission</p>
                     <h3 className="text-2xl font-bold text-black">{selected.name}</h3>
                     <p className="text-sm font-medium text-gray-400">{selected.email}</p>
                  </div>
                  <div className="bg-gray-50 p-8 rounded-3xl text-sm text-gray-600 leading-relaxed font-medium italic">
                     "{selected.message}"
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex gap-4">
                     <button 
                        onClick={async () => {
                          await updateDoc(doc(db, 'contact_inquiries', selected.id), { status: 'replied' });
                          setSelected(null);
                        }}
                        className="flex-1 h-16 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all"
                     >
                        Mark as Replied
                     </button>
                     <button onClick={() => setSelected(null)} className="h-16 px-8 text-gray-400 font-bold">Close</button>
                  </div>
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </div>
  );
}

function AdminNavItem({ active, icon, label, onClick, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal shrink-0 ${active ? 'bg-brand text-white' : 'text-gray-400 hover:bg-white/5'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-bold text-sm md:text-base">{label}</span>
      </div>
      {count > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">{count}</span>}
    </button>
  );
}

function UserList({ users }: { users: any[] }) {
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newBalance, setNewBalance] = useState(0);
  const [newRole, setNewRole] = useState('user');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newStatus, setNewStatus] = useState('active');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!editingUser) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        walletBalance: newBalance,
        role: newRole,
        firstName: newFirstName,
        lastName: newLastName,
        status: newStatus,
        bankDetails: {
          bankName,
          accountName,
          accountNumber
        }
      });
      alert('User updated successfully');
      setEditingUser(null);
    } catch (err: any) {
      console.error('Update failed:', err);
      alert(`Update failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden md:flex bg-gray-50 p-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-gray-400">
         <span className="flex-1">User</span>
         <span className="w-40 text-center">Wallet Balance</span>
         <span className="w-40 text-center">Status</span>
         <span className="w-32 text-right">Actions</span>
      </div>
      <div className="space-y-4">
        {users.map(u => (
          <div key={u.id} className={`flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-6 border rounded-3xl transition-colors ${u.status === 'suspended' ? 'bg-red-50/30 border-red-100' : 'border-gray-50 hover:bg-gray-50/50'}`}>
             <div className="flex-1 flex items-center gap-4">
                <img src={u.avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0" />
                <div className="truncate">
                   <p className="font-bold text-black truncate">{u.firstName} {u.lastName}</p>
                   <p className="text-xs text-gray-400 font-medium truncate">{u.email} • <span className="capitalize">{u.role}</span></p>
                </div>
             </div>
             
             <div className="flex items-center justify-between md:contents">
                <div className="md:w-40 md:text-center">
                   <p className="md:hidden text-[10px] text-gray-400 font-bold uppercase mb-1">Balance</p>
                   <p className="font-bold text-brand h-full">₦{u.walletBalance?.toLocaleString() || '0'}</p>
                </div>
                <div className="md:w-40 md:text-center">
                   <span className={`px-3 py-1 text-center rounded-full text-[10px] font-black uppercase ${u.status === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                     {u.status || 'active'}
                   </span>
                </div>
                <div className="md:w-32 flex justify-end">
                  <button 
                    onClick={() => {
                      setEditingUser(u);
                      setNewBalance(u.walletBalance || 0);
                      setNewRole(u.role || 'user');
                      setNewFirstName(u.firstName || '');
                      setNewLastName(u.lastName || '');
                      setNewStatus(u.status || 'active');
                      setBankName(u.bankDetails?.bankName || '');
                      setAccountName(u.bankDetails?.accountName || '');
                      setAccountNumber(u.bankDetails?.accountNumber || '');
                    }}
                    className="px-6 py-2 md:px-4 bg-gray-100 rounded-full text-black font-bold text-xs hover:bg-gray-200 transition-all"
                  >
                    Edit
                  </button>
               </div>
             </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setEditingUser(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
             <motion.div 
               initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}}
               className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] p-10 relative z-10 space-y-8"
             >
                <div className="space-y-1">
                   <h3 className="text-2xl font-bold text-black">Edit Account</h3>
                   <p className="text-sm font-medium text-gray-400">{editingUser.email}</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">First Name</label>
                      <input value={newFirstName} onChange={e => setNewFirstName(e.target.value)} className="w-full h-12 md:h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 md:px-6 font-bold outline-none focus:border-brand transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Last Name</label>
                      <input value={newLastName} onChange={e => setNewLastName(e.target.value)} className="w-full h-12 md:h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 md:px-6 font-bold outline-none focus:border-brand transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Wallet Balance (₦)</label>
                      <input type="number" value={newBalance} onChange={e => setNewBalance(Number(e.target.value))} className="w-full h-12 md:h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 md:px-6 font-bold outline-none focus:border-brand transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Account Status</label>
                      <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full h-12 md:h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 md:px-6 font-bold outline-none focus:border-brand appearance-none capitalize">
                         <option value="active">Active</option>
                         <option value="suspended">Suspended</option>
                      </select>
                   </div>
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Global Role</label>
                      <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full h-12 md:h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 md:px-6 font-bold outline-none focus:border-brand appearance-none capitalize">
                         <option value="user">User</option>
                         <option value="admin">Administrator</option>
                      </select>
                   </div>
                </div>              </div>

                <div className="pt-4 border-t border-gray-50 space-y-6">
                   <h4 className="text-sm font-black uppercase tracking-widest text-black">Bank Credentials</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Bank Name</label>
                         <input value={bankName} onChange={e => setBankName(e.target.value)} className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold outline-none focus:border-brand" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Account Name</label>
                         <input value={accountName} onChange={e => setAccountName(e.target.value)} className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold outline-none focus:border-brand" />
                      </div>
                      <div className="col-span-full space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest">Account Number</label>
                         <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold outline-none focus:border-brand" />
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <button 
                     onClick={handleUpdate}
                     disabled={updating}
                     className="w-full h-16 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                   >
                     {updating ? <Loader2 className="animate-spin" /> : 'Commit Changes'}
                   </button>
                   <button onClick={()=>setEditingUser(null)} className="w-full h-12 text-gray-400 font-bold text-sm">Cancel</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TransactionList({ items, type, onApprove, onDecline }: any) {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  return (
    <div className="space-y-4">
       {items.filter((i: any) => i.status === 'pending').map((item: any) => (
         <div key={item.id} className="p-4 md:p-6 border-2 border-brand-muted rounded-2xl space-y-4 bg-brand-muted/5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
               <div className="flex gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                     {type === 'deposit' ? <ArrowDownCircle size={20} className="text-brand" /> : <ArrowUpCircle size={20} className="text-blue-500" />}
                  </div>
                  <div className="min-w-0">
                     <p className="font-bold text-sm md:text-base text-black truncate">{type === 'deposit' ? 'Refill Request' : 'Payout Request'}</p>
                     <p className="text-[10px] text-gray-400 font-medium truncate">{item.userEmail} • {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
               </div>
               <div className="text-left md:text-right ml-12 md:ml-0">
                  <p className="text-lg md:text-xl font-black text-black">₦{item.amount.toLocaleString()}</p>
                  {type === 'deposit' && item.receiptUrl && (
                    <button 
                      onClick={() => setSelectedReceipt(item.receiptUrl)}
                      className="mt-1 flex items-center gap-1 text-[9px] uppercase font-bold text-brand hover:underline"
                    >
                      <ImageIcon size={10} /> View Receipt
                    </button>
                  )}
                  {type === 'withdrawal' && item.bankDetails && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.bankDetails.bankName} • {item.bankDetails.accountNumber}</p>
                  )}
               </div>
            </div>

            <div className="flex gap-3 pt-2">
               <button 
                 onClick={() => onApprove(item)}
                 className="flex-1 h-10 bg-brand text-white rounded-full font-bold text-xs hover:bg-[#6d1b1b] transition-all flex items-center justify-center gap-2"
               >
                 <CheckCircle2 size={14} /> Approve
               </button>
               <button 
                 onClick={() => onDecline(item)}
                 className="h-10 px-6 border border-gray-100 text-gray-400 rounded-full font-bold text-xs hover:bg-gray-50 flex items-center gap-2"
               >
                 <XCircle size={14} /> Decline
               </button>
            </div>
         </div>
       ))}

       <AnimatePresence>
          {selectedReceipt && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
               <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSelectedReceipt(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
               <motion.div 
                 initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}}
                 className="relative z-10 max-w-4xl w-full max-h-[90vh] flex flex-col items-center gap-4"
               >
                 <img src={selectedReceipt} alt="Receipt" className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain bg-white" />
                 <button onClick={() => setSelectedReceipt(null)} className="px-8 py-3 bg-white text-black rounded-full font-bold">Close Preview</button>
               </motion.div>
            </div>
          )}
       </AnimatePresence>

       {items.filter((i: any) => i.status === 'pending').length === 0 && (
         <div className="py-20 text-center space-y-4">
            <CheckCircle2 size={48} className="mx-auto text-green-200" />
            <p className="text-gray-400 font-bold italic">All {type}s cleared. No pending tasks.</p>
         </div>
       )}
    </div>
  );
}

function SystemSettings({ settings }: any) {
  const [bonusEnabled, setBonusEnabled] = useState(settings?.signupBonusEnabled ?? true);
  const [bonusAmount, setBonusAmount] = useState(settings?.signupBonusAmount ?? 2000);
  const [referralBonus, setReferralBonus] = useState(settings?.referralBonusAmount ?? 500);
  const [loading, setLoading] = useState(false);

  const saveSettings = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'system', 'settings'), {
        signupBonusEnabled: bonusEnabled,
        signupBonusAmount: bonusAmount
      }, { merge: true });
      alert('Settings updated successfully');
    } catch (err: any) { 
      console.error('Settings update failed:', err);
      alert(`Update failed: ${err.message}`); 
    }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl space-y-12">
       <div className="space-y-8">
          <div className="flex items-center justify-between p-8 border border-gray-100 rounded-3xl">
             <div>
                <p className="font-bold text-black text-lg">Signup Bonus</p>
                <p className="text-sm text-gray-400">Add bonus to new users automatically</p>
             </div>
             <button 
               onClick={() => setBonusEnabled(!bonusEnabled)}
               className={`w-14 h-8 rounded-full transition-all relative ${bonusEnabled ? 'bg-brand' : 'bg-gray-200'}`}
             >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${bonusEnabled ? 'right-1' : 'left-1'}`} />
             </button>
          </div>

          <div className="space-y-4">
             <label className="text-sm font-bold text-gray-400 ml-1">Bonus Amount (₦)</label>
             <input 
               type="number"
               value={bonusAmount}
               onChange={(e) => setBonusAmount(Number(e.target.value))}
               className="w-full h-16 px-8 rounded-2xl bg-gray-50 border border-gray-100 focus:border-brand focus:bg-white outline-none transition-all font-bold text-black"
             />
             <p className="text-[10px] text-gray-400 font-medium px-1">Note: Referrers now receive a fixed 10% commission on their referee's first deposit automatically.</p>
          </div>
       </div>

       <button 
         onClick={saveSettings}
         disabled={loading}
         className="w-full h-20 bg-brand text-white rounded-full text-xl font-bold hover:bg-[#6d1b1b] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-brand/20"
       >
         {loading ? <Loader2 className="animate-spin" /> : 'Save Global Settings'}
       </button>
    </div>
  );
}

function NotificationCenter({ users }: { users: any[] }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    if (!title || !message) return alert('Title and message are required');
    setLoading(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: target,
        title,
        message,
        type: 'info',
        read: false,
        createdAt: serverTimestamp()
      });
      alert(`Broadcast sent successfully to ${target === 'all' ? 'everyone' : 'selected user'}`);
      setTitle(''); setMessage('');
    } catch (err: any) { 
      console.error('Notification failed:', err);
      alert(`Failed to send: ${err.message}`); 
    }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl space-y-6">
       <div className="space-y-4">
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-400 ml-1">Title</label>
             <input value={title} onChange={e => setTitle(e.target.value)} className="w-full h-12 px-6 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white font-bold text-sm" />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-400 ml-1">Message</label>
             <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full h-32 p-6 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:bg-white font-medium text-sm italic" />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-400 ml-1">Target Audience</label>
             <select value={target} onChange={e => setTarget(e.target.value)} className="w-full h-12 px-6 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white font-bold text-sm appearance-none">
                <option value="all">Broadcast to All Users</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>)}
             </select>
          </div>
       </div>

       <button 
         onClick={sendNotification}
         disabled={loading}
         className="w-full h-14 bg-brand text-white rounded-full text-base font-bold hover:bg-[#6d1b1b] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-brand/10"
       >
         {loading ? <Loader2 className="animate-spin" size={18} /> : 'Blast Notification'}
       </button>
    </div>
  );
}
