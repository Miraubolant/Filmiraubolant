import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Calendar, Menu, Heart, History, Home, User, Tv, Users, Info, Shield, FileText, MoreVertical } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation() {
  const location = useLocation();
  const { isSidebarExpanded, setIsSidebarExpanded } = useStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuItems = [
    {
      title: "Explorer",
      items: [
        { to: "/", icon: Home, label: "Accueil", isActive: location.pathname === '/' },
        { to: "/movies", icon: Film, label: "Films", isActive: location.pathname === '/movies' },
        { to: "/tv", icon: Tv, label: "Séries", isActive: location.pathname === '/tv' },
        { to: "/actors", icon: Users, label: "Acteurs", isActive: location.pathname === '/actors' }
      ]
    },
    {
      title: "Bibliothèque",
      items: [
        { to: "/favorites", icon: Heart, label: "Favoris", isActive: location.pathname === '/favorites' },
        { to: "/history", icon: History, label: "Historique", isActive: location.pathname === '/history' },
        { to: "/upcoming", icon: Calendar, label: "À venir", isActive: location.pathname === '/upcoming' }
      ]
    }
  ];

  const legalItems = [
    { to: "/about", icon: Info, label: "À propos", isActive: location.pathname === '/about' },
    { to: "/legal/terms", icon: FileText, label: "CGU", isActive: location.pathname === '/legal/terms' },
    { to: "/legal/privacy", icon: Shield, label: "Confidentialité", isActive: location.pathname === '/legal/privacy' }
  ];

  // Version mobile : navigation fixe en bas
  const mobileNav = (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-theme z-40">
      <div className="grid grid-cols-5 gap-1 p-2">
        {/* Icônes principales */}
        {menuItems[0].items.slice(0, 4).map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              item.isActive
                ? 'text-red-600'
                : 'text-gray-400'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}

        {/* Menu déroulant */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
            showMobileMenu ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          <MoreVertical className="w-5 h-5" />
          <span className="text-xs">Plus</span>
        </button>
      </div>

      {/* Menu déroulant */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-full left-0 right-0 bg-[#141414] border-t border-theme overflow-hidden"
          >
            {/* Bibliothèque */}
            <div className="p-4 space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase px-2">
                Bibliothèque
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {menuItems[1].items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                      item.isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Liens légaux */}
            <div className="p-4 border-t border-theme space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase px-2">
                Informations
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {legalItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                      item.isActive
                        ? 'text-red-500'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs text-center">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Créateur */}
            <a
              href="https://miraubolant.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 text-center text-sm text-gray-500 border-t border-theme hover:bg-gray-800/50 transition-colors"
            >
              Créé avec <span className="text-red-500">❤️</span> par{' '}
              <span className="text-gray-300">Victor Mirault</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  // Version desktop : sidebar
  const desktopNav = (
    <nav className={`hidden md:block fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 ${
      isSidebarExpanded ? 'w-64' : 'w-20'
    } bg-[#141414] border-r border-theme`}>
      <div className="h-full flex flex-col p-4">
        {/* Menu sections */}
        <div className="flex-1 space-y-8">
          {menuItems.map((section, index) => (
            <div key={index} className="space-y-2">
              {isSidebarExpanded && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase px-4 mb-2">
                  {section.title}
                </h3>
              )}
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    item.isActive
                      ? 'bg-red-600 text-white'
                      : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.isActive ? 'text-white' : ''}`} />
                  {isSidebarExpanded && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Liens légaux et créateur */}
        <div className="pt-4 border-t border-theme space-y-2">
          {/* Liens légaux */}
          <div className="flex flex-col gap-1">
            {legalItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  item.isActive
                    ? 'text-red-500'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {isSidebarExpanded && (
                  <span className="text-sm">{item.label}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Créateur */}
          <a
            href="https://miraubolant.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 transition-colors group mt-4"
          >
            {isSidebarExpanded ? (
              <div className="text-center w-full">
                <span className="text-sm text-gray-500">
                  Créé avec <span className="text-red-500">❤️</span> par{' '}
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Victor Mirault
                  </span>
                </span>
              </div>
            ) : (
              <div className="w-full text-center">
                <span className="text-red-500">❤️</span>
              </div>
            )}
          </a>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {desktopNav}
      {mobileNav}
    </>
  );
}