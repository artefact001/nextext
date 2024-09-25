import React from 'react';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';
import { Center, Image, Spinner, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import ProfileCardAdministrateur from '../../components/layout/admin/Navbar';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch QR Code');
  return res.blob();
});

const AdminPage = () => {
  const { user, loading } = useUserWithRoles(['Administrateur']);
  
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

  //
  return (
    <Center display="block">
      {/* ProfileCard */}
      <ProfileCardAdministrateur />

    
    </Center>
  );
};

export default AdminPage;
