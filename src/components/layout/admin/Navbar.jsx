import React, { useMemo } from 'react';
import { Box, Center, Text, Flex, useBreakpointValue, Spinner, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Button } from '@chakra-ui/react';
import { FaSchool, FaUsers, FaUser, FaUsersLine } from "react-icons/fa6";

import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';
import { getUserWithRoles } from '../../../lib/utils/checkRole';
import ThemeToggleButton from '../DarkMode';
import ButtonDeconnexion from '../../common/ButtonDeconnexion';
import Link from 'next/link';
import { useAuthToken } from '../../../lib/utils/token';
import { useRouter } from 'next/router';
import { MdDashboard } from "react-icons/md";
import { FaHome } from 'react-icons/fa';
import { IoSettingsOutline } from "react-icons/io5";
// eslint-disable-next-line react/display-name
const ProfileCardAdministrateur = React.memo(() => {
  useAuthToken();

  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const iconSize = useBreakpointValue({ base: '20px', md: '30px' });
  const isMobile = useBreakpointValue({ base: true, md: false }); // Nouveau point de rupture

  const {roles,  user, loading } = useUserWithRoles(['Administrateur']);

  const fullName = useMemo(() => (user ? `${user.prenom} ${user.nom}` : ''), [user]);

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
      px={{ base: '4%', lg: '25%' }}
      shadow="lg"
      pt={12}

      textAlign="center"
    >
  <Flex
        justify="space-between"
        align="center"
        bg="white"
        width="100%"
        rounded="xl"
        py={2}
        px={{ base: '10%', md: '40px', lg: '80px' }}
        color="white"
        shadow="lg"
        border="2px solid #CE0033"
      >
        <NavLink href="/admins/dashboard" icon={MdDashboard } label="Dashboard" iconSize={iconSize} buttonSize={buttonSize} />
        <NavLink href="/admins/" icon={FaHome } label="Home" iconSize={iconSize} buttonSize={buttonSize} />
        <NavLink href="/admins/promos" icon={FaUsersLine } label="Promos" iconSize={iconSize} buttonSize={buttonSize} />
        <NavLink href="/admins/personnels" icon={FaUsers} label="Personnels" iconSize={iconSize} />
        <NavLink href="/admins/formations" icon={FaSchool} label="Formation" iconSize={iconSize} buttonSize={buttonSize} />
      </Flex>
      <Center mt={4}>
      

        <Box color="white" px={{ base: '8px',md: '8px', lg: '180px' }}>
          <Text fontSize={{ base: '20px', lg: '35px' }} fontWeight="bold">{fullName}</Text>
          
          {roles.length > 0 &&

          <Text>       {roles.join(', ')}
          </Text>
          }
        </Box>
        
      <Popover>
  <PopoverTrigger>
    <Button><IoSettingsOutline /></Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverArrow />
    <PopoverCloseButton />
    <PopoverHeader>profile</PopoverHeader>
    <Flex p={4}>
    {/* <NavLink href="/admins/profile" icon={FaUser } label="Profile" iconSize={iconSize} buttonSize={buttonSize} /> */}

    <PopoverBody><ThemeToggleButton /></PopoverBody>
    <PopoverBody><ButtonDeconnexion /></PopoverBody>
    <PopoverBody><NavLink href="/admins/profile" icon={FaUser } iconSize={iconSize} buttonSize={buttonSize} /></PopoverBody>
    </Flex>
  </PopoverContent>
</Popover>
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
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontSize={buttonSize}
        color={isActive ? '#CE0033' : 'black'}  // Active state
        p={isActive ? 2 : 0}
        borderRadius={isActive ? 'md' : 'none'}
      >
        <Icon size={iconSize} />
        <Text mt={2}>{label}</Text>
      </Flex>
    </Link>
  );
};

export async function getServerSideProps(context) {
  const result = await getUserWithRoles(context, ['Administrateur']);
  console.log('Server-side props:', result);
  return result;
}

export default ProfileCardAdministrateur;
