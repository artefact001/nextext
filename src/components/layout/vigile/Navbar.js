import React from 'react';
import { Box, Center, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaUserAlt, FaQrcode, FaHistory } from 'react-icons/fa'; // Import des icônes
import Swal from 'sweetalert2'; // Import de SweetAlert

import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';
import { getUserWithRoles } from '../../../lib/utils/checkRole';
import ButtonDeconnexion from '../../common/ButtonDeconnexion';

const NavbarVigile = () => {
  const router = useRouter();
  const activeColor = '#CE0033'; // Couleur pour l'état actif
  const inactiveColor = useColorModeValue('gray.600', 'gray.400'); // Couleur pour l'état inactif selon le mode
  useUserWithRoles(['Vigile']);

  // Fonction pour afficher SweetAlert et rediriger selon le choix
  const handleOptionClick = () => {
    Swal.fire({
      title: 'Naviguer vers:',
      text: "Choisissez heure de pointage",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Arrivée',
      cancelButtonText: 'Départ',
    }).then((result) => {
      if (result.isConfirmed) {
        // Rediriger vers la page d'arrivée
        router.push('/vigile/pointages/arrivee');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Rediriger vers la page de départ
        router.push('/vigile/pointages/depart');
      }
    });
  };
   useUserWithRoles(['Vigile']); // Spécifie ici les rôles requis

  return (
    <Box
      position="fixed"
      bottom="0"
      borderRadius="xl"
      w="320px"
      mx="auto"
      left="50%"
      shadow="2xl"
      transform="translateX(-50%)"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        borderRadius="md"
        borderBottom="2px solid"
        fontFamily="Nunito Sans"
        borderColor="red.700"
        color="white"
        shadow="lg"
        px={4}
        py={3}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
      >
        {/* Lien vers l'option (avec SweetAlert) */}
        <Box
          as="button"
          size="sm"
          variant="ghost"
          _focus={{ outline: 'none' }}
          color={router.pathname === '/option' ? activeColor : inactiveColor}
          onClick={handleOptionClick} // Appelle la fonction quand l'utilisateur clique
        > <Box mt={4}>
        <ButtonDeconnexion />
      </Box>
          <Center flexDirection="column">
            <FaUserAlt size={30} />
            <Text mt={2}>Option</Text>
          </Center>
        </Box>

        {/* Lien vers le scanner */}
        <Box position="relative">
          <Link
            href="/vigile/scanner"
            size="sm"
            variant="ghost"
            _focus={{ outline: 'none' }}
          >
            <Center
              bg={router.pathname === '/vigile/scanner' ? activeColor : 'transparent'}
              p="3"
              borderRadius="full"
              shadow="md"
              flexDirection="column"
            >
              <FaQrcode 
                size={30} 
                color={router.pathname === '/vigile/scanner' ? 'white' : 'black'} 
              />
              <Text 
                color={router.pathname === '/vigile/scanner' ? 'white' : 'black'} 
                mt={2}
              >
                Scanner
              </Text>
            </Center>
          </Link>
        </Box>

        {/* Lien vers l'historique */}
        <Link
          href="/vigile/pointages"
          size="sm"
          variant="ghost"
          _focus={{ outline: 'none' }}
          color={router.pathname === '/vigile/pointages' ? activeColor : inactiveColor}
        >
          <Center flexDirection="column">
            <FaHistory size={30} />
            <Text mt={2}>Historique</Text>
          </Center>
        </Link>
      </Box>
    </Box>
  );
};
export async function getServerSideProps(context) {
  return await getUserWithRoles(context, ['Vigile']); // Spécifie ici les rôles requis
} 
export default NavbarVigile;
