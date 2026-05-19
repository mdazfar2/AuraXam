import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileSidebar } from './components/MobileSidebar';
import { Dashboard } from './components/Dashboard';
import { ExamConfig } from './components/ExamConfig';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { useAuth } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const { user, isLoading, handleGoogleCallback } = useAuth();

  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [currentExam, setCurrentExam] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🔥 GOOGLE CALLBACK HANDLE
  useEffect(() => {
    if (window.location.pathname === "/auth/callback") {
      handleGoogleCallback().then(() => {
        window.history.replaceState({}, document.title, "/");
      });
    }
  }, []);

  const handleRouteChange = (route) => {
    setCurrentRoute(route);
    setIsMobileMenuOpen(false);
  };

  const handleExamStart = (exam) => {
    setCurrentExam(exam);
    setCurrentRoute('exam');
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading AuraXam...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header 
          currentRoute={currentRoute} 
          onRouteChange={handleRouteChange}
        />
        
        <main className="pt-16 flex-grow">
          {currentRoute === 'login' && (
            <LoginForm onRouteChange={handleRouteChange} />
          )}
          {currentRoute === 'register' && (
            <RegisterForm onRouteChange={handleRouteChange} />
          )}
          {(currentRoute === 'dashboard' || currentRoute === 'exam-config' || currentRoute === 'analytics') && (
            <LoginForm onRouteChange={handleRouteChange} />
          )}
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header 
        currentRoute={currentRoute} 
        onRouteChange={handleRouteChange}
        onMenuToggle={handleMobileMenuToggle}
      />
      
      {/* 🌟 OLD MOBILE MENU REMOVED, SWAPPED IN YOUR COMPONENT HERE */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onRouteChange={handleRouteChange}
      />
      
      <main className="pt-16 flex-grow">
        {currentRoute === 'dashboard' && (
          <Dashboard onRouteChange={handleRouteChange} />
        )}
        
        {currentRoute === 'exam-config' && (
          <ExamConfig 
            onExamStart={handleExamStart}
            onRouteChange={handleRouteChange}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
      
      <main className="pt-16 flex-grow">
        {currentRoute === 'dashboard' && (
          <Dashboard onRouteChange={handleRouteChange} />
        )}
        
        {currentRoute === 'exam-config' && (
          <ExamConfig 
            onExamStart={handleExamStart}
            onRouteChange={handleRouteChange}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
