'use client';

import {
  Box,
  Center,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import { useRouter } from 'next/router';
import { lazy, Suspense, useEffect, useState } from 'react';
import useSWR from 'swr';
import ListePointage from '../../../components/func/admin/ListePointage';
import PointageBoxPromo from '../../../components/func/admin/MesPointages';

dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

// Dynamic component imports
const ProfileCardAdministrateur = lazy(() =>
  import('../../../components/layout/chefDeProjet/Navbar')
);

// Fetch function
const fetcher = (url) =>
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur lors de la récupération des données');
    return res.json();
  });

const MesPointagesP7 = () => {
  const [date, setDate] = useState(dayjs());
  const [selectedWeek, setSelectedWeek] = useState(date.isoWeek());
  const [selectedDay, setSelectedDay] = useState(null); // Selected day state
  // eslint-disable-next-line no-unused-vars
  const [promo, setPromo] = useState(null); // State for promo data
  const router = useRouter();
  const { id: promoId } = router.query; // Access the dynamic id (promoId)
  // URLs for fetching data
  const pointagesUrl = `${
    process.env.NEXT_PUBLIC_API_URL
  }/pointages/promo?promo_id=${promoId}&mois=${date.format(
    'MM'
  )}&annee=${date.year()}&semaine=${selectedWeek}`;
  const dailyAttendanceUrl = (day) =>
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/pointages/promo/all?promo_id=${promoId}&date=${day.format('YYYY-MM-DD')}`;
  const promoUrl = `${process.env.NEXT_PUBLIC_API_URL}/promos/${promoId}`;

  const { data: pointagesData, error: pointagesError } = useSWR(
    pointagesUrl,
    fetcher
  );
  const {
    data: dailyData,
    error: dailyError,
    isLoading: isDailyLoading,
  } = useSWR(selectedDay ? dailyAttendanceUrl(selectedDay) : null, fetcher);

  const attendanceSummary = dailyData?.pointages
    ? {
        absent: dailyData.pointages.filter((p) => p.type === 'absence').length,
        retard: dailyData.pointages.filter((p) => p.type === 'retard').length,
      }
    : { absent: 0, retard: 0 }; // Default values if pointages is undefined

  const loading = !pointagesData && !pointagesError;

  const handleMonthChange = (direction) => {
    setDate((prev) => prev.add(direction, 'month'));
    setSelectedWeek(date.isoWeek());
  };

  const semainesDuMois = getWeeksOfMonth(date.month() + 1, date.year());

  useEffect(() => {
    setSelectedWeek(date.isoWeek());
  }, [date]);

  // Fetch promo data
  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        const response = await fetch(promoUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const promoData = await response.json();
        setPromo(promoData);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données de la promo:',
          error
        );
      }
    };
    fetchPromoData();
  }, [promoId]);

  useEffect(() => {
    console.log('API URL:', pointagesUrl);
    console.log(
      'Selected Day API URL:',
      selectedDay ? dailyAttendanceUrl(selectedDay) : null
    );
    console.log('Pointages Data:', pointagesData);
    console.log('Daily Data:', dailyData);
  }, [pointagesUrl, selectedDay, pointagesData, dailyData]);

  // Calcul des jours de la semaine
  const daysOfWeek = getDaysOfWeek(selectedWeek, date.year());

  // Gérer le chargement global
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <VStack spacing={4} maxW="100%">
      <Suspense fallback={<Spinner />}>
        <ProfileCardAdministrateur />
      </Suspense>

      <SimpleGrid justifyContent="space-between" columns={[1, 2]} spacing={4}>
        <Box
          as="section"
          py={8}
          mt={7}
          w="full"
          px={{ base: '12px', md: '13px', lg: '40px' }}
          mx={{ base: '2px', md: '3px', lg: '60px' }}
          maxW={{ base: '366px', md: '100%', lg: '80%' }}
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="red.700"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
          flex="2"
        >
          <Suspense fallback={<Spinner />}>
          {promo && <Text fontWeight="bold" textAlign="center" mb={3}>Promotion : {promo.nom}</Text>}

            {isDailyLoading ? (
              <Text>Chargement des données...</Text>
            ) : dailyError ? (
              <Text>Erreur lors de la récupération des données.</Text>
            ) : dailyData?.apprenants_avec_pointage?.length > 0 ||
              dailyData?.apprenants_sans_pointage?.length > 0 ? (
              <>
                  
                {dailyData.apprenants_avec_pointage.length > 0 && (
                  <Box>
     
                    <ListePointage
                      pointages={dailyData.apprenants_avec_pointage} promo={{ nom: 'Promotion 2024' }}
                    />
                  </Box>
                )}
               
              </>
            ) : (
              <>
                <Text>
                  Date:{' '}
                  {selectedDay
                    ? selectedDay.format('DD/MM/YYYY')
                    : 'Date non sélectionnée'}
                </Text>
                <Text>Aucun pointage trouvé pour la journée sélectionnée.</Text>
              </>
            )}
          </Suspense>
        </Box>
        <Box
          as="section"
          px={{ base: '2px', md: '1px', lg: '40px' }}
          mx={{ base: '2px', md: '3px', lg: '60px' }}
          maxW={{ base: '366px', md: '100%', lg: '80%' }}
          py={8}
          mt={7}
          w="full"
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="red.100"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
          flex="2"
        >
          <PointageBoxPromo
            date={date}
            handleMonthChange={handleMonthChange}
            semainesDuMois={semainesDuMois}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            pointagesData={pointagesData}
            pointagesError={pointagesError}
            attendanceSummary={attendanceSummary}
            setSelectedDay={setSelectedDay} // Passez setSelectedDay
            daysOfWeek={daysOfWeek}
            dailyData={dailyData} // Données filtrées par jour
          />
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

// Helper functions to get weeks and days of the week
const getWeeksOfMonth = (mois, annee) => {
  const startOfMonth = dayjs(`${annee}-${mois}-01`);
  const endOfMonth = startOfMonth.endOf('month');
  const weeks = [];
  let currentWeek = startOfMonth.startOf('week');

  while (currentWeek.isBefore(endOfMonth, 'week')) {
    weeks.push({
      start: currentWeek.format('YYYY-MM-DD'),
      end: currentWeek.endOf('week').format('YYYY-MM-DD'),
      number: currentWeek.isoWeek(),
    });
    currentWeek = currentWeek.add(1, 'week');
  }

  return weeks;
};

const getDaysOfWeek = (week, year) => {
  const startOfWeek = dayjs().isoWeek(week).year(year).startOf('isoWeek');
  return Array.from({ length: 7 }, (_, index) => startOfWeek.add(index, 'day')); // Limité à 7 jours pour la semaine
};

export default MesPointagesP7;
