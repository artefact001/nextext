// src/components/common/ButtonDeconnexion/index.jsx
import { useRouter } from 'next/router';
import { api } from '../../../lib/utils/api';

const ButtonDeconnexion = () => {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      try {
        await api('logout', 'POST');
        localStorage.removeItem('token');
        router.push('/connexion');
      } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
      }
    }
  };

  return <button onClick={handleLogout}>Déconnexion</button>;
};

export default ButtonDeconnexion;
