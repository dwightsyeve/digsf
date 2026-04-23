import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, TrendingUp, Users, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-24 md:space-y-40 pb-24 md:pb-40 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 flex flex-col lg:flex-row items-center gap-16 md:gap-24 relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-[100px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-8 md:space-y-10 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/5 rounded-full text-brand text-xs font-black uppercase tracking-widest border border-brand/10">
             <ShieldCheck size={14} />
             <span>Institutional Grade Security</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] text-gray-900 tracking-tighter">
            The Secure Way to <br />
            <span className="text-brand">Grow Wealth</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Professional asset management for the digital era. Secure your legacy with our high-yield, bank-level vault technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto lg:mx-0">
            <Link to="/signup" className="btn-brand h-16 px-12 text-xl shadow-2xl shadow-brand/30 flex items-center justify-center gap-3 active:scale-95 transition-transform">
              <span>Start Investing</span>
              <ArrowRight size={24} />
            </Link>
            <Link to="/about" className="h-16 px-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-lg font-bold hover:bg-gray-50 transition-colors">
              Learn More
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
             </div>
             <p className="text-sm font-bold text-gray-400">Trusted by <span className="text-black">12,000+</span> elite investors</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative w-full max-w-lg mx-auto"
        >
          <div className="bg-brand rounded-[60px] md:rounded-[80px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
            <div className="bg-white rounded-[40px] md:rounded-[60px] p-8 md:p-10 shadow-inner aspect-[9/16] relative overflow-hidden backdrop-blur-3xl">
               <div className="space-y-8">
                  <header className="flex justify-between items-center text-black">
                     <div className="flex gap-1.5"><div className="w-2 h-2 bg-black/10 rounded-full" /><div className="w-2 h-2 bg-black/10 rounded-full" /></div>
                     <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-brand rounded-lg flex items-center justify-center text-white scale-90">
                          <ShieldCheck size={16} />
                        </div>
                        <p className="text-lg font-black tracking-tight">Prime<span className="text-brand">Invest</span></p>
                     </div>
                     <div className="w-10 h-10 rounded-full border-2 border-gray-50 overflow-hidden shadow-lg">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="User" />
                     </div>
                  </header>

                  <div className="space-y-8 pt-4">
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black text-black">Hello, Adrian</h3>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Portfolio Overview</p>
                    </div>

                    <div className="space-y-4">
                       <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                          <div className="flex justify-between items-end">
                             <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Balance</p>
                                <p className="text-4xl font-black text-black">$248,590</p>
                             </div>
                             <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-black">
                                +12.5%
                             </div>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-brand p-5 rounded-[28px] text-white shadow-xl shadow-brand/20">
                             <p className="text-[8px] opacity-70 mb-1 font-bold uppercase tracking-widest">Current Plan</p>
                             <p className="text-lg font-black">Premium Pro</p>
                          </div>
                          <div className="bg-white border-2 border-gray-50 p-5 rounded-[28px] text-black">
                             <p className="text-[8px] text-gray-400 mb-1 font-bold uppercase tracking-widest">Active Trades</p>
                             <p className="text-lg font-black text-brand">14 Active</p>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Stats */}
      <section className="bg-brand text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="grid grid-cols-10 h-full w-full">
              {Array.from({length: 100}).map((_, i) => (
                <div key={i} className="border border-white/20" />
              ))}
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24 text-center relative z-10">
          <Stat value="$1.2B+" label="Managed Assets" />
          <Stat value="500K+" label="Global Investors" />
          <Stat value="99.9%" label="Security Uptime" />
          <Stat value="24/7" label="Dedicated Support" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 md:space-y-24">
        <div className="text-center space-y-4 md:space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tight">Grow Your Wealth Safely</h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto font-medium">
            PrimeInvest provides institutional-grade tools that give you more control over your digital assets.
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

      {/* How it Works */}
      <section className="bg-gray-50 py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tight">Simple. Fast. <br />Professional.</h2>
              <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                Setting up your account takes less than 2 minutes. Start building your portfolio today with our automated investment strategies.
              </p>
            </div>

            <div className="space-y-8">
              <Step number="01" title="Create Account" description="Sign up with your email and verify your identity in seconds." />
              <Step number="02" title="Connect Assets" description="Transfer your digital assets or deposit funds securely." />
              <Step number="03" title="Start Growing" description="Choose a strategy and watch your wealth grow with real-time updates." />
            </div>

            <Link to="/signup" className="inline-flex items-center gap-3 text-xl font-bold text-brand group">
              <span>Open your account</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="relative">
             <div className="absolute -inset-20 bg-brand/5 rounded-full blur-3xl" />
             <div className="relative bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 rotate-2">
                <div className="aspect-square bg-gray-50 rounded-[32px] flex items-center justify-center overflow-hidden">
                   <img 
                      src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80" 
                      alt="Digital Security" 
                      className="w-full h-full object-cover"
                   />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-brand text-white p-6 rounded-[32px] shadow-2xl animate-bounce-slow">
                   <p className="text-4xl font-bold">24%</p>
                   <p className="text-xs font-bold uppercase tracking-widest opacity-80">Avg. Annual ROI</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center">
         <div className="bg-brand rounded-[60px] p-12 md:p-24 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative space-y-6">
              <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight">Ready to secure your <br />digital future?</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
                Join 500,000+ investors who trust PrimeInvest with their digital asset management.
              </p>
              <div className="pt-4">
                <Link to="/signup" className="inline-flex h-16 px-12 bg-white text-black rounded-full items-center justify-center text-xl font-black hover:scale-105 transition-transform shadow-2xl">
                  Get Started Now
                </Link>
              </div>
            </div>
         </div>
      </section>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6 items-start">
      <span className="text-4xl font-black text-brand/20 font-serif translate-y-[-10px]">{number}</span>
      <div className="space-y-1">
        <h4 className="text-xl font-bold text-black">{title}</h4>
        <p className="text-gray-400 font-medium leading-relaxed">{description}</p>
      </div>
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
