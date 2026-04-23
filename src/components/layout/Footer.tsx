import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-brand">PrimeInvest</h2>
          <p className="text-gray-500 max-w-sm text-sm">
            Empowering You to Build a Digitally Safe Investment Portfolio with PrimeInvest.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 uppercase">Products</h3>
            <ul className="space-y-2 text-gray-500">
              <li><Link to="/invest" className="hover:text-brand">Savings</Link></li>
              <li><Link to="/invest" className="hover:text-brand">Fixed Deposit</Link></li>
              <li><Link to="/invest" className="hover:text-brand">Mutual Funds</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 uppercase">Information</h3>
            <ul className="space-y-2 text-gray-500">
              <li><Link to="/about" className="hover:text-brand">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-brand">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-brand">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 uppercase">Resources</h3>
            <ul className="space-y-2 text-gray-500">
              <li><Link to="/help" className="hover:text-brand">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-brand">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="space-y-4 w-full md:w-auto">
          <h3 className="font-semibold text-gray-900 uppercase">Newsletter</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20 w-full md:w-48"
            />
            <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-hover transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <p>© 2026 PrimeInvest. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/admin-login" className="hover:text-brand transition-colors">Admin Login</Link>
          <Link to="/terms" className="hover:text-brand transition-colors">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
