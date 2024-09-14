// pages/admins/index.jsx

import ButtonDeconnexion from '@components/common/ButtonDeconnexion';
import { useAuthToken } from '@utils/token';

const DashboardAdmin = () => {
  // Vérifie si l'utilisateur est connecté
  useAuthToken();

  return (
    <div>
      <h1>Tableau de Bord admin</h1>
      <p>Bienvenue sur la page protégée du tableau de bord.</p>
      {/* Bouton de déconnexion */}
      <ButtonDeconnexion></ButtonDeconnexion>
    </div>
  );
};

export default DashboardAdmin;
