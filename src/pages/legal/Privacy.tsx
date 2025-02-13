import React from 'react';
import { Shield } from 'lucide-react';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-red-600" />
        <h1 className="text-4xl font-bold">
          <span className="text-white">Politique de</span>
          <span className="ml-2 text-red-600">Confidentialité</span>
        </h1>
      </div>

      <section className="prose prose-invert max-w-none">
        <h2>1. Collecte des données</h2>
        <p>
          Nous collectons les informations suivantes :
        </p>
        <ul>
          <li>Informations de compte (email, nom d'utilisateur)</li>
          <li>Préférences de visionnage</li>
          <li>Historique de navigation</li>
          <li>Données techniques (adresse IP, type de navigateur)</li>
        </ul>

        <h2>2. Utilisation des données</h2>
        <p>
          Nous utilisons vos données pour :
        </p>
        <ul>
          <li>Personnaliser votre expérience</li>
          <li>Améliorer notre service</li>
          <li>Communiquer avec vous</li>
          <li>Assurer la sécurité de votre compte</li>
        </ul>

        <h2>3. Protection des données</h2>
        <p>
          Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisée.
        </p>

        <h2>4. Cookies</h2>
        <p>
          Nous utilisons des cookies pour :
        </p>
        <ul>
          <li>Maintenir votre session</li>
          <li>Mémoriser vos préférences</li>
          <li>Analyser l'utilisation du service</li>
          <li>Personnaliser le contenu</li>
        </ul>

        <h2>5. Partage des données</h2>
        <p>
          Nous ne vendons pas vos données personnelles. Nous pouvons partager certaines informations avec :
        </p>
        <ul>
          <li>Nos prestataires de services</li>
          <li>Les autorités légales si requis</li>
          <li>Nos partenaires avec votre consentement</li>
        </ul>

        <h2>6. Vos droits</h2>
        <p>
          Vous avez le droit de :
        </p>
        <ul>
          <li>Accéder à vos données</li>
          <li>Rectifier vos informations</li>
          <li>Supprimer votre compte</li>
          <li>Retirer votre consentement</li>
          <li>Exporter vos données</li>
        </ul>

        <h2>7. Contact</h2>
        <p>
          Pour toute question concernant vos données personnelles, contactez notre délégué à la protection des données : privacy@miraustream.com
        </p>

        <div className="mt-8 p-4 bg-red-600/10 rounded-lg">
          <p className="text-sm text-gray-300">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </section>
    </div>
  );
}