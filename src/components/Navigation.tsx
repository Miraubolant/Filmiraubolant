import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Calendar, Menu, Heart, History, Home, User, Tv, Users } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Navigation() {
  const location = useLocation();
  const { isSidebarExpanded, setIsSidebarExpanded } = useStore();

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

  return (
    <nav className={`fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 ${
      isSidebarExpanded ? 'w-64' : 'w-20'
    } bg-[#141414] border-r border-gray-800`}>
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

        {/* Créateur */}
        <div className="pt-4 border-t border-gray-800">
          <a
            href="https://miraubolant.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors group"
          >
            {isSidebarExpanded ? (
              <div className="text-center w-full">
                <span className="text-sm text-gray-400">
                  Créé avec ❤️ par Victor Mirault
                </span>
              </div>
            ) : (
              <div className="w-full text-center">
                <span className="text-red-600">❤️</span>
              </div>
            )}
          </a>
        </div>
      </div>
    </nav>
  );
}