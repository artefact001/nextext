import React from 'react';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';
import { Center, Image, Spinner, Text } from '@chakra-ui/react';
import ProfileCard from '../../components/layout/chefDeProjet/Navbar';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch QR Code');
  return res.blob();
});

const ChefDeProjetPage = () => {
  const { user, loading } = useUserWithRoles(['ChefDeProjet']);
  
  // Fetch QR code using SWR
  const { data: qrCodeBlob, error } = useSWR(
    user ? `${process.env.NEXT_PUBLIC_API_URL}/qr/${user.matricule}` : null,
    fetcher
  );

  // Handle loading state
  if (loading) {
    return (
      <Center>
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  // Handle user not available
  if (!user) {
    return <Text>Une erreur est survenue. Veuillez vous reconnecter.</Text>;
  }

  // Create a URL for the QR code blob
  const qrCodeUrl = qrCodeBlob ? URL.createObjectURL(qrCodeBlob) : null;

  return (
    <Center display="block">
      {/* ProfileCard */}
      <ProfileCard />

      {/* QR Code */}
      {error ? (
        <Text>{error.message}</Text>
      ) : qrCodeUrl ? (
        <Center mt={20} bg="white" p={4} borderRadius="md">
          <Image
            src={qrCodeUrl}
            alt="QR Code"
            width={200}
            height={200}
            objectFit="contain"
          />
        </Center>
      ) : (
<Center mt={20} flexDirection="column">
    <Spinner size="lg" color="red.500" />
    <Text mt={4} fontSize="lg" color="gray.600">
      Chargement du QR Code, veuillez patienter...
    </Text>
  </Center>      )}
    </Center>
  );
};

export default ChefDeProjetPage;
