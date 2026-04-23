import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import ChatBot from '../ChatBot';
import DepositModal from '../modals/DepositModal';
import { useAuth } from '../../context/AuthContext';

export default function Shell() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  
  // Dashboard-like routes where we want the sidebar
  const isDashboardRoute = ['/dashboard', '/invest', '/withdraw', '/settings', '/admin'].some(path => location.pathname.startsWith(path));
  const showSidebar = isAuthenticated && isDashboardRoute;

  useEffect(() => {
    const handleOpenDeposit = () => setIsDepositOpen(true);
    window.addEventListener('open-deposit-modal', handleOpenDeposit);
    return () => window.removeEventListener('open-deposit-modal', handleOpenDeposit);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />
      <div className="flex flex-1 relative">
        {showSidebar && <Sidebar />}
        <main className={`flex-grow ${showSidebar ? 'lg:pl-0' : ''}`}>
          <Outlet />
        </main>
      </div>
      {!showSidebar && <Footer />}
      <ChatBot />
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </div>
  );
}
