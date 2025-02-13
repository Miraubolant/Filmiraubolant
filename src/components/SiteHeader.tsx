import React, { useState } from 'react';
import { Film, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AuthModal } from './auth/AuthModal';

export function SiteHeader() {
  const { isSidebarExpanded, setIsSidebarExpanded } = useStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#141414] border-b border-theme">
        <div className="h-full flex items-center">
          {/* Logo et titre (à gauche) */}
          <div className={`flex items-center h-full transition-all duration-300 ${
            isSidebarExpanded ? 'w-64' : 'w-20'
          } border-r border-theme md:block hidden`}>
            <motion.button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="flex items-center gap-4 px-4 h-full w-full hover:bg-gray-800/50 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="relative w-12 h-12"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-red-600/20 rounded-xl blur-xl transform scale-150"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg transform rotate-45 scale-75"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-red-700 rounded-xl shadow-lg transform -rotate-45 scale-75"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl shadow-lg">
                  <div className="absolute inset-0.5 bg-[#141414] rounded-[10px]"></div>
                </div>
                <Film className="absolute inset-0 w-7 h-7 m-auto text-red-500 drop-shadow-lg transform group-hover:scale-110 transition-transform" />
              </motion.div>

              {isSidebarExpanded && (
                <div className="flex items-baseline">
                  <span className="text-3xl font-black text-white font-outfit tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    Mirau
                  </span>
                  <span className="text-3xl font-black text-red-600 font-outfit tracking-tight">
                    Stream
                  </span>
                </div>
              )}
            </motion.button>
          </div>

          {/* Logo mobile */}
          <div className="md:hidden flex items-center px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-lg shadow-lg">
                  <div className="absolute inset-0.5 bg-[#141414] rounded-[7px]"></div>
                </div>
                <Film className="absolute inset-0 w-5 h-5 m-auto text-red-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-black text-white font-outfit tracking-tight">
                  Mirau
                </span>
                <span className="text-xl font-black text-red-600 font-outfit tracking-tight">
                  Stream
                </span>
              </div>
            </Link>
          </div>

          {/* Espace vide au milieu */}
          <div className="flex-1"></div>

          {/* Actions (à droite) */}
          <div className="flex items-center gap-4 px-6">
            <motion.button 
              className="p-2 text-gray-400 hover:text-white transition-colors relative group hidden sm:block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full transform scale-0 group-hover:scale-100 transition-transform"></span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-colors shadow-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <User className="w-5 h-5 relative z-10" />
              <span className="text-sm font-medium font-outfit relative z-10 hidden sm:block">Se connecter</span>
            </motion.button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}