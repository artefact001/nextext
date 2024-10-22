/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';
import Link from 'next/link';
import useSWR from 'swr';
import ProfileCardAdministrateur from '../../components/layout/admin/Navbar';
import FormationCard from '../../components/func/admin/FormationCard';
import PromoCardAdmin from '../../components/func/admin/PromoCard';
import ListePointage from '../../components/func/vigile/ListePointage';

// Fetcher function for SWR
const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });

const AdminPage = () => {
  const { user, loading } = useUserWithRoles(['Administrateur']);
  const [selectedFormation, setSelectedFormation] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  // const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openModal = () => {
    console.log('Modal opened');
    setIsOpen(true);
  };

  // Fetch formations using SWR
  const { data: FormationsData, error: FormationsError } = useSWR(
    user ? `${process.env.NEXT_PUBLIC_API_URL}/formations` : null,
    fetcher
  );
  const formations = FormationsData ? FormationsData : [];
  console.log('Formations', formations);

  const handleSelectFormation = (formation) => {
    setSelectedFormation(formation);
    openModal();
  };

  useEffect(() => {
    console.log(selectedFormation);
  }, [selectedFormation]);

  if (FormationsError) {
    return <p>Erreur lors de la récupération des formateurs.</p>;
  }

  const { data: FabriquesData } = useSWR(
    user ? `${process.env.NEXT_PUBLIC_API_URL}/fabriques` : null,
    fetcher
  );
  const fabriques = FabriquesData ? FabriquesData : [];
  console.log('Fabriques', fabriques);

  const ITEMS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(fabriques.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedFabriques = fabriques.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const [pointages, setPointages] = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPointages = async () => {
      try {
        // Retrieve the token from localStorage or wherever it's stored
        const token = localStorage.getItem('token'); // Adjust this to how you're managing tokens

        // Fetch pointages with the token included in the headers
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pointages/aujourdhui/tous`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Erreur lors de la récupération des pointages.'
          );
        }

        setPointages(data.pointages);
        setLoadingP(false);
      } catch (error) {
        setError(error.message);
        setLoadingP(false);
      }
    };

    fetchPointages();
  }, []);

  if (loading) {
    return (
      <Center>
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }
  if (loadingP) {
    return (
      <Center>
        <Spinner size="lg" color="red.500" />
      </Center>
    );
  }

  // Handle error during fetch
  if (FormationsError) {
    return <Text>Erreur lors de la récupération des formations.</Text>;
  }

  // Handle user not authenticated
  if (!user) {
    return <Text>Une erreur est survenue. Veuillez vous reconnecter.</Text>;
  }

  return (
    <Center display="block">
      {/* Profile Card */}
      <ProfileCardAdministrateur />

      <SimpleGrid
        mx={{ base: '2px', md: '13px', lg: '12px' }}
        justifyContent="space-between"
        columns={[1, 2]}
        spacing={2}
      >
        {/* Add Fabrique and Formation Forms */}
        <Box
          as="section"
          px={{ base: '2px', md: '30px', lg: '20px' }}
          ml={{ base: '2px', md: '20px', lg: '120px' }}
          py={8}
          mt={7}
          w="full"
          maxW={{ base: '100%', lg: '90%' }}
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="red.700"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
        >
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              overflow="hidden"
            >
              <Button onClick={handlePrevPage} isDisabled={currentPage === 1}>
                Précédent
              </Button>

              {selectedFabriques?.length > 0 ? (
                selectedFabriques.map((fabrique) => (
                  <Box key={fabrique.id} mx={4} textAlign="center">
                    <Image
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/4ab18d4eb620294560328c98d7834f71abf167307ffbe85a4a9b42def28b575c?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b"
                      alt={fabrique.nom}
                      boxSize="50px"
                      borderRadius="md"
                      mx={8}
                    />
                    <Text mt={2}>{fabrique.nom}</Text>
                  </Box>
                ))
              ) : (
                <Text>Aucune formation disponible.</Text>
              )}
              <Button
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </Flex>
          </Box>
          <SimpleGrid columns={[1]} spacing={4}>
            {/* Add Fabrique Form */}
            <Box>
              {loading ? (
                <Text>Chargement des pointages...</Text>
              ) : error ? (
                <Text>Erreur : {error}</Text>
              ) : pointages.length === 0 ? (
                <Text>{`Aucun pointage pour aujourd'hui.`}</Text>
              ) : (
                <ListePointage pointages={pointages} />
              )}
            </Box>
          </SimpleGrid>
        </Box>

        {/* Display Formations */}
        <Box
          as="section"
          px={{ base: '2px', md: '30px', lg: '20px' }}
          mx="auto"
          py={8}
          mt={7}
          w="full"
          maxW={{ base: '100%', lg: '60%' }}
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="red.700"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
        >
          <Flex justifyContent="space-between">
            <Heading as="h1" size="md" fontWeight="semibold">
              Formations
            </Heading>

            <Link href="/admins/formations" mx={4} my={1}>
              <svg width="48" height="48" fill="#CE0033">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.8108 1.38174C19.5768 0.411166 28.4232 0.411166 37.1891 1.38174C42.0426 1.92574 45.9583 5.7479 46.5278 10.6184C47.5666 19.5094 47.5666 28.4911 46.5278 37.3821C45.9583 42.2526 42.0426 46.0747 37.1891 46.6187C28.4232 47.5893 19.5768 47.5893 10.8108 46.6187C5.95731 46.0747 2.04165 42.2526 1.47215 37.3821C0.433601 28.492 0.433601 19.5113 1.47215 10.6212C1.7602 8.25503 2.83889 6.05545 4.53337 4.37896C6.22786 2.70248 8.43884 1.64734 10.808 1.38457M24 9.8534C24.5636 9.8534 25.1041 10.0773 25.5026 10.4758C25.9011 10.8743 26.125 11.4148 26.125 11.9784V21.8752H36.0218C36.5854 21.8752 37.1259 22.0991 37.5244 22.4976C37.9229 22.8961 38.1468 23.4366 38.1468 24.0002C38.1468 24.5638 37.9229 25.1043 37.5244 25.5028C37.1259 25.9013 36.5854 26.1252 36.0218 26.1252H26.125V36.0221C26.125 36.5857 25.9011 37.1262 25.5026 37.5247C25.1041 37.9232 24.5636 38.1471 24 38.1471C23.4364 38.1471 22.8959 37.9232 22.4974 37.5247C22.0989 37.1262 21.875 36.5857 21.875 36.0221V26.1252H11.9782C11.4146 26.1252 10.8741 25.9013 10.4756 25.5028C10.0771 25.1043 9.85322 24.5638 9.85322 24.0002C9.85322 23.4366 10.0771 22.8961 10.4756 22.4976C10.8741 22.0991 11.4146 21.8752 11.9782 21.8752H21.875V11.9784C21.875 11.4148 22.0989 10.8743 22.4974 10.4758C22.8959 10.0773 23.4364 9.8534 24 9.8534"
                />
              </svg>
            </Link>
          </Flex>

          <SimpleGrid columns={1} spacing={4}>
            {formations?.length > 0 ? (
              formations.map((formation) => (
                <FormationCard
                  key={formation.id}
                  formation={formation}
                  onClick={openModal}
                  colorScheme="blue"
                  onSelect={() => handleSelectFormation(formation)}
                />
              ))
            ) : (
              <Text>Aucune formation disponible.</Text>
            )}
          </SimpleGrid>
        </Box>
      </SimpleGrid>
      {selectedFormation && (
        <Box>
          {/* Modal Popup */}
          <Modal mx isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent mx={2}>
              <ModalCloseButton />
              <ModalBody>
                {selectedFormation && (
                  <>
                    <Text fontWeight="bold">
                      Formation : {selectedFormation.nom}
                    </Text>

                    <SimpleGrid columns={1} spacing={4} mt={4}>
                      {selectedFormation.promos?.length > 0 ? (
                        selectedFormation.promos.map((promo) => (
                          <Link
                            href={`/admins/promos/${promo.id}`}
                            key={promo.id}
                          >
                            <PromoCardAdmin promo={promo} />
                          </Link>
                        ))
                      ) : (
                        <Text>Aucune promotion pour cette formation.</Text>
                      )}
                    </SimpleGrid>
                  </>
                )}
              </ModalBody>

              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </Center>
  );
};

export default AdminPage;
