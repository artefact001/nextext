import { Center, Box, Table, Thead, Tbody, Tr, Th, Td, Text, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ProfileCardFormateur from '../../../components/layout/formateur/Navbar';

const AffichagesPromos = () => {
  const [promos, setPromos] = useState([]);
  const [errors, setErrors] = useState('');
  const [pointages, setPointages] = useState([]);
  const [selectedPromoId, setSelectedPromoId] = useState(null);

  // Fonction pour récupérer les promotions
  const fetchPromos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promos/formateur`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPromos(data.promos);
        } else {
          setErrors(data.message || 'Erreur lors de la récupération des promotions.');
        }
      } else {
        setErrors('Erreur lors de la récupération des promotions.');
      }
    } catch (error) {
      setErrors('Erreur lors de la récupération des promotions.');
    }
  };

  // Fonction pour récupérer les pointages d'une promotion
  const fetchPointages = async (promoId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pointages/promo?promo_id=${promoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPointages(data.pointages);
          setSelectedPromoId(promoId); // Sélectionner la promotion actuelle
        } else {
          setErrors(data.message || 'Erreur lors de la récupération des pointages.');
        }
      } else {
        setErrors('Erreur lors de la récupération des pointages.');
      }
    } catch (error) {
      setErrors('Erreur lors de la récupération des pointages.');
    }
  };
  

  useEffect(() => {
    fetchPromos();
  }, []);

  
  // Inside the AffichagesPromos component
return (
  <Center display="block">
    <ProfileCardFormateur />

    <Box mt={5} p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="100%" maxWidth="800px">
      {errors && <Text color="red.500">{errors}</Text>}

      {promos.length > 0 ? (
        <>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Date de début</Th>
                <Th>Date de fin</Th>
                <Th>Formateur</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {promos.map((promo) => (
                <Tr key={promo.id}>
                  <Td>{promo.nom}</Td>
                  <Td>{new Date(promo.date_debut).toLocaleDateString()}</Td>
                  <Td>{new Date(promo.date_fin).toLocaleDateString()}</Td>
                  <Td>{promo.formateur ? promo.formateur.nom : 'N/A'}</Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      onClick={() => fetchPointages(promo.id)}
                    >
                      Voir Pointages
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {selectedPromoId && (
            <Box mt={5}>
              <Text fontSize="xl" mb={3}>
                Pointages de la promotion sélectionnée :
              </Text>
              {pointages.length > 0 ? (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Nom de l'utilisateur</Th>
                      <Th>Date</Th>
                      <Th>Heure de présence</Th>
                      <Th>Statut</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pointages.map((pointage) => (
                      <Tr key={pointage.id}>
                        <Td>{pointage.user.nom}</Td>
                        <Td>{new Date(pointage.date).toLocaleDateString()}</Td>
                        <Td>{pointage.heure_present}</Td>
                        <Td>{pointage.type}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Text>Aucun pointage disponible pour cette promotion.</Text>
              )}
            </Box>
          )}
        </>
      ) : (
        <Text>Aucune promotion disponible.</Text>
      )}
    </Box>
  </Center>
);

};

export default AffichagesPromos;