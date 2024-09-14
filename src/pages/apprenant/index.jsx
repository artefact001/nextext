// pages/admins/index.jsx

import ButtonDeconnexion from '@components/common/ButtonDeconnexion';
import { useAuthToken } from '@utils/token';

const DashboardApprenant = () => {
  // Vérifie si l'utilisateur est connecté
  useAuthToken();

  return (
    <div>
      <h1>Tableau de Bord Apprenant</h1>
      <p>Bienvenue sur la page protégée du tableau de bord.</p>
      {/* Bouton de déconnexion */}
      <ButtonDeconnexion></ButtonDeconnexion>
    </div>
  );
};

export default DashboardApprenant;
