
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NewOrder from '@/pages/NewOrder';
import PosScreen from '@/pages/PosScreen';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import './App.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { StoreProvider } from '@/context/StoreContext';
import { LanguageProvider } from '@/context/LanguageContext';
import ManagementDashboard from '@/pages/ManagementDashboard';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { isAuthenticated } from '@/lib/auth';

// Setup pages
import StoreSetupPage from '@/pages/setup/StoreSetupPage';
import BrandSetupPage from '@/pages/setup/BrandSetupPage';
import RegionSetupPage from '@/pages/setup/RegionSetupPage';
import StoreRegionLinkPage from '@/pages/setup/StoreRegionLinkPage';
import ItemSetupPage from '@/pages/setup/ItemSetupPage';
import UserSetupPage from '@/pages/setup/UserSetupPage';
import SecuritySetupPage from '@/pages/setup/SecuritySetupPage';
import LanguageSetupPage from '@/pages/setup/LanguageSetupPage';

// Simple auth route component to protect routes
const ProtectedRoute = ({ children }) => {
  // if (!isAuthenticated()) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return children;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <LanguageProvider>
        <StoreProvider>
          <Router>
            <div className="fixed top-4 right-4 z-50">
              <PWAInstallPrompt />
            </div>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/new-order" element={
                <ProtectedRoute>
                  <NewOrder />
                </ProtectedRoute>
              } />
              <Route path="/pos" element={
                <ProtectedRoute>
                  <PosScreen />
                </ProtectedRoute>
              } />
              <Route path="/management" element={
                <ProtectedRoute>
                  <ManagementDashboard />
                </ProtectedRoute>
              } />
              
              {/* Setup Routes */}
              <Route path="/setup/stores" element={
                <ProtectedRoute>
                  <StoreSetupPage />
                </ProtectedRoute>
              } />
              <Route path="/setup/brands" element={
                <ProtectedRoute>
                  <BrandSetupPage />
                </ProtectedRoute>
              } />
              <Route path="/setup/regions" element={
                <ProtectedRoute>
                  <RegionSetupPage />
                </ProtectedRoute>
              } />
              <Route path="/setup/store-regions" element={
                <ProtectedRoute>
                  <StoreRegionLinkPage />
                </ProtectedRoute>
              } />
              <Route path="/setup/items" element={
                <ProtectedRoute>
                  <ItemSetupPage />
                </ProtectedRoute>
              } />
              <Route path="/setup/users" element={
                <ProtectedRoute>
                  <UserSetupPage />
                </ProtectedRoute>
              } />
              <Route path="/setup/security" element={
                <ProtectedRoute>
                  <SecuritySetupPage />
                </ProtectedRoute>
              } />
              <Route path="/setup/language" element={
                <ProtectedRoute>
                  <LanguageSetupPage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster richColors position="top-right" />
          </Router>
        </StoreProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
