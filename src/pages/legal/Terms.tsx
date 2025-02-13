import React from 'react';
import { FileText } from 'lucide-react';

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-8 h-8 text-red-600" />
        <h1 className="text-4xl font-bold">
          <span className="text-white">Conditions</span>
          <span className="ml-2 text-red-600">d'utilisation</span>
        </h1>
      </div>

      <section className="prose prose-invert max-w-none">
        <h2>1. Acceptation des conditions</h2>
        <p>
          En accédant et en utilisant MirauStream, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
        </p>

        <h2>2. Description du service</h2>
        <p>
          MirauStream est un service de streaming qui permet aux utilisateurs de découvrir et de suivre des films et séries. Nous fournissons des informations sur le contenu disponible sur différentes plateformes de streaming.
        </p>

        <h2>3. Compte utilisateur</h2>
        <ul>
          <li>Vous devez avoir au moins 13 ans pour créer un compte.</li>
          <li>Vous êtes responsable de maintenir la confidentialité de votre compte.</li>
          <li>Vous acceptez de nous fournir des informations exactes et à jour.</li>
        </ul>

        <h2>4. Contenu</h2>
        <p>
          Le contenu affiché sur MirauStream est fourni à titre informatif uniquement. Nous ne stockons ni ne diffusons aucun contenu vidéo directement.
        </p>

        <h2>5. Propriété intellectuelle</h2>
        <p>
          Tous les droits de propriété intellectuelle relatifs au service et à son contenu appartiennent à MirauStream ou à ses partenaires.
        </p>

        <h2>6. Utilisation acceptable</h2>
        <p>
          Vous acceptez de ne pas :
        </p>
        <ul>
          <li>Utiliser le service de manière illégale</li>
          <li>Tenter de contourner nos mesures de sécurité</li>
          <li>Collecter des informations sur nos utilisateurs</li>
          <li>Perturber le fonctionnement du service</li>
        </ul>

        <h2>7. Modifications du service</h2>
        <p>
          Nous nous réservons le droit de modifier ou d'interrompre le service à tout moment, avec ou sans préavis.
        </p>

        <h2>8. Limitation de responsabilité</h2>
        <p>
          MirauStream n'est pas responsable des dommages directs, indirects, accessoires ou consécutifs résultant de votre utilisation du service.
        </p>

        <h2>9. Contact</h2>
        <p>
          Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à l'adresse : contact@miraustream.com
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