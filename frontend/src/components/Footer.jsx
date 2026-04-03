import React from 'react';
import { Target, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Github, Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'New Exam', href: '#exam' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Badges', href: '#badges' }
  ];

  const supportLinks = [
    { label: 'Help Center', href: '#help' },
    { label: 'Documentation', href: '#docs' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact Us', href: '#contact' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'Security', href: '#security' }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#facebook' },
    { icon: Twitter, label: 'Twitter', href: '#twitter' },
    { icon: Linkedin, label: 'LinkedIn', href: '#linkedin' },
    { icon: Github, label: 'GitHub', href: '#github' }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AuraXam</h2>
                <p className="text-xs text-gray-500">Elite Access</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Your professional arena for technical mastery. Master exams, track progress, and achieve excellence with AuraXam Elite.
            </p>
            <div className="pt-4">
              <p className="text-xs font-semibold text-gray-400 mb-3">Follow Us</p>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:mr-3 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 group-hover:mr-3 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h3>
            <div className="space-y-4">
              <a href="mailto:support@auraxam.com" className="flex items-start space-x-3 group">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors">
                    support@auraxam.com
                  </p>
                </div>
              </a>

              <a href="tel:+919876543210" className="flex items-start space-x-3 group">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors">
                    +91 (987) 654-3210
                  </p>
                </div>
              </a>

              <a href="https://maps.google.com" className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors">
                    New Delhi, India
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start space-x-2">
              <span>&copy; {currentYear} AuraXam Elite. All rights reserved.</span>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by Team AuraXam</span>
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Accent Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <span className="inline-block w-1 h-1 bg-blue-500 rounded-full" />
            <span>Empowering learners worldwide</span>
            <span className="inline-block w-1 h-1 bg-blue-500 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
};
