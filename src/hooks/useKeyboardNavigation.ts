import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Navigation avec les flèches
      if (e.key === 'ArrowLeft') {
        navigate(-1);
      } else if (e.key === 'ArrowRight') {
        navigate(1);
      }
      
      // Raccourcis clavier
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'f':
            e.preventDefault();
            document.querySelector<HTMLInputElement>('[placeholder*="Rechercher"]')?.focus();
            break;
          case 'k':
            e.preventDefault();
            document.querySelector<HTMLButtonElement>('[aria-label="Menu"]')?.click();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
}