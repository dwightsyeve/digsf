import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-24 space-y-24">
      <h1 className="text-7xl font-bold text-black tracking-tight text-center">Get in Touch</h1>
      
      <div className="grid lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Contact Information</h2>
            <p className="text-xl text-gray-400 font-medium">Have questions or need support? We're here to help.</p>
          </div>
          
          <div className="space-y-8">
            <ContactItem icon={<Phone />} label="Phone" value="+1 (555) 000-0000" />
            <ContactItem icon={<Mail />} label="Email" value="support@digisafe.com" />
            <ContactItem icon={<MapPin />} label="Office" value="123 Investment Way, Silicon Valley, CA" />
          </div>
        </div>

        <form className="space-y-6 bg-white p-12 rounded-[50px] border border-gray-100 shadow-xl">
           <input className="input-pill" type="text" placeholder="Full Name" />
           <input className="input-pill" type="email" placeholder="Email Address" />
           <textarea className="w-full h-40 p-8 rounded-[40px] border border-gray-200 outline-none focus:border-brand transition-all font-semibold text-gray-700 resize-none" placeholder="Your Message" />
           <button className="btn-brand w-full h-16 text-lg">Send Message</button>
        </form>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value }: any) {
  return (
    <div className="flex gap-6 items-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-muted text-brand flex items-center justify-center">
        {React.cloneElement(icon, { className: "w-8 h-8" })}
      </div>
      <div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">{label}</p>
        <p className="text-2xl font-bold text-black">{value}</p>
      </div>
    </div>
  );
}
