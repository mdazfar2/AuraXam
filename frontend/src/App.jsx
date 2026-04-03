import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ExamConfig } from './components/ExamConfig';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { useAuth } from './contexts/AuthContext';

// Main App component that manages routing and global state
function App() {
  return (
    // Wrap entire app with theme and auth providers for global state management
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

// Inner app content component that has access to auth context
const AppContent = () => {
  // Get current user from authentication context
  const { user, isLoading } = useAuth();
  
  // Current route state management - determines which component to show
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  
  // Current exam state - holds exam data when user starts an exam
  const [currentExam, setCurrentExam] = useState(null);
  
  // Mobile menu state for responsive navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle route changes throughout the application
  const handleRouteChange = (route) => {
    console.log('Route changed to:', route);
    setCurrentRoute(route);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  // Handle exam start - called when user configures and starts an exam
  const handleExamStart = (exam) => {
    console.log('Starting exam:', exam.title);
    setCurrentExam(exam);
    setCurrentRoute('exam');
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          {/* Loading spinner with smooth animation */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading AuraXam...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login/register forms
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header for non-authenticated users */}
        <Header 
          currentRoute={currentRoute} 
          onRouteChange={handleRouteChange}
        />
        
        {/* Main content area for authentication forms */}
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

  // Main authenticated app layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with navigation for authenticated users */}
      <Header 
        currentRoute={currentRoute} 
        onRouteChange={handleRouteChange}
        onMenuToggle={handleMobileMenuToggle}
      />
      
      {/* Mobile menu overlay - shown on small screens when menu is open */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile menu panel */}
          <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              {/* Mobile navigation items */}
              <button
                onClick={() => handleRouteChange('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentRoute === 'dashboard'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleRouteChange('exam-config')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentRoute === 'exam-config'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                New Exam
              </button>
              <button
                onClick={() => handleRouteChange('analytics')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentRoute === 'analytics'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>
      )}
      
      {/* Main content area - renders different components based on current route */}
      <main className="pt-16">
        {/* Dashboard - shows user overview, recent activity, and quick actions */}
        {currentRoute === 'dashboard' && (
          <Dashboard onRouteChange={handleRouteChange} />
        )}
        
        {/* Exam Configuration - allows users to upload PDFs and configure exam settings */}
        {currentRoute === 'exam-config' && (
          <ExamConfig 
            onExamStart={handleExamStart}
            onRouteChange={handleRouteChange}
          />
        )}
        
        {/* Placeholder for other routes */}
        {currentRoute === 'exam' && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Exam Interface
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Exam interface will be implemented next
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Current exam: {currentExam?.title}
              </p>
            </div>
          </div>
        )}
        
        {currentRoute === 'analytics' && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Analytics Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Performance analytics will be implemented next
              </p>
            </div>
          </div>
        )}
        
        {currentRoute === 'profile' && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                User Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                User profile management will be implemented next
              </p>
            </div>
          </div>
        )}
        
        {currentRoute === 'results' && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Exam Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed exam results will be implemented next
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;