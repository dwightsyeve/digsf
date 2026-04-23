import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight text-center">Get in Touch</h1>
      
      <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">Have questions or need support? Our specialized team is here to assist you with any inquiries regarding your digital assets.</p>
          </div>
          
          <div className="space-y-6">
            <ContactItem icon={<Phone />} label="Phone" value="+1 (555) 000-0000" />
            <ContactItem icon={<Mail />} label="Email" value="support@digisafe.com" />
            <ContactItem icon={<MapPin />} label="Office" value="123 Investment Way, Silicon Valley, CA" />
          </div>
        </div>

        <form className="space-y-4 bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50">
           <input className="input-pill h-11 text-sm font-semibold" type="text" placeholder="Full Name" />
           <input className="input-pill h-11 text-sm font-semibold" type="email" placeholder="Email Address" />
           <textarea className="w-full h-32 p-6 rounded-[24px] border border-gray-100 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all font-semibold text-sm text-gray-700 resize-none bg-gray-50/50" placeholder="Your Message" />
           <button className="btn-brand w-full h-11 text-sm">Send Message</button>
        </form>
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
