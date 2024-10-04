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
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

const PointageHebdomadaire = () => {
  const [pointages, setPointages] = useState(null);
  const [error, setError] = useState('');
  const [promoId, setPromoId] = useState('');
  const [date, setDate] = useState('');
  const [promos, setPromos] = useState([]);
  const [selectedPointage, setSelectedPointage] = useState(null);
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
    const response = await api('pointages/semaines', 'POST', {
      promo_id: promoId,
      date,
    });

    if (response.success) {
      setPointages(response.pointages);
      setError('');
    } else {
      setError(response.message);
    }
  };

  const openPointageModal = (pointage) => {
    setSelectedPointage(pointage);
    onOpen();
  };

  // Fonction pour calculer le total des absences et retards par jour
  const calculerRecapitulatifParJour = () => {
    const recap = {
      Monday: { absents: 0, retards: 0 },
      Tuesday: { absents: 0, retards: 0 },
      Wednesday: { absents: 0, retards: 0 },
      Thursday: { absents: 0, retards: 0 },
      Friday: { absents: 0, retards: 0 }
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

  const recapitulatif = pointages ? calculerRecapitulatifParJour() : null;

  return (
    <Box p={5}>
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

      {/* Bouton pour récupérer les pointages et ouvrir le modal */}
      <Button 
        onClick={async () => { 
          await fetchPointages(); // Récupère les pointages
          onOpen(); // Ouvre le modal après avoir récupéré les données
        }} 
        color="white" bg="#CE0033" mb={5}>
        Récupérer les pointages
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="100%">
        <ModalHeader>Détails du pointage</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}

      {pointages && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Apprenant</Th>
                <Th>Lundi</Th>
                <Th>Mardi</Th>
                <Th>Mercredi</Th>
                <Th>Jeudi</Th>
                <Th>Vendredi</Th>
                <Th>Absences</Th>
                <Th>Retards</Th>
                <Th>Action</Th>
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
                  <Td>{pointage.absent !== undefined ? pointage.absent : 0}</Td>
                  <Td>{pointage.retard !== undefined ? pointage.retard : 0}</Td>
                  <Td>
                    <Button onClick={() => openPointageModal(pointage)} colorScheme="blue">
                      Détails
                    </Button>
                  </Td>
                </Tr>
              ))}
              {/* Récapitulatif par jour */}
              {recapitulatif && (
                <Tr>
                  <Td><strong>Récapitulatif</strong></Td>
                  <Td>{recapitulatif.Monday.absents} absents, {recapitulatif.Monday.retards} retards</Td>
                  <Td>{recapitulatif.Tuesday.absents} absents, {recapitulatif.Tuesday.retards} retards</Td>
                  <Td>{recapitulatif.Wednesday.absents} absents, {recapitulatif.Wednesday.retards} retards</Td>
                  <Td>{recapitulatif.Thursday.absents} absents, {recapitulatif.Thursday.retards} retards</Td>
                  <Td>{recapitulatif.Friday.absents} absents, {recapitulatif.Friday.retards} retards</Td>
                  <Td colSpan={2}></Td> {/* Colonne vide pour l'alignement */}
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for pointage details */}
      {selectedPointage && (
        <Box>
          <Text><strong>Apprenant:</strong> {selectedPointage.user.nom} {selectedPointage.user.prenom}</Text>
          <Text><strong>Lundi:</strong> {selectedPointage.date['Monday'] ? selectedPointage.date['Monday'] : 'Absent'}</Text>
          <Text><strong>Mardi:</strong> {selectedPointage.date['Tuesday'] ? selectedPointage.date['Tuesday'] : 'Absent'}</Text>
          <Text><strong>Mercredi:</strong> {selectedPointage.date['Wednesday'] ? selectedPointage.date['Wednesday'] : 'Absent'}</Text>
          <Text><strong>Jeudi:</strong> {selectedPointage.date['Thursday'] ? selectedPointage.date['Thursday'] : 'Absent'}</Text>
          <Text><strong>Vendredi:</strong> {selectedPointage.date['Friday'] ? selectedPointage.date['Friday'] : 'Absent'}</Text>
          <Text><strong>Absences:</strong> {selectedPointage.absent}</Text>
          <Text><strong>Retards:</strong> {selectedPointage.retard}</Text>
        </Box>
      )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PointageHebdomadaire;
