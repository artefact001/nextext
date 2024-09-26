import {
  Button,
  Center,
  Flex,
  SimpleGrid,

} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import CardBox from '../../../components/common/Card';
import UserList from '../../../components/common/UserList';
import ProfileCardAdministrateur from '../../../components/layout/admin/Navbar';
import FormateurPromotions from '../../../components/common/FormateurPromotions';
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
    <Center bg="white" display={'block'}>
      <ProfileCardAdministrateur />

      <SimpleGrid
        mx={{ base: '2px', md: '13px', lg: '12px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={2}
      >
        <CardBox>
        
            {' '}

            <FormateurPromotions formateur={selectedFormateur} />
            {/* <FormateurPromotions formateur={selectedFormateur} isCompleted/> */}

        </CardBox>
        <CardBox>
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
