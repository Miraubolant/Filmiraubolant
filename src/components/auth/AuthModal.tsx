import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, ToggleLeft as Google, Film } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'authentification
    console.log({ email, password, name });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#141414] w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
          >
            {/* En-tête */}
            <div className="relative h-32 bg-gradient-to-br from-red-600 to-red-800">
              {/* Logo et titre */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 mb-2">
                  <div className="absolute inset-0 bg-red-600/20 rounded-xl blur-xl transform scale-150"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg transform rotate-45 scale-75"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-red-700 rounded-xl shadow-lg transform -rotate-45 scale-75"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl shadow-lg">
                    <div className="absolute inset-0.5 bg-[#141414] rounded-[10px]"></div>
                  </div>
                  <Film className="absolute inset-0 w-8 h-8 m-auto text-red-500 drop-shadow-lg" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-black text-white font-outfit tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    Mirau
                  </span>
                  <span className="text-3xl font-black text-red-600 font-outfit tracking-tight">
                    Stream
                  </span>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="px-6 pt-8">
              <h2 className="text-2xl font-bold text-center mb-2">
                {isLogin ? 'Connexion' : 'Inscription'}
              </h2>
              <p className="text-gray-400 text-center mb-8">
                {isLogin
                  ? 'Connectez-vous pour accéder à votre compte'
                  : 'Créez votre compte pour commencer'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nom complet"
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 text-white placeholder-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-colors relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLogin ? 'Se connecter' : 'S\'inscrire'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#141414] text-gray-400 text-sm">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Google className="w-5 h-5" />
                  <span>Google</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>Github</span>
                </motion.button>
              </div>
            </div>

            {/* Pied de page */}
            <div className="px-6 py-4 bg-gray-900/50 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                {isLogin
                  ? 'Pas encore de compte ? S\'inscrire'
                  : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}