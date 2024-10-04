import { useState, useEffect } from 'react';
import { Box, Heading, List, ListItem, Text, Badge, Spinner, useToast } from '@chakra-ui/react';
import { api } from '../../../lib/utils/api';
import ModalComponent from './PointageHebdomadaire';

const CongeList = () => {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast(); // Toast for error notifications

  const fetchConges = async () => {
    setLoading(true);
    try {
      const response = await api('conges', 'GET');
      setConges(response);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Erreur lors de la récupération des congés.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConges();
  }, []);

  const handleUpdateSuccess = () => {
    fetchConges(); // Refetch data after update
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box maxW="md" mx="auto" p={5} borderWidth={1} borderRadius="md" boxShadow="md">
      <Heading as="h2" size="lg" mb={5}>Liste des congés</Heading>
      <List spacing={3}>
        {conges.length > 0 ? (
          conges.map((conge) => (
            <ListItem key={conge.id} borderWidth={1} p={3} borderRadius="md">
              <Text><strong>Type :</strong> {conge.type}</Text>
              <Text><strong>Date début :</strong> {conge.date_debut}</Text>
              <Text><strong>Date fin :</strong> {conge.date_fin || 'Non définie'}</Text>
              <Text><strong>Motif :</strong> {conge.motif || 'Aucun'}</Text>
              <Badge colorScheme={conge.status === 'approuvée' ? 'green' : conge.status === 'rejetée' ? 'red' : 'yellow'}>
                {conge.status}
              </Badge>
              <ModalComponent congeId={conge.id} onUpdateSuccess={handleUpdateSuccess} /> {/* Pass update handler */}
            </ListItem>
          ))
        ) : (
          <Text>Aucun congé trouvé.</Text>
        )}
      </List>
    </Box>
  );
};


export default CongeList;
