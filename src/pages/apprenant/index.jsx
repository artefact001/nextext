import React, { useEffect, useState } from 'react';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles'; // Assurez-vous que le chemin est correct
import { Image } from '@chakra-ui/react';

const ApprenantPage = () => {
  const { user, roles, loading } = useUserWithRoles(['Apprenant']); // Spécifie ici les rôles requis
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchQRCode = async () => {
        try {
          // Correction de l'URL
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/qr/${user.matricule}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch QR Code');
          }
          const qrCodeBlob = await response.blob();
          const qrCodeUrl = URL.createObjectURL(qrCodeBlob);
          setQrCodeUrl(qrCodeUrl);
        } catch (err) {
          setError('Failed to load QR Code.');
          console.error('Error fetching QR Code:', err);
        }
      };

      fetchQRCode();
    }
  }, [user]);

  if (loading) {
    return <p>Chargement...</p>; // Afficher un message de chargement pendant la récupération des données
  }

  if (!user) {
    return <p>Une erreur est survenue. Veuillez vous reconnecter.</p>; // Gérer les cas où l'utilisateur n'est pas disponible
  }

  return (
    <div>
      <h1>Bienvenue, {user.nom}</h1>
      <p>Votre adresse e-mail est : {user.email}</p>
      {roles.length > 0 && <p>Vos rôles : {roles.join(', ')}</p>}
      {error ? (
        <p>{error}</p>
      ) : qrCodeUrl ? (
        <Image
          src={qrCodeUrl}
          alt="QR Code"
          width={200} // Remplacer par la largeur souhaitée
          height={200} // Remplacer par la hauteur souhaitée
        />
      ) : (
        <p>Chargement du QR Code...</p>
      )}
    </div>
  );
};

export default ApprenantPage;
