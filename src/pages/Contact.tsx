import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'contact_inquiries'), {
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'new'
      });
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (e) { alert('Submission failed. Please try again.'); }
    finally { setSending(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 animate-fade-in min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight text-center">Get in Touch</h1>
      
      <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">Have questions or need support? Our specialized team is here to assist you with any inquiries regarding your digital assets.</p>
          </div>
          
          <div className="space-y-6">
            <ContactItem icon={<Phone />} label="Phone" value="+1 (555) 000-0000" />
            <ContactItem icon={<Mail />} label="Email" value="support@primeinvest.com" />
            <ContactItem icon={<MapPin />} label="Office" value="123 Investment Way, Silicon Valley, CA" />
          </div>
        </div>

        <div className="relative">
          {sent ? (
            <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-xl text-center space-y-4 animate-scale-in">
               <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} />
               </div>
               <h3 className="text-2xl font-bold text-black">Message Sent!</h3>
               <p className="text-gray-400 text-sm font-medium px-4">Thank you for reaching out. Our team will review your inquiry and get back to you shortly via email.</p>
               <button onClick={() => setSent(false)} className="text-brand font-bold text-sm hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                 <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input-pill h-11 text-sm font-semibold" 
                    type="text" 
                    placeholder="e.g. John Doe" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                 <input 
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="input-pill h-11 text-sm font-semibold" 
                    type="email" 
                    placeholder="e.g. john@example.com" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Message</label>
                 <textarea 
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full h-32 p-6 rounded-[24px] border border-gray-100 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all font-semibold text-sm text-gray-700 resize-none bg-gray-50/50" 
                    placeholder="How can we help?" 
                 />
               </div>
               <button 
                  disabled={sending}
                  className="btn-brand w-full h-14 text-sm font-black flex items-center justify-center gap-2"
               >
                  {sending ? <Loader2 className="animate-spin" size={18} /> : 'Send Message'}
               </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value }: any) {
  return (
    <div className="flex gap-4 items-center group">
      <div className="w-12 h-12 rounded-xl bg-brand-muted text-brand flex items-center justify-center transition-transform group-hover:scale-110">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-lg font-bold text-black">{value}</p>
      </div>
    </div>
  );
}
