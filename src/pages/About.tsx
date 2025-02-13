import React from 'react';
import { Info, Heart, Film, Users, Calendar, Star, Github, Mail, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export function About() {
  const features = [
    {
      icon: Film,
      title: 'Films & Séries',
      description: 'Découvrez les dernières sorties et les classiques du cinéma.'
    },
    {
      icon: Users,
      title: 'Acteurs',
      description: 'Explorez la filmographie de vos acteurs préférés.'
    },
    {
      icon: Calendar,
      title: 'Calendrier',
      description: 'Suivez les prochaines sorties et ne manquez aucun film.'
    },
    {
      icon: Heart,
      title: 'Favoris',
      description: 'Créez votre liste de films et séries à regarder.'
    }
  ];

  const stats = [
    { value: '100K+', label: 'Films & Séries' },
    { value: '50K+', label: 'Acteurs' },
    { value: '10K+', label: 'Utilisateurs' },
    { value: '4.9', label: 'Note moyenne', icon: Star }
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/victormirault' },
    { icon: Mail, label: 'Email', url: 'mailto:contact@miraustream.com' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/victormirault' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Info className="w-8 h-8 text-red-600" />
          <h1 className="text-4xl font-bold">
            <span className="text-white">À</span>
            <span className="ml-2 text-red-600">Propos</span>
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          MirauStream est votre compagnon ultime pour découvrir et suivre vos films et séries préférés. Notre mission est de rendre le streaming plus simple et plus agréable.
        </p>
      </div>

      {/* Fonctionnalités */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors"
          >
            <feature.icon className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Statistiques */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                {stat.value}
                {stat.icon && <stat.icon className="w-6 h-6 text-yellow-500" />}
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Créateur */}
      <section className="text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <img
            src=""
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute inset-0 rounded-full ring-2 ring-red-500"></div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Victor Mirault</h2>
          <p className="text-gray-400">Créateur & Développeur</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <link.icon className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
            </motion.a>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="text-center bg-red-600/10 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Une question ?</h2>
        <p className="text-gray-400 mb-6">
          N'hésitez pas à nous contacter pour toute question ou suggestion.
        </p>
        <motion.a
          href="mailto:contact@miraustream.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span>Nous contacter</span>
        </motion.a>
      </section>
    </div>
  );
}