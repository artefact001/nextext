import React from 'react';
import { Box, Center, Text, Flex, useBreakpointValue, Link } from '@chakra-ui/react';
import { FaUserAlt, FaQrcode, FaHistory } from 'react-icons/fa';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';
import { getUserWithRoles } from '../../../lib/utils/checkRole';

const ProfileCard = () => {
  // Utilisation de valeurs réactives pour différentes tailles d'écran
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const iconSize = useBreakpointValue({ base: '20px', md: '30px' });
  const { user } = useUserWithRoles(['Apprenant']); // Spécifie ici les rôles requis
  if (!user) {
    return <p>Une erreur est survenue. Veuillez vous reconnecter.</p>; // Gérer les cas où l'utilisateur n'est pas disponible
  }
  return (
    <Box
      bg="#CE0033"
      roundedBottomEnd="3xl"
      roundedBottomStart="3xl"
      width={{ base: '100%', md: '400px' }}
      p={6}
      shadow="lg"
      textAlign="center"
    >
      {/* Top section with profile and history buttons */}
      <Flex justify="space-between" align="center" bg="black" rounded="xl" py={2} px={5} color="white"   shadow={'lg'}   border="2px solid #CE0033">
        <Link href='/apprenant/profile'
          color="white"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          variant="ghost"
          fontSize={buttonSize}
          _focus={{ outline: 'none' }}
        >
          <FaUserAlt size={iconSize} />
          <Text mt={2}>Profile</Text>
        </Link>

        <Center position="relative">
        <Link href='/apprenant'
          
            shadow="md"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <FaQrcode size={iconSize} />
            <Text mt={2}>QR Code</Text>
          </Link>
          {/* <Box
            position="absolute"
            inset="0"
            animation="pulse 2s infinite"
          /> */}
        </Center>

               <Link href='/apprenant/mesPointages'

          color="white"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          variant="ghost"
          fontSize={buttonSize}
          _focus={{ outline: 'none' }}
        >
          <FaHistory size={iconSize} />
          <Text mt={2}>Historique</Text>
        </Link>
      </Flex>

      {/* Name and ID */}
      <Box color="white" mt={12}>
        <Text fontSize="xl" fontWeight="bold">{user.prenom} {user.nom}</Text>
        <Text>#P7</Text>
      </Box>

      {/* QR Code (can be added later if needed) */}
    
      {/* Bottom Indicator */}
      <Center mt={2}>
        <Box w="14" h="1" bg="#CE0033" rounded="full" />
      </Center>
    </Box>
  );
};
export async function getServerSideProps(context) {
  return await getUserWithRoles(context, ['Apprenant']); // Spécifie ici les rôles requis
}
export default ProfileCard;
