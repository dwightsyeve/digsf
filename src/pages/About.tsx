import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-bold text-gray-900">About Us</h1>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6 text-gray-600 leading-relaxed text-lg"
      >
        <p>
          At PrimeInvest, we are dedicated to revolutionizing the way you invest in the digital age. We understand the importance of security, trust, and growth when it comes to your financial future.
        </p>
        <p>
          Our platform is designed to provide you with a safe and reliable environment to grow your wealth. With advanced technology and stringent security measures, we ensure that your investments are protected against potential risks and threats.
        </p>
        <p>
          At the core of PrimeInvest, we believe in empowering our users with the tools and knowledge they need to make informed investment decisions. Our team of experts is committed to providing you with comprehensive resources, market insights, and personalized guidance to help you navigate the world of digital investments.
        </p>
        <p>
          We embrace innovation and leverage the power of emerging technologies to bring you a seamless investment experience. Our user-friendly interface allows you to access your portfolio, monitor performance, and execute transactions with ease, giving you full control over your financial journey.
        </p>
        <p>
          Transparency and integrity are the pillars of our operation. We prioritize open and honest communication, ensuring that you have a clear understanding of our investment strategies, fees, and the potential risks involved. Your trust is of utmost importance to us, and we work tirelessly to maintain the highest standards of professionalism and ethics.
        </p>
        <p>
          Join us at PrimeInvest and embark on a journey towards a digitally safe and prosperous future. Experience the peace of mind that comes from investing with a platform that prioritizes your security, growth, and financial well-being. Together, let's unlock the endless possibilities of digital investments and build a brighter tomorrow.
        </p>
      </motion.div>
    </div>
  );
}
