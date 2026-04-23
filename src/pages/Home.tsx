import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Smartphone, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-32 pb-16 md:pb-32">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-16 flex flex-col lg:flex-row items-center gap-10 md:gap-20">
        <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-gray-900 tracking-tight">
            The Secure Way to <span className="text-brand">Grow Your Wealth</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            DigiSafe provides professional-grade asset management and high-yield investment opportunities with bank-level security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto lg:mx-0">
            <div className="relative flex-1">
              <input 
                type="email" 
                placeholder="Email address" 
                className="input-pill h-14 md:h-16"
              />
              <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-gray-400">
                 <Smartphone className="w-5 h-5" />
              </div>
            </div>
            <button className="btn-brand h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl shadow-2xl">
              Get Started
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-sm lg:max-w-md mx-auto">
          <div className="bg-brand rounded-[40px] md:rounded-[60px] p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-8 shadow-inner aspect-[9/16] relative overflow-hidden">
               <div className="space-y-6">
                  <header className="flex justify-between items-center text-black">
                     <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-black rounded-full" /><div className="w-1.5 h-1.5 bg-black rounded-full" /></div>
                     <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-brand rounded-md flex items-center justify-center text-white scale-75">
                          <ShieldCheck size={14} />
                        </div>
                        <p className="text-sm font-black tracking-tight">Digi<span className="text-brand">Safe</span></p>
                     </div>
                     <div className="w-7 h-7 rounded-full border-2 border-gray-100 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="User" />
                     </div>
                  </header>

                  <div className="space-y-4">
                    <div className="space-y-1">
                       <h3 className="text-xl font-bold text-black">Hey, Jimmy</h3>
                       <div className="w-full h-1.5 bg-gray-50 rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-white">
                       <div className="bg-brand p-3 rounded-2xl">
                          <p className="text-[6px] opacity-70 mb-0.5 font-bold">Payout</p>
                          <p className="text-sm font-bold">$50K</p>
                       </div>
                       <div className="bg-white border border-brand p-3 rounded-2xl text-brand">
                          <p className="text-[6px] opacity-70 mb-0.5 font-bold">Profit</p>
                          <p className="text-sm font-bold">$10K</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-brand text-white py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          <Stat value="$1.2B+" label="Managed" />
          <Stat value="500K+" label="Investors" />
          <Stat value="99.9%" label="Uptime" />
          <Stat value="24/7" label="Support" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 md:space-y-24">
        <div className="text-center space-y-4 md:space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tight">Grow Your Wealth Safely</h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto font-medium">
            DigiSafe provides tools that give you more control over your money.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-12">
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 md:w-10 md:h-10" />}
            title="Secure Tech"
            description="Bank-grade encryption and multi-factor authentication to keep your assets protected."
          />
          <FeatureCard 
            icon={<TrendingUp className="w-8 h-8 md:w-10 md:h-10" />}
            title="Real-time Analytics"
            description="Detailed insights into your portfolio's performance with interactive charts and alerts."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 md:w-10 md:h-10" />}
            title="Expert Support"
            description="Access to financial advisors who can help you optimize your strategy."
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-1">
      <p className="text-2xl md:text-5xl font-bold">{value}</p>
      <p className="text-brand-muted text-[10px] md:text-sm font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 md:p-12 bg-white rounded-[32px] md:rounded-[50px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-brand-muted text-brand flex items-center justify-center mb-6 md:mb-8 group-hover:bg-brand group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl md:text-3xl font-bold text-black mb-3 md:mb-4">{title}</h3>
      <p className="text-sm md:text-lg text-gray-400 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

