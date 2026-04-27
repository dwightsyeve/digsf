import React from 'react';
import { motion } from 'motion/react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>
        <p className="text-gray-500">Effective Date: {new Date().toLocaleDateString()}</p>
      </motion.div>
      <div className="space-y-6 text-gray-600 prose prose-brand max-w-none">
        <p>Welcome to PrimeInvest. By using our platform, you agree to these Terms & Conditions.</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using our services, you agree to be bound by these Terms and all applicable laws and regulations.</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Account Responsibilities</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Investment Risks</h2>
        <p>All investments carry risks. PrimeInvest does not guarantee returns on investments. Past performance is not indicative of future results.</p>
      </div>
    </div>
  );
}
