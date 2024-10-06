import { api } from '../../../lib/utils/api';
import { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Box,
  Select,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Heading,
} from '@chakra-ui/react';

const PointageHebdomadaire = () => {
  const [pointages, setPointages] = useState([]);
  const [error, setError] = useState('');
  const [promoId, setPromoId] = useState('');
  const [date, setDate] = useState('');
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch promotions when the component mounts
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const responses = await api('promos', 'GET');
        if (responses) {
          setPromos(responses);
        } else {
          setError('Impossible de récupérer les promotions');
        }
      } catch (error) {
        setError('Erreur lors de la récupération des promotions');
      }
    };

    fetchPromos();
  }, []);

  // Fetch pointages by week and promo
  const fetchPointages = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api('pointages/semaines', 'POST', {
        promo_id: promoId,
        date,
      });

      if (response.success) {
        setPointages(response.pointages);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des pointages');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to calculate total absences and tardies by day
  const calculerRecapitulatifParJour = () => {
    const recap = {
      Monday: { absents: 0, retards: 0 },
      Tuesday: { absents: 0, retards: 0 },
      Wednesday: { absents: 0, retards: 0 },
      Thursday: { absents: 0, retards: 0 },
      Friday: { absents: 0, retards: 0 },
    };

    pointages.forEach(pointage => {
      Object.keys(recap).forEach(day => {
        if (!pointage.date[day]) {
          recap[day].absents += 1; // Si absent
        } else {
          recap[day].retards += pointage.retard; // Si en retard
        }
      });
    });

    return recap;
  };

  const recapitulatif = calculerRecapitulatifParJour();

  return (
    <Box p={5}>
      <Heading mx="25%">Rapport Hebdomadaire</Heading>
      <FormControl mb={4}>
        <FormLabel>Choisir la promotion</FormLabel>
        <Select
          placeholder="Sélectionnez une promotion"
          value={promoId}
          onChange={(e) => setPromoId(e.target.value)}
        >
          {promos.length > 0 ? (
            promos.map((promo) => (
              <option key={promo.id} value={promo.id}>
                {promo.nom}
              </option>
            ))
          ) : (
            <option disabled>Aucune promotion disponible</option>
          )}
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Choisir la date</FormLabel>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </FormControl>

      <Button 
        onClick={() => { 
            fetchPointages();
          onOpen();
        }} 
        colorScheme="red" 
        mb={5}
        isDisabled={!promoId || !date} // Disable button if promo or date is not selected
      >
        Récupérer les pointages de cette semaine
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="90%">
          <ModalHeader>Détails du pointage</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {error && (
                  <Text color="red.500" mb={4}>
                    {error}
                  </Text>
                )}

                {pointages.length > 0 ? (
                  <TableContainer>
                    <Table variant="simple" size={{ base: 'sm', md: 'md', lg: 'lg' }}>
                      <Thead>
                        <Tr>
                          <Th>Apprenant</Th>
                          <Th>Lundi</Th>
                          <Th>Mardi</Th>
                          <Th>Mercredi</Th>
                          <Th>Jeudi</Th>
                          <Th>Vendredi</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {pointages.map((pointage) => (
                          <Tr key={pointage.user.id}>
                            <Td>{pointage.user.nom} {pointage.user.prenom}</Td>
                            <Td>{pointage.date['Monday'] || 'Absent'}</Td>
                            <Td>{pointage.date['Tuesday'] || 'Absent'}</Td>
                            <Td>{pointage.date['Wednesday'] || 'Absent'}</Td>
                            <Td>{pointage.date['Thursday'] || 'Absent'}</Td>
                            <Td>{pointage.date['Friday'] || 'Absent'}</Td>
                          </Tr>
                        ))}
                        {recapitulatif && (
                          <Tr>
                            <Td><strong>Récapitulatif</strong></Td>
                            <Td>{recapitulatif.Monday.absents} absents, {recapitulatif.Monday.retards} retards</Td>
                            <Td>{recapitulatif.Tuesday.absents} absents, {recapitulatif.Tuesday.retards} retards</Td>
                            <Td>{recapitulatif.Wednesday.absents} absents, {recapitulatif.Wednesday.retards} retards</Td>
                            <Td>{recapitulatif.Thursday.absents} absents, {recapitulatif.Thursday.retards} retards</Td>
                            <Td>{recapitulatif.Friday.absents} absents, {recapitulatif.Friday.retards} retards</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Text>Aucun pointage disponible pour cette date.</Text>
                )}
              </>
            )}
          </ModalBody>
        
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PointageHebdomadaire;
