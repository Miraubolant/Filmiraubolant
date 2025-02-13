import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { TVShows } from './pages/TVShows';
import { Details } from './pages/Details';
import { Favorites } from './pages/Favorites';
import { Upcoming } from './pages/Upcoming';
import { History } from './pages/History';
import { Actors } from './pages/Actors';
import { Terms } from './pages/legal/Terms';
import { Privacy } from './pages/legal/Privacy';
import { About } from './pages/About';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/tv" element={<TVShows />} />
      <Route path="/actors" element={<Actors />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/upcoming" element={<Upcoming />} />
      <Route path="/history" element={<History />} />
      <Route path="/:mediaType/:id" element={<Details />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}