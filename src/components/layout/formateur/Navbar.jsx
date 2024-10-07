import React, { useMemo } from 'react';
import {
  Box,
  Center,
  Text,
  Flex,
  useBreakpointValue,
  Spinner,
} from '@chakra-ui/react';
import { FaUserAlt, FaQrcode, FaHistory } from 'react-icons/fa';
import { FaUsersLine } from 'react-icons/fa6';

import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';
import { getUserWithRoles } from '../../../lib/utils/checkRole';
import ThemeToggleButton from '../DarkMode';
import ButtonDeconnexion from '../../common/ButtonDeconnexion';
import Link from 'next/link';
import { useRouter } from 'next/router';

// eslint-disable-next-line react/display-name
const ProfileCardFormateur = React.memo(() => {
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const iconSize = useBreakpointValue({ base: '20px', md: '30px' });
  const { roles, user, loading } = useUserWithRoles(['Formateur']);

  const fullName = useMemo(
    () => (user ? `${user.prenom} ${user.nom}` : ''),
    [user]
  );

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center h="100vh">
        <Text>Une erreur est survenue. Veuillez vous reconnecter.</Text>
      </Center>
    );
  }

  return (
    <Box
      bg="#CE0033"
      roundedBottomEnd="3xl"
      roundedBottomStart="3xl"
      width="100%"
      px={{ base: '5%', lg: '25%' }}
      shadow="lg"
      textAlign="center"
    >

      <Flex
        justify="space-between"
        align="center"
        bg="black"
        width="100%"
        rounded="xl"
        py={2}
        px={{ base: '10%', md: '40px', lg: '80px' }}
        color="white"
        shadow="lg"
        border="2px solid #CE0033"
      >
        <NavLink
          href="/formateur/profile"
          icon={FaUserAlt}
          label="Profile"
          iconSize={iconSize}
          buttonSize={buttonSize}
        />
        <NavLink
          href="/formateur"
          icon={FaQrcode}
          label="QR Code"
          iconSize={iconSize}
        />
        <NavLink
          href="/formateur/promos"
          icon={FaUsersLine}
          label="Promos"
          iconSize={iconSize}
          buttonSize={buttonSize}
          _active={{
            bg: '#CE0033',
            color: 'white',
          }}
        />
        <NavLink
          href="/formateur/mesPointages"
          icon={FaHistory}
          label="Historique"
          iconSize={iconSize}
          buttonSize={buttonSize}
        />
      </Flex>

      <Center mt={4}>
      <Box mt={4}>
      <ThemeToggleButton />
      </Box>
        <Box color="white" px={20}>
          <Text fontSize={{ base: '20px', lg: '35px' }} fontWeight="bold">
            {fullName}
          </Text>
          {roles.length > 0 && <Text> {roles.join(', ')}</Text>}{' '}
        </Box>
        <Box mt={4}>
          <ButtonDeconnexion />
        </Box>
      </Center>

      <Center mt={4}>
        <Box w="14" h="1" bg="#CE0033" rounded="full" />
      </Center>
    </Box>
  );
});


const NavLink = ({ href, icon: Icon, label, iconSize, buttonSize }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} passHref>
      <Flex
        color={isActive ? '#CE0033' : 'white'} // Active link color
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontSize={buttonSize}
        // bg={isActive ? 'white' : 'transparent'} // Active background color
        borderRadius="md"
        _hover={{
          bg: 'gray.700',
          color: '#CE0033',
        }}
      >
        <Icon size={iconSize} />
        <Text mt={2}>{label}</Text>
      </Flex>
    </Link>
  );
};



export async function getServerSideProps(context) {
  const result = await getUserWithRoles(context, ['Formateur']);
  console.log('Server-side props:', result);
  return result;
}

export default ProfileCardFormateur;
