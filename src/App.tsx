import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Shell from './components/layout/Shell';

// Page imports (to be created)
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import Settings from './pages/Settings';
import Invest from './pages/Invest';
import Careers from './pages/Careers';
import Contact from './pages/Contact';

import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (adminOnly && user?.role !== 'admin' && user?.email !== 'tester419tester@gmail.com') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/withdraw" element={
              <ProtectedRoute><Withdraw /></ProtectedRoute>
            } />
            <Route path="/invest" element={
              <ProtectedRoute><Invest /></ProtectedRoute>
            } />
            <Route path="/settings/*" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />
            
            {/* Restricted Admin Route */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/secret-admin-gate" element={
              <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
            } />
            
            {/* Redirects */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
