import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../../lib/utils/api';
import { FaSignOutAlt } from 'react-icons/fa'; // Import de l'icône Font Awesome

const ButtonDeconnexion = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      setIsLoading(true);
      setError('');
      try {
        await api('logout', 'POST');
        localStorage.removeItem('token');
        router.push('/connexion');
      } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
        setError('Une erreur est survenue lors de la déconnexion. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
      >
        <FaSignOutAlt className="h-5 w-5" /> {/* Icône de déconnexion */}
        <span>{isLoading ? 'Déconnexion en cours...' : ''}</span>
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ButtonDeconnexion;
