import {
  Box,
  Text,
  
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import ProfileCardFormateur from '../../../components/layout/formateur/Navbar';
import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import PromoCard from '../../../components/common/PromoCard';
import ListePointage from '../../../components/func/apprenant/ListePointage';
import PromoHeader from '../../../components/common/PromoHeader';

// Fonction de récupération des données
const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données.');
    return res.json();
  });

const Dashboard = () => {
  // Récupérer les promos en cours et terminées
  const { data: promosData, error: promosError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/promos/encours`,
    fetcher
  );
  const { data: promosDataTerminer, error: promosErrorTerminer } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/promos/terminer`,
    fetcher
  );
  const [pointages, setPointages] = useState([]);
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const router = useRouter();

  // Rediriger vers la page de la promotion sélectionnée
  const handlePromoClick = (promoId) => {
    router.push(`/formateur/promos/${promoId}`);
  };

  // Récupérer les pointages du jour pour une promotion
  const fetchPointages = async (promoId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/promos/${promoId}/pointages-aujourdhui`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setPointages(data.pointages);
        setSelectedPromoId(promoId);
      } else {
        console.error(
          data.message || 'Erreur lors de la récupération des pointages.'
        );
      }
    } else {
      console.error('Erreur lors de la récupération des pointages.');
    }
  };

  if (promosError || promosErrorTerminer) {
    return (
      <Text color="red.500">
        Erreur lors de la récupération des promotions.
      </Text>
    );
  }

  const promos = promosData ? promosData.promos : [];
  const promosTerminer = promosDataTerminer ? promosDataTerminer.promos : [];

  return (
    <Box p={5}>
      {/* Profil Formateur et Header */}
      <ProfileCardFormateur />

      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={5} mt={10}>
        {/* Liste des Promos en cours */}
        <VStack>

          {/* <ListePointage /> */}
          {selectedPromoId && (
            <ListePointage
            pointages={pointages}
            promoId={selectedPromoId}
            fetchPointages={fetchPointages}
            isCompleted
            
            
            />
          )};
        </VStack>
            <VStack>  
              <PromoHeader/>
              <PromoCard promos={promos} handlePromoClick={handlePromoClick} />
              {/* Liste des Promos terminées */}
              <PromoCard promos={promosTerminer} isCompleted />
            </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
