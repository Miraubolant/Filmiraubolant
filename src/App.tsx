import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navigation } from './components/Navigation';
import { SiteHeader } from './components/SiteHeader';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { AppRoutes } from './routes';
import { useStore } from './store/useStore';

export default function App() {
  const { isSidebarExpanded } = useStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#141414] text-white font-outfit">
        <Helmet>
          <html lang="fr" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://miraustream.com" />
          <meta name="description" content="MirauStream vous permet de découvrir les derniers films et séries, de suivre vos acteurs préférés et de savoir où regarder vos contenus favoris en streaming." />
          <meta name="keywords" content="films, séries, streaming, acteurs, cinéma, VOD, Netflix, Disney+, Prime Video" />
          <meta name="author" content="Victor Mirault" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://miraustream.com/" />
          <meta property="og:title" content="MirauStream - Votre compagnon streaming" />
          <meta property="og:description" content="Découvrez où regarder vos films et séries préférés en streaming. Suivez les sorties et créez votre watchlist personnalisée." />
          <meta property="og:image" content="https://miraustream.com/og-image.jpg" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://miraustream.com/" />
          <meta property="twitter:title" content="MirauStream - Votre compagnon streaming" />
          <meta property="twitter:description" content="Découvrez où regarder vos films et séries préférés en streaming. Suivez les sorties et créez votre watchlist personnalisée." />
          <meta property="twitter:image" content="https://miraustream.com/og-image.jpg" />
        </Helmet>

        <SiteHeader />
        <div className="flex pt-16">
          <Navigation />
          <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'} pb-20 md:pb-8`}>
            <div className="container mx-auto px-4 py-8">
              <AppRoutes />
            </div>
          </main>
        </div>
        <ScrollToTop />
      </div>
    </BrowserRouter>
  );
}