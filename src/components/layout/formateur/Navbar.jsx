import React from 'react';
import { Box, Center, Text, Flex, useBreakpointValue, Link, HStack } from '@chakra-ui/react';
import { FaUserAlt, FaQrcode, FaHistory } from 'react-icons/fa';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';
import { getUserWithRoles } from '../../../lib/utils/checkRole';
import ThemeToggleButton from '../DarkMode';
import ButtonDeconnexion from '../../common/ButtonDeconnexion';

const ProfileCard = () => {
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const iconSize = useBreakpointValue({ base: '20px', md: '30px' });
  const { user } = useUserWithRoles(['Formateur']);
  
  if (!user) {
    return <p>Une erreur est survenue. Veuillez vous reconnecter.</p>;
  }

  return (
    <Box
      bg="#CE0033"
      roundedBottomEnd="3xl"
      roundedBottomStart="3xl"
      width={{ base: '100%', md: '100%', lg: '100%' }}
      px={{ base: '5%', md: '5%', lg: '25%' }} 
      shadow="lg"
      textAlign="center"
      justifyContent= "space-between"
      alignContent='center'    >
      <ThemeToggleButton />

      {/* Section de la barre noire */}
      <Flex 
        justify="space-between" 
        align="center" 
        bg="black" 
        width={{ base: '100%', md: '100%', lg: '100%' }} 
        rounded="xl" 
        py={2} 
        
        px={{ base: '10%', md: '40px', lg: '80px' }}  // Ajustement du padding horizontal
        color="white"   
        shadow="lg"   
        border="2px solid #CE0033"
      >
        {/* Lien vers le profil utilisateur */}
        <Link
          href='/formateur/profile'
          color="white"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          fontSize={buttonSize}
          _focus={{ outline: 'none' }}
        >
          <FaUserAlt size={iconSize} />
          <Text mt={2}>Profile</Text>
        </Link>

        {/* Lien vers le QR Code */}
        <Link
          href='/formateur'
          shadow="md"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <FaQrcode size={iconSize} />
          <Text mt={2}>QR Code</Text>
        </Link>

        {/* Lien vers l'historique */}
        <Link
          href='/formateur/mesPointages'
          color="white"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          fontSize={buttonSize}
          _focus={{ outline: 'none' }}
        >
          <FaHistory size={iconSize} />
          <Text mt={2}>Historique</Text>
        </Link>
      </Flex>

      {/* Nom et ID utilisateur */}
      <Center  display='flex' mt={4}  textAlign="center">
        <Box color="white" px={20 }>
          <Text fontSize={{ base: '20px', md: '20px', lg: '35px' }} fontWeight="bold">{user.prenom} {user.nom}</Text>
          <Text>#P7</Text>
        </Box>
        
        <Box  mt={4}>
          <ButtonDeconnexion />
        </Box>
      </Center>

      {/* Indicateur en bas */}
      <Center mt={4}>
        <Box w="14" h="1" bg="#CE0033" rounded="full" />
      </Center>
    </Box>
  );
};

// Fetching user data
export async function getServerSideProps(context) {
  return await getUserWithRoles(context, ['Formateur']);
}

export default ProfileCard;
