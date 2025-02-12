import React from 'react';
import { Film, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function SiteHeader() {
  const { isSidebarExpanded, setIsSidebarExpanded } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#141414] border-b border-gray-800">
      <div className="h-full flex items-center">
        {/* Logo et titre (à gauche) */}
        <div className={`flex items-center h-full transition-all duration-300 ${
          isSidebarExpanded ? 'w-64' : 'w-20'
        } border-r border-gray-800`}>
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="flex items-center gap-3 px-4 h-full w-full hover:bg-gray-800 transition-colors"
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-lg transform rotate-12"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg"></div>
              <Film className="absolute inset-0 w-5 h-5 m-auto text-white drop-shadow-lg" />
            </div>
            {isSidebarExpanded && (
              <span className="text-lg font-extrabold text-white font-outfit tracking-wide">
                Filmirault
              </span>
            )}
          </button>
        </div>

        {/* Espace vide au milieu */}
        <div className="flex-1"></div>

        {/* Actions (à droite) */}
        <div className="flex items-center gap-4 px-6">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-colors shadow-lg"
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-medium font-outfit">Se connecter</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}