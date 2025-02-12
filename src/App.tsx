import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { SiteHeader } from './components/SiteHeader';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { TVShows } from './pages/TVShows';
import { Details } from './pages/Details';
import { Favorites } from './pages/Favorites';
import { Upcoming } from './pages/Upcoming';
import { History } from './pages/History';
import { Actors } from './pages/Actors';
import { useStore } from './store/useStore';

export default function App() {
  const { isSidebarExpanded } = useStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <SiteHeader />
        <div className="flex pt-16">
          <Navigation />
          <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv" element={<TVShows />} />
                <Route path="/actors" element={<Actors />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/upcoming" element={<Upcoming />} />
                <Route path="/history" element={<History />} />
                <Route path="/:mediaType/:id" element={<Details />} />
              </Routes>
            </div>
          </main>
        </div>
        <ScrollToTop />
      </div>
    </BrowserRouter>
  );
}