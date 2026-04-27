import React from 'react';
import { motion } from 'motion/react';

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900">Help Center</h1>
        <p className="text-gray-500">How can we help you today?</p>
      </motion.div>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4">
          <h3 className="font-bold text-lg">Contact Support</h3>
          <p className="text-gray-500">If you need immediate assistance, please reach out to our team at support@primeinvest.com or visit the contact page.</p>
        </div>
        <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4">
          <h3 className="font-bold text-lg">Frequently Asked Questions</h3>
          <p className="text-gray-500">Check back soon! We are compiling a list of frequently asked questions to help you navigate our platform better.</p>
        </div>
      </div>
    </div>
  );
}
