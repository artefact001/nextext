import {
  Box,
  Button,
  Center,
  Flex,
  SimpleGrid,
  Text,

} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import CardBox from '../../../components/common/Card';
import UserList from '../../../components/common/UserList';
import ProfileCardAdministrateur from '../../../components/layout/admin/Navbar';
import FormateurPromotions from '../../../components/common/FormateurPromotions';
import Link from 'next/link';
const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });

const AjouteFormateurPage = () => {

  const [filterType, setFilterType] = useState('Formateur');
  const [selectedFormateur, setSelectedFormateur] = useState(null); // État pour le formateur sélectionné

  // Récupération des formateurs
  const { data: formateursData, error: formateursError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/formateurs`,
    fetcher
  );

  const formateurs = formateursData ? formateursData.formateurs : [];

  // Filtrer les utilisateurs selon le rôle
  const filteredUsers = formateurs.filter((user) =>
    filterType === 'Formateur'
      ? user.role === 'Formateur'
      : user.role === 'ChefDeProjet'
  );
  const handleSelectFormateur = (formateur) => {
    setSelectedFormateur(formateur); // Met à jour le formateur sélectionné
  };
  useEffect(() => {
    console.log(selectedFormateur);
  }, [selectedFormateur]);

  if (formateursError) {
    return <p>Erreur lors de la récupération des formateurs.</p>;
  }
  // console.log(setSelectedFormateur())
  return (
    <Center  display={'block'}>
      <ProfileCardAdministrateur />

      <SimpleGrid
        mx={{ base: '2px', md: '13px', lg: '12px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={2}
      >
        <CardBox
        as="section"
       
        maxW={{ base: '366px', md: '100%', lg: '90%' }}
     
        display={{ base: 'block', md: 'block', lg: 'block' }}
      >
        
            {' '}

            <FormateurPromotions formateur={selectedFormateur} />
            {/* <FormateurPromotions formateur={selectedFormateur} isCompleted/> */}

        </CardBox>
        <CardBox>
          <Box position="relative" w="100%" h="14">
      {/* Rectangle de fond */}
      <Box
        position=""
        top="0"
        left="0"
        h="14"
        bg="gray.300"
        opacity="0.8"
        rounded="md"
        justifyContent="space-between"
        display="flex"
      >
        {/* Texte centré */}
        <Text
          textAlign="center"
          color="black"
          fontSize="lg"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          mx="auto"
          my="auto"
          fontFamily="'Nunito Sans', sans-serif"
          m
        >
          Personnels
        </Text>
        
        <Link                             
        href={`/admins/personnels/formateur`}
        mx={4} my={1}>
          <svg
            width="48"
            height="48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.8108 1.38174C19.5768 0.411166 28.4232 0.411166 37.1891 1.38174C42.0426 1.92574 45.9583 5.7479 46.5278 10.6184C47.5666 19.5094 47.5666 28.4911 46.5278 37.3821C45.9583 42.2526 42.0426 46.0747 37.1891 46.6187C28.4232 47.5893 19.5768 47.5893 10.8108 46.6187C5.95731 46.0747 2.04165 42.2526 1.47215 37.3821C0.433601 28.492 0.433601 19.5113 1.47215 10.6212C1.7602 8.25503 2.83889 6.05545 4.53337 4.37896C6.22786 2.70248 8.43884 1.64734 10.808 1.38457M24 9.8534C24.5636 9.8534 25.1041 10.0773 25.5026 10.4758C25.9011 10.8743 26.125 11.4148 26.125 11.9784V21.8752H36.0218C36.5854 21.8752 37.1259 22.0991 37.5244 22.4976C37.9229 22.8961 38.1468 23.4366 38.1468 24.0002C38.1468 24.5638 37.9229 25.1043 37.5244 25.5028C37.1259 25.9013 36.5854 26.1252 36.0218 26.1252H26.125V36.0221C26.125 36.5857 25.9011 37.1262 25.5026 37.5247C25.1041 37.9232 24.5636 38.1471 24 38.1471C23.4364 38.1471 22.8959 37.9232 22.4974 37.5247C22.0989 37.1262 21.875 36.5857 21.875 36.0221V26.1252H11.9781C11.4146 26.1252 10.8741 25.9013 10.4755 25.5028C10.077 25.1043 9.85315 24.5638 9.85315 24.0002C9.85315 23.4366 10.077 22.8961 10.4755 22.4976C10.8741 22.0991 11.4146 21.8752 11.9781 21.8752H21.875V11.9784C21.875 11.4148 22.0989 10.8743 22.4974 10.4758C22.8959 10.0773 23.4364 9.8534 24 9.8534Z"
              fill="#CE0033"
            />
          </svg>
        </Link>
        {/* Icon plus  */}
      </Box>
    </Box>
          <Flex
            flex="auto"
            gap={20}
            px={4}
            py={1.5}
            fontWeight="bold"
            justifyContent="space-between"
          >
            <Button
              px={{ base: 5, md: 10 }}
              py={5}
              fontSize="lg"
              color="white"
              bg={filterType === 'Formateur' ? '#ce0033' : 'gray.500'}
              borderRadius="md"
              onClick={() => setFilterType('Formateur')}
            >
              Formateurs
            </Button>
            <Button
              px={{ base: 5, md: 10 }}
              py={5}
              fontSize="lg"
              color="white"
              bg={filterType === 'ChefDeProjet' ? '#ce0033' : 'gray.500'}
              borderRadius="md"
              onClick={() => setFilterType('ChefDeProjet')}
            >
              Chefs de projet
            </Button>
          </Flex>

        
      
          <UserList
            users={filteredUsers}
            formateurs={formateurs}
            onSelectFormateur={handleSelectFormateur}
            filterType={filterType}
          />
        </CardBox>
      </SimpleGrid>
    </Center>
  );
};

export default AjouteFormateurPage;
