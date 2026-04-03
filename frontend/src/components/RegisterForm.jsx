import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Target, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const RegisterForm = ({ onRouteChange }) => {
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        onRouteChange('dashboard');
      } else {
        setErrors({ general: 'Registration failed. Try a different email.' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center py-12 px-4"
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800/50 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Start your journey to the top of the leaderboard.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <AnimatePresence>
            {errors.general && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 text-xs font-medium">
                {errors.general}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 outline-none transition-all ${errors.name ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
                  placeholder="Full Name"
                />
                {errors.name && <span className="text-[10px] text-red-500 ml-2">{errors.name}</span>}
              </div>

              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 outline-none transition-all ${errors.email ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
                  placeholder="Email Address"
                />
                {errors.email && <span className="text-[10px] text-red-500 ml-2">{errors.email}</span>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 outline-none transition-all ${errors.password ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
                  placeholder="Password (6+ chars)"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 outline-none transition-all ${errors.confirmPassword ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
                  placeholder="Confirm Password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formData.confirmPassword && (
                  <div className="absolute -right-7 top-1/2 -translate-y-1/2">
                    {formData.password === formData.confirmPassword ? 
                      <CheckCircle2 className="text-green-500 w-5 h-5" /> : 
                      <XCircle className="text-red-400 w-5 h-5" />
                    }
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span className="flex items-center justify-center">
              {isSubmitting || isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2 fill-current" />
                  Begin My Journey
                </>
              )}
            </span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onRouteChange('login')}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
            >
              Already an elite member? <span className="text-blue-600 font-bold">Sign In</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};