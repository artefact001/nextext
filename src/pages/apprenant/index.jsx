import React, { useEffect, useState } from 'react';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';
import { Center, Image, Text, Spinner, Box, SimpleGrid } from '@chakra-ui/react';
import ProfileCard from '../../components/layout/apprenant/Navbar';

const ApprenantPage = () => {
  const { user, loading } = useUserWithRoles(['Apprenant']);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loadingQRCode, setLoadingQRCode] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchQRCode = async () => {
        try {
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
        } finally {
          setLoadingQRCode(false);
        }
      };

      fetchQRCode();
    }
  }, [user]);

  if (loading) {
    return <Text textAlign="center">Chargement...</Text>;
  }

  if (!user) {
    return <Text textAlign="center">Une erreur est survenue. Veuillez vous reconnecter.</Text>;
  }

  return (
    <Center display={'block'}>
      <ProfileCard />

       <SimpleGrid
        mx={{ base: '2px', md: '3px', lg: '12px' }}
        justifyContent="center"
        columns={[1]}
        spacing={8}
      >
        <Box
          as="section"
          px={{ base: '2px', md: '3px', lg: '20px' }}
          mx={{ base: '2px', md: '3px', lg: '10px' }}
          py={8}
          mt={7}
          w="full"
          maxW={{ base: '366px', md: '100%', lg: '100%' }}
        
          borderColor="red.700"
          borderRadius="md"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
          flex="2"
          >

        {loadingQRCode ? (
          <>
            <Spinner size="xl" color="red.500" />
            <Text mt={2}>Chargement du QR Code...</Text>
          </>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : qrCodeUrl ? (
          <Center mt={18} w='100%' bg="white" p={4} borderRadius="md">
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={240}
              height={240}
              objectFit="contain"
            />
          </Center>
        ) : (
          <Text>Aucun QR Code disponible.</Text>
        )}
      </Box>
      </SimpleGrid>
    </Center>
  );
};

export default ApprenantPage;
