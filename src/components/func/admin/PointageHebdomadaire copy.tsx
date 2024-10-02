import { api } from '../../../lib/utils/api';
import { useState } from 'react';
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
} from '@chakra-ui/react';

const PointageHebdomadaire = () => {
  const [pointages, setPointages] = useState(null);
  const [error, setError] = useState('');

  const fetchPointages = async () => {
    const response = await api('pointages/semaines', 'POST', {
      promo_id: 1, // Exemples de données
      date: '2024-10-02', // Date de référence
    });

    if (response.success) {
      setPointages(response.pointages);
      setError('');
    } else {
      setError(response.message);
    }
  };

  return (
    <Box p={5}>
      <Button onClick={fetchPointages} colorScheme="blue" mb={5}>
        Récupérer les pointages
      </Button>

      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}

      {pointages && (
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Apprenant</Th>
                <Th>Jour 1</Th>
                <Th>Jour 2</Th>
                <Th>Jour 3</Th>
                <Th>Jour 4</Th>
                <Th>Jour 5</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pointages.map((pointage) => (
                <Tr key={pointage.user.id}>
                  <Td>{pointage.user.nom}  {pointage.user.prenom}</Td>


                  <Td>
                    {pointage.type}
                    {pointage.heure_present}
                    {pointage.date}

                  </Td>
                    <Td>{pointage.user.nom}</Td>
                  <Td>{pointage.user.nom}</Td>
                  <Td>{pointage.user.nom}</Td>

                  {/* Vérifier si heur_presence est un tableau avant d'utiliser map */}
                  {Array.isArray(pointage.heur_presence) ? (
                    pointage.heur_presence.map((heur, index) => (
                      <Td key={index}>{heur || 'Absent'}</Td>
                    ))
                  ) : (
                    <Td colSpan={5}>Données non disponibles</Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PointageHebdomadaire;
