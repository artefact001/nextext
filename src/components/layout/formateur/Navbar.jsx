import React, { useMemo } from 'react';
import {
  Box,
  Center,
  Text,
  Flex,
  useBreakpointValue,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaUserAlt, FaQrcode, FaHistory,  FaUser } from 'react-icons/fa';
import { FaUsersLine } from 'react-icons/fa6';
import { IoSettingsOutline } from 'react-icons/io5';

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
  const isMobile = useBreakpointValue({ base: true, md: false }); // Nouveau point de rupture

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
      px={{ base: '5%', lg: '15%' }}
      shadow="lg"
      textAlign="center"
      pt={12}

    >

<Flex
        justify="space-between"
        align="center"
        width="100%"
        rounded="xl"
        py={2}
        px={{ base: '1%', md: '0px', lg: '10px' }}
      ><Flex
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
      <SimpleGrid
          overflow="hidden"
          columns={[3, 4]}
          spacingX={6}
          px={1}
          py={2}
          w="full"
          borderRadius="md"
          mt={{ base: 2.5, md: 0 }}
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
         </SimpleGrid>
      </Flex>
      {!isMobile && (
          <Flex
            ml={{ base: '0%', md: '20px', lg: '10%' }}
            mr={{ base: '0%', md: '20px', lg: '0%' }}
          >
            <Popover>
              <PopoverTrigger>
                <Button w="24" rounded="xl" h="24" bg="white">
                  <IoSettingsOutline size={32} />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>profile</PopoverHeader>
                <Flex p={4}>
                  <PopoverBody>
                    <ThemeToggleButton />
                  </PopoverBody>
                  <PopoverBody>
                    <ButtonDeconnexion />
                  </PopoverBody>
                </Flex>
              </PopoverContent>
            </Popover>
          </Flex>
        )}
      </Flex>

      {isMobile && (
        <Flex justify="center" mt={4} width="100%">
          {/* Affichage des boutons sur mobile en haut */}

          <Popover>
            <PopoverTrigger>
              <Button>
                <IoSettingsOutline />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>profile</PopoverHeader>
              <Flex p={4}>
                <NavLink
                  href="/formateur/profile"
                  icon={FaUser}
                  label="Profile"
                  iconSize={iconSize}
                  buttonSize={buttonSize}
                />

                <PopoverBody>
                  <ThemeToggleButton />
                </PopoverBody>
                <PopoverBody>
                  <ButtonDeconnexion />
                </PopoverBody>
                <PopoverBody>
                  <NavLink
                    href="/formateur/profile"
                    icon={FaUser}
                    iconSize={iconSize}
                    buttonSize={buttonSize}
                  />
                </PopoverBody>
              </Flex>
            </PopoverContent>
          </Popover>
        </Flex>
      )}
      <Center mt={4}>
      
        <Box color="white" px={{ base: '8px',md: '15px', lg: '90px' }}>
          <Text fontSize={{ base: '20px', lg: '35px' }} fontWeight="bold">
            {fullName}
          </Text>
          {roles.length > 0 && <Text> {roles.join(', ')}</Text>}{' '}
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
        color={isActive ? '#CE0033' : 'black'} // Active link color
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontSize={buttonSize}
        // bg={isActive ? 'white' : 'transparent'} // Active background color
        borderRadius="md"
        _hover={{
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
