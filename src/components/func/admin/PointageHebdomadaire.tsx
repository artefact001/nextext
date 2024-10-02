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
      date: '2024-10-07', // Date de référence
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
                <Th>Nom de l'élève</Th>
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
                  <Td>{pointage.date['Monday'] ? pointage.date['Monday'] : 'Absent'}</Td>
                  <Td>{pointage.date['Tuesday'] ? pointage.date['Tuesday'] : 'Absent'}</Td>
                  <Td>{pointage.date['Wednesday'] ? pointage.date['Wednesday'] : 'Absent'}</Td>
                  <Td>{pointage.date['Thursday'] ? pointage.date['Thursday'] : 'Absent'}</Td>
                  <Td>{pointage.date['Friday'] ? pointage.date['Friday'] : 'Absent'}</Td>
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
