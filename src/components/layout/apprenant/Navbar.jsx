import React, { useMemo } from 'react';
import { Box, Center, Text, Flex, useBreakpointValue, Spinner } from '@chakra-ui/react';
import { FaUserAlt, FaQrcode, FaHistory } from 'react-icons/fa';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';
import { getUserWithRoles } from '../../../lib/utils/checkRole';
import ThemeToggleButton from '../DarkMode';
import ButtonDeconnexion from '../../common/ButtonDeconnexion';
import Link from 'next/link';
import { useRouter } from 'next/router';

// eslint-disable-next-line react/display-name
const ProfileCardApprenant = React.memo(() => {
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const iconSize = useBreakpointValue({ base: '20px', md: '30px' });
  const { roles, user, loading } = useUserWithRoles(['Apprenant']);

  const fullName = useMemo(() => (user ? `${user.prenom} ${user.nom}` : ''), [user]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  if (!user) {
    return <p>Une erreur est survenue. Veuillez vous reconnecter.</p>;
  }

  return (
    <Box
      bg="#CE0033"
      roundedBottomEnd="3xl"
      roundedBottomStart="3xl"
      width="100%"
      px={{ base: '5%', md: '5%', lg: '25%' }}
      shadow="lg"
      textAlign="center"
      pt={12}

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
        <NavLink href="/apprenant/profile" icon={FaUserAlt} label="Profile" iconSize={iconSize} buttonSize={buttonSize} />
        <NavLink href="/apprenant" icon={FaQrcode} label="QR Code" iconSize={iconSize} />
        <NavLink href="/apprenant/mesPointages" icon={FaHistory} label="Historique" iconSize={iconSize} buttonSize={buttonSize} />
      </Flex>

      <Center display='flex' mt={4} textAlign="center">
      <Box mt={4}>
      <ThemeToggleButton />
      </Box>
        <Box color="white" px={{ base: '8px',md: '10px', lg: '140px' }}>
          <Text fontSize={{ base: '20px', md: '20px', lg: '35px' }} fontWeight="bold">{fullName}</Text>
          {roles.length > 0 && <Text>{roles.join(', ')}</Text>}
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
        as="a"
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontSize={buttonSize}
        color={isActive ? '#CE0033' : 'white'}
        p={isActive ? 2 : 0}
        borderRadius={isActive ? 'md' : 'none'}
        transition="background-color 0.3s"
        _hover={{ bg: isActive ? undefined : 'rgba(255, 255, 255, 0.1)' }}
      >
        <Icon size={iconSize} />
        <Text mt={2}>{label}</Text>
      </Flex>
    </Link>
  );
};

export async function getServerSideProps(context) {
  const result = await getUserWithRoles(context, ['Apprenant']);
  console.log('Server-side props:', result);
  return result;
}

export default ProfileCardApprenant;
