import React from 'react';
import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-500">Effective Date: {new Date().toLocaleDateString()}</p>
      </motion.div>
      <div className="space-y-6 text-gray-600 prose prose-brand max-w-none">
        <p>At PrimeInvest, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information Collection</h2>
        <p>We collect information you provide directly to us when you create an account, make transactions, or communicate with us.</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Use of Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
        <p>We implement reasonable security measures to protect your personal information from unauthorized access or disclosure.</p>
      </div>
    </div>
  );
}
