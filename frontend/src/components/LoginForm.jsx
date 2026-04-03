import React from 'react';
import { Target, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export const LoginForm = ({ onRouteChange }) => {
  const { isLoading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      // 🔥 REAL GOOGLE OAUTH REDIRECT
      window.location.href = "http://localhost:8000/auth/login";
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-700/50 text-center">
          
          <div className="relative mx-auto w-20 h-20 mb-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl"
            />
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-2xl">
              <Target className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
            AuraXam <span className="text-blue-600">Elite</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 px-4">
            The professional arena for technical mastery. Access your dashboard in one click.
          </p>

          <div className="space-y-4">
            <motion.button
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="group w-full relative flex items-center justify-center py-4 px-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
            >
              <div className="absolute left-6 bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              
              <span className="text-gray-700 dark:text-gray-200 font-bold text-lg">
                Continue with Google
              </span>

              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                className="absolute right-6"
              >
                <ChevronRight className="w-5 h-5 text-blue-500" />
              </motion.div>
            </motion.button>

            <div className="pt-6 flex items-center justify-center space-x-6 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
              <span className="flex items-center">
                <Zap className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" /> 
                Secure SSO
              </span>
              <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <span>Elite Access</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600 font-medium">
            Protected by AuraXam Guard &copy; 2026. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
