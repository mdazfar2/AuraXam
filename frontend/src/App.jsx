import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header 
          currentRoute={currentRoute} 
          onRouteChange={handleRouteChange}
        />
        
        <main className="pt-16">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        currentRoute={currentRoute} 
        onRouteChange={handleRouteChange}
        onMenuToggle={handleMobileMenuToggle}
      />
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              <button onClick={() => handleRouteChange('dashboard')} className="w-full text-left px-4 py-3 rounded-lg">
                Dashboard
              </button>
              <button onClick={() => handleRouteChange('exam-config')} className="w-full text-left px-4 py-3 rounded-lg">
                New Exam
              </button>
              <button onClick={() => handleRouteChange('analytics')} className="w-full text-left px-4 py-3 rounded-lg">
                Analytics
              </button>
            </nav>
          </div>
        </div>
      )}
      
      <main className="pt-16">
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
    </div>
  );
};

export default App;
