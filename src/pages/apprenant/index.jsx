import React, { useEffect, useState } from 'react';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles'; // Assurez-vous que le chemin est correct
import { Center, Image } from '@chakra-ui/react';
// import ButtonDeconnexion from '../../components/common/ButtonDeconnexion';
import ProfileCard from '../../components/layout/apprenant/Navbar';

const ApprenantPage = () => {
  const { user, loading } = useUserWithRoles(['Apprenant']); // Spécifie ici les rôles requis
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
    <Center  display={'block'}> {/* Ensures full height centering and padding for mobile view */}
      {/* ProfileCard */}
        <ProfileCard />

      {/* ButtonDeconnexion */}

      {/* QR Code */}
      {error ? (
        <p>{error}</p>
      ) : qrCodeUrl ? (
        <Center mt={20} bg="white" p={4} borderRadius="md"> {/* Center the QR code in a nice box */}
          <Image
            src={qrCodeUrl}
            alt="QR Code"
            width={200} // Mobile size
            height={200}
            objectFit="contain"
          />
        </Center>
      ) : (
        <p>Chargement du QR Code...</p>
      )}

{/* <ButtonDeconnexion /> */}

  </Center>
  );
};

export default ApprenantPage;
