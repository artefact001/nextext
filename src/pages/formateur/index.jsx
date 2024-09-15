// pages/admins/index.jsx

import ButtonDeconnexion from '../../components/common/ButtonDeconnexion';
import { useAuthToken } from '../../lib/utils/token';

const DashboardFormateur = () => {
  // Vérifie si l'utilisateur est connecté
  useAuthToken();

  return (
    <div>
      <h1>Tableau de Bord Formateur</h1>
      <p>Bienvenue sur la page protégée du tableau de bord.</p>
      {/* Bouton de déconnexion */}
      <ButtonDeconnexion></ButtonDeconnexion>
    </div>
  );
};

export default DashboardFormateur;
