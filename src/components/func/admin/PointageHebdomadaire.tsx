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
const pointageParSemaine = (data) => {
  return data.map(user => ({
    user: {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom
    },
    date: user.date, // Assurez-vous que cela contient les bonnes dates
    absent: user.absent || 0, // Si absent n'est pas défini, mettez 0
    retard: user.retard || 0  // Si retard n'est pas défini, mettez 0
  }));
};
const PointageHebdomadaire = () => {
  const [pointages, setPointages] = useState(null);
  const [error, setError] = useState('');
  const [promoId, setPromoId] = useState('');
  const [date, setDate] = useState('');
  const [promos, setPromos] = useState([]);
  const [selectedPointage, setSelectedPointage] = useState(null);
  const d{ isOpen, onOpen, onClose } = useDisclosure();

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
  const pointageParSemaine = (data) => {
  return data.map(user => ({
    user: {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom
    },
    date: user.date, // Assurez-vous que cela contient les bonnes dates
    absent: user.absent || 0, // Si absent n'est pas défini, mettez 0
    retard: user.retard || 0  // Si retard n'est pas défini, mettez 0
  }));
};

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

      <Button onClick={fetchPointages} color="white" bg="#CE0033" mb={5}>
        Récupérer les pointages
      </Button>

      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}

      {pointages && (
        <TableContainer>
          <Table variant="simple" >
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
      <Td>
        {pointage.user.nom} {pointage.user.prenom}
      </Td>
      <Td>{pointage.date['Monday'] || 'Absent'}</Td>
      <Td>{pointage.date['Tuesday'] || 'Absent'}</Td>
      <Td>{pointage.date['Wednesday'] || 'Absent'}</Td>
      <Td>{pointage.date['Thursday'] || 'Absent'}</Td>
      <Td>{pointage.date['Friday'] || 'Absent'}</Td>
      <Td>{pointage.absent !== undefined ? pointage.absent : 0}</Td> {/* Display absences */}
      <Td>{pointage.retard !== undefined ? pointage.retard : 0}</Td> {/* Display lateness */}
      {console.log(`Absents: ${pointage.absent}, Retards: ${pointage.retard}`)} {/* Debugging: Check the values */}
      <Td>
        <Button onClick={() => openPointageModal(pointage)} colorScheme="blue">
          Détails
        </Button>
      </Td>
    </Tr>
  ))}
</Tbody>

          </Table>
        </TableContainer>
      )}

      {/* Modal for pointage details */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Détails du pointage</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PointageHebdomadaire;
