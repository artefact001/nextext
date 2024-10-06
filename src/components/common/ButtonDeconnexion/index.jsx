import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../../lib/utils/api';
import { FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ButtonDeconnexion = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    // Confirmation de déconnexion avec SweetAlert2
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      text: "Cette action vous déconnectera de votre session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnecter',
      confirmButtonColor: '#CE0033',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        setError('');
        try {
          // Appel de l'API pour la déconnexion
          await api('logout', 'POST');
          // Suppression du token
          localStorage.removeItem('token');
          // Redirection vers la page de connexion
          router.push('/connexion');
        } catch (error) {
          console.error('Erreur lors de la déconnexion', error);
          setError('Une erreur est survenue lors de la déconnexion. Veuillez réessayer.');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
      >
        <FaSignOutAlt className="h-5 w-5" /> {/* Icône de déconnexion */}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ButtonDeconnexion;
